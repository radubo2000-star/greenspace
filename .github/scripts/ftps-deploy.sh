#!/usr/bin/env bash
# ============================================
# FTPS deployment helper (cPanel)
# ============================================
# Mirrors a local directory to the cPanel host over FTPS (explicit TLS) using
# lftp. No SSH required: the account only needs an FTP account and the deploy
# never relies on a remote shell.
#
# Usage:
#   ftps-deploy.sh frontend   # mirrors frontend/dist into the site's public_html
#   ftps-deploy.sh backend    # mirrors the staged backend into the Passenger app root
#
# Required env:
#   FTPS_HOST        FTP hostname (e.g. asociatiagreenspace.ro)
#   FTPS_USER        FTP account user (e.g. asocia17)
#   FTPS_PASSWORD    FTP account password
#   REMOTE_PATH      Destination, relative to the FTP login home (e.g. api-gs)
#   LOCAL_DIR        Local directory whose *contents* are mirrored
#
# Optional env:
#   FTPS_PORT         default 21
#   FTPS_IMPLICIT     default false; set true for implicit TLS (usually port 990)
#   FTPS_VERIFY_CERT  default no; set yes to abort on an untrusted/unmatched cert
#   FTPS_PARALLEL     default 3 concurrent transfers
# ============================================
set -euo pipefail

MODE="${1:-}"

if [ "$MODE" != "frontend" ] && [ "$MODE" != "backend" ]; then
  echo "::error::usage: ftps-deploy.sh <frontend|backend>" >&2
  exit 1
fi

require_env() {
  local name="$1"
  if [ -z "${!name:-}" ]; then
    echo "::error::$name is required" >&2
    exit 1
  fi
}

require_env FTPS_HOST
require_env FTPS_USER
require_env FTPS_PASSWORD
require_env REMOTE_PATH
require_env LOCAL_DIR

FTPS_PORT="${FTPS_PORT:-21}"
FTPS_IMPLICIT="${FTPS_IMPLICIT:-false}"
FTPS_VERIFY_CERT="${FTPS_VERIFY_CERT:-no}"
FTPS_PARALLEL="${FTPS_PARALLEL:-3}"

# FTP paths are relative to the login home, so strip the home prefix if an
# absolute path is supplied (the previous SSH deploy used absolute paths).
REMOTE_PATH="${REMOTE_PATH#/home/"$FTPS_USER"/}"
REMOTE_PATH="${REMOTE_PATH#/}"
REMOTE_PATH="${REMOTE_PATH%/}"
if [ -z "$REMOTE_PATH" ]; then
  echo "::error::REMOTE_PATH resolves to the FTP login home; refusing to mirror there" >&2
  exit 1
fi

if [ ! -d "$LOCAL_DIR" ]; then
  echo "::error::local directory not found: $LOCAL_DIR" >&2
  exit 1
fi

command -v lftp >/dev/null 2>&1 || {
  echo "::error::lftp is not installed" >&2
  exit 1
}

# Implicit TLS listens on its own port and is selected by the ftps:// scheme;
# explicit TLS (AUTH TLS) is the cPanel default on the regular FTP port.
case "$FTPS_IMPLICIT" in
  true|1|yes) FTPS_SCHEME="ftps"; FTPS_PORT="${FTPS_PORT:-990}" ;;
  *)          FTPS_SCHEME="ftp" ;;
esac

if [ "$FTPS_VERIFY_CERT" != "yes" ]; then
  echo "::warning::FTPS certificate verification is disabled. Set FTPS_VERIFY_CERT=yes once the host presents a certificate that chains to a public CA."
fi

# `--env-password` reads the password from LFTP_PASSWORD, keeping it off the
# command line where it would be visible in the process list.
export LFTP_PASSWORD="$FTPS_PASSWORD"

SETTINGS="set cmd:fail-exit yes
set net:max-retries 3
set net:timeout 30
set net:reconnect-interval-base 5
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:ssl-protect-list true
set ftp:passive-mode true
set ftp:prefer-epsv true
set xfer:clobber true
set mirror:parallel-transfer-count $FTPS_PARALLEL
set mirror:dereference yes
set ssl:verify-certificate $FTPS_VERIFY_CERT"

