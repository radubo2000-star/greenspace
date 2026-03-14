#!/bin/bash

# ============================================
# BACKEND DEPLOY SCRIPT - QUICK VERSION
# ============================================
# Acest script face deploy rapid al backend-ului
# folosind automat .env.production
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   BACKEND DEPLOY - GREEN SPACE${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Eroare: .env.production nu există!${NC}"
    echo -e "${YELLOW}Creează fișierul .env.production cu configurațiile de producție.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env.production găsit${NC}"
echo ""

# Create deploy directory
DEPLOY_DIR="deploy"
mkdir -p "$DEPLOY_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="greenspace-backend-${TIMESTAMP}"

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

# Create restart.txt for Passenger
echo -e "${YELLOW}→ Creez restart.txt pentru Passenger...${NC}"
mkdir -p "$TEMP_DIR/tmp"
touch "$TEMP_DIR/tmp/restart.txt"

# Create package.json with production scripts
echo -e "${YELLOW}→ Actualizez package.json pentru producție...${NC}"
if [ -f "package.json" ]; then
    cp package.json "$TEMP_DIR/package.json"
fi

# Create README for deployment
cat > "$TEMP_DIR/DEPLOY_README.txt" << 'EOF'
============================================
GREEN SPACE - BACKEND DEPLOYMENT
============================================

PAȘI DE INSTALARE:
==================

1. UPLOAD PE SERVER
   - Urcă această arhivă pe server via cPanel File Manager
   - Extrage în: /home/asocia17/asociatiagreenspace.ro/backend/

2. INSTALARE DEPENDENȚE
   - Conectează-te via SSH sau folosește Terminal în cPanel
   - cd /home/asocia17/asociatiagreenspace.ro/backend
   - npm install --production

3. CONFIGURARE PASSENGER (cPanel)
   - Mergi la: cPanel → Setup Node.js App
   - Application Root: /home/asocia17/asociatiagreenspace.ro/backend
   - Application URL: https://asociatiagreenspace.ro (sau subdomain)
   - Application Startup File: server.js
   - Node.js Version: 18.x sau mai nou
   - Click "Create"

4. SETARE ENVIRONMENT VARIABLES (în cPanel Node.js App)
   - NODE_ENV=production
   - PORT=5000 (sau portul configurat)
   - (Variabilele sunt deja în .env, dar poți adăuga și aici)

5. RESTART APLICAȚIE
   - În cPanel → Setup Node.js App → Click "Restart"
   - SAU: touch tmp/restart.txt

6. VERIFICARE
   - Accesează: https://asociatiagreenspace.ro/api/health
   - Ar trebui să vezi: {"status":"ok","timestamp":"..."}

STRUCTURĂ FIȘIERE:
==================
.
├── server.js              # Entry point
├── package.json           # Dependencies
├── .env                   # Environment variables (din .env.production)
├── .htaccess             # Passenger config
├── config/               # Configurații
├── routes/               # API routes
├── utils/                # Helper functions
├── middleware/           # Express middleware
├── data/                 # Date (se creează automat)
├── logs/                 # Log-uri (se creează automat)
└── tmp/
    └── restart.txt       # Pentru restart Passenger

TROUBLESHOOTING:
================

1. Aplicația nu pornește:
   - Verifică logs: tail -f logs/passenger.log
   - Verifică Node.js version în cPanel
   - Verifică că server.js există

2. Erori de dependențe:
   - Rulează: npm install --production
   - Verifică că package.json există

3. Erori de permisiuni:
   - chmod 755 pentru directoare
   - chmod 644 pentru fișiere
   - chmod 755 pentru server.js

4. API nu răspunde:
   - Verifică PORT în .env
   - Verifică CORS settings
   - Verifică firewall

COMENZI UTILE:
==============

# Restart aplicație
touch tmp/restart.txt

# Vezi log-uri
tail -f logs/passenger.log

# Verifică status
curl https://asociatiagreenspace.ro/api/health

# Reinstalează dependențe
rm -rf node_modules && npm install --production

SUPORT:
=======
Pentru probleme, verifică:
- logs/passenger.log
- cPanel → Errors
- Node.js App status în cPanel

============================================
EOF

echo -e "${GREEN}✅ Fișiere pregătite${NC}"
echo ""

# Create archives
echo -e "${BLUE}📦 Creez arhive...${NC}"
echo ""

# Create .tar.gz (recommended for cPanel)
echo -e "${YELLOW}→ Creez ${ARCHIVE_NAME}.tar.gz...${NC}"
cd "$DEPLOY_DIR"
tar -czf "${ARCHIVE_NAME}.tar.gz" -C "temp_${TIMESTAMP}" .
cd ..

# Cleanup temp directory
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✅ Arhive create cu succes!${NC}"
echo ""

# Show results
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✅ DEPLOY PREGĂTIT CU SUCCES!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${YELLOW}📦 Fișiere generate:${NC}"
echo -e "   ${DEPLOY_DIR}/${ARCHIVE_NAME}.tar.gz"
echo -e "   ${DEPLOY_DIR}/${ARCHIVE_NAME}.zip"
echo ""

# Show file sizes
TAR_SIZE=$(du -h "${DEPLOY_DIR}/${ARCHIVE_NAME}.tar.gz" | cut -f1)
ZIP_SIZE=$(du -h "${DEPLOY_DIR}/${ARCHIVE_NAME}.zip" | cut -f1)

echo -e "${YELLOW}📊 Dimensiuni:${NC}"
echo -e "   .tar.gz: ${TAR_SIZE}"
echo -e "   .zip: ${ZIP_SIZE}"
echo ""

echo -e "${BLUE}============================================${NC}"
echo -e "${YELLOW}📋 URMĂTORII PAȘI:${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "1. ${GREEN}Upload pe server:${NC}"
echo -e "   - Intră în cPanel → File Manager"
echo -e "   - Navighează la: /home/asocia17/asociatiagreenspace.ro/backend/"
echo -e "   - Upload: ${ARCHIVE_NAME}.tar.gz"
echo -e "   - Extract arhiva"
echo ""
echo -e "2. ${GREEN}Instalează dependențe:${NC}"
echo -e "   ${YELLOW}cd /home/asocia17/asociatiagreenspace.ro/backend${NC}"
echo -e "   ${YELLOW}npm install --production${NC}"
echo ""
echo -e "3. ${GREEN}Configurează în cPanel:${NC}"
echo -e "   - Setup Node.js App"
echo -e "   - Application Startup File: server.js"
echo -e "   - Click 'Restart'"
echo ""
echo -e "4. ${GREEN}Verifică:${NC}"
echo -e "   ${YELLOW}https://asociatiagreenspace.ro/api/health${NC}"
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✨ Citește DEPLOY_README.txt din arhivă pentru detalii complete!${NC}"
echo -e "${BLUE}============================================${NC}"
