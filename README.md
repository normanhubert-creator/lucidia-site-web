# Site LucidIA — projet prêt à déployer

Site vitrine de LucidIA : 9 pages, 12 fiches de formation, 6 démonstrations
par fonction, 4 messages sous-titrés. React compilé par Vite, sans base de
données ni serveur applicatif : le résultat est un ensemble de fichiers
statiques, hébergeables partout et très rapide.

---

## 1. Mettre le site en ligne

### Voie rapide, sans rien installer

Le dossier `dist/` contient déjà le site compilé. Vous pouvez le déposer tel
quel :

- **Cloudflare Pages** — créez un projet, choisissez « Direct Upload », glissez
  le dossier `dist/`. Gratuit, usage commercial autorisé, bande passante
  illimitée.
- **Netlify** — sur app.netlify.com, glissez le dossier `dist/` dans la zone de
  dépôt. Gratuit également, usage commercial autorisé.

En dix minutes le site est en ligne sur une adresse provisoire du type
`lucidia.pages.dev`. Vous branchez ensuite votre domaine dans les réglages.

À éviter : le plan gratuit de Vercel (Hobby) est réservé à un usage personnel
non commercial. Pour un site de cabinet, il faudrait passer à Pro.

### Voie normale, avec mise à jour automatique

Prérequis : Node.js 20.19 ou plus récent (ou Node.js 22.12 et versions ultérieures).

```bash
npm install     # installe les dépendances
npm run dev     # aperçu local sur http://localhost:5173
npm run build   # produit dist/
npm run preview # vérifie dist/ avant publication
```

Puis déposez le projet sur un dépôt Git (GitHub, GitLab) et connectez-le à
votre hébergeur avec ces réglages :

| Réglage                | Valeur          |
| ---------------------- | --------------- |
| Commande de build      | `npm run build` |
| Dossier de publication | `dist`          |
| Version de Node        | 20.19+ ou 22.12+ |

Chaque `git push` republiera le site automatiquement.

---

## 2. Ce qu'il faut corriger avant la mise en ligne

### Obligatoire

1. **`src/LucidIA.jsx`, constante `DOMAINE`** — remplacez `https://lucidia.fr`
   par votre domaine réel. Cette valeur alimente les adresses canoniques et les
   données structurées.
2. **Mêmes corrections dans `index.html`** (balises `canonical`, `og:url`,
   `og:image`) et dans `public/robots.txt` et `public/sitemap.xml`.
3. **Mentions légales** — dans `src/LucidIA.jsx`, objet `SITE` : `adresse`,
   `siret`, `numeroDeclarationActivite`, `hebergeur`, ainsi que la forme
   juridique et le capital dans la page `PageMentions`. Publier un site
   commercial sans ces informations est une infraction, et c'est la première
   chose que vérifie un acheteur grand compte.
4. **Adresse électronique** — `SITE.email` pointe vers une adresse Gmail
   personnelle. Une adresse sur votre domaine est plus crédible et passe mieux
   les filtres anti-spam des grandes entreprises.

### Recommandé

5. **Formulaire de contact** — il fonctionne en mode `mailto` : la messagerie du
   visiteur s'ouvre avec la demande déjà rédigée. Pour recevoir les demandes
   directement, choisissez un service (Netlify Forms, Formspree, Brevo), puis
   dans `src/LucidIA.jsx`, objet `ENVOI` : passez `mode` à `"api"` et collez
   l'URL fournie dans `endpoint`. La logique d'appel et la gestion d'erreur sont
   déjà écrites.
6. **Google Search Console** — déclarez le domaine et soumettez
   `https://votre-domaine/sitemap.xml` (27 adresses y sont listées).
7. **Mesure d'audience** — si vous en ajoutez une, préférez Plausible ou Matomo
   configurés sans cookies : vous évitez le bandeau de consentement. Dans ce
   cas, complétez la section « Données personnelles » des mentions légales.

---

