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
    prenomA: "Amélie",              //  À REMPLACER
    prenomB: "Sébastien",            //  À REMPLACER
    initiales: "A & S",             //  À REMPLACER (cachet de cire de l'enveloppe)
  },

  /* ------------------------------------------------------------------ */
  /* 2. DATE & HEURE                                                     */
  /*    Format ISO : "AAAA-MM-JJTHH:MM:SS" (heure de début de la journée) */
  /* ------------------------------------------------------------------ */
  date: {
    iso: "2027-07-03T16:00:00",     //  À REMPLACER — sert au compte à rebours
    jourTexte: "Samedi 3 juillet 2027",   //  À REMPLACER — affiché en toutes lettres
    jourChiffre: "03",              //  À REMPLACER — grand chiffre du cachet
    moisChiffre: "07",              //  À REMPLACER
    annee: "2027",                  //  À REMPLACER
  },

  /* ------------------------------------------------------------------ */
  /* 3. LIEU                                                             */
  /* ------------------------------------------------------------------ */
  lieu: {
    nom: "Domaine du Petit Varennes",           //  À REMPLACER
    adresse: "62 Rue du Mal Leclerc, 89140 Serbonnes",  //  À REMPLACER
    // Ce texte sert à générer la carte Google Maps. Mets le nom du lieu
    // + la ville, exactement comme tu l'écrirais dans la barre de recherche.
    rechercheMaps: "Domaine du Petit Varennes, Serbonnes",  //  À REMPLACER
    // Lien "Ouvrir l'itinéraire" — laisse vide pour le générer automatiquement.
    lienItineraire: "https://maps.app.goo.gl/m7FhKqFu8sjT8YU67",
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
      "Vous qui nous avez vus grandir, rire et evoluer : nous serions profondément heureux de vous compter parmi nous pour célébrer ce moment.",
      "Vous trouverez sur cette page toutes les informations pratiques, le déroulé de la journée, et un petit formulaire pour nous confirmer votre présence.",
      "À très vite,",
    ],
    signature: "Amélie & Sébastien",   //  À REMPLACER

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
    { heure: "16h00", titre: "Accueil des invités", lieu: "Cour du domaine",
      texte: "Un rafraîchissement vous attend à l'ombre des platanes.", icone: "arrivee" },
    { heure: "16h30", titre: "Cérémonie", lieu: "Cour du domaine",
      texte: "Le moment que vous ne voulez pas manquer.", icone: "ceremonie" },
    { heure: "17h00", titre: "Photos de groupe", lieu: "Jardin du domaine",
      texte: "Une petite demi-heure, promis.", icone: "photo" },
    { heure: "18h00", titre: "Vin d'honneur", lieu: "Jardin du domaine",
      texte: "Boissons, douceurs et retrouvailles.", icone: "cocktail" },
    { heure: "20h00", titre: "Dîner", lieu: "Grande salle",
      texte: "Pas de plan de table. Assayez la où le vent vous menera.", icone: "diner" },
    { heure: "23h00", titre: "Ouverture du bal", lieu: "Salle de danse",
      texte: "Et jusqu'au bout de la nuit.", icone: "danse" },
    { heure: "11h00", titre: "Brunch (dimanche)", lieu: "Cour du domaine",
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
      { src: "assets/img/photos/lieu-2.jpg", alt: "La cour arrière" },
      { src: "assets/img/photos/lieu-3.jpg", alt: "Le jardin" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 7. INFORMATIONS PRATIQUES                                           */
  /*    Les logements des environs, et tout ce qui aide les invités à    */
  /*    s'organiser. Ajoute ou retire des blocs librement.               */
  /*                                                                     */
  /*    Pour chaque logement, seuls `nom` et `type` sont obligatoires :  */
  /*    les autres champs disparaissent tout seuls s'ils sont vides.     */
  /* ------------------------------------------------------------------ */
  infosPratiques: {
    titre: "Où dormir",
    intro: "Voici quelques adresses autour du domaine, de la plus proche à la plus éloignée. Pensez à réserver tôt : juillet est une période chargée dans la région.",
    logements: [],
    autres: [],
    // logements: [
    //   {
    //     nom: "Domaine de Saint-Michel",             //  À REMPLACER
    //     type: "Sur place",
    //     distance: "Sur le lieu de réception",
    //     prix: "à partir de 120 € la nuit",
    //     note: "Douze chambres, à réserver directement auprès du domaine. Mentionnez notre mariage : un tarif nous a été réservé.",
    //     tel: "05 61 00 00 00",
    //     site: "https://example.com",
    //   },
    //   {
    //     nom: "Hôtel des Vignes",                    //  À REMPLACER
    //     type: "Hôtel",
    //     distance: "5 min en voiture",
    //     prix: "90 – 140 €",
    //     note: "",
    //     tel: "",
    //     site: "https://example.com",
    //   },
    //   {
    //     nom: "La Grange aux Oiseaux",               //  À REMPLACER
    //     type: "Chambres d'hôtes",
    //     distance: "10 min en voiture",
    //     prix: "75 – 110 €",
    //     note: "Petit-déjeuner compris, quatre chambres seulement.",
    //     tel: "",
    //     site: "https://example.com",
    //   },
    //   {
    //     nom: "Camping du Lac",                      //  À REMPLACER
    //     type: "Camping",
    //     distance: "15 min en voiture",
    //     prix: "à partir de 25 €",
    //     note: "Emplacements tentes et quelques chalets.",
    //     tel: "",
    //     site: "https://example.com",
    //   },
    // ],

    // // Blocs libres affichés sous les logements. Mets [] pour n'en afficher aucun.
    // autres: [
    //   {
    //     titre: "Navette",
    //     texte: "Une navette fera l'aller-retour entre le centre-ville et le domaine, à 14 h puis à 1 h du matin. Dites-le nous dans le formulaire de réponse si vous comptez l'emprunter, pour que nous prévoyions les places.",
    //   },
    //   {
    //     titre: "Tenue",
    //     texte: "Élégante et confortable. La cérémonie et le vin d'honneur se tiennent en extérieur, sur de l'herbe : évitez les talons trop fins.",
    //   },
    //   {
    //     titre: "Cadeaux",
    //     texte: "Votre présence est déjà le principal. Pour ceux qui insistent, une urne sera à disposition le jour J.",
    //   },
    // ],
  },

  /* ------------------------------------------------------------------ */
  /* 8. FORMULAIRE DE RÉPONSE (RSVP)                                     */
  /*                                                                     */
  /*    a) Va sur https://formspree.io et crée un compte gratuit.        */
  /*    b) Crée un formulaire ("New form"), mets ton adresse e-mail.     */
  /*    c) Formspree te donne une URL du type                            */
  /*         https://formspree.io/f/xdorwabc                             */
  /*       Copie la partie finale (xdorwabc) ci-dessous.                 */
  /* ------------------------------------------------------------------ */
  rsvp: {
    formspreeId: "xyeygdbv",                // <-- colle ici ton identifiant Formspree
    dateLimite: "1er mai 2027",     //  À REMPLACER
    // Nombre maximum de personnes qu'un invité peut annoncer
    maxInvites: 6,
    emailContact: "sebvelut28@gmail.com",  //  À REMPLACER
    telContact: "0618358529",                 // optionnel, ex. "06 12 34 56 78"
  },

  /* ------------------------------------------------------------------ */
  /* 9. DIVERS                                                           */
  /* ------------------------------------------------------------------ */
  options: {
    // Afficher l'animation d'ouverture d'enveloppe à l'arrivée
    enveloppe: true,
    // Ne la rejouer qu'une fois par session de navigation
    enveloppeUneSeuleFois: true,
    // Afficher le compte à rebours
    compteARebours: true,
    dureeCarton: 8000,   // temps de lecture en millisecondes
  },
};

/* Rend la configuration accessible partout (y compris depuis la console). */
window.WEDDING = WEDDING;
