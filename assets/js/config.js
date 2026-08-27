/* =========================================================================
   CONFIGURATION DU SITE — c'est le SEUL fichier que tu as besoin de modifier.
   Tout le contenu du site (noms, dates, lieux, planning, photos, textes)
   se règle ici. Remplace simplement les valeurs entre guillemets.
   Les lignes marquées  //  À REMPLACER  sont celles à personnaliser en priorité.
   ========================================================================= */

const WEDDING = {

  /* ------------------------------------------------------------------ */
  /* 1. LE COUPLE                                                        */
  /* ------------------------------------------------------------------ */
  couple: {
    prenomA: "Jeanne",              //  À REMPLACER
    prenomB: "Benjamin",            //  À REMPLACER
    initiales: "J & B",             //  À REMPLACER (cachet de cire de l'enveloppe)
  },

  /* ------------------------------------------------------------------ */
  /* 2. DATE & HEURE                                                     */
  /*    Format ISO : "AAAA-MM-JJTHH:MM:SS" (heure de début de la journée) */
  /* ------------------------------------------------------------------ */
  date: {
    iso: "2028-07-22T15:00:00",     //  À REMPLACER — sert au compte à rebours
    jourTexte: "Samedi 22 juillet 2028",   //  À REMPLACER — affiché en toutes lettres
    jourChiffre: "22",              //  À REMPLACER — grand chiffre du cachet
    moisChiffre: "07",              //  À REMPLACER
    annee: "2028",                  //  À REMPLACER
  },

  /* ------------------------------------------------------------------ */
  /* 3. LIEU                                                             */
  /* ------------------------------------------------------------------ */
  lieu: {
    nom: "Domaine de Saint-Michel",           //  À REMPLACER
    adresse: "1234 route des Vignes, 31000 Toulouse",  //  À REMPLACER
    // Ce texte sert à générer la carte Google Maps. Mets le nom du lieu
    // + la ville, exactement comme tu l'écrirais dans la barre de recherche.
    rechercheMaps: "Domaine de Saint-Michel, Toulouse",  //  À REMPLACER
    // Lien "Ouvrir l'itinéraire" — laisse vide pour le générer automatiquement.
    lienItineraire: "",
    infoParking: "Parking gratuit sur place, accès fléché depuis la route principale.",
  },

  /* ------------------------------------------------------------------ */
  /* 4. TEXTES                                                           */
  /* ------------------------------------------------------------------ */
  textes: {
    // Petite phrase affichée sous les prénoms sur la page d'accueil
    accroche: "Nous nous marions",

    // Mot qui apparaît sur le carton, à l'ouverture de l'enveloppe
    carton: "Vous êtes cordialement invités à célébrer notre mariage",

    // Message de bienvenue / d'invitation (section « Notre invitation »)
    invitationTitre: "Un mot pour vous",
    invitationParagraphes: [
      "Après plusieurs années à construire notre histoire ensemble, nous avons décidé de nous dire oui. Et nous ne pouvons pas imaginer ce jour-là sans vous.",
      "Vous qui nous avez vus grandir, rire, douter, avancer : nous serions profondément heureux de vous compter parmi nous pour célébrer ce moment.",
      "Vous trouverez sur cette page toutes les informations pratiques, le déroulé de la journée, et un petit formulaire pour nous confirmer votre présence.",
      "À très vite,",
    ],
    signature: "Jeanne & Benjamin",   //  À REMPLACER

    // Phrase de fin de page
    footer: "Merci d'être là. Ce jour-là ne serait pas le même sans vous.",
  },

  /* ------------------------------------------------------------------ */
  /* 5. PROGRAMME DE LA JOURNÉE                                          */
  /*    Ajoute / retire des blocs librement.                             */
  /*    icone : ceremonie | anneaux | cocktail | photo | diner | danse |  */
  /*            arrivee | brunch                                         */
  /* ------------------------------------------------------------------ */
  programme: [
    { heure: "14h30", titre: "Accueil des invités", lieu: "Cour du domaine",
      texte: "Un rafraîchissement vous attend à l'ombre des platanes.", icone: "arrivee" },
    { heure: "15h00", titre: "Cérémonie", lieu: "Chapelle Saint-Michel",
      texte: "Le moment que vous ne voulez pas manquer.", icone: "ceremonie" },
    { heure: "16h30", titre: "Vin d'honneur", lieu: "Jardin sud",
      texte: "Champagne, douceurs et retrouvailles.", icone: "cocktail" },
    { heure: "18h00", titre: "Photos de groupe", lieu: "Devant l'orangerie",
      texte: "Une petite demi-heure, promis.", icone: "photo" },
    { heure: "20h00", titre: "Dîner", lieu: "Grande salle",
      texte: "Plan de table affiché à l'entrée.", icone: "diner" },
    { heure: "23h00", titre: "Ouverture du bal", lieu: "Pavillon du parc",
      texte: "Et jusqu'au bout de la nuit.", icone: "danse" },
    { heure: "11h00", titre: "Brunch (dimanche)", lieu: "Terrasse",
      texte: "Pour ceux qui tiennent encore debout.", icone: "brunch" },
  ],

  /* ------------------------------------------------------------------ */
  /* 6. PHOTOS                                                           */
  /*    Dépose tes images dans assets/img/photos/ puis indique le chemin. */
  /*    Si un fichier n'existe pas, un joli cadre vide s'affiche à la     */
  /*    place — le site ne casse jamais.                                 */
  /* ------------------------------------------------------------------ */
  photos: {
    couple: { src: "assets/img/photos/couple.jpg", alt: "Nous deux" },
    galerie: [
      { src: "assets/img/photos/lieu-1.jpg", alt: "Le domaine" },
      { src: "assets/img/photos/lieu-2.jpg", alt: "La chapelle" },
      { src: "assets/img/photos/lieu-3.jpg", alt: "Le jardin" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 7. FORMULAIRE DE RÉPONSE (RSVP)                                     */
  /*                                                                     */
  /*    a) Va sur https://formspree.io et crée un compte gratuit.        */
  /*    b) Crée un formulaire ("New form"), mets ton adresse e-mail.     */
  /*    c) Formspree te donne une URL du type                            */
  /*         https://formspree.io/f/xdorwabc                             */
  /*       Copie la partie finale (xdorwabc) ci-dessous.                 */
  /* ------------------------------------------------------------------ */
  rsvp: {
    formspreeId: "",                // <-- colle ici ton identifiant Formspree
    dateLimite: "1er mai 2028",     //  À REMPLACER
    // Nombre maximum de personnes qu'un invité peut annoncer
    maxInvites: 6,
    emailContact: "jeanne.benjamin@example.com",  //  À REMPLACER
    telContact: "",                 // optionnel, ex. "06 12 34 56 78"
  },

  /* ------------------------------------------------------------------ */
  /* 8. DIVERS                                                           */
  /* ------------------------------------------------------------------ */
  options: {
    // Afficher l'animation d'ouverture d'enveloppe à l'arrivée
    enveloppe: true,
    // Ne la rejouer qu'une fois par session de navigation
    enveloppeUneSeuleFois: true,
    // Afficher le compte à rebours
    compteARebours: true,
  },
};

/* Rend la configuration accessible partout (y compris depuis la console). */
window.WEDDING = WEDDING;
