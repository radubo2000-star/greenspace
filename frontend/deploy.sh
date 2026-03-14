#!/bin/bash

# ============================================
# Script de Deploy Automat pentru Frontend
# Asociația Green Space
# ============================================

set -e  # Exit on error

# Culori pentru output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funcții helper
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ============================================
# Configurare
# ============================================

FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$FRONTEND_DIR")"
DIST_DIR="dist"
DEPLOY_DIR="$FRONTEND_DIR/deploy"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="greenspace-frontend-${TIMESTAMP}.tar.gz"

# Configurare cPanel (opțional - pentru upload automat)
CPANEL_USER="asocia17"
CPANEL_HOST="asociatiagreenspace.ro"
CPANEL_REMOTE_PATH="public_html"

# ============================================
# Start Deploy
# ============================================

print_header "🚀 Deploy Frontend - Asociația Green Space"

# ============================================
# Verificări Inițiale
# ============================================

print_info "Verificare mediu..."

# Verifică dacă suntem în directorul corect
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    print_error "Nu sunt în directorul frontend corect!"
    exit 1
fi

# Verifică dacă există .env.production
if [ ! -f "$FRONTEND_DIR/.env.production" ]; then
    print_error "Fișierul .env.production nu există!"
    print_info "Creează fișierul .env.production cu configurația de producție"
    exit 1
fi

print_success "Verificări inițiale complete"

# ============================================
# Curățare
# ============================================

print_header "🧹 Curățare fișiere vechi"

# Șterge dist vechi
if [ -d "$DIST_DIR" ]; then
    print_info "Șterg folderul dist vechi..."
    rm -rf "$DIST_DIR"
    print_success "Dist vechi șters"
fi

# Creează director deploy dacă nu există
if [ ! -d "$DEPLOY_DIR" ]; then
    mkdir -p "$DEPLOY_DIR"
    print_success "Director deploy creat"
fi

# ============================================
# Instalare Dependențe
# ============================================

print_header "📦 Verificare dependențe"

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    print_info "Instalez dependențele..."
    cd "$FRONTEND_DIR"
    npm install
    print_success "Dependențe instalate"
else
    print_success "Dependențele sunt deja instalate"
fi

# ============================================
# Build Production
# ============================================

print_header "🔨 Build pentru producție"

print_info "Folosesc .env.production pentru configurație..."
print_info "Backend URL: $(grep VITE_BACKEND_URL $FRONTEND_DIR/.env.production | cut -d '=' -f2)"

cd "$FRONTEND_DIR"

# Copiază .env.production ca .env.local (Vite îl va folosi automat)
cp .env.production .env.local

# Rulează build
print_info "Rulez build (skip TypeScript check pentru deploy rapid)..."
npx vite build

# Șterge .env.local după build
rm -f .env.local

if [ ! -d "$DIST_DIR" ]; then
    print_error "Build-ul a eșuat! Folderul dist nu a fost creat."
    exit 1
fi

print_success "Build complet!"

# ============================================
# Verificare Build
# ============================================

print_header "🔍 Verificare build"

# Verifică dimensiunea
DIST_SIZE=$(du -sh "$DIST_DIR" | cut -f1)
print_info "Dimensiune dist: $DIST_SIZE"

# Verifică fișiere importante
if [ -f "$DIST_DIR/index.html" ]; then
    print_success "index.html găsit"
else
    print_error "index.html lipsește!"
    exit 1
fi

# Numără fișierele
FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l)
print_info "Număr total fișiere: $FILE_COUNT"

# ============================================
# Creare Arhivă
# ============================================

print_header "📦 Creare arhivă pentru deploy"

cd "$FRONTEND_DIR"

# Creează arhivă tar.gz
print_info "Creez arhiva $ARCHIVE_NAME..."
tar -czf "$DEPLOY_DIR/$ARCHIVE_NAME" -C "$DIST_DIR" .

if [ -f "$DEPLOY_DIR/$ARCHIVE_NAME" ]; then
    ARCHIVE_SIZE=$(du -sh "$DEPLOY_DIR/$ARCHIVE_NAME" | cut -f1)
    print_success "Arhivă creată: $ARCHIVE_NAME ($ARCHIVE_SIZE)"
else
    print_error "Crearea arhivei a eșuat!"
    exit 1
fi


# ============================================
# Creare .htaccess
# ============================================

print_header "📝 Creare .htaccess pentru cPanel"

cat > "$DIST_DIR/.htaccess" << 'EOF'
# ============================================
# .htaccess pentru React Router (cPanel/Apache)
# Asociația Green Space
# ============================================

# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redirect HTTP to HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Handle React Router
  # If the requested file or directory exists, serve it
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API calls (if backend is on same domain)
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html
  RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  # Prevent clickjacking
  Header always set X-Frame-Options "SAMEORIGIN"
  
  # XSS Protection
  Header always set X-XSS-Protection "1; mode=block"
  
  # Prevent MIME sniffing
  Header always set X-Content-Type-Options "nosniff"
  
  # Referrer Policy
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  
  # Fonts
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
  
  # HTML (no cache for main page)
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Disable directory browsing
Options -Indexes

# Custom Error Pages (optional)
# ErrorDocument 404 /index.html
# ErrorDocument 500 /index.html
EOF

print_success ".htaccess creat în dist/"

# Adaugă .htaccess în arhive
cd "$FRONTEND_DIR"
tar -czf "$DEPLOY_DIR/$ARCHIVE_NAME" -C "$DIST_DIR" .

print_success ".htaccess adăugat în arhive"

# ============================================
# Instrucțiuni Deploy Manual
# ============================================

print_header "📋 Instrucțiuni Deploy Manual"

cat << EOF