## 3. Organisation des fichiers

```
index.html            métadonnées, partage social, repli sans JavaScript
vite.config.js        configuration de compilation
package.json          dépendances et commandes
src/
  main.jsx            point d'entrée, chargement des polices auto-hébergées
  LucidIA.jsx         tout le site : contenus, styles, composants
public/
  _redirects          règle de réécriture (Netlify et Cloudflare Pages)
  robots.txt          consignes aux robots
  sitemap.xml         27 adresses déclarées
  favicon.svg         icône d'onglet
  apple-touch-icon.png
  og-image.png        image de partage 1200 × 630
  img/arthur.jpg      portraits, 760 × 950
  img/norman.jpg
dist/                 site compilé, prêt à déposer
```

`src/LucidIA.jsx` est commenté et organisé en sections : informations du
cabinet, catalogue, démonstrations, messages, styles, composants, pages. Les
contenus éditoriaux sont tous regroupés en tête de fichier, avant le code.

---

## 4. Modifier un contenu courant

| Ce que vous voulez changer      | Où                                              |
| ------------------------------- | ----------------------------------------------- |
| Coordonnées, liens, photos      | objet `SITE`                                    |
| Une formation, ses durées       | tableau `FORMATIONS`                            |
| Une thématique de filtre        | tableau `THEMES`                                |
| Une démonstration               | tableau `DEMOS`                                 |
| Un message sous-titré           | tableau `MESSAGES`                              |
| Les huit principes              | tableau `DIFFERENCES`                           |
| Les questions fréquentes        | tableau `FAQ`                                   |
| Les villes de la carte          | tableau `VILLES`                                |
| Une couleur, une police         | début de la constante `CSS`                     |

Après toute modification : `npm run build`, puis redéployez.

### Remplacer une animation par une vraie vidéo

Les démonstrations et les messages sont des reconstitutions signalées comme
telles. Le jour où vous disposez d'une captation, renseignez le champ `video`
de l'entrée concernée (`DEMOS` ou `MESSAGES`) avec une URL YouTube, Vimeo ou un
fichier `.mp4`. Le lecteur détecte le format, remplace l'animation et change la
mention « Illustration » en « Enregistrement ». Les sous-titres existants vous
servent de script de tournage, puis de transcription.

---

## 5. Choix techniques, et pourquoi

- **Adresses réelles plutôt qu'ancres.** Chaque page a sa propre URL
  (`/formations/prompting-professionnel`), donc son titre, sa description et son
  adresse canonique indexables séparément. Cela exige que l'hébergeur renvoie
  `index.html` pour toute adresse inconnue : c'est le rôle de
  `public/_redirects`, reconnu par Netlify et Cloudflare Pages. Sur un autre
  hébergeur, reportez cette règle dans sa configuration, ou passez la constante
  `ROUTAGE` à `"ancres"` dans `src/LucidIA.jsx`.
- **Polices auto-hébergées.** Manrope et Inter sont servies depuis votre
  domaine, sans appel à Google Fonts : une requête externe de moins, et aucun
  transfert d'adresse IP vers un tiers.
- **Photos en fichiers.** Les portraits sont dans `public/img/`, donc mis en
  cache par le navigateur au lieu d'être rechargés avec le code.
- **Animations respectueuses.** Tout mouvement est désactivé si le visiteur a
  activé « réduire les animations » dans son système. Les contenus restent
  visibles même si une animation ne se déclenche pas.
- **Accessibilité.** Navigation au clavier sur tous les éléments interactifs,
  états exposés aux lecteurs d'écran, contrastes mesurés entre 5,3:1 et 11,7:1,
  lien d'évitement vers le contenu.

---

## 6. Poids et performances

Site compilé : environ 1 Mo au total, dont 314 Ko de JavaScript (93 Ko
compressé sur le réseau) et 170 Ko de portraits. Aucune dépendance externe à
l'exécution : tout est servi par votre hébergeur.
