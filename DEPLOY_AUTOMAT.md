# Deploy automat - Frontend + Backend (cPanel)

Deploy automat pe **asociatiagreenspace.ro** la fiecare push pe `main` care
modifică `frontend/` sau `backend/`. Workflow: `.github/workflows/deploy.yml`.

Deploy-ul folosește **FTPS** (FTP peste TLS) - nu este nevoie de SSH, deci nu
contează dacă hosting-ul nu expune portul SSH.

| Componentă | Sursă | Destinație |
|---|---|---|
| Frontend (React/Vite) | `frontend/dist` | `asociatiagreenspace.ro/public_html` |
| Backend (Node/Express/Passenger) | `backend` + `node_modules` de producție | `api-gs` (app root Passenger) |

Scriptul de upload este `.github/scripts/ftps-deploy.sh` (folosește `lftp`,
instalat de workflow pe runner). Scriptul face upload **incremental**:
fișierele neschimbate sunt sărite, cele șterse din repo sunt șterse de pe server.

---

## Configurare unică (înainte de primul deploy)

### 1. Cont FTP (obligatoriu)

1. În cPanel: **Files → FTP Accounts → Create FTP Account**
2. User: `asocia17` (sau orice cont care are acces la `public_html` și la app-ul Passenger)
3. Directory: `/` (home-ul contului) - workflow-ul navighează singur în subdirectoare
4. Setează o parolă puternică și notează-o

În GitHub: **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Necesar | Descriere |
|---|---|---|
| `FTPS_PASSWORD` | Da | Parola contului FTP din cPanel |
| `FTPS_HOST` | Opțional | implicit `asociatiagreenspace.ro` |
| `FTPS_USER` | Opțional | implicit `asocia17` |
| `FTPS_PORT` | Opțional | implicit `21` |
| `FTPS_IMPLICIT` | Opțional | implicit `false`; pune `true` pentru FTPS implicit (de obicei portul `990`) |
| `FTPS_VERIFY_CERT` | Opțional | implicit `no`; pune `yes` după ce hosting-ul servește un certificat valid |
| `CPANEL_FE_PATH` | Opțional | implicit `asociatiagreenspace.ro/public_html` |
| `CPANEL_BE_PATH` | Opțional | implicit `api-gs` |

> `CPANEL_FE_PATH` și `CPANEL_BE_PATH` sunt **relative la directorul de login
> FTP**. Poți scrie și căi absolute (`/home/asocia17/api-gs`) - scriptul
> elimină automat prefixul `/home/<user>/`. Dacă loghezi contul FTP direct în
> `public_html`, setează `CPANEL_FE_PATH=.`.

Test rapid al credențialelor, local:

```bash
lftp -c "set ftp:ssl-force true; open --env-password -u asocia17 ftp://asociatiagreenspace.ro:21; ls"
```

### 2. MySQL / SMTP (recomandat)

Fără acestea deploy-ul folosește fallback-uri de demo.

| Secret | Pentru | Note |
|---|---|---|
| `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | Backend | datele de conectare la baza MySQL din cPanel |
| `SMTP_USER`, `SMTP_PASS` | Backend | pentru email-uri reale |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | Backend | opțional; implicit `smtp.gmail.com`, `587`, `false` |
| `ADMIN_EMAIL`, `EMAIL_FROM` | Backend | opțional; default-uri în tabelul de mai jos |
| `CSRF_SECRET` | Backend | opțional; altfel backend-ul generează și persistă un secret în `data/csrf-secret` |
| `MAX_FILE_SIZE`, `MAX_VIDEO_SIZE` | Backend | opțional; limite de upload în bytes |
| `ALLOWED_FILE_TYPES` | Backend | opțional; tipuri MIME acceptate la upload, separate prin virgulă |

---

## Lista completă a variabilelor

Toate numele de mai jos sunt exact cele citite de cod. Ce nu e setat ca secret
primește valoarea implicită din tabel.

### Frontend - build-time (`frontend/.env.production`)

Generate în CI, **fără secrete**:

| Variabilă | Valoare implicită |
|---|---|
| `VITE_NODE_ENV` | `production` |
| `VITE_BACKEND_URL` | `https://api.asociatiagreenspace.ro` |
| `VITE_PORT` | `5000` |

Nu există nicio variabilă `VITE_FIREBASE_*`. Frontend-ul nu vorbește direct cu
nicio bază de date; toate datele vin din backend API.

### Backend - runtime (`backend/.env`)

Generate în CI din secrete:

