/* ════════════════════════════════════════════════════════════════════════
   PRÉ-RENDU DES MÉTADONNÉES DE PARTAGE

   Pourquoi ce fichier existe
   ──────────────────────────
   Le site est une application d'une seule page : le navigateur remplace le
   titre, la description et l'adresse canonique après avoir exécuté le
   JavaScript. Les robots de LinkedIn, WhatsApp, Slack ou Signal n'exécutent
   pas de JavaScript : ils lisent le HTML tel qu'il arrive, et voyaient donc
   les métadonnées de la page d'accueil, quelle que soit l'adresse partagée.

   Ce script s'exécute après « vite build ». Pour chaque adresse listée
   ci-dessous, il écrit un dist/<chemin>/index.html : une copie de la page
   construite, dont les seules balises de métadonnées ont été remplacées.
   Netlify sert un fichier existant avant d'appliquer la règle de réécriture,
   donc ces fichiers sont servis tels quels — aux robots comme aux visiteurs —
   et l'application démarre ensuite normalement, puisqu'elle lit l'adresse.

   La balise noindex présente dans index.html est recopiée à l'identique :
   ce pré-rendu ne change rien à l'exposition du site aux moteurs.

   Les textes ne sont PAS dupliqués ici : ils sont lus dans src/LucidIA.jsx,
   qui reste l'unique source. Si la lecture échoue, le script interrompt la
   construction plutôt que de publier des métadonnées fausses.
   ════════════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_SITE = { url: "/og-image.png", w: 1200, h: 630,
  alt: "LucidIA — formation et conseil en intelligence artificielle" };

const source = readFileSync(join(racine, "src/LucidIA.jsx"), "utf8");

function fatal(message) {
  console.error("\n✗ Pré-rendu interrompu : " + message);
  console.error("  Les métadonnées de partage seraient fausses. Construction arrêtée.\n");
  process.exit(1);
}

/* L'adresse du site n'est écrite qu'à un seul endroit : la constante DOMAINE
   du composant. On la lit ici plutôt que de la recopier, pour qu'une adresse
   publiée ne puisse jamais contredire celle qu'affiche l'application. */
const domaineLu = source.match(/const DOMAINE = "(https?:\/\/[^"]+)";/);
if (!domaineLu) fatal("la constante DOMAINE est introuvable dans src/LucidIA.jsx");
const DOMAINE = domaineLu[1].replace(/\/$/, "");

/* ── Lecture des pages déclarées dans le composant ── */
const blocPages = source.match(/const PAGES = \[([\s\S]*?)\n\];/);
if (!blocPages) fatal("la liste PAGES est introuvable dans src/LucidIA.jsx");

const pages = new Map();
for (const ligne of blocPages[1].split("\n")) {
  const m = ligne.match(
    /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*titre:\s*"([^"]+)",\s*meta:\s*"([^"]+)"\s*\}/
  );
  if (m) pages.set(m[1], { titre: m[3], meta: m[4] });
}
if (pages.size < 8) fatal(`seulement ${pages.size} page(s) lue(s) dans PAGES`);

/* ── Lecture du numéro de revue mis en avant ── */
function champ(bloc, nom) {
  const m = bloc.match(new RegExp(nom + ':\\s*\\n?\\s*"([^"]+)"'));
  return m ? m[1] : null;
}
const blocNumeros = source.match(/const NUMEROS = \[([\s\S]*?)\n\];/);
if (!blocNumeros) fatal("la liste NUMEROS est introuvable");
const premier = blocNumeros[1].split(/\n  \{/).find((b) => /publie:\s*true/.test(b));
if (!premier) fatal("aucun numéro publié trouvé dans NUMEROS");

const numero = {
  id: champ(premier, "id"),
  numero: champ(premier, "numero"),
  date: champ(premier, "date"),
  titre: champ(premier, "titre"),
  accroche: champ(premier, "accroche"),
};
for (const [k, v] of Object.entries(numero))
  if (!v) fatal(`champ « ${k} » illisible dans le numéro publié`);

/* Image de partage du numéro : la couverture posée sur le fond LucidIA. */
const IMAGE_REVUE = {
  url: "/revue/a-deux-voix-n01-partage.jpg",
  w: 1200,
  h: 630,
  alt: `Couverture du numéro ${numero.numero} de la mini-revue LucidIA « À deux voix » — ${numero.titre}`,
};

/* ── Adresses pré-rendues ── */
const routes = [
  { chemin: "formations" },
  { chemin: "conseil" },
  { chemin: "apropos" },
  { chemin: "demonstrations" },
  { chemin: "ressources" },
  { chemin: "contact" },
  { chemin: "mentions" },
  { chemin: "a-deux-voix", image: IMAGE_REVUE },
  {
    chemin: `a-deux-voix/${numero.id}`,
    titre: `${numero.titre} — À deux voix ${numero.numero} | LucidIA`,
    meta: `${numero.accroche} À deux voix, ${numero.numero} — ${numero.date}.`,
    image: IMAGE_REVUE,
  },
];

/* ── Écriture ── */
const gabarit = readFileSync(join(racine, "dist/index.html"), "utf8");

/* index.html porte ses propres adresses absolues, écrites à la main. Si elles
   ne correspondent plus à DOMAINE, la page d'accueil annoncerait un site
   différent de toutes les autres. On préfère arrêter la construction. */
const autreDomaine = [...gabarit.matchAll(/(?:href|content)="(https?:\/\/[^"\/]+)/g)]
  .map((m) => m[1])
  .filter((u) => u !== DOMAINE && !u.includes("schema.org"));
