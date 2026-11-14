HAS DIGITAL MEDAL VAULT — ARYA DINAR (2026–2027 SEASON)
Harare Amateur Swimming (HAS) · Official Record ID: HAS-2026-0001

OVERVIEW
--------
This is a 100% pure static website built using only HTML5, CSS3 and Vanilla JavaScript.
It requires no build tools, no package manager, no Node.js runtime, and no compilation step.

DIRECTORY STRUCTURE
-------------------
has-digital-medal-vault/
├── index.html                  (Landing experience + 4-destination Digital Medal Vault)
├── css/
│   └── style.css               (Complete aquatic stylesheet + print certificate rules)
├── js/
│   ├── data.js                 (Official athlete, medal, competition & R2 media record)
│   └── app.js                  (Navigation, video player, Moments story, lightbox & certificate)
├── assets/
│   ├── images/
│   │   ├── has-gold-medal.svg
│   │   └── has-gold-medal-reverse.svg
│   └── icons/
│       └── favicon.svg
└── README.txt

Notes on Media Assets:
- Competition Day photographs (01–08), The Podium photographs (09–11), and the
  official 50m Freestyle Final race video are streamed directly from their supplied
  Cloudflare R2 URLs configured in js/data.js.
- Local vector medal artwork (front and reverse QR engraving) is stored in assets/images/.

OPEN LOCALLY IN A BROWSER
-------------------------
Double-click index.html to open it directly in Chrome, Safari, Edge, or Firefox,
or serve the root folder with any static file server.

DEPLOY TO CLOUDFLARE PAGES
--------------------------
Option A — Direct Upload (ZIP or Folder):
1. Log in to the Cloudflare Dashboard and go to Workers & Pages -> Create -> Pages -> Direct Upload.
2. Upload the extracted has-digital-medal-vault/ folder (or upload the ZIP archive directly).
3. Deploy immediately.

Option B — Git Integration (GitHub / GitLab):
1. Push the contents of has-digital-medal-vault/ to the root of your repository.
2. In Cloudflare Pages -> Create a project -> Connect to Git, select your repository.
3. Configure build settings as:
   - Framework preset: None
   - Build command: (leave blank)
   - Build output directory: /
   - Root directory: /
4. Click "Save and Deploy".
