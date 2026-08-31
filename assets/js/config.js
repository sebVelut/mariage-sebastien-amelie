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
    logements: [
      {
        nom: "MAISON PRÈS DE L'YONNE",             //  À REMPLACER
        type: "Airbnb",
        distance: "Dans le village du domaine",
        prix: "à partir de 180 € la nuit",
        note: "Maison indépendante pour 6 personnes",
        site: "https://www.airbnb.fr/rooms/1434853786981092012",
      },
      {
        nom: "LES PORTES DE BOURGOGNE",                    //  À REMPLACER
        type: "chambre d'hotes",
        distance: "Dans le village du domaine",
        prix: "à partir de 133 € la nuit",
        note: ":3 chambres d'hôtes, 6 personnes",
        site: "https://www.booking.com/hotel/fr/les-portes-de-bourgogne.fr.html",
      },
      {
        nom: "VILLA NOYERS",               //  À REMPLACER
        type: "Gîtes",
        distance: "Dans le village du domaine",
        prix: "à partir de 114 € la nuit",
        note: "Maison indépendante pour 4 couples. soit 8 personnes.",
        site: "ttps://www.gites-de-france.com/fr/bourgogne-franche-comte/yonne/villa-noyers-h89g030227",
      },
      {
        nom: "L’OASIS-BALNÉO",                      //  À REMPLACER
        type: "Airbnb",
        distance: "Dans le village du domaine",
        prix: "à partir de 137 € la nuit",
        note: "1 chambre pour 2 personnes",
        site: "https://www.airbnb.fr/rooms/1276214340038260975",
      },
      {
        nom: "MAISON DE CAMPAGNE RUSTIQUE",                      //  À REMPLACER
        type: "Gites",
        distance: "A Michery, village à 4 minutes du domaine en voiture",
        prix: "à partir de 108 € la nuit",
        note: "4 lits pour 6 personnes",
        site: "",
      },
      {
        nom: "LES CHENEVIERES",                      //  À REMPLACER
        type: "Gîtes",
        distance: "A Michery, village à 4 minutes du domaine en voiture",
        prix: "à partir de 137 € la nuit",
        note: "1 chambre pour 4 personnes",
        site: "https://www.gites.fr/d/64180656?searchId=c99ae7d9-7315-4423-8b0a-26ce10196851",
      },
      {
        nom: "LA RENAUDIÈRE",                      //  À REMPLACER
        type: "Airbnb",
        distance: "A Courlon sur Yonne, village à 4 minutes du domaine en voiture",
        prix: "à partir de 128 € la nuit",
        note: "7 chambres pour 15 personnes",
        site: "https://www.airbnb.fr/rooms/12319812",
      },
      {
        nom: "CHAMBRE D’HÔTE CHEZ LÉNAIC",                      //  À REMPLACER
        type: "Airbnb",
        distance: "A Courlon sur Yonne, village à 4 minutes du domaine en voiture",
        prix: "à partir de 85 € la nuit",
        note: "1 chambre pour 2 personnes",
        site: "https://www.airbnb.fr/rooms/1276214340038260975",
      },
      {
        nom: "MAISON LONGÈRE LES CAMÉLIAS",                      //  À REMPLACER
        type: "Booking",
        distance: "A Vinneuf, village à 7 minutes du domaine en voiture",
        prix: "",
        note: "2 chambres pour 6 personnes",
        site: "https://www.airbnb.fr/rooms/1276214340038260975",
      },
      {
        nom: "AU 13",                      //  À REMPLACER
        type: "Chambres d'hotes",
        distance: "A Vinneuf, village à 7 minutes du domaine en voiture",
        prix: "à partir de 147 € la nuit",
        note: "1 chambre pour 2 personnes",
        site: "https://www.airbnb.fr/rooms/1276214340038260975",
      },
      {
        nom: "LA GRAINETERIE 89",                      //  À REMPLACER
        type: "Apparts hotels",
        distance: "A Pont sur Yonne, village à 10 minutes du domaine en voiture",
        prix: "à partir de 186 € la nuit",
        note: "11 chambres au total, pour 30 personnes",
        site: "https://www.booking.com/hotel/fr/la-graineterie-pont-sur-yonne.fr.html",
      },
      {
        nom: "CHEZ NATHALIE",                      //  À REMPLACER
        type: "Airbnb",
        distance: "A Pont sur Yonne, village à 10 minutes du domaine en voiture",
        prix: "à partir de 56 € la nuit",
        note: "1 chambre pour 2 personnes",
        site: "https://www.airbnb.fr/rooms/920194758211762021",
      },
      {
        nom: "LES 3 FONTAINES",                      //  À REMPLACER
        type: "Gîtes",
        distance: "A Sergines, village à 12 minutes du domaine en voiture",
        prix: "à partir de 47 € la nuit",
        note: "2 chambres pour 8 personnes",
        site: "https://www.mairie-sergines.fr/gites-des-3-fontaines",
      },
      {
        nom: "LE SARCINOË",                      //  À REMPLACER
        type: "Gîtes",
        distance: "A Pont sur Yonne, village à 10 minutes du domaine en voiture",
        prix: "à partir de 47 € la nuit",
        note: "2 chambres pour 6 personnes",
        site: "https://www.le-sarcinoe.com/",
      },
      {
        nom: "Hotels à Sens",                      //  À REMPLACER
        type: "Hotel",
        distance: "A Sens, ville à une vingtaine de minutes du domaine en voiture",
        prix: "",
        note: "",
        site: "",
      },
    ],

    // Blocs libres affichés sous les logements. Mets [] pour n'en afficher aucun.
    autres: [
      {
        titre: "Tenue",
        texte: "Venez comme vous êtes. La cérémonie et le vin d'honneur se tiennent en extérieur, sur de l'herbe : évitez les talons trop fins.",
      },
      {
        titre: "Cadeaux",
        texte: "Nous ne faisons pas de liste de mariage. Nous allons mettre en place un pot commun pour ceux qui souhaitent nous offrir un cadeau. Vous pourrez y contribuer le jour J, ou en ligne via le lien ci-dessous (s'il n'y a rien, le lien viendra). Merci d'avance pour votre générosité !",
      },
    ],
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
