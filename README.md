# Site de mariage

Un site d'une seule page, en HTML/CSS/JS pur — **aucun build, aucune dépendance**.
Il s'ouvre sur une animation d'enveloppe, puis déroule le mot de bienvenue,
la date et le lieu, la carte, le programme de la journée et le formulaire de réponse.

```
mariage/
├── index.html                 la page (structure)
├── assets/
│   ├── css/style.css          tout le style + les animations
│   ├── js/config.js           ← LE SEUL FICHIER À MODIFIER
│   ├── js/main.js             la logique (injection du contenu, RSVP, scroll…)
│   └── img/
│       ├── botanic/*.svg      le feuillage (généré, ne pas éditer à la main)
│       └── photos/            ← DÉPOSE TES PHOTOS ICI
├── tools/generate_botanic.py  régénère le feuillage si tu veux le retoucher
└── .github/workflows/pages.yml  déploiement automatique (optionnel)
```

---

## 1. Personnaliser le contenu (5 minutes)

Tout est dans **`assets/js/config.js`**. Ouvre-le, remplace les valeurs :

| À changer | Où |
|---|---|
| Vos prénoms et les initiales du cachet de cire | `couple` |
| La date (compte à rebours + affichage) | `date` |
| Le lieu, l'adresse, la carte | `lieu` |
| Le mot de bienvenue, la signature | `textes` |
| Le déroulé de la journée | `programme` |
| Les chemins des photos | `photos` |
| Le formulaire de réponse | `rsvp` |
| Activer/désactiver l'enveloppe, le compte à rebours | `options` |

Les lignes marquées `//  À REMPLACER` sont celles à traiter en priorité.

### Les photos

Dépose tes fichiers dans `assets/img/photos/` avec exactement ces noms :

- `couple.jpg` — la photo de vous deux (section « Un mot pour vous »)
- `lieu-1.jpg`, `lieu-2.jpg`, `lieu-3.jpg` — la galerie du lieu

Tu peux aussi mettre d'autres noms, il suffit de les indiquer dans `config.js`.
Tant qu'une photo est absente, un cadre « photo à venir » s'affiche à sa place —
le site ne casse jamais.

