import { useState, useEffect, useMemo, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════════════════════════════
   LucidIA — site vitrine (première version fonctionnelle)

   ORGANISATION DU FICHIER
   1. SITE        → coordonnées, liens, informations légales À COMPLÉTER
   2. FORMATIONS  → données du catalogue, faciles à modifier
   3. ARTICLES / VILLES / VALEURS → contenus éditoriaux
   4. CSS         → système visuel (variables de couleur, type, mise en page)
   5. Composants  → navigation, pages, pied de page
   ════════════════════════════════════════════════════════════════════════ */

/* ─────────── 1. INFORMATIONS À FOURNIR ───────────
   Remplacer chaque valeur "À COMPLÉTER". Tout le site lit ces variables. */
/* Adresse définitive du site : elle sert aux URL canoniques et aux données
   structurées. À corriger si le domaine retenu diffère. */
const DOMAINE = "https://lucidia.fr";

/* "chemins" : de vraies URL (/formations/prompting-professionnel), indexables
   une par une. Exige la règle de réécriture fournie dans public/_redirects.
   "ancres" : URL en #/… si l'hébergement ne sait pas réécrire. */
const ROUTAGE = "chemins";

const SITE = {
  nom: "LucidIA",
  descripteur: "Formation et conseil en intelligence artificielle pour les entreprises",
  signature: "Comprendre l’IA. Maîtriser ses usages. Transformer son entreprise.",
  email: "arthur.peniguel@gmail.com",
  telephone: "07 87 41 20 13",
  telephoneLien: "+33787412013",
  adresse: "", // À COMPLÉTER — adresse de facturation et siège social
  calendly: "https://calendar.app.google/MBv1V4YRUqQBgboHA",
  /* Portraits servis depuis public/img/ : remplacer les fichiers suffit,
     sans toucher au code. */
  linkedinArthur: "https://www.linkedin.com/in/arthur-peniguel",
  linkedinNorman: "https://www.linkedin.com/in/norman-hubert/",
  linkedinCabinet: "", // À COMPLÉTER
  photoArthur: "/img/arthur.jpg",
  photoNorman: "/img/norman.jpg",
  siret: "", // À COMPLÉTER
  numeroDeclarationActivite: "", // À COMPLÉTER — déclaration d’activité de formation
  hebergeur: "", // À COMPLÉTER — nom et adresse de l’hébergeur
};

/* ─────────── 2. CATALOGUE ───────────
   publics : codir | managers | collaborateurs | metiers
   formats : demi | journee | atelier
   niveau  : decouverte | intermediaire | avance
   themes  : fondamentaux | outils | prompting | strategie | metiers | risques */

const PUBLICS = [
  { id: "codir", label: "CODIR & COMEX" },
  { id: "managers", label: "Managers" },
  { id: "collaborateurs", label: "Collaborateurs" },
  { id: "metiers", label: "Équipes métiers" },
];
const FORMATS = [
  { id: "demi", label: "Demi-journée" },
  { id: "journee", label: "Journée" },
  { id: "atelier", label: "Atelier métier" },
];
const NIVEAUX = [
  { id: "decouverte", label: "Découverte" },
  { id: "intermediaire", label: "Intermédiaire" },
  { id: "avance", label: "Avancé" },
];
const THEMES = [
  { id: "fondamentaux", label: "Fondamentaux" },
  { id: "outils", label: "Outils" },
  { id: "prompting", label: "Prompting" },
  { id: "strategie", label: "Stratégie" },
  { id: "metiers", label: "Métiers" },
  { id: "risques", label: "Risques et usages responsables", court: "Risques" },
  { id: "finance", label: "Finance" },
  { id: "comptabilite", label: "Comptabilité" },
  { id: "controle-gestion", label: "Contrôle de gestion" },
  { id: "rh", label: "Ressources humaines", court: "RH" },
  { id: "marketing", label: "Marketing" },
];

const FORMATIONS = [
  {
    id: "comprendre-ia-generative",
    titre: "Comprendre l’IA générative",
    promesse:
      "Savoir ce que ces systèmes font réellement, ce qu’ils ne font pas, et où ils deviennent utiles dans votre organisation.",
    publics: ["collaborateurs", "managers", "metiers"],
    formats: ["demi", "journee"],
    niveau: "decouverte",
    themes: ["fondamentaux", "risques"],
    duree: "3 h 30 en demi-journée, ou 7 h en journée avec ateliers par métier",
    participants: "6 à 12 participants",
    prerequis: "Aucun. Une pratique courante des outils bureautiques suffit.",
    objectifs: [
      "Expliquer avec ses propres mots le fonctionnement d’un modèle de langage",
      "Distinguer ce qui relève de la capacité réelle, de la limite technique et du récit commercial",
      "Repérer dans son quotidien de travail trois situations où l’IA apporte un gain de temps ou de qualité",
      "Identifier les situations où il ne faut pas l’utiliser",
    ],
    programme: [
      {
        titre: "D’où viennent ces systèmes",
        points: [
          "Une généalogie courte : de l’automatisation par règles à l’apprentissage statistique",
          "Ce qu’« entraîner un modèle » veut dire concrètement",
          "Pourquoi la même question peut recevoir deux réponses différentes",
        ],
      },
      {
        titre: "Ce que la machine sait faire",
        points: [
          "Rédaction, reformulation, synthèse, traduction, extraction",
          "Analyse de documents et de données non structurées",
          "Démonstrations commentées sur des cas apportés par les participants",
        ],
      },
      {
        titre: "Ce qu’elle ne sait pas faire",
        points: [
          "Erreurs plausibles, approximations, absence de source",
          "Ce qui se passe avec les données que l’on saisit",
          "La place du contrôle humain dans une chaîne de travail",
        ],
      },
      {
        titre: "Premiers usages",
        points: [
          "Cartographie rapide des tâches de l’équipe",
          "Sélection des deux premiers usages à tester",
        ],
      },
    ],
    modalites: [
      "Apports courts alternés avec des démonstrations en direct",
      "Exercices sur des documents et situations apportés par les participants",
      "Temps d’échange dédié aux questions et aux inquiétudes",
    ],
    outils: ["ChatGPT", "Claude", "Microsoft Copilot", "Mistral", "Gemini"],
    livrables: [
      "Support de formation complet",
      "Fiche « ce que je peux tester dès demain »",
      "Liste de vérification avant d’utiliser une réponse produite par l’IA",
    ],
  },
  {
    id: "codir-piloter-entreprise",
    titre: "CODIR/COMEX : piloter son entreprise à l’ère de l’IA",
    promesse:
      "Donner à l’équipe de direction une lecture commune des ruptures en cours et une trajectoire tenable pour les douze prochains mois.",
    publics: ["codir"],
    formats: ["demi", "journee"],
    niveau: "intermediaire",
    themes: ["strategie", "fondamentaux"],
    duree: "3 h 30 en format séminaire, ou 7 h avec construction de la feuille de route",
    participants: "4 à 12 membres du comité",
    prerequis:
      "Aucun prérequis technique. Une session de cadrage préalable avec la direction générale est prévue.",
    objectifs: [
      "Situer l’état réel des capacités de l’IA au regard du secteur de l’entreprise",
      "Évaluer les effets possibles sur les métiers, les coûts, la relation client et les compétences",
      "Décider d’un niveau d’ambition et des règles d’usage internes",
      "Formuler une feuille de route à douze mois avec ses conditions de réussite",
    ],
    programme: [
      {
        titre: "Lecture du paysage",
        points: [
          "Ce qui a changé techniquement et ce qui reste stable",
          "Ce que font les entreprises comparables, et à quel coût",
          "Séparer les signaux durables des effets d’annonce",
        ],
      },
      {
        titre: "Effets sur l’organisation",
        points: [
          "Où se déplace la valeur dans la chaîne de travail",
          "Conséquences sur les rôles d’encadrement et la délégation de décision",
          "Compétences à acquérir, à maintenir, à ne pas perdre",
        ],
      },
      {
        titre: "Gouvernance",
        points: [
          "Données, confidentialité, cadre réglementaire, responsabilité",
          "Règles d’usage internes : ce qui est autorisé, encadré, interdit",
          "Qui décide, qui arbitre, qui contrôle",
        ],
      },
      {
        titre: "Feuille de route",
        points: [
          "Choix des premiers chantiers et de leur séquence",
          "Indicateurs de suivi définis avant le lancement",
        ],
      },
    ],
    modalites: [
      "Format séminaire de direction, sans support technique inutile",
      "Travail sur la situation réelle de l’entreprise, préparé en amont",
      "Restitution écrite des arbitrages pris en séance",
    ],
    outils: ["Panorama comparatif des principales solutions du marché"],
    livrables: [
      "Synthèse des décisions et arbitrages de la séance",
      "Trame de feuille de route à douze mois",
      "Projet de charte d’usage interne",
    ],
  },
  {
    id: "maitriser-assistants",
    titre: "Maîtriser ChatGPT, Claude et les assistants génératifs",
    promesse:
      "Choisir le bon assistant pour la tâche à traiter et l’utiliser avec méthode plutôt qu’au hasard.",
    publics: ["collaborateurs", "managers", "metiers"],
    formats: ["journee", "atelier"],
    niveau: "intermediaire",
    themes: ["outils", "prompting"],
    duree: "7 h en journée, ou 2 × 3 h 30 à distance",
    participants: "6 à 10 participants",
    prerequis: "Avoir déjà utilisé un assistant génératif, même ponctuellement.",
    objectifs: [
      "Comparer les principaux assistants sur des tâches professionnelles identiques",
      "Structurer une demande pour obtenir un résultat exploitable du premier coup",
      "Organiser ses conversations, ses contextes et ses fichiers de référence",
      "Savoir quand changer d’outil plutôt que de reformuler",
    ],
    programme: [
      {
        titre: "Comparer sans militer",
        points: [
          "Mise en concurrence sur une même tâche : rédaction, analyse, synthèse",
          "Lecture des différences de comportement et de ton",
          "Ce que change la version, l’abonnement ou le paramétrage de l’entreprise",
        ],
      },
      {
        titre: "Travailler avec des documents",
        points: [
          "Interroger un document long et vérifier les réponses obtenues",
          "Constituer un contexte de travail réutilisable",
        ],
      },
      {
        titre: "Ranger sa pratique",
        points: [
          "Conversations, dossiers, instructions permanentes",
          "Ce qui peut être saisi et ce qui ne doit jamais l’être",
        ],
      },
    ],
    modalites: [
      "Atelier en petits groupes, chacun sur son poste",
      "Travail exclusivement sur les outils autorisés par l’entreprise",
      "Comparaison à l’aveugle des résultats produits",
    ],
    outils: ["ChatGPT", "Claude", "Microsoft Copilot", "Gemini", "Mistral"],
    livrables: [
      "Grille de choix « quelle tâche, quel outil »",
      "Bibliothèque de départ de dix demandes types",
      "Support de formation complet",
    ],
  },
  {
    id: "prompting-professionnel",
    titre: "Prompting professionnel : obtenir des résultats fiables et utiles",
    promesse:
      "Passer d’un usage intuitif à une méthode reproductible, transmissible et vérifiable.",
    publics: ["collaborateurs", "managers", "metiers"],
    formats: ["journee", "atelier"],
    niveau: "intermediaire",
    themes: ["prompting", "outils"],
    duree: "7 h en journée, ou 2 ateliers de 3 h espacés de deux à trois semaines",
    participants: "6 à 10 participants",
    prerequis: "Une pratique régulière d’au moins un assistant génératif.",
    objectifs: [
      "Construire une demande complète : intention, contexte, contraintes, format attendu",
      "Conduire une itération utile au lieu d’enchaîner les reformulations",
      "Vérifier un résultat avant de l’utiliser ou de le transmettre",
      "Constituer et maintenir une bibliothèque de prompts d’équipe",
    ],
    programme: [
      {
        titre: "Anatomie d’une demande qui fonctionne",
        points: [
          "Ce que la machine ignore de votre contexte et qu’il faut lui donner",
          "Rôle, matière première, contraintes, forme de sortie",
          "Exemples fournis en entrée : l’accélérateur le plus sous-utilisé",
        ],
      },
      {
        titre: "Itérer avec méthode",
        points: [
          "Corriger une dimension à la fois",
          "Faire critiquer un résultat par le modèle lui-même, et ses limites",
          "Découper une tâche longue en étapes contrôlables",
        ],
      },
      {
        titre: "Vérifier",
        points: [
          "Repérer les affirmations à contrôler en priorité",
          "Croiser avec une source interne ou un outil connecté",
        ],
      },
      {
        titre: "Industrialiser",
        points: [
          "Passer d’un bon prompt à un modèle réutilisable par l’équipe",
          "Nommer, ranger, mettre à jour la bibliothèque",
        ],
      },
    ],
    modalites: [
      "Chaque exercice part d’une tâche réelle apportée par le participant",
      "Travail en binôme avec relecture croisée",
      "Construction collective de la bibliothèque d’équipe en fin de session",
    ],
    outils: ["ChatGPT", "Claude", "Microsoft Copilot", "Perplexity"],
    livrables: [
      "Bibliothèque de prompts propre à l’équipe",
      "Méthode de vérification en une page",
      "Support de formation complet",
    ],
  },
  {
    id: "copilot-environnement-travail",
    titre: "Microsoft Copilot dans l’environnement de travail",
    promesse:
      "Tirer un bénéfice réel de Copilot là où il est déjà installé, sans attendre un projet.",
    publics: ["collaborateurs", "managers"],
    formats: ["demi", "journee"],
    niveau: "decouverte",
    themes: ["outils"],
    duree: "3 h 30 par population, ou 7 h avec atelier par métier",
    participants: "6 à 12 participants",
    prerequis:
      "Disposer d’un accès Copilot actif dans l’entreprise. Le programme est ajusté au périmètre effectivement déployé.",
    objectifs: [
      "Situer ce que Copilot apporte dans les applications utilisées au quotidien",
      "Identifier les tâches où le gain est immédiat et celles où il est illusoire",
      "Adopter des réflexes de rédaction de demandes adaptés à l’environnement de travail",
      "Comprendre le périmètre des données accessibles à l’assistant",
    ],
    programme: [
      {
        titre: "Situer l’assistant",
        points: [
          "Où il apparaît dans la suite bureautique et de collaboration",
          "Ce qu’il voit de vos contenus et ce qui conditionne la qualité des réponses",
          "Différences entre les usages en rédaction, en analyse et en réunion",
        ],
      },
      {
        titre: "Ateliers par application",
        points: [
          "Documents : rédaction, reformulation, mise en forme, synthèse",
          "Tableurs : lecture d’un jeu de données, hypothèses, contrôle des résultats",
          "Présentations : structuration d’un message avant la mise en page",
          "Messagerie et réunions : tri, réponses, comptes rendus et relevés de décisions",
        ],
      },
      {
        titre: "Précautions",
        points: [
          "Documents sensibles et droits d’accès",
          "Relecture systématique des chiffres et des engagements",
        ],
      },
    ],
    modalites: [
      "Chaque participant travaille sur ses propres documents",
      "Le programme est adapté à la version et au périmètre déployés dans l’entreprise",
      "Aucune fonction non vérifiée n’est présentée comme acquise",
    ],
    outils: ["Microsoft Copilot dans l’environnement de travail de l’entreprise"],
    livrables: [
      "Fiche réflexes par application",
      "Liste des usages retenus par l’équipe",
      "Support de formation complet",
    ],
  },
  {
    id: "recherche-ia-connectees",
    titre: "Rechercher et analyser avec Perplexity et les IA connectées",
    promesse:
      "Gagner du temps sur la recherche d’information sans perdre la maîtrise des sources.",
    publics: ["collaborateurs", "metiers", "managers"],
    formats: ["demi", "atelier"],
    niveau: "intermediaire",
    themes: ["outils", "risques"],
    duree: "3 h 30 en demi-journée, ou atelier de 3 h",
    participants: "6 à 12 participants",
    prerequis: "Aucun prérequis technique.",
    objectifs: [
      "Distinguer un assistant connecté au web d’un modèle hors ligne",
      "Formuler une recherche exploitable et en évaluer les résultats",
      "Remonter aux sources et juger de leur solidité",
      "Produire une synthèse dont chaque affirmation est traçable",
    ],
    programme: [
      {
        titre: "Ce que change la connexion",
        points: [
          "Recherche, citation, fraîcheur de l’information",
          "Pourquoi une source citée n’est pas une source vérifiée",
        ],
      },
      {
        titre: "Méthode de recherche",
        points: [
          "Décomposer une question large en questions traitables",
          "Comparer plusieurs restitutions d’une même recherche",
          "Repérer les angles morts et les informations manquantes",
        ],
      },
      {
        titre: "Synthétiser",
        points: [
          "Construire une note courte et traçable",
          "Signaler ce qui reste incertain",
        ],
      },
    ],
    modalites: [
      "Recherches menées sur des sujets réels de l’entreprise",
      "Comparaison systématique avec une recherche classique",
      "Exercice final de vérification croisée",
    ],
    outils: ["Perplexity", "ChatGPT", "Claude", "Gemini"],
    livrables: [
      "Méthode de recherche et de vérification en une page",
      "Modèle de note de synthèse sourcée",
      "Support de formation complet",
    ],
  },
  {
    id: "ia-finance",
    titre: "IA pour les métiers de la finance",
    promesse:
      "Alléger la production récurrente pour laisser du temps à l’analyse, sans fragiliser le contrôle.",
    publics: ["metiers", "managers"],
    formats: ["journee", "atelier"],
    niveau: "intermediaire",
    themes: ["finance", "comptabilite", "controle-gestion", "metiers", "outils"],
    duree: "7 h en journée, ou atelier métier de 3 h",
    participants: "4 à 10 participants",
    prerequis: "Exercer une fonction financière, comptable ou de contrôle de gestion. Aucun prérequis technique.",
    objectifs: [
      "Repérer les tâches financières où l’IA apporte un gain mesurable",
      "Préparer un commentaire de gestion, une synthèse ou un support de comité",
      "Interroger un jeu de données ou un corpus documentaire avec méthode",
      "Maintenir la piste d’audit et le contrôle sur les chiffres produits",
    ],
    programme: [
      {
        titre: "Cartographie des tâches",
        points: [
          "Clôture, reporting, analyse d’écarts, prévisions, contrôle interne",
          "Où le gain est réel, où il est marginal, où le risque est trop élevé",
        ],
      },
      {
        titre: "Produire",
        points: [
          "Commentaires de gestion à partir de données validées",
          "Notes de synthèse et supports de comité",
          "Réécriture pour des destinataires non financiers",
        ],
      },
      {
        titre: "Analyser",
        points: [
          "Interrogation d’un corpus documentaire ou contractuel",
          "Lecture assistée d’un jeu de données et formulation d’hypothèses",
        ],
      },
      {
        titre: "Contrôler",
        points: [
          "Aucun chiffre produit par l’IA sans source vérifiable",
          "Confidentialité des données financières et périmètre des outils autorisés",
        ],
      },
    ],
    modalites: [
      "Travail sur des données anonymisées de l’entreprise ou sur un jeu fourni",
      "Exercices calqués sur le calendrier réel de la fonction",
      "Attention constante portée à la traçabilité",
    ],
    outils: ["ChatGPT", "Claude", "Microsoft Copilot dans le tableur"],
    livrables: [
      "Cartographie des usages retenus pour la fonction",
      "Modèles de demandes pour les livrables récurrents",
      "Règles de contrôle avant diffusion",
    ],
  },
  {
    id: "ia-ressources-humaines",
    titre: "IA pour les ressources humaines",
    promesse:
      "Utiliser l’IA sur les tâches RH à fort volume tout en protégeant les personnes et les données.",
    publics: ["metiers", "managers"],
    formats: ["journee", "atelier"],
    niveau: "intermediaire",
    themes: ["rh", "metiers", "risques"],
    duree: "7 h en journée, ou atelier métier de 3 h",
    participants: "4 à 10 participants",
    prerequis: "Exercer une fonction RH, formation ou communication interne.",
    objectifs: [
      "Identifier les tâches RH où l’IA est pertinente et celles où elle est à écarter",
      "Rédiger plus vite sans uniformiser la voix de l’entreprise",
      "Reconnaître les effets de biais dans une aide à la décision",
      "Poser des règles claires sur les données personnelles",
    ],
    programme: [
      {
        titre: "Communication et rédaction",
        points: [
          "Offres, communications internes, supports de formation",
          "Adaptation d’un même message à plusieurs publics",
        ],
      },
      {
        titre: "Recrutement",
        points: [
          "Aide à la préparation d’entretien et à la structuration des critères",
          "Ce qui ne peut pas être délégué à un système automatique",
          "Biais, équité de traitement, traçabilité des décisions",
        ],
      },
      {
        titre: "Formation et accompagnement",
        points: [
          "Conception de parcours et de supports",
          "Préparation d’entretiens managériaux difficiles",
        ],
      },
      {
        titre: "Données sensibles",
        points: [
          "Ce qui ne doit jamais être saisi dans un outil grand public",
          "Cadre interne à poser avant le déploiement",
        ],
      },
    ],
    modalites: [
      "Cas pratiques construits sur des situations RH réelles et anonymisées",
      "Travail en sous-groupes avec restitution",
      "Séquence dédiée aux limites et aux points de vigilance",
    ],
    outils: ["ChatGPT", "Claude", "Microsoft Copilot"],
    livrables: [
      "Liste des usages autorisés et écartés pour la fonction",
      "Modèles de demandes pour les productions récurrentes",
      "Points de vigilance sur les données personnelles",
    ],
  },
  {
    id: "ia-marketing-communication",
    titre: "IA pour le marketing et la communication",
    promesse:
      "Produire plus vite sans diluer la marque, et garder la main sur la qualité.",
    publics: ["metiers", "collaborateurs"],
    formats: ["journee", "atelier"],
    niveau: "intermediaire",
    themes: ["marketing", "metiers", "prompting"],
    duree: "7 h en journée, ou atelier métier de 3 h",
    participants: "4 à 10 participants",
    prerequis: "Exercer une fonction marketing, communication ou commerciale.",
    objectifs: [
      "Accélérer l’idéation sans produire du contenu interchangeable",
      "Transmettre au modèle la voix et les contraintes de la marque",
      "Décliner un même contenu sur plusieurs canaux",
      "Mettre en place un contrôle qualité avant publication",
    ],
    programme: [
      {
        titre: "Idéation",
        points: [
          "Explorer largement puis trancher : la partie que la machine ne fait pas",
          "Travailler à partir de vos contenus existants plutôt que d’une page blanche",
        ],
      },
      {
        titre: "Production",
        points: [
          "Transmettre une charte éditoriale à un assistant",
          "Écriture, réécriture, adaptation de format et de longueur",
          "Ce qui se voit immédiatement dans un texte produit sans intervention",
        ],
      },
      {
        titre: "Contrôle",
        points: [
          "Vérification des affirmations, des chiffres et des engagements",
          "Droits, mentions et traçabilité des contenus",
        ],
      },
    ],
    modalites: [
      "Travail sur vos contenus et votre charte éditoriale réels",
      "Comparaison systématique avec une production sans IA",
      "Grille de contrôle qualité construite en séance",
    ],
    outils: ["ChatGPT", "Claude", "Perplexity", "Microsoft Copilot"],
    livrables: [
      "Charte éditoriale exploitable par un assistant",
      "Bibliothèque de demandes par canal",
      "Grille de contrôle avant publication",
    ],
  },
  {
    id: "ia-equipes-commerciales",
    titre: "IA pour les équipes commerciales",
    promesse:
      "Consacrer moins de temps à la préparation et au suivi, plus de temps au client.",
    publics: ["metiers", "collaborateurs", "managers"],
    formats: ["demi", "atelier"],
    niveau: "decouverte",
    themes: ["metiers", "outils"],
    duree: "3 h 30 en demi-journée, ou atelier de 3 h par équipe",
    participants: "6 à 12 participants",
    prerequis: "Exercer une fonction commerciale ou d’avant-vente.",
    objectifs: [
      "Préparer un rendez-vous en une fraction du temps habituel",
      "Structurer un argumentaire adapté à l’interlocuteur",
      "Accélérer les comptes rendus et les relances",
      "Éviter les erreurs factuelles dans un échange client",
    ],
    programme: [
      {
        titre: "Préparation",
        points: [
          "Recherche sur un compte, un secteur, un interlocuteur",
          "Questions à poser et objections probables",
        ],
      },
      {
        titre: "Argumentation",
        points: [
          "Passer de la caractéristique au bénéfice, selon l’interlocuteur",
          "Adapter le niveau de discours d’un acheteur à un dirigeant",
        ],
      },
      {
        titre: "Suivi",
        points: [
          "Comptes rendus, relances, synthèses de cycle",
          "Ce que l’on ne met jamais dans un outil non validé",
        ],
      },
    ],
    modalites: [
      "Préparation d’un rendez-vous réel à venir",
      "Mises en situation avec restitution collective",
      "Vérification des informations produites avant usage",
    ],
    outils: ["ChatGPT", "Claude", "Perplexity", "Microsoft Copilot"],
    livrables: [
      "Trame de préparation de rendez-vous",
      "Bibliothèque de demandes pour le suivi commercial",
      "Support de formation complet",
    ],
  },
  {
    id: "atelier-cas-usage",
    titre: "Atelier cas d’usage : de l’idée au prototype",
    promesse:
      "Repartir avec un usage testé et les conditions concrètes de son déploiement.",
    publics: ["metiers", "managers", "codir"],
    formats: ["atelier", "journee"],
    niveau: "avance",
    themes: ["strategie", "metiers"],
    duree: "7 h en journée, ou 2 ateliers de 3 h 30",
    participants: "2 à 4 équipes de 3 à 4 personnes",
    prerequis:
      "Avoir suivi une formation d’acculturation ou disposer d’une pratique établie. Un cas de travail réel est requis.",
    objectifs: [
      "Formuler un besoin métier en termes exploitables",
      "Concevoir un usage et le tester dans la séance",
      "Évaluer la valeur, la faisabilité et les risques",
      "Définir les conditions d’adoption et les étapes suivantes",
    ],
    programme: [
      {
        titre: "Cadrer le besoin",
        points: [
          "Partir de l’irritant, pas de la technologie",
          "Décrire la tâche, ses entrées, ses sorties, ses contrôles",
        ],
      },
      {
        titre: "Concevoir",
        points: [
          "Choisir l’outil et le niveau d’automatisation pertinents",
          "Définir la place de l’humain dans la boucle de décision",
        ],
      },
      {
        titre: "Tester",
        points: [
          "Construction d’un prototype en séance",
          "Confrontation à des cas réels, y compris difficiles",
        ],
      },
      {
        titre: "Décider",
        points: [
          "Évaluation valeur, faisabilité, données, risques",
          "Conditions d’adoption, mesure des résultats, prochaines étapes",
        ],
      },
    ],
    modalites: [
      "Travail par équipe sur un cas apporté par l’entreprise",
      "Un prototype par équipe, testé avant la fin de la séance",
      "Restitution devant les décideurs lorsque le format le permet",
    ],
    outils: [
      "Outils autorisés par l’entreprise",
      "Assistants avec espaces de travail et instructions permanentes",
    ],
    livrables: [
      "Fiche de cadrage par cas d’usage",
      "Prototype fonctionnel et son mode d’emploi",
      "Évaluation des conditions de déploiement",
    ],
  },
  {
    id: "usages-responsables",
    titre: "Usages responsables, confidentialité et esprit critique",
    promesse:
      "Donner à chacun les réflexes qui évitent l’erreur, la fuite de données et la perte de contrôle.",
    publics: ["collaborateurs", "managers", "codir", "metiers"],
    formats: ["demi", "atelier"],
    niveau: "decouverte",
    themes: ["risques", "fondamentaux"],
    duree: "3 h 30 en demi-journée, ou 2 h en format sensibilisation",
    participants: "jusqu’à 15 participants",
    prerequis: "Aucun.",
    objectifs: [
      "Reconnaître une réponse plausible mais fausse",
      "Savoir ce que devient une information saisie dans un outil",
      "Identifier les biais d’un système et leurs effets sur une décision",
      "Appliquer une règle de contrôle humain claire et partagée",
    ],
    programme: [
      {
        titre: "Erreurs et confiance",
        points: [
          "Pourquoi le ton assuré n’indique rien sur l’exactitude",
          "Exercice de repérage sur des cas préparés",
        ],
      },
      {
        titre: "Données",
        points: [
          "Ce qui sort de l’entreprise quand on saisit un texte",
          "Différences entre usage grand public et environnement sous contrat",
          "Règles simples et mémorisables",
        ],
      },
      {
        titre: "Biais et décision",
        points: [
          "D’où viennent les biais et comment ils se propagent",
          "Situations où la décision ne doit pas être déléguée",
        ],
      },
      {
        titre: "Cadre commun",
        points: [
          "Construction collective de règles d’usage internes",
          "Qui alerter en cas de doute",
        ],
      },
    ],
    modalites: [
      "Séquences courtes, très concrètes, avec exercices de repérage",
      "Adaptation au cadre juridique et aux outils de l’entreprise",
      "Rédaction collective des règles d’usage en fin de session",
    ],
    outils: ["Outils en place dans l’entreprise"],
    livrables: [
      "Règles d’usage internes rédigées en séance",
      "Affiche de rappel des réflexes essentiels",
      "Support de formation complet",
    ],
  },
];

/* ─────────── 3. AUTRES CONTENUS ÉDITORIAUX ─────────── */

const ETAPES = [
  {
    id: "comprendre",
    titre: "Comprendre",
    texte:
      "Un langage commun, des repères fiables et une vision partagée de ce que ces systèmes font vraiment. Sans cette étape, tout le reste repose sur des malentendus.",
  },
  {
    id: "experimenter",
    titre: "Expérimenter",
    texte:
      "Les équipes travaillent sur leurs propres dossiers, pas sur des exemples de démonstration. C’est là que l’intérêt devient tangible et que les limites apparaissent.",
  },
  {
    id: "prioriser",
    titre: "Prioriser",
    texte:
      "Tous les usages possibles ne méritent pas d’être menés. On classe selon la valeur attendue, la faisabilité réelle, les données disponibles et les risques.",
  },
  {
    id: "deployer",
    titre: "Déployer",
    texte:
      "Un usage n’existe que s’il entre dans les pratiques. Formalisation, préparation des équipes, mesure des résultats et ajustements.",
  },
];

const METHODE = [
  {
    verbe: "Écouter",
    texte:
      "Comprendre l’organisation, les métiers, les outils déjà en place et les contraintes réelles. Un entretien de cadrage précède toujours l’intervention.",
  },
  {
    verbe: "Éclairer",
    texte:
      "Transmettre des connaissances fiables et installer un langage commun, au niveau de langage du public concerné.",
  },
  {
    verbe: "Expérimenter",
    texte:
      "Faire travailler les participants sur leurs situations concrètes, avec les outils qu’ils utiliseront ensuite.",
  },
  {
    verbe: "Ancrer",
    texte:
      "Formaliser les usages, les réflexes et les prochaines étapes, pour que la formation ne s’arrête pas à la fin de la journée.",
  },
];

const PUBLICS_HOME = [
  {
    titre: "CODIR & COMEX",
    texte:
      "Comprendre les ruptures en cours, évaluer les opportunités et définir une direction commune.",
    lien: { page: "formations", filtre: "codir" },
    lienLabel: "Voir les formations dirigeants",
  },
  {
    titre: "Collaborateurs & métiers",
    texte:
      "Apprendre à utiliser l’IA sur des situations de travail réelles, avec méthode et discernement.",
    lien: { page: "formations", filtre: "collaborateurs" },
    lienLabel: "Voir les formations métiers",
  },
  {
    titre: "Équipes de transformation",
    texte:
      "Identifier, cadrer et déployer les cas d’usage qui créent réellement de la valeur.",
    lien: { page: "accompagnement" },
    lienLabel: "Voir l’accompagnement",
  },
];

const OUTILS_MARQUEE = [
  "ChatGPT",
  "Claude",
  "Microsoft Copilot",
  "Perplexity",
  "Mistral",
  "Gemini",
  "Notebook LM",
  "Copilot Studio",
];

const ACCOMPAGNEMENT = [
  {
    id: "diagnostic",
    titre: "Diagnostic des pratiques et des besoins",
    resume:
      "Savoir où en est réellement l’entreprise avant de décider quoi que ce soit.",
    texte:
      "Les usages de l’IA existent souvent déjà, de façon dispersée et parfois invisible. Le diagnostic cartographie ce qui se pratique, ce que les équipes attendent, ce qui les gêne, les outils disponibles, les niveaux de maturité par population et les précautions à prendre compte tenu de vos données.",
    livrables: [
      "Cartographie des usages existants et des attentes par population",
      "Niveaux de maturité et écarts de compétences",
      "Points de vigilance sur les données et les outils",
      "Recommandations de séquence",
    ],
  },
  {
    id: "audit",
    titre: "Audit et identification des cas d’usage",
    resume: "Regarder les processus de près, tâche par tâche.",
    texte:
      "L’audit examine les processus et les tâches qui les composent pour repérer où un assistant apporte un gain plausible, où il n’apporte rien et où il introduirait un risque. Aucun gain chiffré n’est annoncé sans mesure préalable : les estimations de valeur sont présentées comme des hypothèses à vérifier.",
    livrables: [
      "Inventaire des tâches candidates par processus",
      "Fiches de cas d’usage documentées",
      "Hypothèses de valeur et conditions de mesure",
      "Écartements motivés",
    ],
  },
  {
    id: "priorisation",
    titre: "Priorisation et cadrage",
    resume: "Décider de l’ordre, pas seulement de la liste.",
    texte:
      "Les cas d’usage sont classés selon leur valeur potentielle, leur faisabilité, les risques associés, les données nécessaires et les conditions d’adoption par les équipes. Le cadrage transforme les cas retenus en chantiers décrits : périmètre, acteurs, jalons, indicateurs.",
    livrables: [
      "Matrice de priorisation argumentée",
      "Fiches de cadrage des chantiers retenus",
      "Indicateurs définis avant lancement",
      "Trajectoire à six et douze mois",
    ],
  },
  {
    id: "deploiement",
    titre: "Accompagnement au déploiement",
    resume: "Passer de l’expérimentation à la pratique installée.",
    texte:
      "Nous aidons l’entreprise à expérimenter, à formaliser les usages, à préparer les équipes et à mesurer les résultats obtenus. Lorsque le chantier suppose une intégration technique, nous travaillons avec vos partenaires techniques ou votre DSI plutôt qu’à leur place.",
    livrables: [
      "Protocole d’expérimentation et suivi",
      "Modes opératoires et règles d’usage",
      "Plan de montée en compétences",
      "Mesure des résultats et arbitrages de suite",
    ],
  },
];

/* Exemples génériques — illustrations, non issues d’un client.
   cote : côté où s’affiche l’étiquette. nudge : ajustement vertical en pixels. */
const MATRICE = [
  { nom: "Tri et réponse aux demandes entrantes", impact: 0.8, facilite: 0.18, cote: "d", nudge: 14 },
  { nom: "Réponse aux appels d’offres", impact: 0.88, facilite: 0.32, cote: "d", nudge: -8 },
  { nom: "Commentaire de gestion mensuel", impact: 0.72, facilite: 0.52, cote: "d", nudge: 0 },
  { nom: "Synthèse de documents longs", impact: 0.6, facilite: 0.8, cote: "g", nudge: -4 },
  { nom: "Aide à la recherche documentaire", impact: 0.48, facilite: 0.64, cote: "g", nudge: 6 },
  { nom: "Comptes rendus de réunion", impact: 0.4, facilite: 0.9, cote: "g", nudge: 0 },
  { nom: "Traduction de supports internes", impact: 0.22, facilite: 0.94, cote: "g", nudge: 0 },
];

const DIFFERENCES = [
  {
    icone: "cadrage",
    titre: "Partir des réalités de l’entreprise",
    texte:
      "Un entretien de cadrage et un questionnaire précèdent chaque intervention. Les exercices sont construits sur vos documents et vos situations.",
    exemple:
      "Pour une session finance, nous demandons un tableau d’écarts anonymisé et le calendrier de clôture. Les exercices s’appuient dessus, pas sur un cas d’école.",
  },
  {
    icone: "langage",
    titre: "Adapter le niveau de langage au public",
    texte:
      "Un comité de direction et une équipe opérationnelle n’ont pas besoin du même discours. Le contenu change, l’exigence reste la même.",
    exemple:
      "Le même mécanisme technique est présenté à un COMEX en termes de risque et d’arbitrage, et à une équipe métier en termes de gestes quotidiens.",
  },
  {
    icone: "usage",
    titre: "Relier chaque notion à un usage",
    texte:
      "Aucune notion n’est présentée sans une utilisation possible dans le travail des participants.",
    exemple:
      "Expliquer pourquoi un modèle se trompe n’a d’intérêt que si l’on enchaîne sur la vérification à faire avant d’envoyer le document.",
  },
  {
    icone: "pratique",
    titre: "Faire pratiquer les participants",
    texte:
      "Les mains sur le clavier pendant la majeure partie du temps. On n’apprend pas ces outils en les regardant.",
    exemple:
      "Sur une journée de sept heures, les apports tiennent en deux heures. Le reste se passe sur les postes des participants.",
  },
  {
    icone: "comparer",
    titre: "Comparer plusieurs outils lorsque c’est utile",
    texte:
      "Mise en concurrence sur une même tâche, à l’aveugle quand c’est possible, pour juger sur les résultats.",
    exemple:
      "Une même synthèse est demandée à trois assistants, les réponses sont présentées sans leur nom, et le groupe classe avant de découvrir lequel a produit quoi.",
  },
  {
    icone: "limites",
    titre: "Enseigner les limites autant que les possibilités",
    texte:
      "Erreurs, biais, confidentialité, dépendance : ce qui protège vos équipes fait partie de la formation, pas d’une annexe.",
    exemple:
      "Un exercice consiste à repérer l’erreur dans une réponse plausible et bien écrite. Personne ne la trouve du premier coup, et c’est précisément la leçon.",
  },
  {
    icone: "supports",
    titre: "Produire des supports réutilisables",
    texte:
      "Bibliothèques de demandes, fiches réflexes, règles d’usage : ce qui reste après la session est ce qui produit l’effet.",
    exemple:
      "La bibliothèque de prompts est construite en séance par les participants eux-mêmes, avec leurs mots et leurs cas.",
  },
  {
    icone: "suites",
    titre: "Proposer des suites concrètes",
    texte:
      "Chaque intervention se termine par des prochaines étapes identifiées, que vous soyez accompagnés ou non pour les mener.",
    exemple:
      "Une note de fin de session liste les deux usages à tester, qui les porte, et ce qu’il faut mesurer pour décider de la suite.",
  },
];

const FRISE = [
  {
    temps: "Avant",
    points: [
      "Entretien de cadrage avec le commanditaire",
      "Questionnaire adressé aux participants",
      "Sélection des cas réels qui serviront de matière",
      "Adaptation des supports aux métiers et aux outils autorisés",
    ],
  },
  {
    temps: "Pendant",
    points: [
      "Apports accessibles, sans jargon inutile",
      "Démonstrations commentées",
      "Exercices individuels et en binôme",
      "Ateliers sur les situations des participants",
      "Restitution et mise en commun",
    ],
  },
  {
    temps: "Après",
    points: [
      "Supports de formation complets",
      "Ressources et bibliothèques constituées en séance",
      "Recommandations écrites",
      "Proposition de prochaines étapes",
    ],
  },
];

const VALEURS = [
  { titre: "Clarté et pédagogie", texte: "Expliquer jusqu’à ce que ce soit compris, pas jusqu’à ce que ce soit dit." },
  { titre: "Rigueur intellectuelle et scientifique", texte: "Ce que nous affirmons doit pouvoir être justifié." },
  { titre: "Efficacité opérationnelle", texte: "Une formation se juge à ce qui change dans le travail la semaine suivante." },
  { titre: "Indépendance vis-à-vis des éditeurs", texte: "Aucun accord commercial avec un fournisseur de solution." },
  { titre: "Transmission du savoir", texte: "Rendre l’entreprise autonome plutôt que dépendante de son prestataire." },
  { titre: "Adaptation aux réalités métiers", texte: "Le programme s’ajuste au terrain, jamais l’inverse." },
  { titre: "Usage responsable et maîtrisé", texte: "Enseigner les limites, les risques et la place du contrôle humain." },
  { titre: "Résultats concrets plutôt qu’effets de mode", texte: "Nous écartons volontiers un usage qui n’apporte rien." },
];

const ARTICLES = [
  {
    titre: "Quelle formation IA choisir pour son entreprise ?",
    angle: "Comparer les formats selon la population, le niveau initial et l’objectif visé.",
    theme: "Repères",
  },
  {
    titre: "Comment former un CODIR ou un COMEX à l’IA ?",
    angle: "Ce qu’attend une équipe de direction, et ce qui fait échouer un séminaire.",
    theme: "Dirigeants",
  },
  {
    titre: "ChatGPT, Claude, Copilot, Mistral : quel outil pour quel usage ?",
    angle: "Une lecture par type de tâche plutôt que par fournisseur.",
    theme: "Outils",
  },
  {
    titre: "Comment identifier les bons cas d’usage IA dans une PME ?",
    angle: "Partir des irritants du quotidien plutôt que des promesses technologiques.",
    theme: "Cas d’usage",
  },
  {
    titre: "Former ses collaborateurs à l’IA sans être une entreprise technologique",
    angle: "Ce qu’il faut réellement maîtriser, et ce dont on peut se passer.",
    theme: "Acculturation",
  },
  {
    titre: "De l’acculturation au déploiement : construire une trajectoire IA réaliste",
    angle: "Séquencer sur douze mois sans surcharger les équipes.",
    theme: "Trajectoire",
  },
];

const FAQ = [
  {
    q: "Vos formations sont-elles adaptées à notre secteur ?",
    r: "Les programmes sont construits à partir de vos situations de travail. Un entretien de cadrage précède l’intervention et les exercices utilisent vos documents, vos processus et les outils autorisés dans l’entreprise.",
  },
  {
    q: "Faut-il des connaissances techniques pour participer ?",
    r: "Non, pour la grande majorité des formations. Le niveau indiqué sur chaque fiche précise les prérequis. Les formations de découverte ne demandent qu’une pratique courante des outils bureautiques.",
  },
  {
    q: "Pourquoi les tarifs ne sont-ils pas affichés ?",
    r: "Chaque proposition dépend de la taille de l’entreprise, du nombre de participants, des métiers concernés, du niveau initial et du degré de personnalisation. Nous établissons un devis après un échange court sur votre besoin.",
  },
  {
    q: "Intervenez-vous dans nos locaux ?",
    r: "Oui, c’est notre mode d’intervention privilégié, avec une présence régulière à Paris et dans le Grand Ouest. Des formats à distance sont possibles lorsque la dispersion des équipes le justifie.",
  },
  {
    q: "Combien de participants par session ?",
    r: "De six à douze personnes pour les formations collectives, jusqu’à quinze en format sensibilisation. Pour un comité de direction, le groupe correspond au comité lui-même. Au-delà, nous dédoublons les sessions plutôt que d’augmenter l’effectif : ces formations reposent sur la pratique.",
  },
  {
    q: "Sous quel délai pouvez-vous intervenir ?",
    r: "Comptez deux à quatre semaines entre l’accord et la session : ce délai couvre l’entretien de cadrage, le questionnaire aux participants et l’adaptation des supports à vos cas réels.",
  },
  {
    q: "Êtes-vous liés à un éditeur de solution ?",
    r: "Non. LucidIA n’a aucun accord commercial avec un fournisseur de solution et ne se présente pas comme partenaire ou certifié par un éditeur. Nous formons sur les outils pertinents pour votre usage, y compris ceux déjà déployés chez vous.",
  },
  {
    q: "Une formation suffit-elle à lancer une démarche IA ?",
    r: "Elle suffit à donner des repères et les premiers usages. Le passage à l’échelle demande un travail de priorisation et de déploiement, qui peut être mené par vos équipes ou avec notre accompagnement.",
  },
];

/* Carte stylisée de la France — coordonnées projetées manuellement.
   Ce n’est pas une carte géographique exacte : c’est une silhouette. */
const CONTOUR_FR =
  "234,17 255,34 303,56 342,82 399,103 394,120 390,163 345,224 369,284 381,331 " +
  "339,357 324,348 279,338 252,355 252,374 210,365 166,369 115,340 124,290 " +
  "130,248 127,225 108,210 96,176 78,166 60,159 48,155 40,152 19,146 19,130 " +
  "26,127 55,124 79,120 102,118 108,100 114,74 126,90 165,82 194,63 210,21";

const REGIONS = [
  {
    id: "grand-ouest",
    nom: "Grand Ouest",
    large: true,
    points:
      "19,130 26,127 79,120 102,118 108,100 114,74 126,90 165,82 178,120 " +
      "172,158 160,196 128,214 108,210 96,176 60,159 19,146",
  },
  {
    id: "idf",
    nom: "Île-de-France",
    points: "216,94 250,97 256,119 228,128 210,112",
  },
  {
    id: "bretagne",
    nom: "Bretagne",
    points:
      "19,146 19,130 26,127 55,124 79,120 102,118 111,141 96,176 78,166 " +
      "60,159 48,155 40,152",
  },
  {
    id: "pdl",
    nom: "Pays de la Loire",
    points: "96,176 108,210 132,206 155,190 162,166 144,150 118,154",
  },
];

const VILLES = [
  { nom: "Paris", x: 232, y: 109, region: "Île-de-France", dx: 10, dy: 4, ancre: "start" },
  { nom: "Rennes", x: 111, y: 141, region: "Bretagne", dx: 9, dy: -7, ancre: "start" },
  { nom: "Angers", x: 145, y: 169, region: "Pays de la Loire", dx: 10, dy: 3, ancre: "start" },
  { nom: "Nantes", x: 115, y: 180, region: "Pays de la Loire", dx: -9, dy: 1, ancre: "end" },
  { nom: "Cholet", x: 135, y: 186, region: "Pays de la Loire", dx: 10, dy: 8, ancre: "start" },
  { nom: "La Roche-sur-Yon", x: 119, y: 203, region: "Pays de la Loire", dx: -9, dy: 8, ancre: "end" },
];

const BESOINS = [
  "Formation d’acculturation pour les équipes",
  "Séminaire ou formation CODIR / COMEX",
  "Formation sur un outil précis",
  "Atelier métier",
  "Formation sur mesure",
  "Diagnostic des pratiques et des besoins",
  "Audit et identification des cas d’usage",
  "Accompagnement au déploiement",
  "Demande de devis",
  "Autre sujet",
];

/* ─────────── DÉMONSTRATIONS ───────────
   Reconstitutions d'interface, jouées en HTML : ce ne sont PAS des
   enregistrements de sessions client, et chaque lecteur l'affiche.

   Pour remplacer une animation par une vraie capture vidéo, renseigner
   `video` avec l'URL : YouTube, Vimeo ou un fichier .mp4 auto-hébergé.
   Le lecteur détecte le format et bascule automatiquement — l'animation
   reste en place tant que le champ est vide. */

const MOTIFS = [
  {
    id: "iag",
    label: "IA générative",
    explication:
      "Un modèle produit un texte à partir de la matière première qu’on lui fournit. Aucune recherche, aucun accès à vos systèmes.",
  },
  {
    id: "rag",
    label: "RAG",
    explication:
      "Le modèle interroge d’abord une base documentaire interne, puis répond en citant les passages retrouvés. La réponse est traçable.",
  },
  {
    id: "agent",
    label: "Agent",
    explication:
      "Le modèle enchaîne plusieurs actions — lire, interroger un outil, comparer — et s’arrête sur un point de contrôle humain.",
  },
];

const DEMOS = [
  {
    id: "finance-commentaire-gestion",
    fonction: "Finance",
    theme: "finance",
    motif: "iag",
    titre: "Rédiger le commentaire de gestion mensuel",
    promesse:
      "Le temps passé à mettre en forme le commentaire revient à l’analyse des écarts.",
    contexte:
      "La clôture de mars est terminée. Les écarts sont calculés dans le tableau de suivi, le commentaire destiné au comité reste à écrire.",
    formation: "ia-finance",
    video: "",
    etapes: [
      {
        type: "saisie",
        label: "La demande",
        duree: 4200,
        texte:
          "Rédige le commentaire de gestion de mars à partir du tableau d’écarts joint. Destinataire : comité de direction. 180 mots, ton factuel. N’avance aucune explication qui ne figure pas dans le tableau.",
      },
      { type: "etape", label: "Lecture du tableau", duree: 1400, texte: "12 lignes, 4 indicateurs, comparatif budget et N-1" },
      { type: "etape", label: "Repérage des écarts significatifs", duree: 1500, texte: "3 écarts au-delà du seuil de 5 %" },
      {
        type: "sortie",
        label: "Le texte produit",
        duree: 5200,
        lignes: [
          "Le chiffre d’affaires de mars s’établit à 4 % au-dessus du budget, porté par l’activité services.",
          "La marge brute recule de 1,8 point sous l’effet du poste achats, dont l’écart défavorable représente l’essentiel de la variation.",
          "Les frais de personnel restent conformes au budget malgré les deux recrutements de février.",
          "Le résultat d’exploitation ressort en ligne avec la prévision, l’effet volume compensant l’effet prix.",
        ],
      },
    ],
    controle:
      "Aucun chiffre n’est inventé par le modèle : ils proviennent du tableau fourni. Le contrôleur de gestion vérifie chaque valeur citée et la causalité avancée avant diffusion.",
  },
  {
    id: "comptabilite-rapprochement",
    fonction: "Comptabilité",
    theme: "comptabilite",
    motif: "agent",
    titre: "Rapprocher une facture fournisseur et son bon de commande",
    promesse:
      "Les écarts remontent seuls ; la comptabilité arbitre au lieu de chercher.",
    contexte:
      "Une facture fournisseur arrive par messagerie. Elle doit être confrontée au bon de commande et au bon de réception avant validation.",
    formation: "ia-finance",
    video: "",
    etapes: [
      {
        type: "saisie",
        label: "La demande",
        duree: 3400,
        texte:
          "Rapproche cette facture du bon de commande et du bon de réception. Signale tout écart de quantité, de prix unitaire ou de conditions de règlement.",
      },
      { type: "etape", label: "Extraction des lignes de la facture", duree: 1300, texte: "7 lignes, TVA, conditions de paiement" },
      { type: "etape", label: "Lecture du bon de commande", duree: 1200, texte: "Référence BC-2026-0412" },
      { type: "etape", label: "Lecture du bon de réception", duree: 1100, texte: "Réception partielle constatée" },
      {
        type: "tableau",
        label: "Écarts détectés",
        duree: 4200,
        entetes: ["Ligne", "Écart", "Constat"],
        lignes: [
          ["Ligne 3", "Quantité", "Facturé 120, reçu 100"],
          ["Ligne 5", "Prix unitaire", "Facturé 48,00 €, commandé 44,50 €"],
          ["Règlement", "Délai", "Facture à 30 jours, contrat à 45 jours"],
        ],
      },
    ],
    controle:
      "L’agent ne valide ni ne paie : il prépare le dossier et s’arrête. La décision de bloquer, de contester ou d’accepter reste au comptable.",
  },
  {
    id: "controle-gestion-interrogation",
    fonction: "Contrôle de gestion",
    theme: "controle-gestion",
    motif: "rag",
    titre: "Interroger deux ans de reporting en une question",
    promesse:
      "Retrouver un chiffre dans le corpus interne sans ouvrir douze fichiers.",
    contexte:
      "Les rapports mensuels, les budgets et les comptes rendus de comité sont déposés dans un espace documentaire interne.",
    formation: "ia-finance",
    video: "",
    etapes: [
      {
        type: "saisie",
        label: "La question",
        duree: 3200,
        texte:
          "Comment a évolué la marge du site de Cholet entre le premier semestre 2025 et le premier semestre 2026, et quelles explications ont été avancées en comité ?",
      },
      {
        type: "recherche",
        label: "Recherche dans la base documentaire",
        duree: 3600,
        documents: [
          { nom: "Reporting mensuel — juin 2026.xlsx", extrait: "Marge brute site Cholet : 23,4 %" },
          { nom: "Reporting mensuel — juin 2025.xlsx", extrait: "Marge brute site Cholet : 26,1 %" },
          { nom: "CR comité de pilotage — 12/09/2025.docx", extrait: "Hausse du coût matière sur la gamme technique" },
        ],
      },
      {
        type: "sortie",
        label: "La réponse, sourcée",
        duree: 4600,
        lignes: [
          "La marge brute du site de Cholet passe de 26,1 % au premier semestre 2025 à 23,4 % au premier semestre 2026, soit un recul de 2,7 points.",
          "Deux explications figurent dans les comptes rendus de comité : la hausse du coût matière sur la gamme technique, et un effet mix défavorable lié aux volumes de sous-traitance.",
          "Aucun document du corpus ne chiffre la part respective de ces deux effets.",
        ],
      },
    ],
    controle:
      "Chaque affirmation renvoie au document d’origine, consultable en un clic. Ce que le corpus ne dit pas est signalé comme tel plutôt que comblé par une hypothèse.",
  },
  {
    id: "rh-questions-collaborateurs",
    fonction: "Ressources humaines",
    theme: "rh",
    motif: "rag",
    titre: "Répondre aux questions des collaborateurs sur les accords internes",
    promesse:
      "Les questions récurrentes trouvent une réponse exacte et sourcée, sans mobiliser l’équipe RH.",
    contexte:
      "Convention collective, accords d’entreprise, règlement intérieur et note sur le télétravail sont réunis dans une base documentaire RH.",
    formation: "ia-ressources-humaines",
    video: "",
    etapes: [
      {
        type: "saisie",
        label: "La question posée",
        duree: 2800,
        texte:
          "Combien de jours de télétravail puis-je prendre par semaine, et cela change-t-il quelque chose à mes titres-restaurant ?",
      },
      {
        type: "recherche",
        label: "Recherche dans la base RH",
        duree: 3400,
        documents: [
          { nom: "Accord télétravail — avenant 2026", extrait: "Jusqu’à trois jours par semaine, accord du manager requis" },
          { nom: "Note titres-restaurant", extrait: "Attribution maintenue les jours télétravaillés" },
        ],
      },
      {
        type: "sortie",
        label: "La réponse",
        duree: 4000,
        lignes: [
          "L’accord télétravail en vigueur autorise jusqu’à trois jours par semaine, sous réserve de l’accord de votre manager et des impératifs de service.",
          "Les titres-restaurant sont maintenus pour les jours télétravaillés, dans les mêmes conditions que sur site.",
          "Pour une situation particulière — temps partiel, poste soumis à présence obligatoire — l’équipe RH reste l’interlocuteur.",
        ],
      },
    ],
    controle:
      "Les données individuelles de paie ou de dossier n’entrent jamais dans le système. La base ne contient que des documents collectifs, et toute question à portée individuelle est renvoyée vers l’équipe RH.",
  },
  {
    id: "marketing-declinaison",
    fonction: "Marketing",
    theme: "marketing",
    motif: "iag",
    titre: "Décliner un contenu sur trois canaux sans diluer la marque",
    promesse:
      "Un même message adapté à chaque canal, dans la voix de l’entreprise.",
    contexte:
      "Un article de fond vient d’être publié. Il doit être décliné pour la lettre d’information, le réseau professionnel et la force commerciale.",
    formation: "ia-marketing-communication",
    video: "",
    etapes: [
      {
        type: "saisie",
        label: "La demande",
        duree: 3600,
        texte:
          "À partir de cet article et de notre charte éditoriale, produis trois déclinaisons : une accroche de lettre d’information, une publication professionnelle, un argumentaire d’une phrase pour les commerciaux. Pas de superlatif, pas de point d’exclamation.",
      },
      { type: "etape", label: "Lecture de la charte éditoriale", duree: 1500, texte: "Ton, vocabulaire proscrit, longueur par canal" },
      {
        type: "sortie",
        label: "Les trois déclinaisons",
        duree: 5000,
        lignes: [
          "Lettre d’information — « Ce que change réellement l’automatisation des relances, chiffres à l’appui. »",
          "Publication professionnelle — « Nous avons mesuré l’effet de l’automatisation des relances sur trois portefeuilles clients. Résultat contre-intuitif sur le délai moyen de paiement. »",
          "Argumentaire commercial — « Nos clients réduisent leur délai de paiement en agissant sur la relance, pas sur les conditions de vente. »",
        ],
      },
    ],
    controle:
      "La charte éditoriale est fournie en entrée, ce qui évite le texte interchangeable. Chaque affirmation chiffrée est vérifiée dans l’article source avant publication.",
  },
  {
    id: "commercial-preparation",
    fonction: "Commercial",
    theme: "metiers",
    motif: "agent",
    titre: "Préparer un rendez-vous client en quelques minutes",
    promesse:
      "Arriver au rendez-vous avec le contexte, les questions et les objections probables.",
    contexte:
      "Un premier rendez-vous est prévu demain avec une entreprise industrielle de 400 salariés.",
    formation: "ia-equipes-commerciales",
    video: "",
    etapes: [
      {
        type: "saisie",
        label: "La demande",
        duree: 3000,
        texte:
          "Prépare mon rendez-vous de demain : situation de l’entreprise, enjeux probables de mon interlocuteur, cinq questions à poser, objections attendues.",
      },
      { type: "etape", label: "Recherche publique sur l’entreprise", duree: 1600, texte: "Site, communiqués, publications récentes" },
      { type: "etape", label: "Lecture de l’historique dans le CRM", duree: 1400, texte: "2 échanges en 2024, aucune suite" },
      {
        type: "sortie",
        label: "La note de préparation",
        duree: 4600,
        lignes: [
          "Contexte — Croissance externe annoncée en début d’année, deux sites intégrés, fonctions support en cours de réorganisation.",
          "Enjeu probable de l’interlocuteur — Harmoniser des pratiques hétérogènes sans alourdir la charge des équipes.",
          "Questions à poser — Qui arbitre aujourd’hui ? Quelles pratiques ont déjà été tentées ? Qu’est-ce qui a échoué et pourquoi ?",
          "Objection attendue — « Nos équipes n’ont pas le temps. » Réponse par le format court et l’effet mesuré sur la charge.",
        ],
      },
    ],
    controle:
      "Tout élément factuel sur l’entreprise est vérifié avant d’être utilisé en rendez-vous. Aucune information issue du CRM n’est saisie dans un outil non validé par l’entreprise.",
  },
];

/* ─────────── MESSAGES SOUS-TITRÉS ───────────
   Séquences muettes et sous-titrées, jouées en HTML à partir du portrait
   réel et du logotype. Ce ne sont PAS des enregistrements : tant que
   `video` est vide, le site affiche la version animée et le dit.

   Pour publier la vraie captation : renseigner `video` (YouTube, Vimeo ou
   fichier .mp4). Le lecteur bascule seul. Les sous-titres ci-dessous
   servent alors de script de tournage et de transcription. */
const MESSAGES = [
  {
    id: "pourquoi-se-former",
    emplacement: "formations",
    auteur: "Arthur Péniguel",
    role: "Cofondateur",
    photo: () => SITE.photoArthur,
    titre: "Pourquoi former ses équipes à l’IA",
    video: "",
    lignes: [
      { t: "Vos équipes utilisent déjà l’IA.", d: 3200, visuel: "logo" },
      { t: "Souvent sans le dire, et sans cadre.", d: 3600, visuel: "icone:limites" },
      { t: "Le problème n’est pas l’outil.", d: 3000, visuel: "icone:comparer" },
      { t: "C’est qu’on ne sait pas ce qu’il fait vraiment.", d: 4200, visuel: "icone:cadrage" },
      { t: "Un modèle qui se trompe avec assurance coûte plus cher qu’un modèle qu’on n’utilise pas.", d: 6200, visuel: "icone:limites" },
      { t: "Se former, ce n’est pas apprendre à cliquer.", d: 3800, visuel: "icone:pratique" },
      { t: "C’est apprendre à juger.", d: 3200, visuel: "mot:Juger" },
      { t: "Ce que vos équipes y gagnent : du temps sur la production,", d: 4400, visuel: "icone:supports" },
      { t: "et du discernement sur tout le reste.", d: 3800, visuel: "icone:usage" },
      { t: "C’est là que commence une trajectoire IA qui tient.", d: 4600, visuel: "logo" },
    ],
  },
  {
    id: "notre-process",
    emplacement: "formations",
    auteur: "Norman Hubert",
    role: "Cofondateur",
    photo: () => SITE.photoNorman,
    titre: "Pourquoi faire confiance à notre process",
    video: "",
    lignes: [
      { t: "Nous ne vendons aucun outil.", d: 3000, visuel: "logo" },
      { t: "Aucun accord commercial avec un éditeur.", d: 3800, visuel: "icone:comparer" },
      { t: "Chaque intervention commence par un entretien de cadrage,", d: 4400, visuel: "icone:cadrage" },
      { t: "pas par un catalogue.", d: 2800, visuel: "mot:Votre contexte" },
      { t: "Les exercices se font sur vos documents, vos processus, vos contraintes.", d: 5400, visuel: "icone:pratique" },
      { t: "Nous enseignons aussi ce que ces systèmes ne savent pas faire.", d: 4800, visuel: "icone:limites" },
      { t: "Vous repartez avec des supports réutilisables et des règles d’usage écrites.", d: 5600, visuel: "icone:supports" },
      { t: "La recherche donne la rigueur. Le terrain donne l’utilité.", d: 4800, visuel: "icone:langage" },
      { t: "Les deux, à chaque intervention.", d: 3600, visuel: "logo" },
    ],
  },
  {
    id: "notre-volonte",
    emplacement: "accueil",
    auteur: "Arthur Péniguel",
    role: "Cofondateur",
    photo: () => SITE.photoArthur,
    titre: "Pourquoi nous avons créé LucidIA",
    video: "",
    lignes: [
      { t: "Nous avons vu les mêmes scènes se répéter.", d: 3400, visuel: "logo" },
      { t: "Des dirigeants sollicités de toutes parts sur l’IA, sans jamais obtenir de réponse claire.", d: 6000, visuel: "icone:cadrage" },
      { t: "Des équipes qui utilisent ces outils en cachette, faute de cadre.", d: 4800, visuel: "icone:limites" },
      { t: "Des projets lancés sur une promesse, abandonnés six mois plus tard.", d: 5000, visuel: "icone:suites" },
      { t: "Entre le discours technologique et la réalité du travail, il manquait une traduction.", d: 5600, visuel: "mot:Traduire" },
      { t: "LucidIA fait ce travail de traduction.", d: 3600, visuel: "logo" },
      { t: "Nous ne vendons pas d’outil. Nous ne vendons pas d’avenir.", d: 4600, visuel: "icone:comparer" },
      { t: "Nous rendons l’IA compréhensible, pour qu’elle devienne décidable.", d: 5200, visuel: "mot:Décidable" },
    ],
  },
  {
    id: "notre-ambition",
    emplacement: "accueil",
    auteur: "Norman Hubert",
    role: "Cofondateur",
    photo: () => SITE.photoNorman,
    titre: "Notre ambition pour les entreprises",
    video: "",
    lignes: [
      { t: "Notre ambition n’est pas de former le plus grand nombre.", d: 4400, visuel: "logo" },
      { t: "Elle est de rendre les entreprises autonomes.", d: 4000, visuel: "icone:supports" },
      { t: "Une entreprise qui comprend ces systèmes choisit où les employer,", d: 5000, visuel: "icone:usage" },
      { t: "à quelles conditions, et sous quel contrôle.", d: 4000, visuel: "icone:limites" },
      { t: "Les autres subiront les choix faits ailleurs.", d: 4000, visuel: "mot:Subir ou décider" },
      { t: "Dans trois ans, nous voulons que nos clients n’aient plus besoin de nous sur les fondamentaux.", d: 6200, visuel: "icone:pratique" },
      { t: "Et qu’ils nous appellent pour les questions difficiles.", d: 4200, visuel: "icone:suites" },
      { t: "C’est la seule mesure de réussite qui nous intéresse.", d: 4400, visuel: "logo" },
    ],
  },
];

const PAGES = [
  { id: "accueil", label: "Accueil", titre: "LucidIA — Formation IA en entreprise pour TPE, PME et ETI", meta: "LucidIA forme dirigeants et équipes à l’intelligence artificielle et accompagne les TPE, PME et ETI de la compréhension jusqu’au déploiement des usages. Paris et Grand Ouest." },
  { id: "formations", label: "Formations", titre: "Catalogue de formations IA en entreprise — LucidIA", meta: "Formations IA pour CODIR, managers, collaborateurs et équipes métiers : fondamentaux, ChatGPT, Claude, Microsoft Copilot, prompting, finance, RH, marketing, usages responsables." },
  { id: "accompagnement", label: "Accompagnement", titre: "Accompagnement IA en entreprise : diagnostic, audit, cas d’usage — LucidIA", meta: "Diagnostic des pratiques, audit IA PME, identification et priorisation des cas d’usage IA, accompagnement au déploiement pour TPE, PME et ETI." },
  { id: "methode", label: "Notre méthode", titre: "Notre méthode de formation et d’accompagnement IA — LucidIA", meta: "Écouter, éclairer, expérimenter, ancrer : la méthode LucidIA pour des formations IA en entreprise construites sur vos situations de travail réelles." },
  { id: "apropos", label: "À propos", titre: "À propos de LucidIA — la recherche rencontre le terrain", meta: "LucidIA, cabinet de formation et de conseil en intelligence artificielle fondé par Arthur Péniguel et Norman Hubert, chercheurs et consultants." },
  { id: "demonstrations", label: "Démonstrations", titre: "Démonstrations de cas d’usage IA par fonction — LucidIA", meta: "Démonstrations commentées de cas d’usage IA en entreprise : commentaire de gestion, rapprochement de factures, RAG sur base documentaire RH, déclinaison marketing, préparation de rendez-vous commercial." },
  { id: "ressources", label: "Ressources", titre: "Ressources IA pour les entreprises — LucidIA", meta: "Articles et guides pour choisir une formation IA, former un CODIR, comparer les outils et identifier des cas d’usage IA en PME." },
  { id: "contact", label: "Contact", titre: "Contact — parler de votre projet IA — LucidIA", meta: "Échanger sur votre projet de formation ou d’accompagnement IA. Interventions à Paris, Rennes, Nantes, Angers, Cholet et La Roche-sur-Yon." },
  { id: "mentions", label: "Mentions légales", titre: "Mentions légales et politique de confidentialité — LucidIA", meta: "Mentions légales et politique de confidentialité du site LucidIA." },
];

/* ─────────── 4. SYSTÈME VISUEL ─────────── */
const CSS = `
/* Les polices sont auto-hébergées (voir src/main.jsx) : aucun appel à un
   service tiers, donc aucun transfert d'adresse IP hors de votre hébergeur. */

.l-root {
  /* fonds — le sombre est la base, pas une exception */
  --paper: #05070F;
  --paper-2: #090E1E;
  --nuit: #05070F;
  --nuit-2: #0C1024;
  --carte: #0A0F1F;
  --carte-2: #0F1630;
  --surface: rgba(255,255,255,.04);
  --surface-2: rgba(255,255,255,.08);
  /* typographie */
  --titre: #FFFFFF;
  --gris-1: rgba(255,255,255,.74);
  --gris-2: rgba(255,255,255,.5);
  --ligne: rgba(255,255,255,.13);
  --ligne-nuit: rgba(255,255,255,.13);
  --alerte: #FF9285;
  /* couleur d'action */
  --bleu: #1F3AF0;
  --bleu-fonce: #3F58FF;
  --bleu-pale: rgba(63,88,255,.18);
  --bleu-clair: #B7C2FF;
  --accent: #93A5FF; /* accent unique : bleu clair, lisible en texte (8,7:1) */
  --violet: #6B4BF5;
  /* mise en page */
  --max: 1180px;
  --gout: 24px;

  color-scheme: dark;
  background: var(--paper);
  color: var(--gris-1);
  font-family: "Inter Variable", Inter, "Helvetica Neue", Arial, sans-serif;
  font-size: 17px;
  line-height: 1.62;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
.l-root *, .l-root *::before, .l-root *::after { box-sizing: border-box; }
/* Reset neutralisé par :where() : spécificité nulle, il ne peut donc pas
   écraser les classes de composants définies plus bas. */
:where(.l-root) :where(h1, h2, h3, h4, p, ul, ol, figure, fieldset, legend) { margin: 0; padding: 0; }
:where(.l-root) :where(ul) { list-style: none; }
:where(.l-root) :where(button) { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
:where(.l-root) :where(input, select, textarea) { font: inherit; color: inherit; }
:where(.l-root) :where(a) { color: inherit; text-decoration: none; }
.l-root :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }


/* ── typographie ── */
.l-d1, .l-d2, .l-d3, .l-d4, .l-eyebrow, .l-logo {
  font-family: "Manrope Variable", Manrope, "Helvetica Neue", Arial, sans-serif;
  color: var(--titre);
}
.l-d1 { font-size: clamp(2.2rem, 4.8vw, 4.05rem); line-height: 1.02; letter-spacing: -.035em; font-weight: 700; }
.l-d2 { font-size: clamp(1.75rem, 3.1vw, 2.7rem); line-height: 1.08; letter-spacing: -.028em; font-weight: 700; }
.l-d3 { font-size: clamp(1.25rem, 1.9vw, 1.6rem); line-height: 1.2; letter-spacing: -.02em; font-weight: 700; }
.l-d4 { font-size: 1.06rem; line-height: 1.35; letter-spacing: -.01em; font-weight: 700; }
.l-eyebrow { font-size: .875rem; font-weight: 600; color: var(--accent); letter-spacing: -.005em; }
.l-lede { font-size: clamp(1.05rem, 1.5vw, 1.3rem); line-height: 1.5; color: var(--gris-1); max-width: 34em; }
.l-txt { max-width: 38em; }
.l-small { font-size: .9rem; line-height: 1.55; color: var(--gris-2); }
.l-dark .l-d1, .l-dark .l-d2, .l-dark .l-d3, .l-dark .l-d4 { color: #fff; }
.l-dark { color: rgba(255,255,255,.76); }
.l-dark .l-lede { color: rgba(255,255,255,.8); }
.l-dark .l-small { color: rgba(255,255,255,.55); }

/* ── ossature ── */
.l-wrap { width: 100%; max-width: var(--max); margin: 0 auto; padding: 0 var(--gout); }
.l-sec { padding: 96px 0; }
.l-sec-tight { padding: 64px 0; }
.l-dark { background: linear-gradient(180deg, #070C1D, #05070F 60%); }
.l-pale { background: var(--paper-2); }
.l-pale, .l-dark { position: relative; }
.l-rule { height: 1px; background: var(--ligne); border: 0; }
.l-grid { display: grid; gap: 40px; }
.l-g2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
.l-g3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
.l-g4 { grid-template-columns: repeat(4, minmax(0,1fr)); }
.l-head { max-width: 30ch; }
.l-sec-intro { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,.85fr); gap: 48px; align-items: end; margin-bottom: 56px; }

/* ── actions ── */
.l-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 24px; border-radius: 3px;
  font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .98rem; letter-spacing: -.01em;
  transition: background-color .18s ease, color .18s ease, border-color .18s ease;
}
.l-btn-1 { background: var(--bleu); color: #fff; box-shadow: 0 0 0 0 rgba(63,88,255,.5); }
.l-btn-1:hover { background: var(--bleu-fonce); box-shadow: 0 6px 26px -8px rgba(63,88,255,.8); }
.l-btn-2 { border: 1px solid rgba(255,255,255,.34); color: #fff; }
.l-btn-2:hover { background: #fff; color: var(--nuit); border-color: #fff; }


.l-btn-3 { padding: 0; align-self: flex-start; color: var(--accent); font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; border-bottom: 1px solid rgba(147,165,255,.4); border-radius: 0; transition: color .18s ease, border-color .18s ease; }
.l-btn-3:hover { color: #fff; border-bottom-color: #fff; }
.l-actions { display: flex; flex-wrap: wrap; gap: 14px; }
.l-btn[disabled] { opacity: .45; cursor: not-allowed; }

/* ── navigation ── */
.l-nav { position: fixed; inset: 0 0 auto 0; z-index: 60; transition: background-color .3s ease, box-shadow .3s ease; }
.l-nav-in { display: flex; align-items: center; justify-content: space-between; gap: 40px; height: 72px; }
.l-nav-solid { background: rgba(5,7,15,.8); backdrop-filter: saturate(150%) blur(16px); box-shadow: 0 1px 0 var(--ligne); }
.l-logo { font-size: 1.32rem; font-weight: 800; letter-spacing: -.045em; display: inline-flex; align-items: baseline; }
.l-logo span { color: var(--accent); letter-spacing: -.01em; }
.l-nav-links { display: flex; align-items: center; gap: 22px; flex: none; }
.l-nav-link { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 500; font-size: .95rem; color: var(--gris-1); padding: 6px 0; border-bottom: 1px solid transparent; white-space: nowrap; }
.l-nav-link:hover { color: #fff; }
.l-nav-link-on { color: var(--titre); border-bottom-color: var(--accent); }
.l-nav-cta { padding: 11px 18px; white-space: nowrap; }
.l-burger { display: none; width: 44px; height: 44px; align-items: center; justify-content: center; }
.l-burger i { display: block; width: 22px; height: 1.5px; background: #fff; position: relative; transition: transform .2s ease; }
.l-burger i::before, .l-burger i::after { content: ""; position: absolute; left: 0; width: 22px; height: 1.5px; background: #fff; transition: transform .2s ease; }
.l-burger i::before { top: -7px; }
.l-burger i::after { top: 7px; }
.l-burger-open i { background: transparent; }
.l-burger-open i::before { transform: translateY(7px) rotate(45deg); }
.l-burger-open i::after { transform: translateY(-7px) rotate(-45deg); }
.l-menu { position: fixed; inset: 0; z-index: 55; background: var(--paper); padding: 96px var(--gout) 40px; display: flex; flex-direction: column; }
.l-menu a, .l-menu button { font-family: "Manrope Variable", Manrope, sans-serif; }
.l-menu-link { display: block; padding: 18px 0; font-size: 1.6rem; font-weight: 700; letter-spacing: -.03em; color: var(--titre); border-bottom: 1px solid var(--ligne); text-align: left; width: 100%; }
.l-menu-foot { margin-top: auto; padding-top: 32px; }

/* ── hero ── */
.l-hero { position: relative; padding: 150px 0 88px; overflow: hidden; }
.l-hero-in { position: relative; display: grid; grid-template-columns: minmax(0,1.08fr) minmax(0,.92fr); gap: 56px; align-items: center; }
.l-hero h1 { margin: 18px 0 22px; }
.l-hero-glow { position: absolute; z-index: 0; top: -220px; right: -180px; width: 780px; height: 780px; border-radius: 50%; background: radial-gradient(circle at 50% 50%, rgba(63,88,255,.42), rgba(107,75,245,.18) 42%, rgba(5,7,15,0) 70%); pointer-events: none; }
.l-hero-art { position: relative; }
.l-dot { animation: l-settle 1.5s cubic-bezier(.16,.8,.28,1) both; }
@keyframes l-settle {
  from { transform: translate(var(--dx), var(--dy)) scale(.6); opacity: 0; }
  60% { opacity: 1; }
  to { transform: translate(0,0) scale(1); opacity: 1; }
}
.l-line-draw { stroke-dasharray: 300; stroke-dashoffset: 300; animation: l-draw 1.6s ease-out .7s forwards; }
@keyframes l-draw { to { stroke-dashoffset: 0; } }

/* ── étapes ── */
.l-etapes { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 0; border-top: 1px solid var(--ligne-nuit); }
.l-etape { text-align: left; padding: 26px 22px 26px 0; border-right: 1px solid var(--ligne-nuit); position: relative; }
.l-etape:last-child { border-right: 0; }
.l-etape-num { font-family: "Manrope Variable", Manrope, sans-serif; font-size: .82rem; color: rgba(255,255,255,.45); }
.l-etape-t { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: 1.22rem; letter-spacing: -.02em; color: #fff; margin: 6px 0 0; display: block; }
.l-etape-on .l-etape-t { color: var(--accent); }
.l-etape-txt { margin-top: 14px; color: rgba(255,255,255,.72); font-size: .95rem; }
.l-etape-bar { position: absolute; top: -1px; left: 0; height: 2px; width: 0; background: var(--accent); transition: width .35s ease; }
.l-etape-on .l-etape-bar { width: calc(100% - 22px); }

/* ── cartes publics ── */
.l-pub { display: flex; flex-direction: column; gap: 14px; padding: 32px 30px 28px; background: var(--carte); border: 1px solid var(--ligne); transition: background-color .2s ease, border-color .2s ease; }
.l-pub:hover { background: var(--carte-2); border-color: rgba(255,255,255,.26); }
.l-pub h3 { letter-spacing: -.02em; }
.l-pub > :last-child { margin-top: auto; }

/* ── filtres ── */
.l-filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 26px 32px; align-items: start; }
.l-fgroup { min-width: 150px; }
.l-fgroup-large { grid-column: span 2; }
@media (max-width: 1040px) { .l-fgroup-large { grid-column: span 1; } }
.l-flabel { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .82rem; color: var(--gris-2); margin-bottom: 9px; display: block; }
.l-chips { display: flex; flex-wrap: wrap; gap: 7px; }
.l-chip { padding: 7px 13px; border: 1px solid var(--ligne); border-radius: 100px; font-size: .88rem; color: var(--gris-1); background: var(--surface); transition: all .15s ease; }
.l-chip:hover { border-color: rgba(255,255,255,.42); background: var(--surface-2); color: #fff; }
.l-chip-on { background: var(--bleu); border-color: var(--bleu); color: #fff; }
.l-search { width: 100%; max-width: 420px; padding: 13px 16px; border: 1px solid var(--ligne); background: var(--surface); color: #fff; border-radius: 3px; }
.l-search::placeholder { color: var(--gris-2); }

/* ── cartes formation ── */
.l-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1px; background: var(--ligne); border: 1px solid var(--ligne); }
.l-card { background: var(--carte); padding: 30px 28px 26px; display: flex; flex-direction: column; gap: 14px; text-align: left; transition: background-color .18s ease; }
.l-card:hover { background: var(--carte-2); }
.l-card:hover .l-card-t { color: var(--accent); }
.l-card-t { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: 1.12rem; line-height: 1.24; letter-spacing: -.02em; color: var(--titre); transition: color .18s ease; }
.l-card-p { font-size: .95rem; color: var(--gris-1); }
.l-card-meta { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--ligne); display: flex; flex-wrap: wrap; gap: 8px; font-size: .82rem; color: var(--gris-2); font-family: "Manrope Variable", Manrope, sans-serif; }
.l-tag { padding: 3px 9px; background: var(--bleu-pale); color: var(--bleu-clair); border-radius: 100px; font-weight: 600; }
.l-empty { padding: 56px 28px; background: var(--carte); border: 1px solid var(--ligne); }

/* ── fiche formation ── */
.l-fiche { display: grid; grid-template-columns: minmax(0,1.6fr) minmax(0,.9fr); gap: 64px; align-items: start; }
.l-mod { border-top: 1px solid var(--ligne); padding: 24px 0; display: grid; grid-template-columns: 2.2rem minmax(0,1fr); gap: 20px; }
.l-mod-n { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; color: var(--accent); }
.l-bul { display: grid; gap: 9px; margin-top: 12px; }
/* Apparition au défilement : le retard dépend de l'index de la ligne */
.l-bul-v li, .l-pick li { opacity: 0; transform: translateY(10px);
  transition: opacity .5s ease, transform .55s cubic-bezier(.16,.8,.28,1);
  transition-delay: calc(var(--i) * 65ms); }
.l-bul-v.l-vu li, .l-pick.l-vu li { opacity: 1; transform: none; }
.l-bul-h li { padding: 3px 10px 3px 0; border-radius: 3px; transition: background-color .18s ease, color .18s ease; }
.l-bul-h li:hover { background: var(--surface); color: #fff; }
.l-bul li > span:first-child { transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease; }
.l-bul-h li:hover > span:first-child { background: #fff; box-shadow: 0 0 12px rgba(147,165,255,.95); transform: scale(1.5); }

/* Listes à choix : le lecteur sélectionne ce qui le concerne */
.l-pick { display: grid; gap: 8px; margin-top: 16px; }
.l-pick-i { width: 100%; display: grid; grid-template-columns: 22px minmax(0,1fr); gap: 14px;
  align-items: start; text-align: left; padding: 13px 16px; border: 1px solid var(--ligne);
  border-radius: 3px; background: var(--surface); transition: background-color .18s ease, border-color .18s ease; }
.l-pick-i:hover { border-color: rgba(255,255,255,.34); background: var(--surface-2); }
.l-pick-box { width: 21px; height: 21px; border: 1px solid rgba(255,255,255,.38); border-radius: 3px;
  display: grid; place-items: center; margin-top: 1px; transition: background-color .18s ease, border-color .18s ease; }
.l-pick-box svg { opacity: 0; transform: scale(.5); transition: opacity .18s ease, transform .18s ease; }
.l-pick-i > span.t { color: var(--gris-1); font-size: .98rem; }
.l-pick-on { border-color: rgba(63,88,255,.7); background: var(--bleu-pale); }
.l-pick-on .l-pick-box { background: var(--bleu); border-color: var(--bleu); }
.l-pick-on .l-pick-box svg { opacity: 1; transform: none; }
.l-pick-on > span.t { color: #fff; }
.l-pick-bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;
  margin-top: 18px; padding: 14px 16px; border-left: 2px solid var(--accent); background: var(--surface); }

/* Programme : chaque module se déplie */
.l-mod-b { width: 100%; text-align: left; display: grid; grid-template-columns: 2.4rem minmax(0,1fr) 18px;
  gap: 18px; align-items: center; padding: 22px 0; }
.l-mod-b:hover .l-mod-t, .l-mod-ouvert .l-mod-t { color: var(--accent); }
.l-mod-t { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: 1.06rem; letter-spacing: -.01em;
  color: var(--titre); transition: color .18s ease; }
.l-mod-chev { width: 10px; height: 10px; border-right: 1.5px solid var(--accent); border-bottom: 1.5px solid var(--accent);
  transform: rotate(45deg); transition: transform .22s ease; justify-self: end; }
.l-mod-ouvert .l-mod-chev { transform: rotate(-135deg); }
.l-mod-corps { padding: 0 0 22px 4.2rem; }
@media (max-width: 860px) { .l-mod-corps { padding-left: 0; } }
.l-bul li { display: grid; grid-template-columns: 14px minmax(0,1fr); gap: 12px; align-items: baseline; }
.l-bul li > span:first-child { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; margin-top: .62em; flex: none; }
.l-aside { background: var(--carte); border: 1px solid var(--ligne); padding: 28px 26px; position: sticky; top: 96px; display: grid; gap: 22px; }
.l-aside-row { display: grid; gap: 4px; }
.l-aside-k { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .82rem; color: var(--gris-2); }

/* ── carrousel typographique ── */
.l-marq { overflow: hidden; position: relative; padding: 10px 0; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.l-marq-row { display: flex; gap: 56px; width: max-content; animation: l-slide 34s linear infinite; }
.l-marq:hover .l-marq-row { animation-play-state: paused; }
.l-marq span { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: clamp(1.3rem, 2.6vw, 2.1rem); letter-spacing: -.03em; color: var(--titre); white-space: nowrap; }
.l-marq span:nth-child(even) { color: var(--gris-2); }
@keyframes l-slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ── méthode ── */
.l-meth { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 32px; counter-reset: m; }
.l-meth-i { padding-top: 22px; border-top: 2px solid rgba(255,255,255,.8); }
.l-meth-v { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: 1.5rem; letter-spacing: -.03em; color: var(--titre); margin-bottom: 10px; }

/* ── fondateurs ── */
.l-fond { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 56px; }
.l-portrait { aspect-ratio: 4/5; max-width: 300px; background: linear-gradient(150deg, #0B1022, #1A2550); display: grid; place-items: center; text-align: center; padding: 24px; margin-bottom: 22px; border: 1px solid var(--ligne); }
.l-portrait-photo { padding: 0; }
.l-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; }
.l-mono { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: 3.4rem; letter-spacing: -.05em; color: var(--bleu-clair); opacity: .42; }
.l-role { color: var(--accent); font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .95rem; margin: 6px 0 14px; }

/* ── carte ── */
.l-map { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,.8fr); gap: 56px; align-items: center; }
.l-map-svg { position: relative; }
.l-map svg { width: 100%; height: auto; max-width: 520px; overflow: visible; }
.l-grat { stroke: rgba(255,255,255,.07); stroke-width: .5; }
.l-contour { fill: none; stroke: rgba(255,255,255,.34); stroke-width: 1.2; }
.l-region { fill: rgba(255,255,255,.07); stroke: rgba(255,255,255,.18); stroke-width: 1;
  transition: fill .3s ease, stroke .3s ease; cursor: pointer; }
.l-region-on { fill: rgba(63,88,255,.4); stroke: var(--accent); }
.l-region-large { fill: rgba(255,255,255,.035); stroke: rgba(255,255,255,.1); }
.l-region-large.l-region-on { fill: rgba(63,88,255,.16); stroke: rgba(147,165,255,.45); }
/* arcs de liaison : tracés à la révélation, animés sur la ville active */
.l-arc { fill: none; stroke: rgba(147,165,255,.3); stroke-width: 1; stroke-dasharray: 420; stroke-dashoffset: 420; }
.l-vu .l-arc { animation: l-trace 1.5s ease-out both; }
@keyframes l-trace { to { stroke-dashoffset: 0; } }
.l-arc-on { stroke: var(--accent); stroke-width: 1.4; stroke-dasharray: 5 7; stroke-dashoffset: 0;
  filter: drop-shadow(0 0 5px rgba(147,165,255,.75)); animation: l-flux 1.1s linear infinite !important; }
@keyframes l-flux { to { stroke-dashoffset: -24; } }
/* villes */
.l-ville { cursor: pointer; }
.l-ville circle.pt { fill: #fff; transition: fill .2s ease; }
.l-vu .l-ville circle.pt { animation: l-battement 3.6s ease-in-out infinite; animation-delay: calc(var(--i) * .5s); }
@keyframes l-battement { 0%, 100% { r: 3.4px; opacity: .85; } 50% { r: 4.3px; opacity: 1; } }
.l-ville:hover circle.pt, .l-ville-on circle.pt { fill: var(--accent); animation: none !important; }
.l-ville text { font-family: "Manrope Variable", Manrope, sans-serif; font-size: 10px; font-weight: 600; fill: rgba(255,255,255,.72);
  transition: fill .2s ease; pointer-events: none; }
.l-ville-on text, .l-ville:hover text { fill: #fff; }
.l-ville-halo { fill: none; stroke: var(--accent); opacity: 0; transition: opacity .25s ease; }
.l-ville-on .l-ville-halo { opacity: .85; }
.l-radar { fill: none; stroke: var(--accent); stroke-width: 1; }
.l-radar-1 { animation: l-radar 2.4s ease-out infinite; }
.l-radar-2 { animation: l-radar 2.4s ease-out 1.2s infinite; }
@keyframes l-radar {
  0% { r: 5px; opacity: .85; }
  100% { r: 26px; opacity: 0; }
}
.l-zone-lab { font-family: "Manrope Variable", Manrope, sans-serif; font-size: 11px; font-weight: 700; fill: #fff;
  pointer-events: none; text-anchor: middle; }
.l-map-card { border-left: 2px solid var(--accent); padding-left: 22px; min-height: 112px;
  display: grid; gap: 8px; align-content: start; }
.l-map-aide { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 18px; }
.l-map-aide span { font-family: "Manrope Variable", Manrope, sans-serif; font-size: .82rem; color: var(--gris-2); }
@media (prefers-reduced-motion: reduce) {
  .l-arc { stroke-dashoffset: 0; animation: none !important; }
  .l-arc-on { animation: none !important; stroke-dasharray: none; }
  .l-radar { display: none; }
  .l-vu .l-ville circle.pt { animation: none; }
}
/* ── matrice ── */
.l-mx-figure { width: 100%; min-width: 0; }
.l-mx-wrap { display: grid; grid-template-columns: 22px minmax(0,1fr); gap: 12px; align-items: stretch; width: 100%; min-width: 0; }
.l-mx-yax { writing-mode: vertical-rl; transform: rotate(180deg); text-align: center; }
.l-matrice { position: relative; width: 100%; min-width: 0; aspect-ratio: 1.2/1; border-left: 1px solid rgba(255,255,255,.3); border-bottom: 1px solid rgba(255,255,255,.3); background: linear-gradient(135deg, rgba(63,88,255,.16), rgba(5,7,15,0) 62%); }
.l-mx-pt { position: absolute; }
.l-mx-dot { position: absolute; left: -4px; top: -4px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px rgba(147,165,255,.7); }
.l-mx-lab { position: absolute; font-size: .78rem; line-height: 1.22; width: 122px; color: var(--gris-1); }
.l-mx-d .l-mx-lab { left: 12px; }
.l-mx-g .l-mx-lab { right: 12px; text-align: right; }
.l-mx-ax { font-family: "Manrope Variable", Manrope, sans-serif; font-size: .8rem; font-weight: 600; color: var(--gris-2); }

/* ── frise ── */
.l-frise { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0; }
.l-frise-i { padding: 0 28px 0 0; position: relative; }
.l-frise-i:hover .l-frise-t { color: var(--accent); }
.l-frise-t { transition: color .2s ease; }
.l-frise-i:hover .l-frise-line::before { background: #fff; box-shadow: 0 0 14px rgba(147,165,255,.95); }
.l-frise-line::before { transition: background-color .2s ease, box-shadow .2s ease; }
.l-frise-t { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: 1.35rem; letter-spacing: -.03em; color: var(--titre); padding-bottom: 20px; }
.l-frise-line { height: 1px; background: var(--ligne); position: relative; margin: 0 -28px 24px 0; }
.l-frise-i:last-child { padding-right: 0; }
.l-frise-i:last-child .l-frise-line { margin-right: 0; }
.l-frise-line::before { content: ""; position: absolute; left: 0; top: -4px; width: 9px; height: 9px; border-radius: 50%; background: var(--accent); }

/* ── accordéon ── */
.l-acc { border-top: 1px solid var(--ligne); }
.l-acc-q { width: 100%; text-align: left; padding: 22px 40px 22px 0; position: relative; font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: 1.04rem; letter-spacing: -.015em; color: var(--titre); }
.l-acc-q::after { content: ""; position: absolute; right: 6px; top: 50%; width: 11px; height: 11px; border-right: 1.5px solid var(--accent); border-bottom: 1.5px solid var(--accent); transform: translateY(-70%) rotate(45deg); transition: transform .22s ease; }
.l-acc-on .l-acc-q::after { transform: translateY(-30%) rotate(-135deg); }
.l-acc-r { padding: 0 60px 24px 0; max-width: 46em; }

/* ── formulaire ── */
.l-form { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 20px 24px; }
.l-field { display: grid; gap: 7px; }
.l-field-full { grid-column: 1 / -1; }
.l-field label { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .88rem; color: var(--titre); }
.l-field input, .l-field select, .l-field textarea { padding: 12px 14px; border: 1px solid var(--ligne); background: var(--surface); color: #fff; border-radius: 3px; width: 100%; transition: border-color .18s ease, background-color .18s ease; }
.l-field input:hover, .l-field select:hover, .l-field textarea:hover { border-color: rgba(255,255,255,.3); }
.l-field input:focus, .l-field select:focus, .l-field textarea:focus { background: var(--surface-2); }
.l-field input::placeholder, .l-field textarea::placeholder { color: var(--gris-2); }
.l-field textarea { min-height: 130px; resize: vertical; }
.l-field-err input, .l-field-err select, .l-field-err textarea { border-color: var(--alerte); }
.l-err { font-size: .82rem; color: var(--alerte); }
.l-check { display: grid; grid-template-columns: 20px minmax(0,1fr); gap: 12px; align-items: start; }
.l-check input { width: 18px; height: 18px; margin-top: 3px; }
.l-ok { border: 1px solid rgba(63,88,255,.5); background: var(--bleu-pale); padding: 28px 26px; display: grid; gap: 10px; }

/* ── ressources ── */
.l-art { background: var(--carte); border: 1px solid var(--ligne); padding: 28px 26px; display: flex; flex-direction: column; gap: 12px; transition: background-color .2s ease, border-color .2s ease; }
.l-art:hover { background: var(--carte-2); border-color: rgba(255,255,255,.26); }
.l-badge { align-self: flex-start; font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .76rem; padding: 4px 10px; border-radius: 100px; background: var(--surface); color: var(--gris-2); border: 1px solid var(--ligne); }
.l-note { border-left: 2px solid var(--accent); padding: 4px 0 4px 18px; }

/* ── pied de page ── */
.l-foot { background: #03050C; padding: 72px 0 36px; border-top: 1px solid var(--ligne); }
.l-foot-grid { display: grid; grid-template-columns: minmax(0,1.3fr) repeat(3, minmax(0,1fr)); gap: 40px; }
.l-foot h4 { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .88rem; color: #fff; margin-bottom: 14px; }
.l-foot a, .l-foot button { color: rgba(255,255,255,.62); font-size: .93rem; display: block; padding: 4px 0; text-align: left; }
.l-foot a:hover, .l-foot button:hover { color: #fff; }
.l-foot .l-logo { color: #fff; }
.l-foot-bot { margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--ligne-nuit); display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; font-size: .85rem; color: rgba(255,255,255,.45); }
.l-todo { display: block; padding: 4px 0; color: rgba(255,255,255,.45); font-size: .85rem; }

/* ── divers ── */
.l-skip { position: absolute; left: -9999px; }
.l-skip:focus { left: 16px; top: 16px; z-index: 80; background: #fff; color: #05070F; padding: 12px 18px; }
.l-back { display: inline-flex; align-items: center; gap: 8px; font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .92rem; color: var(--gris-2); }
.l-back:hover { color: #fff; }
.l-kpi { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: 2.1rem; letter-spacing: -.03em; color: var(--titre); }
.l-count { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; color: var(--gris-2); font-size: .92rem; }

/* ── messages sous-titrés ── */
.l-msg-grille { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 20px; }
.l-msg-aff { position: relative; overflow: hidden; border: 1px solid var(--ligne); background: var(--carte);
  display: grid; grid-template-columns: 104px minmax(0,1fr); gap: 18px; align-items: center; padding: 16px;
  text-align: left; transition: border-color .2s ease, background-color .2s ease; }
.l-msg-aff:hover { border-color: rgba(255,255,255,.3); background: var(--carte-2); }
.l-msg-aff-on { border-color: rgba(147,165,255,.75); background: var(--bleu-pale); }
.l-msg-vig { width: 104px; height: 130px; object-fit: cover; display: block; filter: saturate(.92); }
.l-msg-aff-txt { display: grid; gap: 3px; justify-items: start; }
.l-msg-aff-t { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: 1.04rem; letter-spacing: -.015em;
  color: #fff; display: block; margin-bottom: 6px; }
.l-msg-lire { display: inline-flex; justify-self: start; align-items: center; gap: 8px; margin-top: 12px; font-family: "Manrope Variable", Manrope, sans-serif;
  font-weight: 600; font-size: .86rem; color: var(--accent); }
.l-msg-lire i { width: 22px; height: 22px; border-radius: 50%; border: 1px solid var(--accent); display: grid;
  place-items: center; font-style: normal; font-size: .6rem; padding-left: 2px; }

.l-msg-scene { position: relative; aspect-ratio: 16/9; background: radial-gradient(120% 130% at 78% 12%, rgba(63,88,255,.34), rgba(5,7,15,0) 62%), #070B18;
  border: 1px solid var(--ligne); overflow: hidden; display: grid; }
.l-msg-portrait { position: absolute; left: 0; bottom: 0; height: 100%; width: auto; object-fit: cover;
  object-position: top center; filter: saturate(.92) brightness(.96);
  mask-image: linear-gradient(90deg, #000 58%, transparent 96%);
  -webkit-mask-image: linear-gradient(90deg, #000 58%, transparent 96%); }
.l-msg-logo { position: absolute; top: 18px; right: 22px; font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 800;
  font-size: 1.02rem; letter-spacing: -.045em; color: rgba(255,255,255,.9); }
.l-msg-logo span { color: var(--accent); }
.l-msg-vis { position: absolute; right: 8%; top: 50%; transform: translateY(-58%); text-align: center;
  color: var(--accent); display: grid; gap: 10px; justify-items: center; animation: l-vis-in .5s ease-out both; }
.l-msg-vis svg { width: 92px; height: 92px; filter: drop-shadow(0 0 18px rgba(147,165,255,.5)); }
.l-msg-vis-mot { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: clamp(1.2rem, 2.6vw, 2.1rem);
  letter-spacing: -.03em; color: #fff; }
.l-msg-vis-logo { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 800; font-size: clamp(1.6rem, 3.4vw, 2.8rem);
  letter-spacing: -.05em; color: #fff; }
.l-msg-vis-logo span { color: var(--accent); }
@keyframes l-vis-in { from { opacity: 0; transform: translateY(-58%) scale(.9); } to { opacity: 1; } }
.l-msg-st { position: absolute; left: 6%; right: 6%; bottom: 7%; text-align: center; font-family: "Manrope Variable", Manrope, sans-serif;
  font-weight: 600; font-size: clamp(.95rem, 1.7vw, 1.3rem); line-height: 1.3; letter-spacing: -.015em; color: #fff;
  background: rgba(5,7,15,.72); backdrop-filter: blur(6px); padding: 12px 18px; border-radius: 3px;
  border-bottom: 2px solid var(--accent); }
.l-msg-auteur { position: absolute; left: 22px; top: 18px; font-family: "Manrope Variable", Manrope, sans-serif; font-size: .82rem;
  color: rgba(255,255,255,.72); }
.l-msg-trans { margin-top: 20px; }
.l-msg-trans li { display: grid; grid-template-columns: 30px minmax(0,1fr); gap: 12px; padding: 5px 0;
  font-size: .92rem; color: var(--gris-2); }
.l-msg-trans li b { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .78rem; color: var(--gris-2); }
.l-msg-trans-on { color: #fff !important; }
@media (max-width: 860px) {
  .l-msg-grille { grid-template-columns: 1fr; }
  .l-msg-portrait { height: 100%; opacity: .45; }
  .l-msg-st { bottom: 6%; left: 4%; right: 4%; padding: 10px 12px; }
  .l-msg-vis svg { width: 52px; height: 52px; }
}
@media (prefers-reduced-motion: reduce) { .l-msg-vis { animation: none; } }

/* ── huit principes ── */
.l-prin { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1px; background: var(--ligne);
  border: 1px solid var(--ligne); }
.l-prin-t { background: var(--carte); padding: 22px 20px 20px; text-align: left; display: grid; gap: 10px;
  align-content: start; transition: background-color .2s ease; position: relative; }
.l-prin-t::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 2px; background: var(--accent);
  transform: scaleY(0); transform-origin: 50% 0; transition: transform .25s ease; }
.l-prin-t:hover { background: var(--carte-2); }
.l-prin-on { background: var(--carte-2); }
.l-prin-on::before { transform: scaleY(1); }
.l-prin-ic { color: var(--gris-2); transition: color .2s ease, transform .3s cubic-bezier(.16,.8,.28,1); display: block; }
.l-prin-t:hover .l-prin-ic, .l-prin-on .l-prin-ic { color: var(--accent); transform: translateY(-2px) scale(1.08); }
.l-prin-on .l-prin-ic { filter: drop-shadow(0 0 10px rgba(147,165,255,.55)); }
.l-prin-n { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: .74rem; color: var(--gris-2); }
.l-prin-lab { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .95rem; line-height: 1.25;
  letter-spacing: -.015em; color: #fff; }
.l-prin-detail { margin-top: 28px; padding: 30px 28px; background: var(--carte); border: 1px solid var(--ligne);
  border-left: 2px solid var(--accent); display: grid; grid-template-columns: 56px minmax(0,1fr) auto; gap: 26px;
  align-items: start; }
.l-prin-detail-ic { color: var(--accent); }
.l-prin-detail-ic svg { width: 44px; height: 44px; }
.l-prin-nav { display: flex; align-items: center; gap: 10px; }
@media (max-width: 1040px) { .l-prin { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 860px) {
  .l-prin { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .l-prin-detail { grid-template-columns: 1fr; gap: 18px; padding: 24px 20px; }
  .l-prin-nav { justify-content: space-between; }
}

/* ── signature animée du logotype ──
   Les animations ne démarrent qu'une fois le bloc visible (classe l-vu),
   pour que personne ne rate la séquence. */
.l-sig { position: relative; text-align: center; padding: 26px 0 8px; overflow: hidden; }
.l-sig-glow { position: absolute; left: 50%; top: 50%; width: 760px; height: 420px; transform: translate(-50%,-50%);
  background: radial-gradient(ellipse at center, rgba(63,88,255,.30), rgba(107,75,245,.12) 42%, rgba(5,7,15,0) 72%);
  pointer-events: none; opacity: 0; transition: opacity 1.4s ease .3s; }
.l-sig.l-vu .l-sig-glow { opacity: 1; }
.l-sig-mot { position: relative; display: inline-block; font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 800;
  font-size: clamp(3rem, 9vw, 6.4rem); letter-spacing: -.055em; line-height: 1; color: #fff; }
.l-sig-mot b { font-weight: 800; display: inline-block; opacity: 0; transform: translateY(26px); filter: blur(7px); }
.l-sig.l-vu .l-sig-mot b { animation: l-lettre .78s cubic-bezier(.16,.8,.28,1) both; animation-delay: calc(var(--i) * 72ms); }
@keyframes l-lettre {
  from { opacity: 0; transform: translateY(26px); filter: blur(7px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}
.l-sig-mot b.ia { color: var(--accent); }
.l-sig.l-vu .l-sig-mot b.ia { animation: l-lettre-ia 1.1s cubic-bezier(.16,.8,.28,1) both; animation-delay: calc(var(--i) * 72ms); }
@keyframes l-lettre-ia {
  from { opacity: 0; transform: translateY(26px) scale(.86); filter: blur(7px); text-shadow: none; }
  60% { opacity: 1; transform: none; filter: blur(0); text-shadow: 0 0 34px rgba(147,165,255,.95); }
  to { opacity: 1; transform: none; filter: blur(0); text-shadow: 0 0 16px rgba(147,165,255,.42); }
}
/* balayage lumineux, en boucle lente */
.l-sig-mot::after { content: ""; position: absolute; inset: -8% -14%; pointer-events: none;
  mix-blend-mode: overlay;
  background: linear-gradient(102deg, transparent 32%, rgba(255,255,255,.22) 44%, rgba(255,255,255,.85) 50%, rgba(255,255,255,.22) 56%, transparent 68%);
  transform: translateX(-125%); }
.l-sig.l-vu .l-sig-mot::after { animation: l-balayage 6.5s ease-in-out 1.5s infinite; }
@keyframes l-balayage { 0% { transform: translateX(-120%); } 38%, 100% { transform: translateX(120%); } }
/* filet et point qui le parcourt */
.l-sig-filet { position: relative; height: 1px; width: min(420px, 74%); margin: 26px auto 0;
  background: linear-gradient(90deg, rgba(255,255,255,0), var(--ligne) 22%, var(--ligne) 78%, rgba(255,255,255,0));
  transform: scaleX(0); transform-origin: 50% 50%; }
.l-sig.l-vu .l-sig-filet { animation: l-filet 1.1s cubic-bezier(.16,.8,.28,1) .7s both; }
@keyframes l-filet { to { transform: scaleX(1); } }
.l-sig-filet i { position: absolute; top: -2px; left: 0; width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 14px rgba(147,165,255,.95); opacity: 0; }
.l-sig.l-vu .l-sig-filet i { animation: l-point 6.5s ease-in-out 1.6s infinite; }
@keyframes l-point {
  0% { left: 0; opacity: 0; }
  12% { opacity: 1; }
  40% { left: calc(100% - 5px); opacity: 1; }
  52%, 100% { left: calc(100% - 5px); opacity: 0; }
}
.l-sig-txt { margin-top: 22px; font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600;
  font-size: clamp(.95rem, 1.5vw, 1.18rem); letter-spacing: -.015em; color: var(--gris-1);
  opacity: 0; transform: translateY(10px); }
.l-sig.l-vu .l-sig-txt { animation: l-lettre .9s ease-out 1.05s both; }
@media (prefers-reduced-motion: reduce) {
  .l-sig-mot b, .l-sig-txt { opacity: 1 !important; transform: none !important; filter: none !important; animation: none !important; }
  .l-sig-filet { transform: scaleX(1) !important; animation: none !important; }
  .l-sig-mot::after, .l-sig-filet i { display: none; }
  .l-sig-glow { opacity: 1; }
}

/* ── lecteur de démonstration ── */
.l-demo { background: var(--carte); border: 1px solid var(--ligne); }
.l-demo-head { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between;
  padding: 16px 22px; border-bottom: 1px solid var(--ligne); }
.l-demo-head-g { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.l-motif { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .76rem; padding: 4px 10px;
  border-radius: 100px; background: var(--bleu-pale); color: var(--bleu-clair); }
.l-illus { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .74rem; padding: 4px 10px;
  border-radius: 100px; border: 1px solid rgba(255,255,255,.28); color: var(--gris-2); }
.l-demo-body { padding: 24px 22px; display: grid; gap: 18px; min-height: 420px; align-content: start; }
.l-bloc-k { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .78rem; color: var(--gris-2); margin-bottom: 8px; }
.l-prompt { border: 1px solid var(--ligne); border-left: 2px solid var(--accent); background: var(--surface);
  padding: 14px 16px; font-size: .96rem; color: #fff; }
.l-caret { display: inline-block; width: 7px; height: 1.05em; background: var(--accent); vertical-align: -.18em;
  margin-left: 2px; animation: l-blink 1s steps(1) infinite; }
@keyframes l-blink { 50% { opacity: 0; } }
.l-step { display: grid; grid-template-columns: 16px minmax(0,1fr); gap: 12px; align-items: start; padding: 5px 0; }
.l-step-pt { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.22); margin-top: .45em; }
.l-step-fait .l-step-pt { background: var(--accent); }
.l-step-cours .l-step-pt { background: #fff; box-shadow: 0 0 0 0 rgba(147,165,255,.7); animation: l-pulse 1.3s ease-out infinite; }
@keyframes l-pulse { to { box-shadow: 0 0 0 10px rgba(147,165,255,0); } }
.l-step-t { font-size: .95rem; color: #fff; }
.l-step-d { font-size: .86rem; color: var(--gris-2); }
.l-doc { display: grid; grid-template-columns: 10px minmax(0,1fr); gap: 12px; padding: 10px 12px; margin-bottom: 6px;
  background: var(--surface); border-left: 2px solid var(--accent); }
.l-doc-n { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .86rem; color: #fff; }
.l-doc-e { font-size: .86rem; color: var(--gris-1); }
.l-doc-pt { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); margin-top: .5em; }
.l-sortie { display: grid; gap: 10px; }
.l-sortie li { display: grid; grid-template-columns: 5px minmax(0,1fr); gap: 12px; font-size: .96rem; color: #fff; }
.l-sortie li > span:first-child { background: var(--accent); border-radius: 50%; height: 5px; margin-top: .62em; }
.l-tab { width: 100%; border-collapse: collapse; font-size: .9rem; }
.l-tab th { text-align: left; font-family: "Manrope Variable", Manrope, sans-serif; font-size: .78rem; color: var(--gris-2);
  font-weight: 600; padding: 8px 10px; border-bottom: 1px solid var(--ligne); }
.l-tab td { padding: 9px 10px; border-bottom: 1px solid var(--ligne); color: #fff; }
.l-tab td:first-child { color: var(--accent); font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; white-space: nowrap; }
.l-demo-foot { border-top: 1px solid var(--ligne); padding: 14px 22px; display: grid; gap: 12px; }
.l-barre { height: 2px; background: rgba(255,255,255,.12); position: relative; }
.l-barre i { position: absolute; inset: 0 auto 0 0; background: var(--accent); transition: width .12s linear; }
.l-demo-ctrl { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.l-chap { padding: 6px 11px; border-radius: 100px; border: 1px solid var(--ligne); font-size: .8rem;
  font-family: "Manrope Variable", Manrope, sans-serif; color: var(--gris-2); transition: all .15s ease; }
.l-chap:hover { color: #fff; border-color: rgba(255,255,255,.4); }
.l-chap-on { background: var(--surface-2); color: #fff; border-color: rgba(255,255,255,.4); }
.l-demo-liste { display: grid; gap: 8px; }
.l-demo-i { width: 100%; text-align: left; padding: 15px 16px; border: 1px solid var(--ligne); background: var(--surface);
  display: grid; gap: 5px; transition: background-color .18s ease, border-color .18s ease; }
.l-demo-i:hover { background: var(--surface-2); border-color: rgba(255,255,255,.3); }
.l-demo-i-on { border-color: rgba(147,165,255,.7); background: var(--bleu-pale); }
.l-demo-i-f { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 600; font-size: .76rem; color: var(--accent); }
.l-demo-i-t { font-family: "Manrope Variable", Manrope, sans-serif; font-weight: 700; font-size: .98rem; letter-spacing: -.01em; color: #fff; }
.l-demo-grille { display: grid; grid-template-columns: minmax(0,.8fr) minmax(0,1.6fr); gap: 40px; align-items: start; }
.l-video { width: 100%; aspect-ratio: 16/9; border: 0; display: block; background: #000; }
@media (max-width: 1040px) { .l-demo-grille { grid-template-columns: 1fr; gap: 28px; } }
@media (max-width: 860px) { .l-demo-body { min-height: 0; padding: 20px 16px; } .l-demo-head, .l-demo-foot { padding: 14px 16px; } }
@media (prefers-reduced-motion: reduce) { .l-caret, .l-step-cours .l-step-pt { animation: none; } }

/* ── adaptations ── */
@media (max-width: 1040px) {
  .l-fiche { grid-template-columns: 1fr; gap: 40px; }
  .l-aside { position: static; }
  .l-cards, .l-g3 { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .l-meth, .l-g4 { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .l-etapes { grid-template-columns: repeat(2, minmax(0,1fr)); border-top: 0; }
  .l-etape { border-top: 1px solid var(--ligne-nuit); }
  .l-etape:nth-child(even) { border-right: 0; }
}
@media (max-width: 1220px) {
  .l-nav-links { display: none; }
  .l-burger { display: flex; }
}
@media (max-width: 860px) {
  .l-root { font-size: 16px; }
  .l-sec { padding: 68px 0; }
  .l-hero { padding: 116px 0 64px; }
  .l-hero-in, .l-sec-intro, .l-g2, .l-fond, .l-map, .l-frise, .l-form { grid-template-columns: 1fr !important; gap: 32px; }
  .l-hero-art { max-width: 300px; margin: 8px auto 0; }
  .l-cards, .l-g3, .l-g4, .l-meth { grid-template-columns: 1fr; }
  .l-etapes { grid-template-columns: 1fr; }
  .l-etape { border-right: 0; padding-right: 0; }
  .l-etape-on .l-etape-bar { width: 100%; }
  .l-foot-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .l-frise-i { padding: 0 0 8px; }
  .l-frise-line { margin-right: 0; }
  .l-matrice { aspect-ratio: 1/1.15; }
  .l-mx-lab { width: 108px; font-size: .74rem; }
}
@media (prefers-reduced-motion: reduce) {
  .l-root *, .l-root *::before, .l-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important;
  }
  .l-marq-row { animation: none; flex-wrap: wrap; width: 100%; }
  .l-bul-v li, .l-pick li { opacity: 1 !important; transform: none !important; }
  .l-dot { transform: none !important; opacity: 1 !important; }
  .l-line-draw { stroke-dashoffset: 0; }
}
`;

/* ─────────── 5. UTILITAIRES ─────────── */

const LABEL = (liste, id) => (liste.find((x) => x.id === id) || {}).label || id;
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
/* Décalage initial stable des points du hero (pas de Math.random :
   la même animation doit se rejouer à l’identique) */
const seed = (i, m) => (((i * 73 + 29) * (m + 3)) % 97) - 48;

/* Révèle un bloc quand il entre dans le champ de vision, une seule fois.
   L'animation elle-même est en CSS, et neutralisée si l'utilisateur a
   demandé à réduire les animations. */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("l-vu");
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("l-vu");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    /* Filet de sécurité : un contenu ne doit jamais rester invisible parce
       qu'un observateur ne s'est pas déclenché (impression, capture, onglet
       en arrière-plan, navigateur exotique). Passé ce délai, on révèle. */
    const filet = setTimeout(() => el.classList.add("l-vu"), 1400);
    return () => {
      clearTimeout(filet);
      io.disconnect();
    };
  }, []);
  return ref;
}

