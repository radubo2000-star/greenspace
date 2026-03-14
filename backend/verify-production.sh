#!/bin/bash

# Script de verificare pentru deployment pe cPanel cu Passenger

echo "🔍 Verificare configurație pentru producție..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
echo "📄 Verificare fișier .env..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env există${NC}"
else
    echo -e "${RED}❌ .env nu există${NC}"
    echo -e "${YELLOW}💡 Copiază .env.production la .env și completează valorile${NC}"
fi
echo ""

# Check if .htaccess exists
echo "📄 Verificare fișier .htaccess..."
if [ -f ".htaccess" ]; then
    echo -e "${GREEN}✅ .htaccess există${NC}"
else
    echo -e "${RED}❌ .htaccess nu există${NC}"
fi
echo ""

# Check if server.js exists
echo "📄 Verificare fișier server.js..."
if [ -f "server.js" ]; then
    echo -e "${GREEN}✅ server.js există${NC}"
else
    echo -e "${RED}❌ server.js nu există${NC}"
fi
echo ""

# Check if package.json exists
echo "📄 Verificare fișier package.json..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json există${NC}"
else
    echo -e "${RED}❌ package.json nu există${NC}"
fi
echo ""

# Check if node_modules exists
echo "📦 Verificare node_modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules există${NC}"
else
    echo -e "${RED}❌ node_modules nu există${NC}"
    echo -e "${YELLOW}💡 Rulează: npm install --production${NC}"
fi
echo ""

# Check data folders
echo "📁 Verificare foldere de date..."
folders=(
    "data"
    "data/uploads"
    "data/uploads/images"
    "data/uploads/videos"
    "data/donations"
    "data/volunteers"
    "data/members"
    "data/partnerships"
    "data/contacts"
    "data/analytics"
    "data/analytics/page-views"
)

for folder in "${folders[@]}"; do
    if [ -d "$folder" ]; then
        echo -e "${GREEN}✅ $folder${NC}"
    else
        echo -e "${RED}❌ $folder${NC}"
        echo -e "${YELLOW}💡 Creează: mkdir -p $folder${NC}"
    fi
done
echo ""

# Check Node.js version
echo "🔧 Verificare Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js instalat: $NODE_VERSION${NC}"
    
    # Check if version is 18 or higher
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        echo -e "${GREEN}✅ Versiunea Node.js este compatibilă (18+)${NC}"
    else
        echo -e "${YELLOW}⚠️  Versiunea Node.js este veche. Recomandăm 18+${NC}"
    fi
else
    echo -e "${RED}❌ Node.js nu este instalat${NC}"
fi
echo ""

# Check npm
echo "📦 Verificare npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm instalat: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm nu este instalat${NC}"
fi
echo ""

# Check .env variables (if file exists)
if [ -f ".env" ]; then
    echo "🔐 Verificare variabile de mediu..."
    
    # Check NODE_ENV
    if grep -q "NODE_ENV=production" .env; then
        echo -e "${GREEN}✅ NODE_ENV=production${NC}"
    else
        echo -e "${YELLOW}⚠️  NODE_ENV nu este setat la production${NC}"
    fi
    
    # Check BACKEND_URL
    if grep -q "BACKEND_URL=https://api.asociatiagreenspace.ro" .env; then
        echo -e "${GREEN}✅ BACKEND_URL configurat corect${NC}"
    else
        echo -e "${YELLOW}⚠️  BACKEND_URL nu este configurat corect${NC}"
    fi
    
    # Check FRONTEND_URL
    if grep -q "FRONTEND_URL=https://asociatiagreenspace.ro" .env; then
        echo -e "${GREEN}✅ FRONTEND_URL configurat corect${NC}"
    else
        echo -e "${YELLOW}⚠️  FRONTEND_URL nu este configurat corect${NC}"
    fi
    
    # Check SMTP
    if grep -q "SMTP_USER=" .env && ! grep -q "SMTP_USER=$" .env; then
        echo -e "${GREEN}✅ SMTP_USER configurat${NC}"
    else
        echo -e "${YELLOW}⚠️  SMTP_USER nu este configurat${NC}"
    fi
    
    if grep -q "SMTP_PASS=" .env && ! grep -q "SMTP_PASS=$" .env; then
        echo -e "${GREEN}✅ SMTP_PASS configurat${NC}"
    else
        echo -e "${YELLOW}⚠️  SMTP_PASS nu este configurat${NC}"
    fi
    
    echo ""
fi

# Check file permissions
echo "🔒 Verificare permisiuni..."
if [ -f ".env" ]; then
    PERMS=$(stat -c "%a" .env 2>/dev/null || stat -f "%A" .env 2>/dev/null)
    if [ "$PERMS" = "600" ] || [ "$PERMS" = "400" ]; then
        echo -e "${GREEN}✅ .env are permisiuni corecte ($PERMS)${NC}"
    else
        echo -e "${YELLOW}⚠️  .env are permisiuni: $PERMS (recomandat: 600)${NC}"
        echo -e "${YELLOW}💡 Rulează: chmod 600 .env${NC}"
    fi
fi
echo ""

# Summary
echo "📊 REZUMAT"
echo "=========================================="
echo ""
echo "Pentru deployment pe cPanel cu Passenger:"
echo ""
echo "1️⃣  Configurează subdomenul în cPanel"
echo "2️⃣  Creează Node.js App în cPanel"
echo "3️⃣  Upload fișierele"
echo "4️⃣  Rulează: npm install --production"
echo "5️⃣  Copiază .env.production la .env"
echo "6️⃣  Editează .env cu valorile reale"
echo "7️⃣  Creează folderele data/"
echo "8️⃣  Restart aplicația în cPanel"
echo "9️⃣  Testează: curl https://api.asociatiagreenspace.ro/health"
echo ""
echo "📖 Vezi CPANEL_DEPLOYMENT_GUIDE.md pentru detalii complete"
echo ""
