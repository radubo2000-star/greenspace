#!/bin/bash

# ============================================
# BACKEND DEPLOY SCRIPT - FULL VERSION
# ============================================
# Acest script face deploy complet al backend-ului
# cu opțiuni pentru SSH upload automat
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   BACKEND DEPLOY - GREEN SPACE${NC}"
echo -e "${BLUE}   (Full Version with SSH Upload)${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Configuration
SERVER_USER="asocia17"
SERVER_HOST="asociatiagreenspace.ro"
SERVER_PATH="/home/asocia17/asociatiagreenspace.ro/backend"
SSH_PORT="22"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Eroare: .env.production nu există!${NC}"
    echo -e "${YELLOW}Creează fișierul .env.production cu configurațiile de producție.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env.production găsit${NC}"
echo ""

# Ask for deploy method
echo -e "${CYAN}Alege metoda de deploy:${NC}"
echo -e "  ${YELLOW}1)${NC} Generează doar arhivă (manual upload)"
echo -e "  ${YELLOW}2)${NC} Deploy automat via SSH (necesită acces SSH)"
echo -e "  ${YELLOW}3)${NC} Generează arhivă + instrucțiuni detaliate"
echo ""
read -p "Opțiune (1-3): " DEPLOY_METHOD

# Create deploy directory
DEPLOY_DIR="deploy"
mkdir -p "$DEPLOY_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="greenspace-backend-${TIMESTAMP}"

echo ""
echo -e "${BLUE}📦 Pregătire fișiere pentru deploy...${NC}"
echo ""

# Create temporary directory for packaging
TEMP_DIR="${DEPLOY_DIR}/temp_${TIMESTAMP}"
mkdir -p "$TEMP_DIR"

# Copy necessary files
echo -e "${YELLOW}→ Copiez fișierele necesare...${NC}"

# Copy all backend files except node_modules, data, logs
# Using find and cp instead of rsync
find . -type f \
    ! -path './node_modules/*' \
    ! -path './data/*' \
    ! -path './logs/*' \
    ! -path './deploy/*' \
    ! -name '.env' \
    ! -name '.env.local' \
    ! -name '.env.development' \
    ! -name '*.log' \
    ! -name '.DS_Store' \
    -exec sh -c 'mkdir -p "$1/$(dirname "$2")" && cp "$2" "$1/$2"' _ "$TEMP_DIR" {} \;

# Copy directories structure (empty dirs) - excluding node_modules completely
find . -type d \
    ! -path './node_modules' \
    ! -path './node_modules/*' \
    ! -path './data' \
    ! -path './data/*' \
    ! -path './logs' \
    ! -path './logs/*' \
    ! -path './deploy' \
    ! -path './deploy/*' \
    ! -path './.git' \
    ! -path './.git/*' \
    -exec mkdir -p "$TEMP_DIR/{}" \;

# Copy .env.production as .env
echo -e "${YELLOW}→ Configurez .env.production ca .env...${NC}"
cp .env.production "$TEMP_DIR/.env"

# Create .htaccess for Passenger
echo -e "${YELLOW}→ Creez .htaccess pentru Passenger...${NC}"
cat > "$TEMP_DIR/.htaccess" << 'EOF'
# NOTE: CloudLinux/cPanel will add its own Passenger configuration block at the top
# DO NOT REMOVE the CloudLinux block when it appears!
# You only need to change PassengerStartupFile to app.js in that block

# Environment
SetEnv NODE_ENV production

# CORS Headers - Allow requests from main domain
<IfModule mod_headers.c>
    # Allow requests from main domain, www subdomain, and api subdomain
    SetEnvIf Origin "^https://(www\.|api\.)?asociatiagreenspace\.ro$" AccessControlAllowOrigin=$0
    Header always set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Max-Age "3600"
</IfModule>

# Handle preflight OPTIONS requests
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Disable directory browsing
Options -Indexes

# Error documents
ErrorDocument 404 "API endpoint not found"
ErrorDocument 500 "Internal server error"

# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
</IfModule>
EOF

# Create restart.txt
mkdir -p "$TEMP_DIR/tmp"
touch "$TEMP_DIR/tmp/restart.txt"

# Create deployment guide
cat > "$TEMP_DIR/DEPLOY_GUIDE.txt" << 'EOF'
============================================
GREEN SPACE - BACKEND DEPLOYMENT GUIDE
============================================

METODA 1: MANUAL (cPanel File Manager)
========================================

