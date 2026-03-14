#!/bin/bash

# Script pentru crearea arhivei ZIP pentru deploy pe cPanel
# Autor: Asociația Green Space

echo "🚀 Crearea arhivei pentru deploy pe cPanel..."
echo ""

# Verifică dacă folderul dist există
if [ ! -d "dist" ]; then
    echo "❌ Folderul 'dist' nu există!"
    echo "📦 Rulează mai întâi: npm run build"
    exit 1
fi

# Numele fișierului ZIP
ZIP_NAME="greenspace-deploy-$(date +%Y%m%d-%H%M%S).zip"

# Creează arhiva ZIP
echo "📦 Creez arhiva: $ZIP_NAME"
cd dist
zip -r "../$ZIP_NAME" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# Verifică dacă arhiva a fost creată
if [ -f "$ZIP_NAME" ]; then
    FILE_SIZE=$(du -h "$ZIP_NAME" | cut -f1)
    echo ""
    echo "✅ Arhiva a fost creată cu succes!"
    echo "📁 Fișier: $ZIP_NAME"
    echo "📊 Dimensiune: $FILE_SIZE"
    echo ""
    echo "📤 Următorii pași:"
    echo "   1. Loghează-te în cPanel"
    echo "   2. Deschide File Manager"
    echo "   3. Navighează la public_html"
    echo "   4. Încarcă fișierul: $ZIP_NAME"
    echo "   5. Click dreapta → Extract"
    echo "   6. Șterge fișierul ZIP după extragere"
    echo ""
    echo "📖 Pentru instrucțiuni complete, vezi: DEPLOY_CPANEL.md"
else
    echo "❌ Eroare la crearea arhivei!"
    exit 1
fi