| Variabilă | Implicit dacă secretul lipsește |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `FRONTEND_URL` | `https://asociatiagreenspace.ro` |
| `BACKEND_URL` | `https://api.asociatiagreenspace.ro` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` / `SMTP_PASS` | gol (email dezactivat) |
| `ADMIN_EMAIL` | `contact@asociatiagreenspace.ro` |
| `EMAIL_FROM` | `noreply@asociatiagreenspace.ro` |
| `MYSQL_HOST` | `localhost` |
| `MYSQL_PORT` | `3306` |
| `MYSQL_USER` / `MYSQL_PASSWORD` / `MYSQL_DATABASE` | gol (MySQL dezactivat) |
| `CSRF_SECRET` | generat automat pe server, persistat în `data/csrf-secret` |
| `MAX_FILE_SIZE` | `10485760` |
| `MAX_VIDEO_SIZE` | `104857600` |

Opționale, suportate de backend dar nesetate în CI:

| Variabilă | Efect |
|---|---|
| `ALLOWED_FILE_TYPES` | listă separat prin virgule; implicit setul de imagini/video |
| `API_PREFIX` | prefix pentru rute (ex. `/api`); gol = API la rădăcină |

### Variabile de infrastructură (nu ajung în aplicație)

| Variabilă | Rol |
|---|---|
| `FTPS_HOST`, `FTPS_USER`, `FTPS_PASSWORD`, `FTPS_PORT`, `FTPS_VERIFY_CERT` | conexiunea FTPS |
| `REMOTE_PATH`, `LOCAL_DIR` | setate de workflow pentru fiecare pas de deploy |
| `FTPS_PARALLEL` | opțional; număr de transferuri paralele `lftp` (implicit `3`) |
| `FTPS_IMPLICIT` | opțional; pune `true` pentru FTPS implicit (de obicei portul `990`) |

---

## Lista de setat în repo (Settings -> Secrets and variables -> Actions)

Astea sunt **toate** variabilele citite de workflow. Nu mai există nicio
variabilă `VITE_FIREBASE_*`; datele sunt în MySQL, accesate prin API-ul backend.

Obligatoriu:

| Nume | Tip | Valoare |
|---|---|---|
| `FTPS_PASSWORD` | secret | parola contului FTP din cPanel |

Opționale, dar necesare pentru un backend complet funcțional:

| Nume | Tip | Valoare |
|---|---|---|
| `MYSQL_HOST` | secret | de obicei `localhost` |
| `MYSQL_PORT` | secret | de obicei `3306` |
| `MYSQL_USER` | secret | userul bazei din cPanel |
| `MYSQL_PASSWORD` | secret | parola bazei |
| `MYSQL_DATABASE` | secret | numele bazei |
| `SMTP_USER` | secret | user SMTP pentru email |
| `SMTP_PASS` | secret | parola SMTP |

Opționale, cu valori implicite în cod:

| Nume | Tip | Implicit |
|---|---|---|
| `FTPS_HOST` | secret | `asociatiagreenspace.ro` |
| `FTPS_USER` | secret | `asocia17` |
| `FTPS_PORT` | secret | `21` |
| `FTPS_IMPLICIT` | secret | `false` |
| `FTPS_VERIFY_CERT` | secret | `no` |
| `CPANEL_BE_PATH` | secret | `api-gs` |
| `CPANEL_FE_PATH` | secret | `asociatiagreenspace.ro/public_html` |
| `SMTP_HOST` | secret | `smtp.gmail.com` |
| `SMTP_PORT` | secret | `587` |
| `SMTP_SECURE` | secret | `false` |
| `ADMIN_EMAIL` | secret | `contact@asociatiagreenspace.ro` |
| `EMAIL_FROM` | secret | `noreply@asociatiagreenspace.ro` |
| `MAX_FILE_SIZE` | secret | `10485760` |
| `MAX_VIDEO_SIZE` | secret | `104857600` |
| `ALLOWED_FILE_TYPES` | secret | listă implicită de MIME-uri imagine/video |
| `CSRF_SECRET` | secret | generat automat pe server |

`FTPS_PARALLEL` nu se setează ca secret; are implicit `3` în script.

---

## Ce rămâne pe server (nu e niciodată suprascris)

Mirror-ul este incremental și **șterge** de pe server fișierele care nu mai
există în repo. Următoarele căi sunt excluse explicit și rămân intacte:

| Cale | De ce |
|---|---|
| `backend/data/` | date încărcate de utilizatori (contacte, donații, uploads) |
| `backend/logs/` | loguri Passenger |
| `backend/tmp/` | marker-ul de restart Passenger |
| `backend/.env` | credențiale runtime; urcat separat, atomic, fără fereastră de ștergere |
| `backend/.env.local` | override-uri locale, dacă există |
| `backend/.htaccess` | rescris de CloudLinux/cPanel - copia din repo ar strica configul |
| `backend/node_modules` | symlink către virtualenv-ul cPanel; vezi mai jos |
| `public_html/.well-known/` | fișiere de validare AutoSSL |
| `public_html/cgi-bin/` | creat și administrat de cPanel |

`backend/.htaccess` din repo este exclus la staging și nu ajunge pe server.

Fiecare nume are nevoie de **ambele** forme, `nume` și `nume/`. `lftp` potrivește
un director real doar cu forma cu slash, iar un symlink (ca `node_modules`) doar
cu forma fără slash. Dacă lipsește forma potrivită, `--delete` șterge calea de pe
server în loc s-o sară.

### De ce `node_modules` NU e urcat

cPanel ține `node_modules` ca **symlink** către arborele propriu `nodevenv`:

```
node_modules -> /home/asocia17/nodevenv/api-gs/18/lib/node_modules
```

Ținta e o cale absolută care nu se rezolvă în chroot-ul serverului FTP, așa că
mirror-ul eșua cu:

```
550 Can't change directory to /api-gs/node_modules: No such file or directory
```

Dependențele sunt instalate de cPanel în acel virtualenv (Setup Node.js App), deci
nu se urcă deloc: se trimite doar codul aplicației.

### Când modifici `package.json` (dependențe noi)

Workflow-ul urcă `package.json` și `package-lock.json`, dar **nu** și
`node_modules`. Deci după un deploy care adaugă o dependență, pe server lipsește
modulul și aplicația nu pornește (`Cannot find module ...`). Deploy-ul nu poate
rula `npm ci` singur: serverul nu are SSH (portul 22 e închis), iar FTP-ul nu
execută comenzi.

Instalarea se face din cPanel, o singură dată după un asemenea deploy:

1. cPanel -> **Setup Node.js App** -> aplicația `api-gs`
2. butonul **Run NPM Install** (rulează `npm install` în `nodevenv`)
3. **Restart** aplicația

Butonul citește `package.json` din `api-gs`, deci funcționează pentru că
workflow-ul tocmai l-a urcat. Pașii 2-3 se pot face și înainte de deploy, dar
`package.json` de pe server ar fi cel vechi, deci ordinea corectă e: deploy,
apoi Run NPM Install, apoi Restart.

Workflow-ul afișează un avertisment în sumar când `package.json` sau
`package-lock.json` se schimbă, ca să nu uiți pasul.

### Cum se repornește backend-ul

Passenger repornește aplicația când `tmp/restart.txt` își schimbă timestamp-ul.
Scriptul face asta automat după upload, prin `put` cu timestamp nou. Nu e nevoie
de SSH sau de acces la panoul cPanel.

---

## Rollback

1. **Git revert** (recomandat):

   ```bash
   git revert <commit>
   git push origin main
   ```

   Workflow-ul redeployază starea anterioară.

2. **Redeploy manual al unui commit**: Actions → *Deploy FE & BE* →
   *Run workflow* de pe branch-ul dorit.

3. **Restore frontend**: dacă e nevoie de o versiune veche, restabilește
   `public_html` din backup-ul cPanel (**Files → Backups**), apoi rulează
   workflow-ul din nou pentru a re-sincroniza.

4. **Restore backend**: fișierele din `api-gs` sunt în git; fă revert și
   redeploy. Datele din `data/` și baza MySQL nu sunt atinse de deploy.

---

## Verificare după deploy

Workflow-ul verifică automat la final:

- `https://api.asociatiagreenspace.ro/health` răspunde `200` (cu retry, pentru
  că Passenger pornește la prima cerere după restart)