1. Upload arhiva:
   - Intră în cPanel → File Manager
   - Navighează la: /home/asocia17/asociatiagreenspace.ro/
   - Upload: greenspace-backend-XXXXXX.tar.gz
   - Click dreapta → Extract

2. Instalează dependențe:
   - cPanel → Terminal
   - cd /home/asocia17/asociatiagreenspace.ro/backend
   - npm install --production

3. Configurează Node.js App:
   - cPanel → Setup Node.js App
   - Application Root: /home/asocia17/asociatiagreenspace.ro/backend
   - Application Startup File: server.js
   - Node.js Version: 18.x
   - Click "Create"

4. Restart:
   - Click "Restart" în Node.js App
   - SAU: touch tmp/restart.txt

5. Verifică:
   - https://asociatiagreenspace.ro/api/health


METODA 2: SSH (Automat)
========================

1. Conectează via SSH:
   ssh asocia17@asociatiagreenspace.ro

2. Navighează la backend:
   cd /home/asocia17/asociatiagreenspace.ro/backend

3. Backup (opțional):
   tar -czf backup-$(date +%Y%m%d).tar.gz .

4. Upload și extrage:
   # Upload arhiva via SCP/SFTP
   tar -xzf greenspace-backend-XXXXXX.tar.gz

5. Instalează:
   npm install --production

6. Restart:
   touch tmp/restart.txt


VERIFICARE:
===========

1. Health check:
   curl https://asociatiagreenspace.ro/api/health

2. Log-uri:
   tail -f logs/passenger.log

3. Status:
   cPanel → Setup Node.js App → Status


TROUBLESHOOTING:
================

Aplicația nu pornește:
- Verifică: logs/passenger.log
- Verifică: Node.js version în cPanel
- Verifică: package.json și dependencies

Port conflict:
- Verifică PORT în .env
- Verifică alte aplicații Node.js

Erori CORS:
- Verifică ALLOWED_ORIGINS în .env
- Verifică config/cors.js

Erori email:
- Verifică EMAIL_* în .env
- Verifică config/nodemailer.js


COMENZI UTILE:
==============

# Restart
touch tmp/restart.txt

# Log-uri
tail -f logs/passenger.log

# Reinstall
rm -rf node_modules && npm install --production

# Check Node version
node --version

# Check npm version
npm --version

============================================
EOF

echo -e "${GREEN}✅ Fișiere pregătite${NC}"
echo ""

# Create archives
echo -e "${BLUE}📦 Creez arhive...${NC}"
echo ""

# Create .tar.gz
echo -e "${YELLOW}→ Creez ${ARCHIVE_NAME}.tar.gz...${NC}"
cd "$DEPLOY_DIR"
tar -czf "${ARCHIVE_NAME}.tar.gz" -C "temp_${TIMESTAMP}" .
cd ..


# Cleanup temp directory
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✅ Arhive create cu succes!${NC}"
echo ""

# Handle deploy method
case $DEPLOY_METHOD in
    2)
        echo -e "${BLUE}============================================${NC}"
        echo -e "${CYAN}🚀 DEPLOY AUTOMAT VIA SSH${NC}"
        echo -e "${BLUE}============================================${NC}"
        echo ""
        
        # Ask for SSH password
        echo -e "${YELLOW}Introdu parola SSH pentru ${SERVER_USER}@${SERVER_HOST}:${NC}"
        
        # Upload via SCP
        echo -e "${YELLOW}→ Upload arhivă pe server...${NC}"
        scp -P "$SSH_PORT" "${DEPLOY_DIR}/${ARCHIVE_NAME}.tar.gz" "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"
        
        # Extract and install via SSH
        echo -e "${YELLOW}→ Extrag și instalez pe server...${NC}"
        ssh -p "$SSH_PORT" "${SERVER_USER}@${SERVER_HOST}" << ENDSSH