> Conseil : redimensionne les images à ~1600 px de large et compresse-les
> (par exemple sur [squoosh.app](https://squoosh.app)). Une page qui charge
> 12 Mo de photos, c'est pénible sur le téléphone de mamie.

### La carte

Aucune clé d'API Google n'est nécessaire. Renseigne simplement
`lieu.rechercheMaps` avec ce que tu taperais dans la barre de recherche de
Google Maps (« Domaine de X, Ville »). La carte et le bouton « Itinéraire »
se génèrent tout seuls.

---

## 2. Brancher le formulaire de réponse (Formspree)

Le site est statique : il n'a pas de serveur pour stocker les réponses.
Formspree s'en charge et t'envoie chaque réponse par e-mail.

1. Crée un compte gratuit sur <https://formspree.io>.
2. **New form** → donne-lui un nom → indique ton adresse e-mail.
3. Formspree affiche une URL du type `https://formspree.io/f/xdorwabc`.
4. Copie **la dernière partie** (`xdorwabc`) dans `config.js` :
   ```js
   rsvp: {
     formspreeId: "xdorwabc",
     …
   }
   ```
5. Envoie une réponse de test depuis le site : le premier envoi demande une
   confirmation par e-mail, ensuite tout est automatique.

Le plan gratuit couvre 50 réponses par mois. Au-delà, soit tu passes au plan
payant le temps des réponses, soit tu bascules sur Google Sheets (voir plus bas).

Toutes les réponses sont aussi consultables dans le tableau de bord Formspree,
et exportables en CSV — pratique pour faire le plan de table.

<details>
<summary><strong>Alternative : envoyer les réponses dans un Google Sheet</strong></summary>

1. Crée un Google Sheet, puis **Extensions → Apps Script**.
2. Colle ce script et déploie-le en **application web**, accessible à « tout le monde » :

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const d = JSON.parse(e.postData.contents);
     sheet.appendRow([new Date(), d.nom, d.email, d.presence,
                      d.nombre_personnes, d.repas, d.message]);
     return ContentService.createTextOutput(JSON.stringify({ok: true}))
                          .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. Dans `assets/js/main.js`, remplace l'URL `"https://formspree.io/f/" + id`
   par l'URL de ton déploiement Apps Script.
</details>

---

## 3. Mettre en ligne sur GitHub Pages

### a. Créer le dépôt

Sur GitHub : **New repository** → nom `mariage` → **Public**
(GitHub Pages n'est gratuit sur les dépôts privés qu'avec un compte payant).
Ne coche rien d'autre.

### b. Envoyer les fichiers

Depuis le dossier du site :

```bash
git init
git add .
git commit -m "Site de mariage"
git branch -M main
git remote add origin https://github.com/<TON-PSEUDO>/mariage.git
git push -u origin main
```

*(Le dossier livré contient déjà un dépôt git avec un premier commit :
dans ce cas, seules les deux dernières lignes sont nécessaires.)*

### c. Activer Pages

Dans le dépôt : **Settings → Pages**, puis au choix :

- **Source : Deploy from a branch** → branche `main`, dossier `/ (root)`.
  Le plus simple. Dans ce cas, supprime `.github/workflows/pages.yml`.
- **Source : GitHub Actions** → le workflow fourni s'occupe du reste
  à chaque `git push`.

Une à deux minutes plus tard, le site est en ligne sur :

```
https://<TON-PSEUDO>.github.io/mariage/
```

### d. (Optionnel) Un nom de domaine à vous

Si tu achètes un domaine (~10 €/an) :

1. Crée un fichier `CNAME` à la racine contenant une seule ligne, ex. `jeanne-et-benjamin.fr`
2. Chez ton registrar, ajoute quatre enregistrements `A` vers
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (et un `CNAME` `www` vers `<TON-PSEUDO>.github.io`).
3. Dans **Settings → Pages**, renseigne le domaine et coche **Enforce HTTPS**.

---

## 4. Pour aller plus loin

**Modifier les couleurs** — tout est en haut de `assets/css/style.css`, dans le
bloc `:root` : `--blue-*` (bleu-gris), `--rose-*` (rose pastel), `--sage-*`
(verts), `--brown-*` / `--kraft` (les bruns du kraft).

**Modifier le feuillage** — les SVG sont générés par
`python3 tools/generate_botanic.py`. Les branches, densités et teintes se
règlent dans ce script (variable `GREENS`, fonctions `column_left`, `wreath`…).

**Désactiver l'enveloppe** — `options.enveloppe: false` dans `config.js`.
Par défaut elle ne se joue qu'une fois par session de navigation : un invité
qui revient sur le site n'a pas à la rouvrir à chaque fois.

**Accessibilité** — le site respecte `prefers-reduced-motion` : les personnes
qui ont désactivé les animations dans leur système arrivent directement sur la
page, sans enveloppe ni effets.

**Tester en local** — depuis le dossier :

```bash
python3 -m http.server 8000
```

puis ouvre <http://localhost:8000>. (Ouvrir `index.html` directement en
double-cliquant fonctionne aussi, mais la carte Google peut être bloquée.)

---

## Avant d'envoyer le lien aux invités — la check-list

- [ ] Prénoms, date et lieu remplacés dans `config.js`
- [ ] Programme de la journée à jour
- [ ] Photos déposées dans `assets/img/photos/`
- [ ] `formspreeId` renseigné **et testé** avec un envoi réel
- [ ] Adresse e-mail de contact correcte
- [ ] Carte Google Maps qui pointe au bon endroit
- [ ] Testé sur un téléphone (c'est là que 90 % des invités l'ouvriront)
