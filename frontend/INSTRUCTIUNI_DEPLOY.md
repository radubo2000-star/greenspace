# 🎯 INSTRUCȚIUNI RAPIDE - PUBLICARE PE CPANEL

## ✅ Ce am pregătit pentru tine:

### 📦 Fișiere Generate:

1. **`dist/`** - Folderul cu toate fișierele site-ului
2. **`greenspace-deploy.tar.gz`** - Arhivă comprimată (opțional)
3. **`dist/.htaccess`** - Configurare server (deja inclus în dist)
4. **`DEPLOY_CPANEL.md`** - Ghid complet de publicare

---

## 🚀 METODA 1: Upload Direct (Recomandat)

### Pași:

1. **Deschide folderul `dist`** pe computerul tău
   - Locație: `frontend/dist/`

2. **Loghează-te în cPanel**
   - Accesează panoul de administrare al hosting-ului

3. **Deschide File Manager**
   - Caută "File Manager" în cPanel

4. **Navighează la `public_html`**
   - Pentru domeniul principal: `public_html`
   - Pentru subdomeniu: `public_html/subdomeniu`

5. **Șterge fișierele vechi** (dacă există)
   - Selectează tot → Delete
   - ⚠️ Păstrează `.htaccess` dacă are configurări importante

6. **Încarcă fișierele**
   - Click pe butonul **Upload**
   - Selectează TOATE fișierele din folderul `dist`
   - Include și fișierele ascunse (`.htaccess`)
   - Așteaptă finalizarea upload-ului

7. **Verifică**
   - Accesează domeniul tău în browser
   - Testează navigarea între pagini

---

## 🗜️ METODA 2: Upload Arhivă (Pentru conexiuni lente)

### Pași:

1. **Descarcă arhiva**
   - Fișier: `frontend/greenspace-deploy.tar.gz`

2. **Loghează-te în cPanel → File Manager**

3. **Navighează la `public_html`**

4. **Încarcă arhiva**
   - Click **Upload**
   - Selectează `greenspace-deploy.tar.gz`

5. **Extrage arhiva**
   - Click dreapta pe fișier → **Extract**
   - Confirmă extragerea

6. **Șterge arhiva**
   - După extragere, șterge fișierul `.tar.gz`

---

## 📋 Structura Finală în public_html

După upload, ar trebui să ai:

```
public_html/
├── index.html              ← Pagina principală
├── .htaccess              ← IMPORTANT! Configurare server
├── assets/
│   ├── index-*.css        ← Stiluri
│   └── index-*.js         ← JavaScript
├── images/                ← Imagini
├── videos/                ← Video-uri
├── documents/             ← Documente
├── reports/               ← Rapoarte
├── favicon.ico
├── logo.png
├── manifest.json
├── robots.txt
└── sitemap.xml
```

---

## ⚙️ Configurare Firebase (IMPORTANT!)

### Înainte de a publica, verifică:

1. **Fișierul `.env.production`** trebuie să conțină:
   ```env
   VITE_FIREBASE_API_KEY=your-key
   VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   ```

2. **În Firebase Console:**
   - Authentication → Settings → Authorized domains
   - Adaugă domeniul tău (ex: `www.greenspace.ro`)

---

## 🔧 Verificări După Publicare

### ✅ Checklist:

- [ ] Site-ul se încarcă la adresa principală
- [ ] Navigarea între pagini funcționează
- [ ] Imaginile se încarcă corect
- [ ] Formularele funcționează
- [ ] Nu sunt erori în Console (F12)
- [ ] Site-ul este responsive pe mobil
- [ ] SSL/HTTPS este activ (lacăt verde în browser)

---

## 🐛 Probleme Comune și Soluții

### ❌ Pagina 404 când dai refresh
**Cauză:** Fișierul `.htaccess` lipsește sau `mod_rewrite` nu e activ  
**Soluție:** 
- Verifică dacă `.htaccess` este în `public_html`
- Contactează hosting-ul pentru activarea `mod_rewrite`

### ❌ CSS/JS nu se încarcă
**Cauză:** Permisiuni greșite sau cache browser  
**Soluție:**
- Setează permisiuni: 644 pentru fișiere, 755 pentru foldere
- Curăță cache: Ctrl+Shift+R (Windows) sau Cmd+Shift+R (Mac)

### ❌ Imagini lipsă
**Cauză:** Folderele nu au fost încărcate complet  
**Soluție:** Verifică dacă toate folderele (`images/`, `videos/`, etc.) există

### ❌ Erori Firebase
**Cauză:** Configurare incorectă sau domeniu neautorizat  
**Soluție:**
- Verifică `.env.production`
- Adaugă domeniul în Firebase Console

---

## 📊 Optimizări Recomandate

### 1. **Activează SSL/HTTPS**
- cPanel → SSL/TLS Status
- Activează pentru domeniul tău
- ⚠️ OBLIGATORIU pentru Firebase Authentication

### 2. **Configurează Cloudflare** (Opțional)
- Performanță mai bună
- Protecție DDoS
- CDN gratuit

### 3. **Verifică SEO**
- Google Search Console
- Verifică `robots.txt` și `sitemap.xml`

---

## 🔄 Actualizări Viitoare

Pentru a actualiza site-ul:

```bash
# 1. Modifică codul
# 2. Generează build nou
cd frontend
npm run build

# 3. Încarcă din nou fișierele din dist/ pe cPanel
```

---

## 📞 Suport

### Dacă întâmpini probleme:

1. **Verifică logs-urile:**
   - cPanel → Errors
   - Browser Console (F12)

2. **Contactează hosting-ul** pentru:
   - Probleme de server
   - Activare mod_rewrite
   - Configurare SSL

3. **Verifică documentația:**
   - `DEPLOY_CPANEL.md` - Ghid complet
   - Firebase Documentation

---

## 📁 Fișiere Importante

| Fișier | Descriere |
|--------|-----------|
| `dist/` | Fișierele site-ului (încarcă acestea pe server) |
| `dist/.htaccess` | Configurare server (IMPORTANT!) |
| `greenspace-deploy.tar.gz` | Arhivă comprimată (alternativă) |
| `DEPLOY_CPANEL.md` | Ghid detaliat de publicare |
| `.env.production` | Configurare Firebase |

---

## ✨ Gata de Publicare!

Toate fișierele sunt pregătite în folderul **`frontend/dist/`**

**Următorul pas:** Încarcă-le pe cPanel folosind una din metodele de mai sus!

**Succes cu publicarea site-ului Asociația Green Space! 🌿**

---

*Ultima actualizare: 11 Ianuarie 2025*