cd ${SERVER_PATH}
echo "→ Backup existent..."
tar -czf backup-${TIMESTAMP}.tar.gz --exclude='node_modules' --exclude='data' --exclude='logs' --exclude='deploy' . 2>/dev/null || true
echo "→ Extrag noua versiune..."
tar -xzf ${ARCHIVE_NAME}.tar.gz
echo "→ Instalez dependențe..."
npm install --production
echo "→ Restart aplicație..."
touch tmp/restart.txt
echo "✅ Deploy complet!"
ENDSSH
        
        echo ""
        echo -e "${GREEN}✅ DEPLOY AUTOMAT FINALIZAT!${NC}"
        ;;
        
    3)
        echo -e "${BLUE}============================================${NC}"
        echo -e "${CYAN}📋 GENERARE ARHIVĂ + INSTRUCȚIUNI${NC}"
        echo -e "${BLUE}============================================${NC}"
        echo ""
        
        # Create detailed instructions file
        cat > "${DEPLOY_DIR}/INSTRUCTIUNI_DEPLOY.txt" << 'EOFINSTRUCT'
============================================
INSTRUCȚIUNI DETALIATE DE DEPLOY
============================================

PASUL 1: PREGĂTIRE
==================
✅ Ai generat arhiva: greenspace-backend-XXXXXX.tar.gz
✅ Arhiva conține toate fișierele necesare
✅ .env.production este configurat ca .env

PASUL 2: BACKUP (RECOMANDAT)
=============================
Înainte de deploy, fă backup la versiunea curentă:

Via cPanel Terminal:
  cd /home/asocia17/asociatiagreenspace.ro/backend
  tar -czf backup-$(date +%Y%m%d).tar.gz .

Via SSH:
  ssh asocia17@asociatiagreenspace.ro
  cd /home/asocia17/asociatiagreenspace.ro/backend
  tar -czf backup-$(date +%Y%m%d).tar.gz .

PASUL 3: UPLOAD ARHIVĂ
=======================

Opțiunea A - cPanel File Manager:
  1. Intră în cPanel
  2. File Manager
  3. Navighează la: /home/asocia17/asociatiagreenspace.ro/backend/
  4. Click "Upload"
  5. Selectează: greenspace-backend-XXXXXX.tar.gz
  6. Așteaptă finalizarea upload-ului

Opțiunea B - FTP/SFTP:
  1. Conectează cu FileZilla/WinSCP
  2. Host: asociatiagreenspace.ro
  3. User: asocia17
  4. Navighează la: /home/asocia17/asociatiagreenspace.ro/backend/
  5. Upload: greenspace-backend-XXXXXX.tar.gz

Opțiunea C - SCP (command line):
  scp greenspace-backend-XXXXXX.tar.gz asocia17@asociatiagreenspace.ro:/home/asocia17/asociatiagreenspace.ro/backend/

PASUL 4: EXTRAGERE
===================

Via cPanel File Manager:
  1. Click dreapta pe arhivă
  2. "Extract"
  3. Confirmă extragerea

Via Terminal/SSH:
  cd /home/asocia17/asociatiagreenspace.ro/backend
  tar -xzf greenspace-backend-XXXXXX.tar.gz

PASUL 5: INSTALARE DEPENDENȚE
==============================

Via cPanel Terminal:
  cd /home/asocia17/asociatiagreenspace.ro/backend
  npm install --production

Via SSH:
  ssh asocia17@asociatiagreenspace.ro
  cd /home/asocia17/asociatiagreenspace.ro/backend
  npm install --production

⏱️ Durată estimată: 2-5 minute

PASUL 6: CONFIGURARE NODE.JS APP (Prima dată)
==============================================

Dacă este prima instalare:

1. Intră în cPanel
2. "Setup Node.js App"
3. Click "Create Application"
4. Completează:
   - Node.js Version: 18.x (sau mai nou)
   - Application Mode: Production
   - Application Root: /home/asocia17/asociatiagreenspace.ro/backend
   - Application URL: https://asociatiagreenspace.ro (sau subdomain)
   - Application Startup File: server.js
5. Click "Create"

PASUL 7: RESTART APLICAȚIE
===========================

Opțiunea A - cPanel Node.js App:
  1. Setup Node.js App
  2. Găsește aplicația
  3. Click "Restart"

Opțiunea B - Terminal/SSH:
  cd /home/asocia17/asociatiagreenspace.ro/backend
  touch tmp/restart.txt

⏱️ Restart durează ~10-30 secunde

PASUL 8: VERIFICARE
====================

1. Health Check:
   Accesează: https://asociatiagreenspace.ro/api/health
   Ar trebui să vezi: {"status":"ok","timestamp":"..."}

2. Verifică log-uri:
   cPanel → File Manager → backend/logs/passenger.log
   SAU
   tail -f /home/asocia17/asociatiagreenspace.ro/backend/logs/passenger.log