/* Liste à puces : apparition échelonnée, puce qui s'allume au survol. */
function Liste({ items, style }) {
  const ref = useReveal();
  return (
    <ul className="l-bul l-bul-v l-bul-h" ref={ref} style={style}>
      {items.map((t, i) => (
        <li key={t} style={{ "--i": i }}>
          <span />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/* Liste à choix : chaque ligne est cliquable et remonte dans la demande. */
function ListeChoix({ items, selection, onToggle }) {
  const ref = useReveal();
  return (
    <ul className="l-pick" ref={ref}>
      {items.map((t, i) => {
        const on = selection.includes(t);
        return (
          <li key={t} style={{ "--i": i }}>
            <button
              className={"l-pick-i " + (on ? "l-pick-on" : "")}
              onClick={() => onToggle(t)}
              aria-pressed={on}
            >
              <span className="l-pick-box" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path
                    d="M1.6 6.4 4.4 9.1 10.4 2.9"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="t">{t}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────── SIGNATURE ANIMÉE ───────────
   Le logotype se compose lettre par lettre, « IA » s'allume en dernier,
   puis un balayage lumineux et un point parcourent le filet en boucle lente. */
/* ─────────── ICÔNES DES PRINCIPES ───────────
   Tracés dessinés pour ce site : un trait unique, la même grille de 24,
   pour qu'elles forment une famille plutôt qu'une collection. */
function Icone({ id }) {
  const c = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const traces = {
    /* dossier interrogé : partir du réel de l'entreprise */
    cadrage: (
      <>
        <path d="M3 6.5h6l1.6 2H21v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6.5Z" {...c} />
        <circle cx="12.5" cy="13" r="2.8" {...c} />
        <path d="M14.6 15.1 16.8 17" {...c} />
      </>
    ),
    /* deux paroles de registres différents */
    langage: (
      <>
        <path d="M3 5.5h10v6H6.5L3 14.5v-9Z" {...c} />
        <path d="M21 10.5h-5v5h3l2 2.5v-7.5Z" {...c} />
        <path d="M6 8.5h4M6 10.5h2.5" {...c} />
      </>
    ),
    /* une notion devient un geste */
    usage: (
      <>
        <circle cx="6" cy="12" r="3" {...c} />
        <path d="M10 12h6" {...c} />
        <path d="M13.5 9.5 16 12l-2.5 2.5" {...c} />
        <rect x="17.5" y="8.5" width="4" height="7" rx="1" {...c} />
      </>
    ),
    /* les mains sur le clavier */
    pratique: (
      <>
        <rect x="2.5" y="8" width="19" height="9.5" rx="1.4" {...c} />
        <path d="M5.5 11h2M9 11h2M12.5 11h2M16 11h2.5M5.5 14.5h13" {...c} />
      </>
    ),
    /* mise en concurrence */
    comparer: (
      <>
        <path d="M12 4.2v15.6" {...c} />
        <path d="M5.2 8.4h13.6" {...c} />
        <path d="M7.6 8.4v2.4M16.4 8.4v2.4" {...c} />
        <rect x="4.4" y="10.8" width="6.4" height="3.8" rx=".8" {...c} />
        <rect x="13.2" y="10.8" width="6.4" height="3.8" rx=".8" {...c} />
      </>
    ),
    /* ce qui protège : le garde-fou */
    limites: (
      <>
        <path d="M12 3.5 19.5 6v6c0 4.2-3 7-7.5 8.5C7.5 19 4.5 16.2 4.5 12V6L12 3.5Z" {...c} />
        <path d="M12 8.5v4" {...c} />
        <circle cx="12" cy="15.4" r=".9" fill="currentColor" stroke="none" />
      </>
    ),
    /* ce qui reste après la séance */
    supports: (
      <>
        <path d="M7 4.5h8.5L19 8v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" {...c} />
        <path d="M15 4.5V8h3.5" {...c} />
        <path d="M9 12h7M9 15h5" {...c} />
        <path d="M4 7v13.5a1 1 0 0 0 1 1h11" {...c} opacity=".45" />
      </>
    ),
    /* les prochaines étapes, jalonnées */
    suites: (
      <>
        <circle cx="5" cy="18.5" r="2" {...c} />
        <circle cx="12" cy="12" r="2" {...c} />
        <circle cx="19" cy="5.5" r="2" {...c} />
        <path d="M6.6 17 10.4 13.5M13.6 10.5 17.4 7" {...c} strokeDasharray="2 2.4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      {traces[id]}
    </svg>
  );
}

/* ─────────── HUIT PRINCIPES, EXPLORABLES ─────────── */
function Principes() {
  const [sel, setSel] = useState(0);
  const d = DIFFERENCES[sel];
  const bouger = (pas) => setSel((v) => (v + pas + DIFFERENCES.length) % DIFFERENCES.length);
  return (
    <div>
      <div
        className="l-prin"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            bouger(1);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            bouger(-1);
          }
        }}
      >
        {DIFFERENCES.map((x, i) => (
          <button
            key={x.icone}
            className={"l-prin-t " + (i === sel ? "l-prin-on" : "")}
            onClick={() => setSel(i)}
            onMouseEnter={() => setSel(i)}
            onFocus={() => setSel(i)}
            aria-pressed={i === sel}
          >
            <span className="l-prin-ic">
              <Icone id={x.icone} />
            </span>
            <span className="l-prin-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="l-prin-lab">{x.titre}</span>
          </button>
        ))}
      </div>

      <div className="l-prin-detail" aria-live="polite">
        <div className="l-prin-detail-ic">
          <Icone id={d.icone} />
        </div>
        <div>
          <h3 className="l-d3" style={{ marginBottom: 12 }}>{d.titre}</h3>
          <p className="l-txt" style={{ marginBottom: 18 }}>{d.texte}</p>
          <p className="l-bloc-k">Concrètement</p>
          <p className="l-txt l-small" style={{ color: "var(--gris-1)" }}>{d.exemple}</p>
        </div>
        <div className="l-prin-nav">
          <button className="l-chap" onClick={() => bouger(-1)} aria-label="Principe précédent">
            ←
          </button>
          <span className="l-count">
            {sel + 1} / {DIFFERENCES.length}
          </span>
          <button className="l-chap" onClick={() => bouger(1)} aria-label="Principe suivant">
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function SignatureAnimee() {
  const ref = useReveal();
  const mot = "LucidIA".split("");
  return (
    <div className="l-sig" ref={ref}>
      <span className="l-sig-glow" aria-hidden="true" />
      <p className="l-sig-mot" role="img" aria-label="LucidIA">
        {mot.map((c, i) => (
          <b key={i} className={i >= 5 ? "ia" : ""} style={{ "--i": i }} aria-hidden="true">
            {c}
          </b>
        ))}
      </p>
      <div className="l-sig-filet" aria-hidden="true">
        <i />
      </div>
      <p className="l-sig-txt">{SITE.signature}</p>
    </div>
  );
}

function Logo({ className = "" }) {
  return (
    <span className={"l-logo " + className} aria-label="LucidIA">
      Lucid<span>IA</span>
    </span>
  );
}

function Btn({ variant = "1", onClick, href, children, disabled, className = "", ...rest }) {
  const cls = ("l-btn l-btn-" + variant + " " + className).trim();
  if (href)
    return (
      <a className={cls} href={href} {...rest}>
        {children}
      </a>
    );
  return (
    <button type="button" className={cls} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

function SectionIntro({ eyebrow, titre, texte, action }) {
  return (
    <div className="l-sec-intro">
      <div>
        {eyebrow && <p className="l-eyebrow">{eyebrow}</p>}
        <h2 className="l-d2 l-head" style={{ marginTop: eyebrow ? 14 : 0 }}>
          {titre}
        </h2>
      </div>
      <div>
        {texte && <p className="l-txt">{texte}</p>}
        {action && <div style={{ marginTop: 20 }}>{action}</div>}
      </div>
    </div>
  );
}

/* ─────────── ANIMATION DU HERO ───────────
   Cinq couches d’information qui se mettent en place : le seul mouvement
   non déclenché par l’utilisateur de toute la page. */
function HeroArt() {
  const layers = [0, 1, 2, 3, 4];
  const cols = [0, 1, 2, 3, 4, 5, 6, 7];
  const couleur = ["#39415C", "#5A6486", "#6E76E8", "#3F58FF", "#93A5FF"];
  return (
    <svg viewBox="0 0 360 360" role="img" aria-label="Représentation abstraite de couches d’information qui s’organisent progressivement, de la complexité vers la clarté.">
      {layers.map((l) => (
        <line
          key={"l" + l}
          className="l-line-draw"
          x1="28"
          y1={56 + l * 62}
          x2="332"
          y2={56 + l * 62}
          stroke={couleur[l]}
          strokeWidth="1"
          opacity={0.18 + l * 0.12}
          style={{ animationDelay: 260 + l * 110 + "ms" }}
        />
      ))}
      {layers.map((l) =>
        cols.map((c) => {
          const flou = (4 - l) / 4; /* 1 en haut (complexité), 0 en bas (clarté) */
          const x = 36 + c * 41 + seed(c * 2 + l, l) * 0.16 * flou;
          const y = 56 + l * 62 + seed(c + l * 5, c) * 0.22 * flou;
          return (
            <circle
              key={l + "-" + c}
              className="l-dot"
              cx={x}
              cy={y}
              r={2.6 + l * 0.5}
              fill={couleur[l]}
              style={{
                "--dx": seed(c + l * 8, l) + "px",
                "--dy": seed(c * 3 + l, c) * 0.9 + "px",
                animationDelay: 60 + (l * 8 + c) * 15 + "ms",
              }}
            />
          );
        })
      )}
    </svg>
  );
}

/* ─────────── NAVIGATION ─────────── */
function Nav({ route, go }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [route.page, route.id]);

  const liens = PAGES.filter((p) => p.id !== "mentions" && p.id !== "accueil");

  return (
    <>
      <header className={"l-nav " + (solid || open ? "l-nav-solid" : "")}>
        <div className="l-wrap l-nav-in">
          <button onClick={() => go("accueil")} aria-label="LucidIA — retour à l’accueil">
            <Logo />
          </button>
          <nav className="l-nav-links" aria-label="Navigation principale">
            {liens.map((p) => (
              <button
                key={p.id}
                className={"l-nav-link " + (route.page === p.id ? "l-nav-link-on" : "")}
                onClick={() => go(p.id)}
                aria-current={route.page === p.id ? "page" : undefined}
              >
                {p.label}
              </button>
            ))}
            <Btn variant="1" className="l-nav-cta" onClick={() => go("formations")}>
              Découvrir nos formations
            </Btn>
          </nav>
          <button
            className={"l-burger " + (open ? "l-burger-open" : "")}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <i />
          </button>
        </div>
      </header>

      {open && (
        <div className="l-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <nav aria-label="Navigation mobile">
            {PAGES.filter((p) => p.id !== "mentions").map((p) => (
              <button key={p.id} className="l-menu-link" onClick={() => go(p.id)}>
                {p.label}
              </button>
            ))}
          </nav>
          <div className="l-menu-foot">
            <Btn variant="1" onClick={() => go("formations")}>
              Découvrir nos formations
            </Btn>
            <p className="l-small" style={{ marginTop: 18 }}>
              {SITE.descripteur}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────── PIED DE PAGE ─────────── */
function Footer({ go }) {
  return (
    <footer className="l-foot l-dark">
      <div className="l-wrap">
        <div className="l-foot-grid">
          <div>
            <Logo />
            <p className="l-small" style={{ marginTop: 14, maxWidth: "26em" }}>
              {SITE.descripteur}
            </p>
            <p className="l-small" style={{ marginTop: 14, color: "rgba(255,255,255,.8)" }}>
              {SITE.signature}
            </p>
          </div>
          <div>
            <h4>Formations</h4>
            {FORMATIONS.slice(0, 5).map((f) => (
              <button key={f.id} onClick={() => go("formations", { id: f.id })}>
                {f.titre}
              </button>
            ))}
            <button onClick={() => go("formations")}>Tout le catalogue</button>
          </div>
          <div>
            <h4>Cabinet</h4>
            <button onClick={() => go("accompagnement")}>Accompagnement IA</button>
            <button onClick={() => go("demonstrations")}>Démonstrations</button>
            <button onClick={() => go("methode")}>Notre méthode</button>
            <button onClick={() => go("apropos")}>À propos</button>
            <button onClick={() => go("ressources")}>Ressources</button>
            <button onClick={() => go("contact")}>Contact</button>
          </div>
          <div>
            <h4>Nous écrire</h4>
            <a href={"mailto:" + SITE.email}>{SITE.email}</a>
            {SITE.telephone ? <a href={"tel:" + SITE.telephoneLien}>{SITE.telephone}</a> : <span className="l-todo">Téléphone à compléter</span>}
            {SITE.calendly && (
              <a href={SITE.calendly} target="_blank" rel="noreferrer">Prendre rendez-vous</a>
            )}
            {SITE.linkedinCabinet ? (
              <a href={SITE.linkedinCabinet} target="_blank" rel="noreferrer">LinkedIn du cabinet</a>
            ) : (
              <span className="l-todo">LinkedIn du cabinet à compléter</span>
            )}
            <p className="l-small" style={{ marginTop: 12 }}>
              Interventions à Paris, Rennes, Nantes, Angers, Cholet, La Roche-sur-Yon et partout en France.
            </p>
          </div>
        </div>
        <div className="l-foot-bot">
          <span>© {new Date().getFullYear()} {SITE.nom}. Tous droits réservés.</span>
          <button onClick={() => go("mentions")} style={{ color: "rgba(255,255,255,.62)" }}>
            Mentions légales et politique de confidentialité
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ─────────── BLOCS PARTAGÉS ─────────── */

const FILTRE_VIDE = { q: "", public: "", format: "", niveau: "", theme: "" };

/* Les résultats de recherche placent d’abord les correspondances de titre,
   puis de promesse, puis d’outil cité : « copilot » remonte la formation
   Copilot avant celles qui ne font que la mentionner. */
function score(x, q) {
  if (!q) return 0;
  if (norm(x.titre).includes(q)) return 3;
  if (norm(x.promesse).includes(q)) return 2;
  if (norm(x.themes.join(" ")).includes(q)) return 1;
  return 0;
}

function filtrer(liste, f) {
  const q = norm(f.q.trim());
  const retenues = liste.filter((x) => {
    if (f.public && !x.publics.includes(f.public)) return false;
    if (f.format && !x.formats.includes(f.format)) return false;
    if (f.niveau && x.niveau !== f.niveau) return false;
    if (f.theme && !x.themes.includes(f.theme)) return false;
    if (q) {
      const champ = norm(
        x.titre + " " + x.promesse + " " + x.themes.join(" ") + " " + x.outils.join(" ")
      );
      if (!champ.includes(q)) return false;
    }
    return true;
  });
  return q ? [...retenues].sort((a, b) => score(b, q) - score(a, q)) : retenues;
}

function GroupeChips({ label, options, valeur, onChange, large }) {
  return (
    <fieldset
      className={"l-fgroup " + (large ? "l-fgroup-large" : "")}
      style={{ border: 0, padding: 0, margin: 0 }}
    >
      <legend className="l-flabel">{label}</legend>
      <div className="l-chips">
        <button
          className={"l-chip " + (valeur === "" ? "l-chip-on" : "")}
          onClick={() => onChange("")}
          aria-pressed={valeur === ""}
        >
          Tous
        </button>
        {options.map((o) => (
          <button
            key={o.id}
            className={"l-chip " + (valeur === o.id ? "l-chip-on" : "")}
            onClick={() => onChange(valeur === o.id ? "" : o.id)}
            aria-pressed={valeur === o.id}
          >
            {o.court || o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Filtres({ f, set, avecRecherche }) {
  return (
    <div style={{ display: "grid", gap: 26 }}>
      {avecRecherche && (
        <div>
          <label className="l-flabel" htmlFor="rech">
            Rechercher une formation
          </label>
          <input
            id="rech"
            className="l-search"
            type="search"
            value={f.q}
            placeholder="Prompting, finance, Copilot, comité de direction…"
            onChange={(e) => set({ ...f, q: e.target.value })}
          />
        </div>
      )}
      <div className="l-filters">
        <GroupeChips label="Public" options={PUBLICS} valeur={f.public} onChange={(v) => set({ ...f, public: v })} />
        <GroupeChips label="Durée" options={FORMATS} valeur={f.format} onChange={(v) => set({ ...f, format: v })} />
        <GroupeChips label="Niveau" options={NIVEAUX} valeur={f.niveau} onChange={(v) => set({ ...f, niveau: v })} />
        <GroupeChips
          label="Thématique"
          options={THEMES}
          valeur={f.theme}
          onChange={(v) => set({ ...f, theme: v })}
          large
        />
      </div>
    </div>
  );
}

function CarteFormation({ f, go }) {
  return (
    <button className="l-card" onClick={() => go("formations", { id: f.id })}>
      <span className="l-card-t">{f.titre}</span>
      <span className="l-card-p">{f.promesse}</span>
      <span className="l-card-meta">
        <span className="l-tag">{LABEL(NIVEAUX, f.niveau)}</span>
        <span>{f.formats.map((x) => LABEL(FORMATS, x)).join(" · ")}</span>
      </span>
    </button>
  );
}

function GrilleFormations({ liste, go }) {
  if (!liste.length)
    return (
      <div className="l-empty">
        <p className="l-d4" style={{ marginBottom: 8 }}>
          Aucune formation ne correspond à cette combinaison.
        </p>
        <p className="l-txt">
          Élargissez un filtre, ou demandez une formation sur mesure : la plupart de nos
          interventions sont construites à la demande.
        </p>
      </div>
    );
  return (
    <div className="l-cards">
      {liste.map((f) => (
        <CarteFormation key={f.id} f={f} go={go} />
      ))}
    </div>
  );
}

/* ─────────── QUATRE ÉTAPES INTERACTIVES ─────────── */
function Etapes() {
  const [actif, setActif] = useState("comprendre");
  return (
    <div className="l-etapes">
      {ETAPES.map((e, i) => (
        <div
          key={e.id}
          className={"l-etape " + (actif === e.id ? "l-etape-on" : "")}
          onMouseEnter={() => setActif(e.id)}
        >
          <span className="l-etape-bar" />
          <button
            onClick={() => setActif(e.id)}
            onFocus={() => setActif(e.id)}
            aria-expanded={actif === e.id}
            style={{ display: "block", textAlign: "left", width: "100%" }}
          >
            <span className="l-etape-num">{i + 1}</span>
            <span className="l-etape-t">{e.titre}</span>
          </button>
          {actif === e.id && <p className="l-etape-txt">{e.texte}</p>}
        </div>
      ))}
    </div>
  );
}

/* ─────────── CARROUSEL TYPOGRAPHIQUE ─────────── */
function Marquee() {
  const suite = [...OUTILS_MARQUEE, ...OUTILS_MARQUEE];
  return (
    <div className="l-marq">
      <div className="l-marq-row">
        {suite.map((o, i) => (
          <span key={i}>{o}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────── FONDATEURS ─────────── */
function Fondateurs({ complet }) {
  const gens = [
    {
      nom: "Arthur Péniguel",
      role: "Cofondateur, chercheur et consultant en transformation par l’IA",
      bio: "Doctorant en sciences de gestion au sein de PRISM-Sorbonne et consultant spécialisé dans l’intelligence artificielle appliquée aux organisations, Arthur étudie la manière dont l’IA transforme le rôle des managers, les pratiques de travail et le fonctionnement des entreprises. À la croisée de la recherche et du conseil, il aide les dirigeants à décrypter les évolutions technologiques, à identifier leurs implications concrètes et à convertir le potentiel de l’IA en trajectoires de transformation réalistes.",
      photo: SITE.photoArthur,
      linkedin: SITE.linkedinArthur,
    },
    {
      nom: "Norman Hubert",
      role: "Cofondateur et chercheur en intelligence artificielle générative",
      bio: "Chercheur au sein d’Université Côte d’Azur, Norman est spécialisé dans la transformation des pratiques et des usages professionnels à l’ère de l’IA. Il décrypte les nouveaux modes de collaboration entre l’humain et les technologies génératives pour en faire des méthodes accessibles, concrètes et immédiatement mobilisables. Son ambition : aider les entreprises à ne pas seulement suivre la révolution de l’IA, mais à apprendre à la maîtriser et à construire dès aujourd’hui les pratiques professionnelles de demain.",
      photo: SITE.photoNorman,
      linkedin: SITE.linkedinNorman,
    },
  ];
  return (
    <div className="l-fond">
      {gens.map((g) => (
        <div key={g.nom}>
          <figure className={"l-portrait " + (g.photo ? "l-portrait-photo" : "")}>
            {g.photo ? (
              <img
                src={g.photo}
                alt={"Portrait " + (/^[AEIOUYÉÈ]/.test(g.nom) ? "d’" : "de ") + g.nom}
                loading="lazy"
              />
            ) : (
              /* Emplacement de la photographie : renseigner SITE.photoArthur ou
                 SITE.photoNorman. En attendant, le monogramme reste présentable
                 en ligne, contrairement à un cadre vide. */
              <span className="l-mono" aria-hidden="true">
                {g.nom.split(" ").map((m) => m[0]).join("")}
              </span>
            )}
          </figure>
          <h3 className="l-d3">{g.nom}</h3>
          <p className="l-role">{g.role}</p>
          <p className={complet ? "" : "l-small"} style={{ maxWidth: "36em", color: "var(--gris-1)" }}>
            {g.bio}
          </p>
          <p style={{ marginTop: 16 }}>
            {g.linkedin ? (
              <a className="l-btn l-btn-3" href={g.linkedin} target="_blank" rel="noreferrer">
                Profil LinkedIn
              </a>
            ) : (
              <span className="l-small">Lien LinkedIn à fournir</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─────────── CARTE DE FRANCE ───────────
   Survol ou tabulation : aperçu. Clic ou Entrée : la ville reste épinglée.
   Flèches : passer d'une ville à l'autre. Échap : revenir à l'état neutre. */
function CarteFrance({ go }) {
  const ref = useReveal();
  const [survol, setSurvol] = useState(null);
  const [epingle, setEpingle] = useState(null);
  const [region, setRegion] = useState(null);

  const villeActive = survol || epingle;
  const v = VILLES.find((x) => x.nom === villeActive);
  const regionsActives = region
    ? [region, "grand-ouest"]
    : v
    ? REGIONS.filter((r) => r.nom === v.region).map((r) => r.id)
    : [];
  const zone = REGIONS.find((r) => r.id === region);
  const paris = VILLES[0];

  const deplacer = (pas) => {
    const i = VILLES.findIndex((x) => x.nom === villeActive);
    const j = (i < 0 ? 0 : i + pas + VILLES.length) % VILLES.length;
    setEpingle(VILLES[j].nom);
    setSurvol(null);
  };

  const touches = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      deplacer(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      deplacer(-1);
    } else if (e.key === "Escape") {
      setEpingle(null);
      setSurvol(null);
    }
  };

  /* Quadrillage décoratif, découpé à la silhouette */
  const grille = [];
  for (let x = 20; x < 400; x += 26) grille.push(<line key={"v" + x} className="l-grat" x1={x} y1="0" x2={x} y2="400" />);
  for (let y = 20; y < 390; y += 26) grille.push(<line key={"h" + y} className="l-grat" x1="0" y1={y} x2="420" y2={y} />);

  /* Arc de Paris vers chaque autre ville, légèrement bombé */
  const arc = (b) => {
    const cx = (paris.x + b.x) / 2 + (b.y - paris.y) * 0.16;
    const cy = (paris.y + b.y) / 2 - (b.x - paris.x) * 0.16;
    return "M" + paris.x + "," + paris.y + " Q" + cx + "," + cy + " " + b.x + "," + b.y;
  };

  return (
    <div className="l-map">
      <div className="l-map-svg" ref={ref}>
        <svg
          viewBox="0 0 420 400"
          role="group"
          aria-label="Carte stylisée de la France : villes où LucidIA intervient régulièrement. Utilisez les flèches pour passer d’une ville à l’autre."
          onKeyDown={touches}
        >
          <defs>
            <clipPath id="l-fr-clip">
              <polygon points={CONTOUR_FR} />
            </clipPath>
            <radialGradient id="l-fr-fond" cx="30%" cy="42%" r="72%">
              <stop offset="0%" stopColor="rgba(63,88,255,.22)" />
              <stop offset="100%" stopColor="rgba(255,255,255,.03)" />
            </radialGradient>
          </defs>

          <g clipPath="url(#l-fr-clip)">
            <polygon points={CONTOUR_FR} fill="url(#l-fr-fond)" />
            {grille}
          </g>
          <polygon className="l-contour" points={CONTOUR_FR} />

          {REGIONS.map((r) => (
            <polygon
              key={r.id}
              points={r.points}
              className={
                "l-region " +
                (r.large ? "l-region-large " : "") +
                (regionsActives.includes(r.id) ? "l-region-on" : "")
              }
              onMouseEnter={() => setRegion(r.id)}
              onMouseLeave={() => setRegion(null)}
            >
              <title>{r.nom}</title>
            </polygon>
          ))}

          {VILLES.slice(1).map((b, i) => (
            <path
              key={"a" + b.nom}
              className={"l-arc " + (villeActive === b.nom ? "l-arc-on" : "")}
              d={arc(b)}
              style={{ animationDelay: 300 + i * 160 + "ms" }}
            />
          ))}

          {VILLES.map((c, i) => (
            <g
              key={c.nom}
              className={"l-ville " + (villeActive === c.nom ? "l-ville-on" : "")}
              style={{ "--i": i }}
              tabIndex={0}
              role="button"
              aria-pressed={epingle === c.nom}
              aria-label={"Ville : " + c.nom + ", " + c.region}
              onClick={() => setEpingle(epingle === c.nom ? null : c.nom)}
              onFocus={() => setSurvol(c.nom)}
              onBlur={() => setSurvol(null)}
              onMouseEnter={() => setSurvol(c.nom)}
              onMouseLeave={() => setSurvol(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setEpingle(epingle === c.nom ? null : c.nom);
                }
              }}
            >
              {villeActive === c.nom && (
                <>
                  <circle className="l-radar l-radar-1" cx={c.x} cy={c.y} r="5" />
                  <circle className="l-radar l-radar-2" cx={c.x} cy={c.y} r="5" />
                </>
              )}
              <circle className="l-ville-halo" cx={c.x} cy={c.y} r="11" strokeWidth="1" />
              <circle className="pt" cx={c.x} cy={c.y} r="3.6" />
              <circle cx={c.x} cy={c.y} r="15" fill="transparent" />
              <text x={c.x + c.dx} y={c.y + c.dy} textAnchor={c.ancre}>
                {c.nom}
              </text>
            </g>
          ))}

          {zone && (
            <text className="l-zone-lab" x="210" y="392">
              {zone.nom}
            </text>
          )}
        </svg>
      </div>

      <div>
        <p className="l-eyebrow">Implantation</p>
        <h2 className="l-d2" style={{ margin: "14px 0 20px" }}>
          Nous venons à la rencontre de vos équipes.
        </h2>
        <p className="l-lede" style={{ marginBottom: 28 }}>
          LucidIA intervient directement au sein des TPE, PME et ETI, avec une présence
          privilégiée à Paris et dans le Grand Ouest. Votre entreprise se trouve ailleurs en
          France ? Échangeons sur votre besoin.
        </p>
        <div className="l-map-card" aria-live="polite">
          {zone ? (
            <>
              <p className="l-d4" style={{ color: "#fff" }}>{zone.nom}</p>
              <p className="l-small">
                Une de nos zones d’intervention régulières. Nous nous déplaçons dans vos locaux.
              </p>
            </>
          ) : v ? (
            <>
              <p className="l-d4" style={{ color: "#fff" }}>
                {v.nom} <span className="l-small">— {v.region}</span>
              </p>
              <p className="l-small">
                {v.nom === "Paris"
                  ? "Interventions en présentiel dans toute l’Île-de-France, y compris sur plusieurs sites."
                  : "Nous intervenons directement dans vos locaux, à " +
                    v.nom +
                    " comme dans le reste de la région."}
              </p>
              <button
                className="l-btn l-btn-3"
                style={{ marginTop: 4 }}
                onClick={() =>
                  go("contact", { prefill: "Demande de devis", formation: "Intervention à " + v.nom })
                }
              >
                Parler d’une intervention à {v.nom}
              </button>
            </>
          ) : (
            <p className="l-small">
              Survolez une ville, ou sélectionnez-la pour l’épingler. Cette liste n’est pas
              limitative.
            </p>
          )}
        </div>
        <div className="l-map-aide">
          <span>6 villes</span>
          <span>3 régions</span>
          <span>Interventions partout en France</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────── APPEL À L’ACTION FINAL ─────────── */
function CtaFinal({ go }) {
  return (
    <section className="l-sec l-dark" style={{ position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "auto -120px -260px 40%",
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(18,48,214,.55), rgba(90,63,224,.22) 45%, rgba(5,7,15,0) 72%)",
        }}
      />
      <div className="l-wrap" style={{ position: "relative" }}>
        <h2 className="l-d1" style={{ maxWidth: "24ch" }}>
          Et si votre prochain usage de l’IA commençait par une meilleure compréhension ?
        </h2>
        <div className="l-actions" style={{ marginTop: 40 }}>
          <Btn variant="1" onClick={() => go("formations")}>
            Explorer le catalogue
          </Btn>
          <Btn variant="2" onClick={() => go("contact")}>
            Parler à un expert
          </Btn>
        </div>
      </div>
    </section>
  );
}

/* ─────────── PAGE : ACCUEIL ─────────── */
function PageAccueil({ go }) {
  const [f, set] = useState(FILTRE_VIDE);
  const resultats = useMemo(() => filtrer(FORMATIONS, f), [f]);

  return (
    <>
      <section className="l-hero">
        <div aria-hidden="true" className="l-hero-glow" />
        <div className="l-wrap l-hero-in">
          <div>
            <p className="l-eyebrow">Formation IA en entreprise — TPE, PME et ETI</p>
            <h1 className="l-d1">
              L’intelligence artificielle devient utile lorsqu’elle devient claire.
            </h1>
            <p className="l-lede">
              LucidIA forme vos dirigeants et vos équipes, révèle les usages à forte valeur et
              vous accompagne jusqu’au déploiement de solutions adaptées à vos métiers.
            </p>
            <div className="l-actions" style={{ marginTop: 34 }}>
              <Btn variant="1" onClick={() => go("formations")}>
                Découvrir nos formations
              </Btn>
              <Btn variant="2" onClick={() => go("contact")}>
                Échanger sur votre projet
              </Btn>
            </div>
          </div>
          <div className="l-hero-art">
            <HeroArt />
          </div>
        </div>
      </section>

      <section className="l-sec l-dark">
        <div className="l-wrap">
          <h2 className="l-d2" style={{ maxWidth: "26ch", marginBottom: 48 }}>
            De la compréhension aux premiers usages. Des premiers usages à la transformation.
          </h2>
          <Etapes />
        </div>
      </section>

      <section className="l-sec">
        <div className="l-wrap">
          <SectionIntro
            eyebrow="Trois publics, trois réponses"
            titre="Le même sujet ne s’aborde pas de la même façon selon qui écoute."
            texte="Un comité de direction cherche une direction. Une équipe métier cherche des gestes utiles dès lundi. Une équipe de transformation cherche des cas d’usage qui tiennent."
          />
          <div className="l-grid l-g3">
            {PUBLICS_HOME.map((p) => (
              <article className="l-pub" key={p.titre}>
                <h3 className="l-d3">{p.titre}</h3>
                <p>{p.texte}</p>
                <button
                  className="l-btn l-btn-3"
                  onClick={() => go(p.lien.page, p.lien.filtre ? { filtre: p.lien.filtre } : {})}
                >
                  {p.lienLabel}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="l-sec l-pale">
        <div className="l-wrap">
          <SectionIntro
            eyebrow="Catalogue"
            titre="Douze formations, ajustées à votre contexte avant chaque intervention."
            texte="Filtrez selon le public, la durée, le niveau et la thématique. Chaque programme est ensuite adapté à vos métiers et aux outils autorisés dans votre entreprise."
          />
          <Filtres f={f} set={set} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "36px 0 18px", gap: 20, flexWrap: "wrap" }}>
            <p className="l-count l-count-res">
              {resultats.length} formation{resultats.length > 1 ? "s" : ""} correspondent
              {resultats.length > 6 ? " — six affichées" : ""}
            </p>
            <button className="l-btn l-btn-3" onClick={() => go("formations")}>
              Voir tout le catalogue
            </button>
          </div>
          <GrilleFormations liste={resultats.slice(0, 6)} go={go} />
        </div>
      </section>

      <section className="l-sec">
        <div className="l-wrap">
          <div className="l-grid l-g2" style={{ alignItems: "center", marginBottom: 48 }}>
            <h2 className="l-d2">Le bon outil est celui qui répond au bon usage.</h2>
            <div>
              <p className="l-txt">
                LucidIA n’est lié à aucun éditeur et n’a aucun accord commercial avec un
                fournisseur de solution. Nous formons et accompagnons sur les outils qui
                correspondent à votre besoin réel, y compris ceux déjà déployés chez vous.
              </p>
              <p className="l-small" style={{ marginTop: 14 }}>
                Nous ne sommes ni partenaire ni certifié par ces éditeurs. Les noms cités le sont à
                titre informatif.
              </p>
            </div>
          </div>
          <Marquee />
        </div>
      </section>

      <section className="l-sec-tight l-dark" style={{ paddingTop: 20, paddingBottom: 56 }}>
        <div className="l-wrap">
          <SignatureAnimee />
        </div>
      </section>

      <section className="l-sec l-pale">
        <div className="l-wrap">
          <SectionIntro
            eyebrow="Méthode"
            titre="Quatre temps, toujours dans le même ordre."
            texte="Cette séquence structure aussi bien une demi-journée d’acculturation qu’un accompagnement de plusieurs mois."
            action={
              <button className="l-btn l-btn-3" onClick={() => go("methode")}>
                Notre méthode en détail
              </button>
            }
          />
          <div className="l-meth">
            {METHODE.map((m) => (
              <div className="l-meth-i" key={m.verbe}>
                <p className="l-meth-v">{m.verbe}</p>
                <p className="l-small" style={{ color: "var(--gris-1)" }}>{m.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="l-sec">
        <div className="l-wrap">
          <SectionIntro
            eyebrow="Fondateurs"
            titre="La recherche rencontre le terrain."
            texte="LucidIA est né d’une conviction : les entreprises n’ont pas besoin de promesses supplémentaires sur l’IA. Elles ont besoin de repères solides, d’expériences concrètes et d’interlocuteurs capables de relier les avancées technologiques à la réalité du travail."
          />
          <Fondateurs />
        </div>
      </section>

      <section className="l-sec l-pale">
        <div className="l-wrap">
          <div className="l-grid l-g2" style={{ alignItems: "end", marginBottom: 32 }}>
            <div>
              <p className="l-eyebrow">Nos intentions</p>
              <h2 className="l-d2" style={{ marginTop: 14 }}>
                Ce que nous voulons faire, et jusqu’où.
              </h2>
            </div>
            <p className="l-txt">
              Deux prises de parole courtes, muettes et sous-titrées : d’où vient ce cabinet, et
              ce qu’il cherche à changer dans les entreprises qu’il accompagne.
            </p>
          </div>
          <Messages emplacement="accueil" />
        </div>
      </section>

      <section className="l-sec l-dark">
        <div className="l-wrap">
          <CarteFrance go={go} />
        </div>
      </section>

      <CtaFinal go={go} />
    </>
  );
}

/* ─────────── LECTEUR DE MESSAGE SOUS-TITRÉ ─────────── */
function LecteurMessage({ msg }) {
  const reduit = useMouvementReduit();
  const [i, setI] = useState(0);
  const [t, setT] = useState(0);
  const [joue, setJoue] = useState(false);
  const lignes = msg.lignes;
  const total = lignes.reduce((a, l) => a + l.d, 0);
  const ic = Math.min(i, lignes.length - 1);

  useEffect(() => {
    if (reduit) {
      setI(lignes.length - 1);
      setT(lignes[lignes.length - 1].d);
      setJoue(false);
    } else {
      setI(0);
      setT(0);
      setJoue(true);
    }
  }, [msg.id, reduit, lignes]);

  useEffect(() => {
    if (!joue) return;
    const id = setInterval(() => {
      setT((prec) => {
        const d = lignes[ic].d;
        if (prec + 80 >= d) {
          if (ic < lignes.length - 1) {
            setI(ic + 1);
            return 0;
          }
          setJoue(false);
          return d;
        }
        return prec + 80;
      });
    }, 80);
    return () => clearInterval(id);
  }, [joue, ic, lignes]);

  const ligne = lignes[ic];
  const avance = lignes.slice(0, ic).reduce((a, l) => a + l.d, 0) + t;
  const seconde = (ms) => {
    const x = Math.round(ms / 1000);
    return String(Math.floor(x / 60)) + ":" + String(x % 60).padStart(2, "0");
  };

  const visuel = () => {
    const [genre, valeur] = ligne.visuel.split(":");
    if (genre === "icone")
      return (
        <span className="l-msg-vis" key={ic}>
          <Icone id={valeur} />
        </span>
      );
    if (genre === "mot")
      return (
        <span className="l-msg-vis" key={ic}>
          <span className="l-msg-vis-mot">{valeur}</span>
        </span>
      );
    return (
      <span className="l-msg-vis" key={ic}>
        <span className="l-msg-vis-logo">
          Lucid<span>IA</span>
        </span>
      </span>
    );
  };

  return (
    <div>
      {msg.video ? (
        <Video url={msg.video} titre={msg.titre} />
      ) : (
        <>
          <div className="l-msg-scene">
            {msg.photo() && (
              <img className="l-msg-portrait" src={msg.photo()} alt={"Portrait de " + msg.auteur} />
            )}
            <span className="l-msg-auteur">
              {msg.auteur} — {msg.role}
            </span>
            <span className="l-msg-logo" aria-hidden="true">
              Lucid<span>IA</span>
            </span>
            {visuel()}
            <p className="l-msg-st">{ligne.t}</p>
          </div>
          <div className="l-demo-foot" style={{ border: "1px solid var(--ligne)", borderTop: 0 }}>
            <div className="l-barre" role="presentation">
              <i style={{ width: Math.min(100, (avance / total) * 100) + "%" }} />
            </div>
            <div className="l-demo-ctrl">
              <button
                className="l-chap"
                onClick={() => {
                  setI(0);
                  setT(0);
                  setJoue(true);
                }}
              >
                Revoir
              </button>
              <button className="l-chap" onClick={() => setJoue((v) => !v)}>
                {joue ? "Pause" : "Reprendre"}
              </button>
              <span className="l-count" style={{ marginLeft: 4 }}>
                {seconde(avance)} / {seconde(total)}
              </span>
              <span style={{ flex: 1 }} />
              <span className="l-illus">Muet et sous-titré</span>
            </div>
          </div>
        </>
      )}

      <details className="l-msg-trans">
        <summary className="l-btn l-btn-3" style={{ cursor: "pointer" }}>
          Lire la transcription complète
        </summary>
        <ul style={{ marginTop: 14 }}>
          {lignes.map((l, k) => (
            <li key={k} className={k === ic && !msg.video ? "l-msg-trans-on" : ""}>
              <b>{seconde(lignes.slice(0, k).reduce((a, x) => a + x.d, 0))}</b>
              <span>{l.t}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

/* ─────────── SECTION : DEUX MESSAGES ─────────── */
function Messages({ emplacement }) {
  const liste = MESSAGES.filter((m) => m.emplacement === emplacement);
  const [sel, setSel] = useState(liste[0].id);
  const msg = liste.find((m) => m.id === sel) || liste[0];
  return (
    <div>
      <div className="l-msg-grille">
        {liste.map((m) => (
          <button
            key={m.id}
            className={"l-msg-aff " + (m.id === sel ? "l-msg-aff-on" : "")}
            onClick={() => setSel(m.id)}
            aria-pressed={m.id === sel}
          >
            {m.photo() ? (
              <img className="l-msg-vig" src={m.photo()} alt="" />
            ) : (
              <span className="l-msg-vig" />
            )}
            <span className="l-msg-aff-txt">
              <span className="l-demo-i-f">{m.auteur}</span>
              <span className="l-msg-aff-t">{m.titre}</span>
              <span className="l-small">
                {Math.round(m.lignes.reduce((a, l) => a + l.d, 0) / 1000)} secondes — muet,
                sous-titré
              </span>
              <span className="l-msg-lire">
                <i aria-hidden="true">▶</i>
                {m.id === sel ? "En lecture" : "Lire ce message"}
              </span>
            </span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <LecteurMessage key={msg.id} msg={msg} />
      </div>
    </div>
  );
}

/* ─────────── PAGE : CATALOGUE ─────────── */
function PageFormations({ go, filtreInitial }) {
  const [f, set] = useState({ ...FILTRE_VIDE, public: filtreInitial || "" });
  const [faq, setFaq] = useState(null);
  const resultats = useMemo(() => filtrer(FORMATIONS, f), [f]);
  const actifs = ["public", "format", "niveau", "theme"].filter((k) => f[k]).length + (f.q ? 1 : 0);

  return (
    <>
      <section className="l-sec" style={{ paddingTop: 132 }}>
        <div className="l-wrap">
          <p className="l-eyebrow">Catalogue de formations</p>
          <h1 className="l-d1" style={{ margin: "16px 0 22px", maxWidth: "20ch" }}>
            Des formations qui partent de vos besoins d’entreprise et métiers.
          </h1>
          <p className="l-lede">
            Douze programmes construits pour les TPE, PME et ETI, du premier contact avec l’IA
            générative jusqu’au prototypage de cas d’usage. Chacun est ajusté après un entretien de
            cadrage.
          </p>
        </div>
      </section>

      <section className="l-sec-tight" style={{ paddingTop: 0, paddingBottom: 72 }}>
        <div className="l-wrap">
          <div className="l-grid l-g2" style={{ alignItems: "end", marginBottom: 28 }}>
            <div>
              <p className="l-eyebrow">En deux messages</p>
              <h2 className="l-d2" style={{ marginTop: 14 }}>
                Pourquoi se former, et pourquoi avec nous.
              </h2>
            </div>
            <p className="l-txt">
              Deux prises de parole courtes, muettes et sous-titrées : elles se regardent en
              réunion, sans casque et sans déranger personne.
            </p>
          </div>
          <Messages emplacement="formations" />
        </div>
      </section>

      <section className="l-sec-tight l-pale">
        <div className="l-wrap">
          <Filtres f={f} set={set} avecRecherche />
          <div style={{ display: "flex", gap: 20, alignItems: "baseline", marginTop: 26, flexWrap: "wrap" }}>
            <p className="l-count l-count-res">
              {resultats.length} formation{resultats.length > 1 ? "s" : ""}
            </p>
            {actifs > 0 && (
              <button className="l-btn l-btn-3" onClick={() => set(FILTRE_VIDE)}>
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="l-sec-tight l-pale" style={{ paddingTop: 0 }}>
        <div className="l-wrap">
          <GrilleFormations liste={resultats} go={go} />
        </div>
      </section>

      <section className="l-sec">
        <div className="l-wrap l-grid l-g2" style={{ alignItems: "start" }}>
          <div>
            <p className="l-eyebrow">Sur mesure</p>
            <h2 className="l-d2" style={{ margin: "14px 0 20px" }}>
              Aucun de ces programmes ne correspond exactement ?
            </h2>
            <p className="l-txt">
              C’est fréquent, et c’est prévu. Nous construisons des formations à la demande en
              partant de vos métiers, de vos outils et du niveau réel de vos équipes. Les douze
              programmes du catalogue servent alors de matière première plutôt que de cadre.
            </p>
            <div className="l-actions" style={{ marginTop: 28 }}>
              <Btn variant="1" onClick={() => go("contact", { prefill: "Formation sur mesure" })}>
                Construire une formation sur mesure
              </Btn>
              <Btn variant="2" onClick={() => go("contact", { prefill: "Demande de devis" })}>
                Demander un devis
              </Btn>
            </div>
          </div>
          <div>
            <h2 className="l-d3" style={{ marginBottom: 8 }}>Questions fréquentes</h2>
            <div style={{ marginTop: 18 }}>
              {FAQ.map((item, i) => (
                <div className={"l-acc " + (faq === i ? "l-acc-on" : "")} key={i}>
                  <button
                    className="l-acc-q"
                    onClick={() => setFaq(faq === i ? null : i)}
                    aria-expanded={faq === i}
                  >
                    {item.q}
                  </button>
                  {faq === i && <p className="l-acc-r">{item.r}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaFinal go={go} />
    </>
  );
}

/* ─────────── PAGE : FICHE FORMATION ─────────── */
function PageFiche({ go, id }) {
  const f = FORMATIONS.find((x) => x.id === id);
  /* Les objectifs sélectionnés par le lecteur sont repris dans le formulaire
     de contact : la liste devient un outil de cadrage, pas un affichage. */
  const [prios, setPrios] = useState([]);
  const [mods, setMods] = useState([0]);
  const basculer = (t) =>
    setPrios((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]));
  const basculerMod = (i) =>
    setMods((v) => (v.includes(i) ? v.filter((x) => x !== i) : [...v, i]));
  if (!f)
    return (
      <section className="l-sec" style={{ paddingTop: 140 }}>
        <div className="l-wrap">
          <h1 className="l-d2">Cette formation n’existe pas ou plus.</h1>
          <p className="l-lede" style={{ margin: "18px 0 28px" }}>
            Le catalogue complet reste accessible.
          </p>
          <Btn variant="1" onClick={() => go("formations")}>
            Voir le catalogue
          </Btn>
        </div>
      </section>
    );

  const proches = FORMATIONS.filter(
    (x) => x.id !== f.id && x.themes.some((t) => f.themes.includes(t))
  ).slice(0, 3);

  return (
    <>
      <section className="l-sec" style={{ paddingTop: 124, paddingBottom: 48 }}>
        <div className="l-wrap">
          <button className="l-back" onClick={() => go("formations")}>
            ← Catalogue
          </button>
          <p className="l-eyebrow" style={{ marginTop: 28 }}>
            {f.themes.slice(0, 3).map((t) => LABEL(THEMES, t)).join(" · ")}
          </p>
          <h1 className="l-d1" style={{ margin: "14px 0 22px", maxWidth: "22ch" }}>
            {f.titre}
          </h1>
          <p className="l-lede">{f.promesse}</p>
        </div>
      </section>

      <section className="l-sec-tight" style={{ paddingTop: 0, paddingBottom: 96 }}>
        <div className="l-wrap l-fiche">
          <div>
            <h2 className="l-d3">Objectifs pédagogiques</h2>
            <p className="l-small" style={{ marginTop: 10 }}>
              Sélectionnez ceux qui comptent le plus pour vous : ils seront repris dans votre
              demande et orienteront l’adaptation du programme.
            </p>
            <ListeChoix items={f.objectifs} selection={prios} onToggle={basculer} />
            {prios.length > 0 && (
              <div className="l-pick-bar" aria-live="polite">
                <span>
                  {prios.length} objectif{prios.length > 1 ? "s" : ""} retenu
                  {prios.length > 1 ? "s" : ""} sur {f.objectifs.length}
                </span>
                <button className="l-btn l-btn-3" onClick={() => setPrios([])}>
                  Tout désélectionner
                </button>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 20,
                margin: "56px 0 8px",
                flexWrap: "wrap",
              }}
            >
              <h2 className="l-d3">Programme</h2>
              <button
                className="l-btn l-btn-3"
                onClick={() =>
                  setMods(mods.length === f.programme.length ? [] : f.programme.map((_, i) => i))
                }
              >
                {mods.length === f.programme.length ? "Tout replier" : "Tout déplier"}
              </button>
            </div>
            {f.programme.map((m, i) => {
              const ouvert = mods.includes(i);
              return (
                <div
                  className={"l-mod-bloc " + (ouvert ? "l-mod-ouvert" : "")}
                  key={m.titre}
                  style={{ borderTop: "1px solid var(--ligne)" }}
                >
                  <button className="l-mod-b" onClick={() => basculerMod(i)} aria-expanded={ouvert}>
                    <span className="l-mod-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="l-mod-t">{m.titre}</span>
                    <span className="l-mod-chev" aria-hidden="true" />
                  </button>
                  {ouvert && (
                    <div className="l-mod-corps">
                      <Liste items={m.points} style={{ marginTop: 0 }} />
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ marginTop: 56 }}>
              <h2 className="l-d3">Modalités pédagogiques</h2>
              <Liste items={f.modalites} style={{ marginTop: 18 }} />
            </div>

            <div style={{ marginTop: 48 }}>
              <h2 className="l-d3">Livrables remis aux participants</h2>
              <Liste items={f.livrables} style={{ marginTop: 18 }} />
            </div>

            {DEMOS.filter((d) => d.formation === f.id).length > 0 && (
              <div style={{ marginTop: 48 }}>
                <h2 className="l-d3" style={{ marginBottom: 6 }}>
                  Démonstrations liées à cette formation
                </h2>
                <p className="l-small" style={{ marginBottom: 14 }}>
                  Séquences jouées étape par étape, reconstituées pour l’exemple.
                </p>
                <div className="l-demo-liste">
                  {DEMOS.filter((d) => d.formation === f.id).map((d) => (
                    <button
                      key={d.id}
                      className="l-demo-i"
                      onClick={() => go("demonstrations", { id: d.id })}
                    >
                      <span className="l-demo-i-f">
                        {d.fonction} · {MOTIFS.find((m) => m.id === d.motif).label}
                      </span>
                      <span className="l-demo-i-t">{d.titre}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="l-note" style={{ marginTop: 48 }}>
              <p className="l-small">
                Les contenus sont personnalisés selon les métiers des participants, les outils
                autorisés par l’entreprise et les situations professionnelles rencontrées. Le
                programme ci-dessus est une base, précisée lors de l’entretien de cadrage.
              </p>
            </div>
          </div>

          <aside className="l-aside">
            <div className="l-aside-row">
              <span className="l-aside-k">Public visé</span>
              <span>{f.publics.map((p) => LABEL(PUBLICS, p)).join(", ")}</span>
            </div>
            <div className="l-aside-row">
              <span className="l-aside-k">Niveau</span>
              <span>{LABEL(NIVEAUX, f.niveau)}</span>
            </div>
            <div className="l-aside-row">
              <span className="l-aside-k">Durée indicative</span>
              <span>{f.duree}</span>
            </div>
            <div className="l-aside-row">
              <span className="l-aside-k">Nombre de participants</span>
              <span>{f.participants}</span>
            </div>
            <div className="l-aside-row">
              <span className="l-aside-k">Prérequis</span>
              <span>{f.prerequis}</span>
            </div>
            <div className="l-aside-row">
              <span className="l-aside-k">Outils pouvant être mobilisés</span>
              <span>{f.outils.join(", ")}</span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <Btn
                variant="1"
                onClick={() =>
                  go("contact", {
                    prefill: "Formation sur mesure",
                    formation: f.titre,
                    objectifs: prios,
                  })
                }
              >
                Adapter cette formation à mon entreprise
              </Btn>
              <Btn
                variant="2"
                onClick={() =>
                  go("contact", { prefill: "Demande de devis", formation: f.titre, objectifs: prios })
                }
              >
                Demander un devis
              </Btn>
            </div>
          </aside>
        </div>
      </section>

      {proches.length > 0 && (
        <section className="l-sec l-pale">
          <div className="l-wrap">
            <h2 className="l-d3" style={{ marginBottom: 28 }}>Formations proches</h2>
            <GrilleFormations liste={proches} go={go} />
          </div>
        </section>
      )}

      <CtaFinal go={go} />
    </>
  );
}

/* ─────────── PAGE : ACCOMPAGNEMENT ─────────── */
function PageAccompagnement({ go }) {
  const [ouvert, setOuvert] = useState("diagnostic");
  return (
    <>
      <section className="l-sec" style={{ paddingTop: 132 }}>
        <div className="l-wrap">
          <p className="l-eyebrow">Accompagnement IA</p>
          <h1 className="l-d1" style={{ margin: "16px 0 22px", maxWidth: "22ch" }}>
            Après la compréhension vient le travail de tri.
          </h1>
          <p className="l-lede">
            Une fois les équipes formées, les idées d’usages affluent. L’accompagnement sert à
            distinguer celles qui créeront de la valeur de celles qui coûteront du temps, puis à
            installer les premières dans les pratiques.
          </p>
        </div>
      </section>

      <section className="l-sec-tight" style={{ paddingTop: 0 }}>
        <div className="l-wrap">
          {ACCOMPAGNEMENT.map((o, i) => (
            <article key={o.id} style={{ borderTop: "1px solid var(--ligne)", padding: "34px 0" }}>
              <div className="l-grid l-g2" style={{ alignItems: "start", gap: 40 }}>
                <div>
                  <span className="l-mod-n">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="l-d3" style={{ margin: "10px 0 10px" }}>{o.titre}</h2>
                  <p className="l-txt" style={{ color: "var(--gris-2)" }}>{o.resume}</p>
                  <button
                    className="l-btn l-btn-3"
                    style={{ marginTop: 16 }}
                    onClick={() => setOuvert(ouvert === o.id ? null : o.id)}
                    aria-expanded={ouvert === o.id}
                  >
                    {ouvert === o.id ? "Réduire" : "En savoir plus"}
                  </button>
                </div>
                <div>
                  {ouvert === o.id && (
                    <>
                      <p className="l-txt">{o.texte}</p>
                      <h3 className="l-aside-k" style={{ marginTop: 22 }}>Ce que vous recevez</h3>
                      <Liste items={o.livrables} style={{ marginTop: 10 }} />
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="l-sec l-pale">
        <div className="l-wrap">
          <SectionIntro
            eyebrow="Priorisation"
            titre="Impact potentiel et facilité de mise en œuvre."
            texte="Chaque cas d’usage est positionné sur ces deux axes avant toute décision. Les exemples ci-dessous sont des illustrations génériques : ils ne proviennent d’aucun client et leur position varie fortement selon l’entreprise."
          />
          <div className="l-grid l-g2" style={{ gap: 56, alignItems: "stretch" }}>
            <figure className="l-mx-figure">
              <div className="l-mx-wrap">
                <p className="l-mx-ax l-mx-yax">Impact potentiel</p>
                <div className="l-matrice">
                  {MATRICE.map((m) => (
                    <div
                      className={"l-mx-pt l-mx-" + m.cote}
                      key={m.nom}
                      style={{
                        left: 7 + m.facilite * 86 + "%",
                        bottom: 8 + m.impact * 84 + "%",
                      }}
                    >
                      <span className="l-mx-dot" />
                      <span className="l-mx-lab" style={{ top: -12 + m.nudge }}>
                        {m.nom}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <figcaption className="l-mx-ax" style={{ marginTop: 10, paddingLeft: 34 }}>
                Facilité de mise en œuvre
              </figcaption>
            </figure>
            <div style={{ display: "grid", gap: 22, alignContent: "center" }}>
              <div>
                <h3 className="l-d4">En haut à droite : on commence ici</h3>
                <p className="l-small" style={{ color: "var(--gris-1)" }}>
                  Valeur plausible, mise en œuvre rapide, risque maîtrisé. Ces cas servent à
                  installer la confiance des équipes.
                </p>
              </div>
              <div>
                <h3 className="l-d4">En haut à gauche : on cadre avant d’agir</h3>
                <p className="l-small" style={{ color: "var(--gris-1)" }}>
                  Potentiel élevé mais dépendances fortes : données, intégration, conformité.
                  Ces cas exigent un projet, pas une expérimentation improvisée.
                </p>
              </div>
              <div>
                <h3 className="l-d4">En bas : on assume de ne pas y aller</h3>
                <p className="l-small" style={{ color: "var(--gris-1)" }}>
                  Écarter un usage est une décision utile. Elle libère du temps pour les chantiers
                  qui comptent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="l-sec">
        <div className="l-wrap l-grid l-g2" style={{ alignItems: "center" }}>
          <h2 className="l-d2">
            L’accompagnement fonctionne mieux lorsque les équipes ont déjà été formées.
          </h2>
          <div>
            <p className="l-txt">
              Une équipe qui a manipulé ces outils sait décrire ce qu’elle en attend. Nous
              recommandons donc souvent de commencer par une acculturation courte, puis
              d’enchaîner sur le diagnostic.
            </p>
            <div className="l-actions" style={{ marginTop: 26 }}>
              <Btn variant="1" onClick={() => go("formations")}>
                Découvrir nos formations
              </Btn>
              <Btn variant="2" onClick={() => go("contact", { prefill: "Diagnostic des pratiques et des besoins" })}>
                Échanger sur votre projet IA
              </Btn>
            </div>
          </div>
        </div>
      </section>

      <CtaFinal go={go} />
    </>
  );
}

/* ─────────── PAGE : NOTRE MÉTHODE ─────────── */
function PageMethode({ go }) {
  return (
    <>
      <section className="l-sec" style={{ paddingTop: 132 }}>
        <div className="l-wrap">
          <p className="l-eyebrow">Notre méthode</p>
          <h1 className="l-d1" style={{ margin: "16px 0 22px", maxWidth: "22ch" }}>
            Ce qui fait la différence n’est pas le contenu, c’est le chemin.
          </h1>
          <p className="l-lede">
            Les notions sur l’IA générative sont largement disponibles. Ce qui manque, c’est le
            passage de la notion au geste professionnel. Toute notre méthode tient dans ce passage.
          </p>
        </div>
      </section>

      <section className="l-sec-tight" style={{ paddingTop: 0 }}>
        <div className="l-wrap l-meth">
          {METHODE.map((m) => (
            <div className="l-meth-i" key={m.verbe}>
              <p className="l-meth-v">{m.verbe}</p>
              <p className="l-small" style={{ color: "var(--gris-1)" }}>{m.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-sec l-pale">
        <div className="l-wrap">
          <SectionIntro
            eyebrow="La différence LucidIA"
            titre="Huit principes que nous appliquons sans exception."
            texte="Ils sont exigeants pour nous : chacun demande du travail avant, pendant et après l’intervention. Sélectionnez un principe pour voir ce qu’il donne en pratique."
          />
          <Principes />
        </div>
      </section>

      <section className="l-sec">
        <div className="l-wrap">
          <SectionIntro
            eyebrow="Déroulé"
            titre="Une intervention ne se limite jamais au temps passé dans la salle."
            texte="Le travail de préparation et de suivi représente une part importante de la valeur produite."
          />
          <div className="l-frise">
            {FRISE.map((t) => (
              <div className="l-frise-i" key={t.temps}>
                <p className="l-frise-t">{t.temps}</p>
                <div className="l-frise-line" />
                <Liste items={t.points} style={{ marginTop: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaFinal go={go} />
    </>
  );
}

/* ─────────── PAGE : À PROPOS ─────────── */
function PageApropos({ go }) {
  return (
    <>
      <section className="l-sec" style={{ paddingTop: 132 }}>
        <div className="l-wrap">
          <p className="l-eyebrow">À propos</p>
          <h1 className="l-d1" style={{ margin: "16px 0 22px", maxWidth: "20ch" }}>
            La recherche rencontre le terrain.
          </h1>
          <p className="l-lede">
            LucidIA est né d’une conviction : les entreprises n’ont pas besoin de promesses
            supplémentaires sur l’IA. Elles ont besoin de repères solides, d’expériences concrètes
            et d’interlocuteurs capables de relier les avancées technologiques à la réalité du
            travail.
          </p>
        </div>
      </section>

      <section className="l-sec-tight" style={{ paddingTop: 0 }}>
        <div className="l-wrap l-grid l-g2" style={{ gap: 56, alignItems: "start" }}>
          <div>
            <h2 className="l-d3" style={{ marginBottom: 14 }}>L’origine</h2>
            <p className="l-txt">
              Nous avons passé ces dernières années à observer les mêmes scènes se répéter : des
              dirigeants sollicités de toutes parts sur l’IA sans jamais obtenir de réponse claire,
              des équipes qui utilisent ces outils en cachette faute de cadre, des projets lancés
              sur une promesse et abandonnés six mois plus tard. Entre le discours technologique et
              la réalité du travail, il manquait un travail de traduction. LucidIA fait ce travail.
            </p>
          </div>
          <div>
            <h2 className="l-d3" style={{ marginBottom: 14 }}>Deux regards complémentaires</h2>
            <p className="l-txt">
              La recherche apporte la distance, la méthode et la capacité à distinguer un résultat
              établi d’une affirmation commerciale. Le conseil apporte la connaissance des
              contraintes réelles : les délais, les arbitrages, les systèmes en place, les
              résistances légitimes. Nos interventions tiennent parce qu’elles sont conçues avec
              les deux.
            </p>
          </div>
        </div>
      </section>

      <section className="l-sec l-pale">
        <div className="l-wrap">
          <h2 className="l-d2" style={{ marginBottom: 48, maxWidth: "24ch" }}>
            Les fondateurs
          </h2>
          <Fondateurs complet />
        </div>
      </section>

      <section className="l-sec">
        <div className="l-wrap">
          <SectionIntro
            eyebrow="Valeurs"
            titre="Ce à quoi nous nous tenons."
            texte="Ces principes déterminent aussi ce que nous refusons de faire."
          />
          <div className="l-grid l-g2" style={{ gap: "32px 56px" }}>
            {VALEURS.map((v) => (
              <div key={v.titre} style={{ borderTop: "1px solid var(--ligne)", paddingTop: 16 }}>
                <h3 className="l-d4" style={{ marginBottom: 6 }}>{v.titre}</h3>
                <p className="l-small" style={{ color: "var(--gris-1)" }}>{v.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="l-sec l-dark">
        <div className="l-wrap">
          <p className="l-eyebrow">Notre vision</p>
          <h2 className="l-d2" style={{ margin: "16px 0 24px", maxWidth: "26ch" }}>
            Une IA comprise, choisie et maîtrisée par les entreprises.
          </h2>
          <p className="l-lede">
            Nous ne pensons pas que l’IA s’imposera d’elle-même aux organisations, ni qu’elle
            résoudra leurs difficultés structurelles. Nous pensons que les entreprises qui
            comprendront ces systèmes choisiront où les employer, à quelles conditions et sous quel
            contrôle. Les autres subiront les choix faits ailleurs. Notre travail consiste à mettre
            les premières en position de décider.
          </p>
          <div className="l-actions" style={{ marginTop: 36 }}>
            <Btn variant="2" onClick={() => go("contact")}>
              Échanger sur votre projet
            </Btn>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────── PAGE : RESSOURCES ─────────── */
function PageRessources({ go }) {
  return (
    <>
      <section className="l-sec" style={{ paddingTop: 132 }}>
        <div className="l-wrap">
          <p className="l-eyebrow">Ressources</p>
          <h1 className="l-d1" style={{ margin: "16px 0 22px", maxWidth: "22ch" }}>
            Des repères écrits, à lire avant de décider.
          </h1>
          <p className="l-lede">
            Articles et guides destinés aux dirigeants et aux responsables qui doivent trancher
            sans être spécialistes du sujet. Les premiers textes sont en cours de rédaction.
          </p>
        </div>
      </section>

      <section className="l-sec-tight" style={{ paddingTop: 0 }}>
        <div className="l-wrap">
          <div className="l-grid l-g3">
            {ARTICLES.map((a) => (
              <article className="l-art" key={a.titre}>
                <span className="l-badge">À rédiger — {a.theme}</span>
                <h2 className="l-d4">{a.titre}</h2>
                <p className="l-small" style={{ color: "var(--gris-1)" }}>{a.angle}</p>
                <p className="l-small" style={{ marginTop: "auto", paddingTop: 14 }}>
                  Publication à venir
                </p>
              </article>
            ))}
          </div>
          <div className="l-note" style={{ marginTop: 40 }}>
            <p className="l-small">
              Ces six cartes sont des emplacements éditoriaux. Les contenus restent à écrire : nous
              ne publions ni statistique ni source que nous n’avons pas vérifiée.
            </p>
          </div>
        </div>
      </section>

      <section className="l-sec l-pale">
        <div className="l-wrap l-grid l-g2" style={{ alignItems: "center" }}>
          <div>
            <h2 className="l-d2" style={{ marginBottom: 14 }}>Lettre de veille</h2>
            <p className="l-txt">
              Une sélection commentée de ce qui compte réellement pour les entreprises, sans
              actualité de produit. Fréquence mensuelle prévue.
            </p>
          </div>
          <div>
            {/* Inscription désactivée : aucun service d’envoi n’est connecté.
                Brancher ici le formulaire du prestataire d’emailing. */}
            <div className="l-field">
              <label htmlFor="veille">Adresse électronique professionnelle</label>
              <input id="veille" type="email" placeholder="Bientôt disponible" disabled />
            </div>
            <Btn variant="1" disabled style={{ marginTop: 16 }}>
              Inscription prochainement
            </Btn>
            <p className="l-small" style={{ marginTop: 12 }}>
              En attendant, écrivez-nous : nous vous ajouterons à la première édition.{" "}
              <button className="l-btn l-btn-3" onClick={() => go("contact", { prefill: "Autre sujet" })}>
                Nous contacter
              </button>
            </p>
          </div>
        </div>
      </section>

      <CtaFinal go={go} />
    </>
  );
}

/* ─────────── LECTEUR DE DÉMONSTRATION ───────────
   Joue une séquence d'étapes décrite dans DEMOS. Si `demo.video` est
   renseigné, le lecteur affiche la vraie capture à la place de l'animation. */

function useMouvementReduit() {
  const [reduit, setReduit] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduit(mq.matches);
    const h = () => setReduit(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", h) : mq.addListener(h);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", h) : mq.removeListener(h));
  }, []);
  return reduit;
}

function Video({ url, titre }) {
  const yt = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/);
  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (yt)
    return (
      <iframe
        className="l-video"
        src={"https://www.youtube-nocookie.com/embed/" + yt[1]}
        title={titre}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  if (vi)
    return (
      <iframe
        className="l-video"
        src={"https://player.vimeo.com/video/" + vi[1]}
        title={titre}
        loading="lazy"
        allowFullScreen
      />
    );
  return <video className="l-video" src={url} controls preload="metadata" title={titre} />;
}

function Lecteur({ demo }) {
  const reduit = useMouvementReduit();
  const [i, setI] = useState(0);
  const [t, setT] = useState(0);
  const [joue, setJoue] = useState(false);
  const etapes = demo.etapes;
  const total = etapes.reduce((a, e) => a + e.duree, 0);
  /* Garde-fou : si l'index dépasse la séquence courante (changement de
     démonstration après un saut d'étape), on le ramène dans les bornes
     plutôt que de lire etapes[i] à vide. */
  const ic = Math.min(i, etapes.length - 1);

  /* Au changement de démonstration : on rejoue, sauf si l'utilisateur a
     demandé à réduire les animations — dans ce cas tout est déjà affiché. */
  useEffect(() => {
    if (reduit) {
      setI(etapes.length - 1);
      setT(etapes[etapes.length - 1].duree);
      setJoue(false);
    } else {
      setI(0);
      setT(0);
      setJoue(true);
    }
  }, [demo.id, reduit, etapes]);

  useEffect(() => {
    if (!joue) return;
    const id = setInterval(() => {
      setT((prec) => {
        const d = etapes[ic].duree;
        if (prec + 60 >= d) {
          if (ic < etapes.length - 1) {
            setI(ic + 1);
            return 0;
          }
          setJoue(false);
          return d;
        }
        return prec + 60;
      });
    }, 60);
    return () => clearInterval(id);
  }, [joue, ic, etapes]);

  const avance = etapes.slice(0, ic).reduce((a, e) => a + e.duree, 0) + t;
  const p = Math.min(1, t / etapes[ic].duree);
  const part = (k) => (k < ic ? 1 : k === ic ? p : 0);
  const motif = MOTIFS.find((m) => m.id === demo.motif);

  const rejouer = () => {
    setI(0);
    setT(0);
    setJoue(true);
  };

  const rendu = (e, k) => {
    const f = part(k);
    if (f === 0) return null;
    const classe = "l-step " + (k < ic || (k === ic && f >= 1) ? "l-step-fait" : "l-step-cours");
    if (e.type === "saisie") {
      const n = Math.ceil(f * e.texte.length);
      return (
        <div key={k}>
          <p className="l-bloc-k">{e.label}</p>
          <p className="l-prompt">
            {e.texte.slice(0, n)}
            {f < 1 && <span className="l-caret" aria-hidden="true" />}
          </p>
        </div>
      );
    }
    if (e.type === "etape")
      return (
        <div className={classe} key={k}>
          <span className="l-step-pt" />
          <span>
            <span className="l-step-t">{e.label}</span>
            <br />
            <span className="l-step-d">{e.texte}</span>
          </span>
        </div>
      );
    if (e.type === "recherche") {
      const n = Math.ceil(f * e.documents.length);
      return (
        <div key={k}>
          <p className="l-bloc-k">{e.label}</p>
          {e.documents.slice(0, n).map((d) => (
            <div className="l-doc" key={d.nom}>
              <span className="l-doc-pt" />
              <span>
                <span className="l-doc-n">{d.nom}</span>
                <br />
                <span className="l-doc-e">« {d.extrait} »</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    if (e.type === "tableau") {
      const n = Math.ceil(f * e.lignes.length);
      return (
        <div key={k}>
          <p className="l-bloc-k">{e.label}</p>
          <table className="l-tab">
            <thead>
              <tr>
                {e.entetes.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {e.lignes.slice(0, n).map((r) => (
                <tr key={r[0] + r[1]}>
                  {r.map((c, ci) => (
                    <td key={ci}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    const n = Math.ceil(f * e.lignes.length);
    return (
      <div key={k}>
        <p className="l-bloc-k">{e.label}</p>
        <ul className="l-sortie">
          {e.lignes.slice(0, n).map((l) => (
            <li key={l}>
              <span />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="l-demo">
      <div className="l-demo-head">
        <div className="l-demo-head-g">
          <span className="l-motif">{motif.label}</span>
          <span className="l-step-t">{demo.fonction}</span>
        </div>
        <span className="l-illus">{demo.video ? "Enregistrement" : "Illustration"}</span>
      </div>

      {demo.video ? (
        <Video url={demo.video} titre={demo.titre} />
      ) : (
        <>
          <div className="l-demo-body">{etapes.map(rendu)}</div>
          <div className="l-demo-foot">
            <div className="l-barre" role="presentation">
              <i style={{ width: Math.min(100, (avance / total) * 100) + "%" }} />
            </div>
            <div className="l-demo-ctrl">
              <button className="l-chap" onClick={rejouer}>
                Rejouer
              </button>
              <button className="l-chap" onClick={() => setJoue((v) => !v)}>
                {joue ? "Pause" : "Reprendre"}
              </button>
              <span style={{ flex: 1 }} />
              {etapes.map((e, k) => (
                <button
                  key={k}
                  className={"l-chap " + (k === ic ? "l-chap-on" : "")}
                  onClick={() => {
                    setI(k);
                    setT(e.duree);
                    setJoue(false);
                  }}
                  aria-label={"Étape " + (k + 1) + " : " + e.label}
                >
                  {k + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────── PAGE : DÉMONSTRATIONS ─────────── */
function PageDemos({ go, id }) {
  const depart = DEMOS.find((d) => d.id === id) || DEMOS[0];
  const [sel, setSel] = useState(depart.id);
  useEffect(() => setSel(depart.id), [depart.id]);
  const demo = DEMOS.find((d) => d.id === sel) || DEMOS[0];
  const motif = MOTIFS.find((m) => m.id === demo.motif);
  const formation = FORMATIONS.find((f) => f.id === demo.formation);

  return (
    <>
      <section className="l-sec" style={{ paddingTop: 132, paddingBottom: 40 }}>
        <div className="l-wrap">
          <p className="l-eyebrow">Démonstrations par fonction</p>
          <h1 className="l-d1" style={{ margin: "16px 0 22px", maxWidth: "22ch" }}>
            Voir ce que ces outils font, avant de décider ce qu’on leur confie.
          </h1>
          <p className="l-lede">
            Six situations de travail, une par fonction, jouées étape par étape : ce que l’on
            demande, ce que la machine fait, ce qu’elle produit, et où le contrôle humain
            intervient. Trois familles d’usages y sont distinguées — génération de texte,
            interrogation d’une base documentaire, agent enchaînant plusieurs actions.
          </p>
          <div className="l-note" style={{ marginTop: 26, maxWidth: "46em" }}>
            <p className="l-small">
              Ces séquences sont des reconstitutions d’interface produites pour l’exemple. Ce ne
              sont pas des enregistrements de sessions client, et les données affichées sont
              fictives. Nous préférons le dire plutôt que de laisser croire le contraire.
            </p>
          </div>
        </div>
      </section>

      <section className="l-sec-tight" style={{ paddingTop: 0, paddingBottom: 80 }}>
        <div className="l-wrap l-demo-grille">
          <div>
            <p className="l-flabel">Choisir une fonction</p>
            <div className="l-demo-liste">
              {DEMOS.map((d) => (
                <button
                  key={d.id}
                  className={"l-demo-i " + (d.id === sel ? "l-demo-i-on" : "")}
                  onClick={() => setSel(d.id)}
                  aria-pressed={d.id === sel}
                >
                  <span className="l-demo-i-f">{d.fonction}</span>
                  <span className="l-demo-i-t">{d.titre}</span>
                  <span className="l-small">{MOTIFS.find((m) => m.id === d.motif).label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="l-d3" style={{ marginBottom: 10 }}>{demo.titre}</h2>
            <p className="l-txt" style={{ marginBottom: 20 }}>{demo.promesse}</p>
            <p className="l-small" style={{ marginBottom: 20 }}>
              <strong style={{ color: "#fff", fontWeight: 600 }}>Situation</strong> — {demo.contexte}
            </p>
            <Lecteur key={demo.id} demo={demo} />

            <div className="l-grid l-g2" style={{ gap: 28, marginTop: 28 }}>
              <div>
                <p className="l-bloc-k">Ce que fait {motif.label}</p>
                <p className="l-small" style={{ color: "var(--gris-1)" }}>{motif.explication}</p>
              </div>
              <div>
                <p className="l-bloc-k">Point de contrôle humain</p>
                <p className="l-small" style={{ color: "var(--gris-1)" }}>{demo.controle}</p>
              </div>
            </div>

            <div className="l-actions" style={{ marginTop: 30 }}>
              {formation && (
                <Btn variant="1" onClick={() => go("formations", { id: formation.id })}>
                  La formation correspondante
                </Btn>
              )}
              <Btn
                variant="2"
                onClick={() => go("contact", { prefill: "Atelier métier", formation: demo.titre })}
              >
                Construire ce cas d’usage chez nous
              </Btn>
            </div>
          </div>
        </div>
      </section>

      <CtaFinal go={go} />
    </>
  );
}

/* ─────────── PAGE : CONTACT ───────────
   ENVOI.mode pilote ce qui se passe à la validation :
   • "mailto"     : ouvre le client de messagerie avec la demande déjà rédigée.
                    Aucun back-end nécessaire, le formulaire est utilisable en ligne.
   • "api"        : envoie la demande à ENVOI.endpoint (à renseigner).
   • "simulation" : affiche seulement la confirmation, sans rien transmettre. */
const ENVOI = {
  mode: "mailto",
  endpoint: "", // À COMPLÉTER si mode "api" — ex. "/api/contact"
};

/* ─────────── PAGE : CONTACT ─────────── */
const VIDE_FORM = {
  nom: "",
  entreprise: "",
  fonction: "",
  email: "",
  telephone: "",
  taille: "",
  ville: "",
  besoin: "",
  publicConcerne: "",
  participants: "",
  periode: "",
  message: "",
  consent: false,
};

function PageContact({ prefill, formation, objectifs }) {
  const [v, setV] = useState({
    ...VIDE_FORM,
    besoin: prefill || "",
    message:
      (formation
        ? "Nous souhaitons adapter la formation « " + formation + " » à notre contexte."
        : "") +
      (objectifs && objectifs.length
        ? "\n\nObjectifs prioritaires retenus :\n" + objectifs.map((o) => "— " + o).join("\n")
        : ""),
  });
  const [err, setErr] = useState({});
  const [envoye, setEnvoye] = useState(false);
  const champ = (k) => (e) =>
    setV({ ...v, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const valider = () => {
    const e = {};
    if (!v.nom.trim()) e.nom = "Indiquez votre prénom et votre nom.";
    if (!v.entreprise.trim()) e.entreprise = "Indiquez le nom de votre entreprise.";
    if (!v.fonction.trim()) e.fonction = "Indiquez votre fonction.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
      e.email = "Indiquez une adresse électronique valide.";
    if (!v.taille) e.taille = "Sélectionnez la taille de votre entreprise.";
    if (!v.besoin) e.besoin = "Sélectionnez le type de besoin.";
    if (!v.consent) e.consent = "Votre accord est nécessaire pour traiter la demande.";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const corps = () =>
    [
      "Prénom et nom : " + v.nom,
      "Entreprise : " + v.entreprise,
      "Fonction : " + v.fonction,
      "Adresse électronique : " + v.email,
      "Téléphone : " + (v.telephone || "non communiqué"),
      "Taille de l’entreprise : " + v.taille,
      "Ville ou région : " + (v.ville || "non précisée"),
      "Type de besoin : " + v.besoin,
      "Public concerné : " + (v.publicConcerne || "non précisé"),
      "Nombre de participants : " + (v.participants || "non précisé"),
      "Période souhaitée : " + (v.periode || "non précisée"),
      "",
      "Message :",
      v.message || "(aucun)",
    ].join("\n");

  const envoyer = async () => {
    if (!valider()) {
      const premier = document.querySelector(".l-field-err input, .l-field-err select, .l-check input");
      if (premier) premier.focus();
      return;
    }
    if (ENVOI.mode === "mailto") {
      const sujet = "Demande " + v.besoin + " — " + v.entreprise;
      window.location.href =
        "mailto:" + SITE.email +
        "?subject=" + encodeURIComponent(sujet) +
        "&body=" + encodeURIComponent(corps());
    } else if (ENVOI.mode === "api" && ENVOI.endpoint) {
      try {
        await fetch(ENVOI.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v),
        });
      } catch (e) {
        setErr({ ...err, envoi: "L’envoi a échoué. Écrivez-nous à " + SITE.email + "." });
        return;
      }
    }
    setEnvoye(true);
  };

  if (envoye)
    return (
      <section className="l-sec" style={{ paddingTop: 140, minHeight: "70vh" }}>
        <div className="l-wrap" style={{ maxWidth: 720 }}>
          <div className="l-ok" role="status">
            <h1 className="l-d3">Demande enregistrée</h1>
            <p>
              Merci {v.nom.split(" ")[0]}. Nous revenons vers vous sous deux jours ouvrés avec une
              proposition d’échange de trente minutes.
            </p>
            <p className="l-small">
              {ENVOI.mode === "mailto"
                ? "Votre messagerie s’est ouverte avec la demande déjà rédigée : il reste à l’envoyer. Si rien ne s’est passé, écrivez-nous directement à " + SITE.email + "."
                : ENVOI.mode === "api"
                ? "Demande transmise."
                : "Interface de démonstration : aucun message n’a été transmis, le service d’envoi reste à connecter."}
            </p>
          </div>
          <div className="l-actions" style={{ marginTop: 28 }}>
            <Btn variant="2" onClick={() => { setV(VIDE_FORM); setEnvoye(false); }}>
              Envoyer une autre demande
            </Btn>
          </div>
        </div>
      </section>
    );

  return (
    <>
      <section className="l-sec" style={{ paddingTop: 132, paddingBottom: 40 }}>
        <div className="l-wrap">
          <p className="l-eyebrow">Contact</p>
          <h1 className="l-d1" style={{ margin: "16px 0 22px", maxWidth: "20ch" }}>
            Parlons de votre situation, pas de la nôtre.
          </h1>
          <p className="l-lede">
            Décrivez votre besoin en quelques lignes. Nous répondons sous deux jours ouvrés et
            proposons un premier échange de trente minutes, sans engagement.
          </p>
        </div>
      </section>

      <section className="l-sec-tight" style={{ paddingTop: 0, paddingBottom: 96 }}>
        <div
          className="l-wrap l-grid l-g2"
          style={{ gap: 64, alignItems: "start", gridTemplateColumns: "minmax(0,1.55fr) minmax(0,.75fr)" }}
        >
          <div>
            <div className="l-form">
              <div className={"l-field " + (err.nom ? "l-field-err" : "")}>
                <label htmlFor="c-nom">Prénom et nom *</label>
                <input id="c-nom" value={v.nom} onChange={champ("nom")} autoComplete="name" />
                {err.nom && <span className="l-err">{err.nom}</span>}
              </div>
              <div className={"l-field " + (err.entreprise ? "l-field-err" : "")}>
                <label htmlFor="c-ent">Entreprise *</label>
                <input id="c-ent" value={v.entreprise} onChange={champ("entreprise")} autoComplete="organization" />
                {err.entreprise && <span className="l-err">{err.entreprise}</span>}
              </div>
              <div className={"l-field " + (err.fonction ? "l-field-err" : "")}>
                <label htmlFor="c-fonc">Fonction *</label>
                <input id="c-fonc" value={v.fonction} onChange={champ("fonction")} autoComplete="organization-title" />
                {err.fonction && <span className="l-err">{err.fonction}</span>}
              </div>
              <div className={"l-field " + (err.email ? "l-field-err" : "")}>
                <label htmlFor="c-mail">Adresse électronique professionnelle *</label>
                <input id="c-mail" type="email" value={v.email} onChange={champ("email")} autoComplete="email" />
                {err.email && <span className="l-err">{err.email}</span>}
              </div>
              <div className="l-field">
                <label htmlFor="c-tel">Téléphone (facultatif)</label>
                <input id="c-tel" type="tel" value={v.telephone} onChange={champ("telephone")} autoComplete="tel" />
              </div>
              <div className={"l-field " + (err.taille ? "l-field-err" : "")}>
                <label htmlFor="c-taille">Taille de l’entreprise *</label>
                <select id="c-taille" value={v.taille} onChange={champ("taille")}>
                  <option value="">Sélectionner</option>
                  <option>TPE — moins de 10 salariés</option>
                  <option>PME — 10 à 249 salariés</option>
                  <option>ETI — 250 à 4 999 salariés</option>
                  <option>Autre</option>
                </select>
                {err.taille && <span className="l-err">{err.taille}</span>}
              </div>
              <div className="l-field">
                <label htmlFor="c-ville">Ville ou région</label>
                <input id="c-ville" value={v.ville} onChange={champ("ville")} />
              </div>
              <div className={"l-field " + (err.besoin ? "l-field-err" : "")}>
                <label htmlFor="c-besoin">Type de besoin *</label>
                <select id="c-besoin" value={v.besoin} onChange={champ("besoin")}>
                  <option value="">Sélectionner</option>
                  {BESOINS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                {err.besoin && <span className="l-err">{err.besoin}</span>}
              </div>
              <div className="l-field">
                <label htmlFor="c-public">Public concerné</label>
                <select id="c-public" value={v.publicConcerne} onChange={champ("publicConcerne")}>
                  <option value="">Sélectionner</option>
                  {PUBLICS.map((p) => (
                    <option key={p.id}>{p.label}</option>
                  ))}
                  <option>Plusieurs populations</option>
                </select>
              </div>
              <div className="l-field">
                <label htmlFor="c-part">Nombre approximatif de participants</label>
                <input id="c-part" type="number" min="1" value={v.participants} onChange={champ("participants")} />
              </div>
              <div className="l-field">
                <label htmlFor="c-periode">Période souhaitée</label>
                <input id="c-periode" placeholder="Par exemple : premier trimestre" value={v.periode} onChange={champ("periode")} />
              </div>
              <div className="l-field l-field-full">
                <label htmlFor="c-msg">Votre message</label>
                <textarea id="c-msg" value={v.message} onChange={champ("message")} />
              </div>
              <div className={"l-field l-field-full " + (err.consent ? "l-field-err" : "")}>
                <div className="l-check">
                  <input id="c-ok" type="checkbox" checked={v.consent} onChange={champ("consent")} />
                  <label htmlFor="c-ok" style={{ fontWeight: 400, fontFamily: "inherit", fontSize: ".92rem", color: "var(--gris-1)" }}>
                    J’accepte que les informations transmises soient utilisées pour répondre à ma
                    demande. Elles ne sont ni cédées ni utilisées à d’autres fins. *
                  </label>
                </div>
                {err.consent && <span className="l-err">{err.consent}</span>}
              </div>
              <div className="l-field-full">
                <Btn variant="1" onClick={envoyer}>
                  Envoyer ma demande
                </Btn>
                {err.envoi && <p className="l-err" style={{ marginTop: 10 }}>{err.envoi}</p>}
                <p className="l-small" style={{ marginTop: 12 }}>* Champs obligatoires</p>
              </div>
            </div>
          </div>

          <aside className="l-aside">
            <div className="l-aside-row">
              <span className="l-aside-k">Écrire directement</span>
              <a className="l-btn l-btn-3" href={"mailto:" + SITE.email}>{SITE.email}</a>
            </div>
            <div className="l-aside-row">
              <span className="l-aside-k">Téléphone</span>
              {SITE.telephone ? (
                <a className="l-btn l-btn-3" href={"tel:" + SITE.telephoneLien}>{SITE.telephone}</a>
              ) : (
                <span className="l-small">À compléter</span>
              )}
            </div>
            <div className="l-aside-row">
              <span className="l-aside-k">Prendre rendez-vous</span>
              {SITE.calendly ? (
                <Btn variant="2" href={SITE.calendly} target="_blank" rel="noreferrer">
                  Choisir un créneau
                </Btn>
              ) : (
                <span className="l-small">Lien de prise de rendez-vous à fournir</span>
              )}
            </div>
            <div className="l-aside-row">
              <span className="l-aside-k">Zone d’intervention</span>
              <span className="l-small" style={{ color: "var(--gris-1)" }}>
                Paris et Île-de-France, Pays de la Loire, Bretagne, et partout en France selon le
                projet.
              </span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ─────────── PAGE : MENTIONS LÉGALES ─────────── */
function PageMentions() {
  const aCompleter = (t) => <span className="l-small" style={{ color: "var(--alerte)" }}>{t}</span>;
  return (
    <section className="l-sec" style={{ paddingTop: 132 }}>
      <div className="l-wrap" style={{ maxWidth: 760 }}>
        <p className="l-eyebrow">Page provisoire — à compléter avant mise en ligne</p>
        <h1 className="l-d2" style={{ margin: "16px 0 28px" }}>
          Mentions légales et politique de confidentialité
        </h1>
        <div className="l-note" style={{ marginBottom: 40 }}>
          <p className="l-small">
            Ce document est un canevas. Les informations légales, la forme juridique, les
            coordonnées de l’hébergeur et les modalités de traitement des données doivent être
            renseignées et validées avant publication.
          </p>
        </div>

        <h2 className="l-d3" style={{ marginBottom: 10 }}>Éditeur du site</h2>
        <p className="l-txt" style={{ marginBottom: 8 }}>
          {SITE.nom} — {SITE.descripteur}.
        </p>
        <p className="l-txt" style={{ marginBottom: 28 }}>
          Forme juridique, capital social, siège social : {aCompleter("à compléter")}
          <br />
          Numéro SIRET : {SITE.siret || aCompleter("à compléter")}
          <br />
          Numéro de déclaration d’activité de formation :{" "}
          {SITE.numeroDeclarationActivite || aCompleter("à compléter")}
          <br />
          Adresse électronique : {SITE.email}
        </p>

        <h2 className="l-d3" style={{ marginBottom: 10 }}>Hébergement</h2>
        <p className="l-txt" style={{ marginBottom: 28 }}>
          {SITE.hebergeur || aCompleter("Nom et adresse de l’hébergeur à compléter")}
        </p>

        <h2 className="l-d3" style={{ marginBottom: 10 }}>Propriété intellectuelle</h2>
        <p className="l-txt" style={{ marginBottom: 28 }}>
          Les contenus de ce site, y compris les textes, supports pédagogiques et éléments
          graphiques, sont la propriété de leurs auteurs. Les noms de solutions logicielles cités
          appartiennent à leurs détenteurs respectifs et ne sont mentionnés qu’à titre informatif.
        </p>

        <h2 className="l-d3" style={{ marginBottom: 10 }}>Données personnelles</h2>
        <p className="l-txt" style={{ marginBottom: 12 }}>
          Les informations transmises par le formulaire de contact sont utilisées dans le seul but
          de répondre à la demande. Restent à préciser avant publication : la base légale du
          traitement, la durée de conservation, les destinataires éventuels, l’identité du
          responsable de traitement et les modalités d’exercice des droits d’accès, de
          rectification, d’effacement et d’opposition. {aCompleter("à compléter")}
        </p>
        <p className="l-txt" style={{ marginBottom: 28 }}>
          Aucun outil de mesure d’audience n’est installé à ce stade. Si un outil est ajouté, cette
          page devra décrire les cookies utilisés et le recueil du consentement.
        </p>

        <h2 className="l-d3" style={{ marginBottom: 10 }}>Accessibilité</h2>
        <p className="l-txt">
          Ce site est conçu pour être utilisable au clavier et compatible avec les technologies
          d’assistance. Si vous rencontrez une difficulté d’accès à une information, écrivez-nous à{" "}
          {SITE.email}.
        </p>
      </div>
    </section>
  );
}

/* ─────────── DONNÉES STRUCTURÉES ───────────
   Organization + ProfessionalService, Course pour chaque formation, FAQPage. */
function donneesStructurees(origine) {
  const org = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: SITE.nom,
    description: SITE.descripteur,
    slogan: SITE.signature,
    email: SITE.email,
    url: origine,
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "AdministrativeArea", name: "Île-de-France" },
      { "@type": "AdministrativeArea", name: "Pays de la Loire" },
      { "@type": "AdministrativeArea", name: "Bretagne" },
    ],
    knowsAbout: [
      "Formation intelligence artificielle en entreprise",
      "IA générative",
      "Cas d’usage IA",
      "Acculturation à l’IA",
      "Formation IA pour la finance et le contrôle de gestion",
      "Formation IA pour les ressources humaines",
      "Formation IA pour le marketing",
      "Gouvernance de l’IA",
    ],
    founder: [
      { "@type": "Person", name: "Arthur Péniguel" },
      { "@type": "Person", name: "Norman Hubert" },
    ],
  };
  const cours = FORMATIONS.map((f) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: f.titre,
    description: f.promesse,
    url: origine + "/formations/" + f.id,
    inLanguage: "fr",
    provider: { "@type": "Organization", name: SITE.nom },
    teaches: f.objectifs,
    coursePrerequisites: f.prerequis,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["Onsite", "Blended"],
      courseWorkload: f.duree,
    },
  }));
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.r },
    })),
  };
  return [org, ...cours, faq];
}

/* ─────────── RACINE ─────────── */
export default function SiteLucidIA() {
  const [route, setRoute] = useState({ page: "accueil" });
  const premier = useRef(true);

  /* Routage simulé : l’URL reflète la vue affichée, le bouton retour du
     navigateur fonctionne, et un lien partagé rouvre la bonne page. */
  const lireRoute = useCallback(() => {
    const brut =
      ROUTAGE === "chemins"
        ? window.location.pathname.replace(/^\/+|\/+$/g, "")
        : (window.location.hash || "").replace(/^#\/?/, "");
    const [p, id] = brut.split("/");
    const connue = PAGES.some((x) => x.id === p);
    return { page: connue ? p : "accueil", id: id || undefined };
  }, []);

  useEffect(() => {
    setRoute(lireRoute());
    const relire = () => setRoute(lireRoute());
    const evenement = ROUTAGE === "chemins" ? "popstate" : "hashchange";
    window.addEventListener(evenement, relire);
    return () => window.removeEventListener(evenement, relire);
  }, [lireRoute]);

  const go = useCallback((page, opts = {}) => {
    if (ROUTAGE === "chemins") {
      const cible = page === "accueil" ? "/" : "/" + page + (opts.id ? "/" + opts.id : "");
      if (window.location.pathname !== cible) window.history.pushState({}, "", cible);
    } else {
      const cible = "#/" + page + (opts.id ? "/" + opts.id : "");
      if (window.location.hash !== cible) window.location.hash = cible;
    }
    setRoute({ page, ...opts });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* Adresse canonique de la vue affichée : évite que deux URL servent la
     même page aux yeux des moteurs. */
  const canonique = useCallback((r) => {
    if (r.page === "accueil") return DOMAINE + "/";
    return DOMAINE + (ROUTAGE === "chemins" ? "/" : "/#/") + r.page + (r.id ? "/" + r.id : "");
  }, []);

  /* Titre et méta-description propres à chaque vue */
  useEffect(() => {
    const p = PAGES.find((x) => x.id === route.page) || PAGES[0];
    const fiche = route.page === "formations" && route.id
      ? FORMATIONS.find((x) => x.id === route.id)
      : null;
    const demo =
      route.page === "demonstrations" && route.id ? DEMOS.find((x) => x.id === route.id) : null;
    document.title = fiche
      ? fiche.titre + " — Formation IA en entreprise | LucidIA"
      : demo
      ? demo.titre + " — Démonstration " + demo.fonction + " | LucidIA"
      : p.titre;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    let c = document.querySelector('link[rel="canonical"]');
    if (!c) {
      c = document.createElement("link");
      c.setAttribute("rel", "canonical");
      document.head.appendChild(c);
    }
    c.setAttribute("href", canonique(route));
    m.setAttribute(
      "content",
      fiche
        ? fiche.promesse + " Formation adaptée aux TPE, PME et ETI."
        : demo
        ? demo.promesse + " Démonstration commentée du cas d’usage, fonction " + demo.fonction + "."
        : p.meta
    );
  }, [route, canonique]);

  /* Données structurées injectées une seule fois */
  useEffect(() => {
    if (!premier.current) return;
    premier.current = false;
    const origine = DOMAINE;
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(donneesStructurees(origine));
    document.head.appendChild(s);
    /* sitemap.xml et robots.txt sont dans public/, servis à la racine. */
  }, []);

  let vue;
  if (route.page === "formations")
    vue = route.id ? (
      <PageFiche go={go} id={route.id} />
    ) : (
      <PageFormations go={go} filtreInitial={route.filtre} />
    );
  else if (route.page === "demonstrations") vue = <PageDemos go={go} id={route.id} />;
  else if (route.page === "accompagnement") vue = <PageAccompagnement go={go} />;
  else if (route.page === "methode") vue = <PageMethode go={go} />;
  else if (route.page === "apropos") vue = <PageApropos go={go} />;
  else if (route.page === "ressources") vue = <PageRessources go={go} />;
  else if (route.page === "contact")
    vue = (
      <PageContact prefill={route.prefill} formation={route.formation} objectifs={route.objectifs} />
    );
  else if (route.page === "mentions") vue = <PageMentions />;
  else vue = <PageAccueil go={go} />;

  return (
    <div className="l-root">
      <style>{CSS}</style>
      <a className="l-skip" href="#contenu">Aller au contenu</a>
      <Nav route={route} go={go} />
      <main id="contenu" key={route.page + (route.id || "")}>
        {vue}
      </main>
      <Footer go={go} />
    </div>
  );
}
