#!/bin/bash

# ============================================
# Script de Deploy RAPID pentru Frontend
# Asociația Green Space
# ============================================

set -e

echo "🚀 Deploy Rapid Frontend..."
echo ""

# Directoare
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$FRONTEND_DIR/dist"
DEPLOY_DIR="$FRONTEND_DIR/deploy"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Verifică .env.production
if [ ! -f "$FRONTEND_DIR/.env.production" ]; then
    echo "❌ .env.production nu există!"
    exit 1
fi

# Curățare
echo "🧹 Curățare..."
rm -rf "$DIST_DIR"
mkdir -p "$DEPLOY_DIR"

# Build
echo "🔨 Build cu .env.production..."
cd "$FRONTEND_DIR"
cp .env.production .env.local

# Build doar cu Vite (skip TypeScript check pentru deploy rapid)
echo "   (build rapid - skip TypeScript check...)"
npx vite build

rm -f .env.local

# Verificare
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ Build eșuat!"
    exit 1
fi

# Creare .htaccess
echo "📝 Creare .htaccess..."
cat > "$DIST_DIR/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteRule . /index.html [L]
</IfModule>
<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set X-Content-Type-Options "nosniff"
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
Options -Indexes
EOF

# Creare arhivă
echo "📦 Creare arhivă..."
ARCHIVE_NAME="greenspace-frontend-${TIMESTAMP}.tar.gz"
cd "$FRONTEND_DIR"
tar -czf "$DEPLOY_DIR/$ARCHIVE_NAME" -C "$DIST_DIR" .

# Creare ZIP
cd "$DIST_DIR"
zip -r "$DEPLOY_DIR/greenspace-frontend-${TIMESTAMP}.zip" . > /dev/null 2>&1

# Dimensiuni
DIST_SIZE=$(du -sh "$DIST_DIR" | cut -f1)
ARCHIVE_SIZE=$(du -sh "$DEPLOY_DIR/$ARCHIVE_NAME" | cut -f1)

echo ""
echo "✅ Deploy complet!"
echo ""
echo "📊 Statistici:"
echo "   Dist: $DIST_SIZE"
echo "   Arhivă: $ARCHIVE_SIZE"
echo ""
echo "📦 Fișiere generate:"
echo "   $DEPLOY_DIR/$ARCHIVE_NAME"
echo "   $DEPLOY_DIR/greenspace-frontend-${TIMESTAMP}.zip"
echo ""
echo "📋 Următorii pași:"
echo "   1. Upload arhiva în cPanel File Manager"
echo "   2. Extract în /home/asocia17/asociatiagreenspace.ro/public_html"
echo "   3. Verifică: https://asociatiagreenspace.ro"
echo ""
echo "🎉 Succes!"