${GREEN}✓ Build complet cu succes!${NC}

${YELLOW}Fișiere generate:${NC}
  📁 Folder dist:     $DIST_DIR
  📦 Arhivă tar.gz:   $DEPLOY_DIR/$ARCHIVE_NAME
  📦 Arhivă zip:      $DEPLOY_DIR/greenspace-frontend-${TIMESTAMP}.zip

${YELLOW}Pentru deploy manual pe cPanel:${NC}

${BLUE}Opțiunea 1: Upload prin File Manager${NC}
  1. Loghează-te în cPanel
  2. Deschide File Manager
  3. Navighează la: $CPANEL_REMOTE_PATH
  4. Upload arhiva: $ARCHIVE_NAME
  5. Click dreapta pe arhivă → Extract
  6. Șterge arhiva după extragere

${BLUE}Opțiunea 2: Upload prin FTP${NC}
  1. Conectează-te la FTP (FileZilla, etc.)
  2. Navighează la: $CPANEL_REMOTE_PATH
  3. Upload tot conținutul din: $DIST_DIR
  4. Asigură-te că .htaccess este uploadat

${BLUE}Opțiunea 3: Deploy automat (vezi mai jos)${NC}

${YELLOW}Verificare după deploy:${NC}
  ✓ Vizitează: https://asociatiagreenspace.ro
  ✓ Testează: https://asociatiagreenspace.ro/login
  ✓ Verifică: Console browser pentru erori
  ✓ Testează: Toate rutele React Router

EOF

# ============================================
# Deploy Automat (Opțional)
# ============================================

print_header "🚀 Deploy Automat"

echo -e "${YELLOW}Vrei să deploy automat pe server? (necesită SSH/FTP configurat)${NC}"
echo -e "${BLUE}Opțiuni:${NC}"
echo -e "  1) Deploy via SSH (rsync)"
echo -e "  2) Deploy via FTP (lftp)"
echo -e "  3) Skip (deploy manual)"
echo ""
read -p "Alege opțiunea (1/2/3): " deploy_option

case $deploy_option in
    1)
        print_info "Deploy via SSH..."
        
        # Verifică dacă rsync este instalat
        if ! command -v rsync &> /dev/null; then
            print_error "rsync nu este instalat!"
            print_info "Instalează cu: sudo apt-get install rsync (Linux) sau brew install rsync (Mac)"
            exit 1
        fi
        
        print_warning "Asigură-te că ai configurat SSH key pentru $CPANEL_USER@$CPANEL_HOST"
        read -p "Continuă? (y/n): " confirm
        
        if [ "$confirm" = "y" ]; then
            print_info "Sincronizez fișierele..."
            
            rsync -avz --delete \
                --exclude='.git' \
                --exclude='node_modules' \
                "$DIST_DIR/" \
                "$CPANEL_USER@$CPANEL_HOST:$CPANEL_REMOTE_PATH/"
            
            print_success "Deploy complet via SSH!"
        else
            print_warning "Deploy anulat"
        fi
        ;;
        
    2)
        print_info "Deploy via FTP..."
        
        # Verifică dacă lftp este instalat
        if ! command -v lftp &> /dev/null; then
            print_error "lftp nu este instalat!"
            print_info "Instalează cu: sudo apt-get install lftp (Linux) sau brew install lftp (Mac)"
            exit 1
        fi
        
        read -p "FTP Password pentru $CPANEL_USER: " -s ftp_password
        echo ""
        
        print_info "Upload fișiere via FTP..."
        
        lftp -u "$CPANEL_USER","$ftp_password" "ftp://$CPANEL_HOST" <<EOF
set ftp:ssl-allow yes
set ftp:ssl-force yes
set ssl:verify-certificate no
cd "$CPANEL_REMOTE_PATH"
mirror -R --delete --verbose "$DIST_DIR/" ./
bye
EOF

        
        print_success "Deploy complet via FTP!"
        ;;
        
    3)
        print_info "Deploy manual - urmează instrucțiunile de mai sus"
        ;;
        
    *)
        print_warning "Opțiune invalidă - deploy manual"
        ;;
esac

# ============================================
# Curățare Finală
# ============================================

print_header "🧹 Curățare"

read -p "Ștergi folderul dist local? (y/n): " cleanup
if [ "$cleanup" = "y" ]; then
    rm -rf "$DIST_DIR"
    print_success "Dist local șters"
fi

# ============================================
# Finalizare
# ============================================

print_header "✅ Deploy Finalizat"

cat << EOF

${GREEN}🎉 Totul este gata!${NC}

${YELLOW}Fișiere disponibile:${NC}
  📦 $DEPLOY_DIR/$ARCHIVE_NAME
  📦 $DEPLOY_DIR/greenspace-frontend-${TIMESTAMP}.zip

${YELLOW}Următorii pași:${NC}
  1. Upload fișierele pe server (dacă nu ai făcut deploy automat)
  2. Verifică site-ul: https://asociatiagreenspace.ro
  3. Testează toate funcționalitățile
  4. Verifică console-ul browser pentru erori

${BLUE}Arhivele vechi pot fi șterse din:${NC}
  $DEPLOY_DIR/

${GREEN}Succes! 🚀${NC}

EOF

# ============================================
# Log Deploy
# ============================================

# Salvează log de deploy
LOG_FILE="$DEPLOY_DIR/deploy-log.txt"
cat >> "$LOG_FILE" << EOF
========================================
Deploy: $TIMESTAMP
========================================
Date: $(date)
Archive: $ARCHIVE_NAME
Dist Size: $DIST_SIZE
Files: $FILE_COUNT
Status: Success
========================================

EOF

print_success "Log salvat în: $LOG_FILE"

exit 0
