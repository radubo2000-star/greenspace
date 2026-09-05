# 🚀 Deploy Automat — Frontend + Backend (GitHub Actions)

> Asociația Green Space — la fel ca pentru repo-ul @george-sarluceanu, dar adaptat pentru hosting-ul cPanel (asociatiagreenspace.ro).

Pe fiecare push pe `main` care modifică `frontend/`, `backend/` sau `.github/workflows/`, pipeline-ul:

1. **Build** frontend-ul (Vite, cu `.env.production` generat automat)
2. **Pachetează** backend-ul (Node/Express, fără `node_modules`/`data`/`logs`)
3. **Deploy backend** pe server prin SSH → `/home/asocia17/api-gs` (app-ul Passenger) + restart automat (`touch tmp/restart.txt`)
4. **Deploy frontend** prin rsync → `public_html` (asociatiagreenspace.ro) + `.htaccess` (SPA rewrite, security headers)
5. **Verifică** automat: `https://api.asociatiagreenspace.ro/health` și `https://asociatiagreenspace.ro/`

Deploy-ul rulează doar când sunt modificări reale (frontend sau backend), iar build-urile concurente pe aceeași ramură nu se suprapun.

 Poți rula și manual din tab-ul **Actions** → **Deploy FE & BE** → **Run workflow**.

---

## ⚙️ Configurare unică (înainte de primul deploy)

### 1. Cheie SSH (obligatoriu)

Generează o cheie pe computerul tău (sau pe server:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/greenspace_deploy
```

Adaugă **public** key pe server (dacă nu există deja|:

```bash
ssh-copy-id -i ~/.ssh/greenspace_deploy.pub asocia17@asociatiagreenspace.ro
```

> ⚠️ Dacă SSH pe port 22 nu e deschis pe hosting, activează-l din cPanel
> (**Security** → **SSH Access**) sau folosește portul corect (vezi mai jos).

În GitHub: **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Necesar | Descriere |
|---|---|---|
| `CPANEL_SSH_KEY` | ✅ Da | Conținutul **private** key (`cat ~/.ssh/greenspace_deploy` — text multiline|
| `CPANEL_SSH_USER` | Opțional | implicit `asocia17` |
| `CPANEL_SSH_HOST` | Opțional | implicit `asociatiagreenspace.ro` |
| `CPANEL_SSH_PORT` | Opțional | implicit `22` |
| `CPANEL_FE_PATH` | Opțional | implicit `/home/asocia17/asociatiagreenspace.ro/public_html` — path-ul `public_html` pe server |
| `CPANEL_BE_PATH` | Opțional | implicit `/home/asocia17/api-gs` — app root-ul Passenger |

### 2. Firebase / SMTP (recomandat)

Fără acestea deploy-ul merge, dar admin-ul și email-urile folosesc fallback-uri de demo. Recomandat:

| Secret | Pentru | Note |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Frontend | + `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` (toate `VITE_FIREBASE_*` din `.env.example`|
| `FIREBASE_SERVICE_ACCOUNT` | Backend | JSON-ul service account (multiline| — pentru verificare token-uri admin |
| `FIREBASE_DATABASE_URL` | Backend | ex. `https://proiect-default-rtdb.firebaseio.com` |
| `SMTP_USER`, `SMTP_PASS` | Backend | pentru email-uri reale (Gmail/app password etc.) |
| `ADMIN_EMAIL`, `EMAIL_FROM` | Backend | opțional; default-uri din `.env.example` |

---

## 🔍 Verificare după deploy

```bash
curl https://api.asociatiagreenspace.ro/health
# {"status":"ok","environment":"production",...}

curl -I https://asociatiagreenspace.ro/
# HTTP/2 200
```

Deploy-ul face singur aceste verificări — dacă backend-ul nu răspunde după ~2.5 minute (restart Passenger|, pipeline-ul eșuează și nu marchează deploy-ul ca reușit.

---

## ↩️ Rollback

Fiecare deploy backend face automat un backup pe server:

```bash
# Pe server (SSH|, în /home/asocia17/api-gs:
ls backup-*.tar.gz

# Restaurează ultimul:
tar -xzf backup-YYYYMMDD-HHMMSS.tar.gz
touch tmp/restart.txt
```

Pentru frontend, poți restaura din git history (versiunea anterioară din `dist/`) sau re-rula workflow-ul de pe un commit vechi.



---

## 📁 Structură GitHub Actions

```text
.github/
└── workflows/
    └── deploy.yml        # Pipeline complet: build FE, package BE, SSH deploy + verificare
```

Fișierele generate (`.env.production`, `.env`) sunt create **doar în CI**, niciodată comise — valorile reale vin din GitHub Secrets.|