# Paths are relative to the FTP login home. Create the destination (first
# deploy) and, for the backend, the Passenger restart directory.
PREPARE="mkdir -p -f '$REMOTE_PATH'"
if [ "$MODE" = "backend" ]; then
  PREPARE="$PREPARE; mkdir -p -f '$REMOTE_PATH/tmp'"
fi

# The mirror is destructive for anything it can see, so every path that exists
# only on the server is excluded: uploaded/seed data, logs, the Passenger
# restart marker and the CloudLinux-managed .htaccess (rewritten by cPanel, so
# the copy in the repo must never clobber it).
#
# Each name needs both 'name' and 'name/' forms. lftp matches a real directory
# against 'name/' and silently misses it when only 'name' is given, while a
# symlink (see node_modules below) is reported as a plain file and matches only
# the bare form. Getting this wrong makes --delete remove the live path instead
# of skipping it.
if [ "$MODE" = "backend" ]; then
  EXCLUDES=(--exclude-glob 'data/' --exclude-glob 'data'
            --exclude-glob 'logs/' --exclude-glob 'logs'
            --exclude-glob 'tmp/' --exclude-glob 'tmp'
            --exclude-glob '.htaccess'
            --exclude-glob '.env.local'
            --exclude-glob '.env'
            --exclude-glob 'node_modules/' --exclude-glob 'node_modules')

  # cPanel's "Setup Node.js App" keeps node_modules as a symlink into its
  # nodevenv tree. The target is an absolute path that does not resolve inside
  # the FTP server's chroot, so mirroring it fails with
  #   550 Can't change directory to .../node_modules: No such file or directory
  # Dependencies are installed into that virtualenv on the server, so the tree
  # is never uploaded.
  #
  # .env is excluded too and `put` separately below. If the mirror owned it,
  # --delete would remove the live file before re-adding it, and a run that died
  # in that window would leave the app without its database credentials.
else
  # .well-known/ holds AutoSSL validation files; cgi-bin/ is created by cPanel.
  EXCLUDES=(--exclude-glob '.well-known/' --exclude-glob '.well-known'
            --exclude-glob 'cgi-bin/' --exclude-glob 'cgi-bin')
fi

echo "::group::FTPS upload [$MODE]"
echo "host=$FTPS_HOST port=$FTPS_PORT user=$FTPS_USER scheme=$FTPS_SCHEME"
echo "local=$LOCAL_DIR remote=$REMOTE_PATH"
echo "local files: $(find "$LOCAL_DIR" -type f | wc -l)"

# Write .env first and on its own. `put` truncates in place rather than
# unlinking, so the credentials are never absent from the server.
if [ "$MODE" = "backend" ] && [ -f "$LOCAL_DIR/.env" ]; then
  lftp -c "
$SETTINGS
open --env-password -u '$FTPS_USER' $FTPS_SCHEME://$FTPS_HOST:$FTPS_PORT
$PREPARE
put '$LOCAL_DIR/.env' -o '$REMOTE_PATH/.env'
"
  echo "uploaded .env"
fi

lftp -c "
$SETTINGS
open --env-password -u '$FTPS_USER' $FTPS_SCHEME://$FTPS_HOST:$FTPS_PORT
$PREPARE
mirror -R --delete --no-perms --verbose=1 ${EXCLUDES[*]} '$LOCAL_DIR' '$REMOTE_PATH'
"

# Passenger restarts an app when tmp/restart.txt changes. FTP is enough: the
# upload itself moves the file's timestamp, which is how restart.txt was meant
# to be triggered on hosts without shell access.
if [ "$MODE" = "backend" ]; then
  TRIGGER="$(mktemp)"
  date -u +"restart %Y-%m-%dT%H:%M:%SZ" > "$TRIGGER"
  lftp -c "
$SETTINGS
open --env-password -u '$FTPS_USER' $FTPS_SCHEME://$FTPS_HOST:$FTPS_PORT
put '$TRIGGER' -o '$REMOTE_PATH/tmp/restart.txt'
"
  rm -f "$TRIGGER"
fi
echo "::endgroup::"

echo "FTPS upload [$MODE] complete"