if (autreDomaine.length)
  fatal(
    `index.html référence ${[...new Set(autreDomaine)].join(", ")} alors que ` +
      `DOMAINE vaut ${DOMAINE}. Mettre index.html en accord.`
  );

const echappe = (t) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Remplace le contenu d'une balise meta déjà présente. Si elle manque, on
   arrête : cela signifierait que index.html a changé de structure. */
function remplaceMeta(html, attribut, nom, valeur) {
  const re = new RegExp(`(<meta\\s+${attribut}="${nom}"\\s+content=")[^"]*(")`);
  if (!re.test(html)) fatal(`balise ${attribut}="${nom}" absente de dist/index.html`);
  return html.replace(re, `$1${echappe(valeur)}$2`);
}

const ecrits = [];
for (const r of routes) {
  const page = pages.get(r.chemin.split("/")[0]);
  const titre = r.titre || (page && page.titre);
  const meta = r.meta || (page && page.meta);
  if (!titre || !meta) fatal(`titre ou description manquants pour /${r.chemin}`);

  const image = r.image || IMAGE_SITE;
  const url = `${DOMAINE}/${r.chemin}`;

  let html = gabarit
    .replace(/<title>[^<]*<\/title>/, `<title>${echappe(titre)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);

  html = remplaceMeta(html, "name", "description", meta);
  html = remplaceMeta(html, "property", "og:url", url);
  html = remplaceMeta(html, "property", "og:title", titre);
  html = remplaceMeta(html, "property", "og:description", meta);
  html = remplaceMeta(html, "property", "og:image", DOMAINE + image.url);
  html = remplaceMeta(html, "property", "og:image:width", String(image.w));
  html = remplaceMeta(html, "property", "og:image:height", String(image.h));
  html = remplaceMeta(html, "property", "og:image:alt", image.alt);
  html = remplaceMeta(html, "name", "twitter:title", titre);
  html = remplaceMeta(html, "name", "twitter:description", meta);
  html = remplaceMeta(html, "name", "twitter:image", DOMAINE + image.url);

  const dossier = join(racine, "dist", r.chemin);
  mkdirSync(dossier, { recursive: true });
  writeFileSync(join(dossier, "index.html"), html, "utf8");
  ecrits.push(r.chemin);
}

/* ── Règles de service ──
   On n'attend pas de l'hébergeur qu'il devine qu'une adresse sans extension
   correspond à un dossier. Chaque page pré-rendue reçoit sa règle explicite,
   insérée avant la règle passe-partout. Il s'agit de réécritures (code 200) :
   l'adresse affichée ne change pas, l'application démarre normalement. */
const cheminRedirections = join(racine, "dist/_redirects");
const redirections = readFileSync(cheminRedirections, "utf8");
const REPERE = "# @@PAGES_PRERENDUES@@";
if (!redirections.includes(REPERE))
  fatal("le repère @@PAGES_PRERENDUES@@ est absent de public/_redirects");

const regles = ecrits
  .map((c) => `/${c}`.padEnd(34) + `/${c}/index.html`.padEnd(42) + "200")
  .join("\n");

writeFileSync(cheminRedirections, redirections.replace(REPERE, regles), "utf8");

console.log(`✓ pré-rendu : ${ecrits.length} pages avec leurs propres métadonnées de partage`);
console.log(`  dont /a-deux-voix/${numero.id} → ${IMAGE_REVUE.url}`);
console.log(`✓ ${ecrits.length} règles de service écrites dans dist/_redirects`);