- `https://asociatiagreenspace.ro/` răspunde `200`

Dacă vreo verificare eșuează, job-ul e marcat roșu și deploy-ul e considerat
eșuat, deși fișierele au fost urcate.

---

## Depanare

| Simptom | Cauză probabilă | Fix |
|---|---|---|
| `FTPS_PASSWORD secret is not set` | lipsește secretul | adaugă secretul în repo |
| `Certificate verification: The certificate is NOT trusted` | FTPS cu certificat self-signed | setează `FTPS_VERIFY_CERT=no` (sau `yes` după ce certificatul e valid) |
| `530 Login incorrect` | user/parolă FTP greșite | verifică `FTPS_USER` / `FTPS_PASSWORD` |
| `550 No such file or directory` | `REMOTE_PATH` greșit | căile sunt relative la home-ul FTP; verifică-le cu `ls` |
| Backend pică cu 500 | dependențe lipsă sau Node incompatibil | verifică logurile în `logs/greenspace-backend.log` |
| Frontend 404 la refresh pe o rută | lipsește `.htaccess` (SPA rewrite) | verifică `frontend/htaccess-pentru-cpanel.txt` și pașii din workflow |
| Deploy re-urcă tot `node_modules` | `package-lock.json` s-a schimbat | normal; doar la schimbarea lockfile-ului |

Loguri utile:

- Actions: tab **Actions** → run-ul dorit
- Passenger: `~/logs/greenspace-backend.log` (din cPanel File Manager)
- Deploy anterior: `DEPLOY_AUTOMAT` (acest fișier)