3. Test API endpoints:
   - https://asociatiagreenspace.ro/api/health
   - https://asociatiagreenspace.ro/api/status

TROUBLESHOOTING
===============

Problema: Aplicația nu pornește
Soluție:
  - Verifică logs/passenger.log
  - Verifică că server.js există
  - Verifică Node.js version în cPanel
  - Verifică că npm install a rulat cu succes

Problema: Eroare "Cannot find module"
Soluție:
  - Șterge node_modules: rm -rf node_modules
  - Reinstalează: npm install --production

Problema: Port conflict
Soluție:
  - Verifică PORT în .env
  - Verifică alte aplicații Node.js în cPanel

Problema: CORS errors
Soluție:
  - Verifică ALLOWED_ORIGINS în .env
  - Verifică că include frontend URL-ul

Problema: Email nu funcționează
Soluție:
  - Verifică EMAIL_* variabilele în .env
  - Verifică că SMTP credentials sunt corecte
  - Email-urile se salvează în data/emails/ ca fallback

COMENZI UTILE
=============

# Restart aplicație
touch tmp/restart.txt

# Vezi log-uri în timp real
tail -f logs/passenger.log

# Verifică versiunea Node.js
node --version

# Verifică versiunea npm
npm --version

# Reinstalează dependențe
rm -rf node_modules && npm install --production

# Verifică status aplicație
curl https://asociatiagreenspace.ro/api/health

# Vezi toate aplicațiile Node.js
cPanel → Setup Node.js App

ROLLBACK (Dacă ceva nu merge)
==============================

1. Oprește aplicația curentă:
   cPanel → Setup Node.js App → Stop

2. Restaurează backup-ul:
   cd /home/asocia17/asociatiagreenspace.ro/backend
   rm -rf *
   tar -xzf backup-YYYYMMDD.tar.gz

3. Restart:
   touch tmp/restart.txt

SUPORT
======

Dacă întâmpini probleme:
1. Verifică logs/passenger.log
2. Verifică cPanel → Errors
3. Verifică Node.js App status în cPanel
4. Contactează suportul hosting dacă problema persistă

============================================
SUCCES CU DEPLOY-UL! 🚀
============================================
EOFINSTRUCT
        
        echo -e "${GREEN}✅ Instrucțiuni detaliate create!${NC}"
        ;;
esac

# Show results
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✅ DEPLOY PREGĂTIT CU SUCCES!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${YELLOW}📦 Fișiere generate:${NC}"
echo -e "   ${DEPLOY_DIR}/${ARCHIVE_NAME}.tar.gz"
echo -e "   ${DEPLOY_DIR}/${ARCHIVE_NAME}.zip"
if [ "$DEPLOY_METHOD" = "3" ]; then
    echo -e "   ${DEPLOY_DIR}/INSTRUCTIUNI_DEPLOY.txt"
fi
echo ""

# Show file sizes
TAR_SIZE=$(du -h "${DEPLOY_DIR}/${ARCHIVE_NAME}.tar.gz" | cut -f1)
ZIP_SIZE=$(du -h "${DEPLOY_DIR}/${ARCHIVE_NAME}.zip" | cut -f1)

echo -e "${YELLOW}📊 Dimensiuni:${NC}"
echo -e "   .tar.gz: ${TAR_SIZE}"
echo -e "   .zip: ${ZIP_SIZE}"
echo ""

if [ "$DEPLOY_METHOD" != "2" ]; then
    echo -e "${BLUE}============================================${NC}"
    echo -e "${YELLOW}📋 URMĂTORII PAȘI:${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
    echo -e "1. ${GREEN}Upload arhiva pe server${NC}"
    echo -e "2. ${GREEN}Extrage arhiva${NC}"
    echo -e "3. ${GREEN}Rulează: npm install --production${NC}"
    echo -e "4. ${GREEN}Restart aplicația${NC}"
    echo -e "5. ${GREEN}Verifică: https://asociatiagreenspace.ro/api/health${NC}"
    echo ""
    if [ "$DEPLOY_METHOD" = "3" ]; then
        echo -e "${CYAN}📖 Citește INSTRUCTIUNI_DEPLOY.txt pentru pași detaliați!${NC}"
    else
        echo -e "${CYAN}📖 Citește DEPLOY_GUIDE.txt din arhivă pentru detalii!${NC}"
    fi
    echo ""
fi

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✨ Deploy pregătit cu succes!${NC}"
echo -e "${BLUE}============================================${NC}"
