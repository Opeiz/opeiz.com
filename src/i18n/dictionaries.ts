// UI texts (everything that isn't CV content) in every language.
// English defines the shape; Spanish and French must match it exactly (TypeScript checks it).
// Texts with {placeholders} are filled in with t("Job {i} of {n}", { i: 2, n: 5 }).
// Only plain strings here (no functions), so they can be passed to Client Components too.

import type { Lang } from "@/i18n/config";

// Annotated type (not "as"): palette names, checked by palettes.test.ts
type PaletteNames = Record<string, string>; // palette id → name (palettes.test.ts checks none is missing)

const en = {
  meta: {
    title: "Joaquin Opazo Yentzen · Software Engineer",
    description: "Software engineer in C++, Python, robotics and embedded systems, based in Chambéry, France.",
    cvTitle: "Joaquin Opazo Yentzen · CV",
  },
  nav: { sections: "Sections", experience: "Experience", offTheClock: "Off the clock", puzzles: "Puzzles", labs: "UTS Labs", contact: "Contact" },
  header: {
    shuffle: "Shuffle the site colors",
    shuffleTitle: "Shuffle colors",
    colorsChanged: "Colors changed to {name}",
    language: "Language",
  },
  palettes: { signal: "Ink & Orange", wine: "Wine & Mint", navy: "Navy & Gold", forest: "Forest & Coral", lagoon: "Lagoon" } as PaletteNames,
  hero: {
    currentlyAt: "Currently at {org}",
    hi: "Hi, I'm",
    prize: "1st prize, Thales RISC-V",
    getInTouch: "Get in touch",
    classicCv: "Classic CV",
    flagChile: "Flag of Chile",
    flagFrance: "Flag of France",
  },
  experience: {
    label: "Experience",
    title: "Experience",
    education: "Education",
    awards: "Awards",
    leadership: "Leadership",
    platforms: "Where I train",
    platformsIntro: "I keep my problem solving sharp on coding challenge sites.",
    certificates: "Certificates",
    liveBanner: "Live stats from {name}",
    current: "Current",
    region: "Work experience",
    track: "Experience cards. Use the arrow keys to move between them.",
    previous: "Previous job",
    next: "Next job",
    goTo: "Go to {org}",
    slide: "{i} of {n}: {org}",
    announce: "Job {i} of {n}: {title} at {org}",
  },
  offTheClock: {
    label: "Personal",
    title: "Off the clock",
    intro: "The less formal part. When I'm not writing code:",
    funFacts: "Fun facts",
  },
  puzzles: {
    label: "Puzzles",
    title: "Bored? Solve a puzzle",
    intro: "Understand, then solve. Draw one line from the circle to the exit, without crossing itself. Each tab adds a new rule:",
    choose: "Choose a rule",
    modes: {
      maze: { name: "Maze", rules: "Some tracks are missing. Find the way through to the exit." },
      dots: { name: "Hexagons", rules: "The line must pass over every hexagon." },
      colors: { name: "Colors", rules: "The line splits the board into areas. An area can't hold squares of both colors." },
      triangles: { name: "Triangles", rules: "A cell with triangles needs exactly that many of its 4 sides on the line." },
    },
    boardLabel: "Puzzle board. Drag from the circle, or use the arrow keys to draw the line.",
    time: "Time",
    newPuzzle: "New puzzle",
    hint: "Start on the big circle and drag to the exit, the short line at the top right.",
    wrong: "Not quite: the red symbols break a rule. Start again from the circle.",
    solved: "Solved in {time}. Nice!",
    keys: "Keyboard: arrow keys draw the line, Esc clears it.",
  },
  labs: { label: "Founder", title: "What I'm building", comingSoon: "Coming soon" },
  contact: {
    label: "Contact",
    title: "Let's talk",
    intro: "A project, a question, or just a hello: my inbox is open.",
    send: "Send an email",
  },
  footer: { built: "Built with Next.js, Tailwind CSS & Vercel" },
  cv: {
    back: "← Back to home",
    download: "Download PDF",
    experience: "Experience",
    awards: "Awards",
    education: "Education",
    leadership: "Leadership",
    skills: "Skills",
    languages: "Languages",
    softSkills: "Soft skills",
    hobbies: "Hobbies",
  },
};

export type Dict = typeof en;

const es: Dict = {
  meta: {
    title: "Joaquin Opazo Yentzen · Ingeniero de Software",
    description: "Ingeniero de software en C++, Python, robótica y sistemas embebidos, basado en Chambéry, Francia.",
    cvTitle: "Joaquin Opazo Yentzen · CV",
  },
  nav: { sections: "Secciones", experience: "Experiencia", offTheClock: "Fuera de horario", puzzles: "Puzzles", labs: "UTS Labs", contact: "Contacto" },
  header: {
    shuffle: "Cambiar los colores del sitio",
    shuffleTitle: "Cambiar colores",
    colorsChanged: "Colores cambiados a {name}",
    language: "Idioma",
  },
  palettes: { signal: "Tinta y Naranja", wine: "Vino y Menta", navy: "Marino y Oro", forest: "Bosque y Coral", lagoon: "Laguna" },
  hero: {
    currentlyAt: "Actualmente en {org}",
    hi: "Hola, soy",
    prize: "1er premio, Thales RISC-V",
    getInTouch: "Contáctame",
    classicCv: "CV clásico",
    flagChile: "Bandera de Chile",
    flagFrance: "Bandera de Francia",
  },
  experience: {
    label: "Experiencia",
    title: "Experiencia",
    education: "Formación",
    awards: "Premios",
    leadership: "Liderazgo",
    platforms: "Dónde entreno",
    platformsIntro: "Mantengo mi resolución de problemas en forma en sitios de desafíos de programación.",
    certificates: "Certificados",
    liveBanner: "Estadísticas en vivo de {name}",
    current: "Actual",
    region: "Experiencia laboral",
    track: "Tarjetas de experiencia. Usa las flechas del teclado para moverte entre ellas.",
    previous: "Trabajo anterior",
    next: "Trabajo siguiente",
    goTo: "Ir a {org}",
    slide: "{i} de {n}: {org}",
    announce: "Trabajo {i} de {n}: {title} en {org}",
  },
  offTheClock: {
    label: "Personal",
    title: "Fuera de horario",
    intro: "La parte menos formal. Cuando no estoy programando:",
    funFacts: "Datos curiosos",
  },
  puzzles: {
    label: "Puzzles",
    title: "¿Aburrido? Resuelve un puzzle",
    intro: "Entender, luego resolver. Dibuja una línea desde el círculo hasta la salida, sin que se cruce consigo misma. Cada pestaña agrega una regla nueva:",
    choose: "Elige una regla",
    modes: {
      maze: { name: "Laberinto", rules: "Faltan algunos caminos. Encuentra la ruta hasta la salida." },
      dots: { name: "Hexágonos", rules: "La línea debe pasar por todos los hexágonos." },
      colors: { name: "Colores", rules: "La línea divide el tablero en zonas. Una zona no puede tener cuadrados de los dos colores." },
      triangles: { name: "Triángulos", rules: "Una celda con triángulos necesita exactamente esa cantidad de sus 4 lados sobre la línea." },
    },
    boardLabel: "Tablero del puzzle. Arrastra desde el círculo, o usa las flechas para dibujar la línea.",
    time: "Tiempo",
    newPuzzle: "Nuevo puzzle",
    hint: "Empieza en el círculo grande y arrastra hasta la salida, la línea corta arriba a la derecha.",
    wrong: "Casi: los símbolos en rojo rompen una regla. Vuelve a empezar desde el círculo.",
    solved: "Resuelto en {time}. ¡Bien!",
    keys: "Teclado: las flechas dibujan la línea, Esc la borra.",
  },
  labs: { label: "Fundador", title: "Lo que estoy construyendo", comingSoon: "Próximamente" },
  contact: {
    label: "Contacto",
    title: "Hablemos",
    intro: "Un proyecto, una pregunta o solo un hola: mi correo está abierto.",
    send: "Enviar un correo",
  },
  footer: { built: "Hecho con Next.js, Tailwind CSS y Vercel" },
  cv: {
    back: "← Volver al inicio",
    download: "Descargar PDF",
    experience: "Experiencia",
    awards: "Premios",
    education: "Formación",
    leadership: "Liderazgo",
    skills: "Competencias",
    languages: "Idiomas",
    softSkills: "Habilidades blandas",
    hobbies: "Pasatiempos",
  },
};

const fr: Dict = {
  meta: {
    title: "Joaquin Opazo Yentzen · Ingénieur Logiciel",
    description: "Ingénieur logiciel en C++, Python, robotique et systèmes embarqués, basé à Chambéry, France.",
    cvTitle: "Joaquin Opazo Yentzen · CV",
  },
  nav: { sections: "Sections", experience: "Expérience", offTheClock: "Hors du bureau", puzzles: "Puzzles", labs: "UTS Labs", contact: "Contact" },
  header: {
    shuffle: "Changer les couleurs du site",
    shuffleTitle: "Changer les couleurs",
    colorsChanged: "Couleurs changées : {name}",
    language: "Langue",
  },
  palettes: { signal: "Encre & Orange", wine: "Vin & Menthe", navy: "Marine & Or", forest: "Forêt & Corail", lagoon: "Lagon" },
  hero: {
    currentlyAt: "Actuellement chez {org}",
    hi: "Bonjour, je suis",
    prize: "1er prix, Thales RISC-V",
    getInTouch: "Me contacter",
    classicCv: "CV classique",
    flagChile: "Drapeau du Chili",
    flagFrance: "Drapeau de la France",
  },
  experience: {
    label: "Expérience",
    title: "Expérience",
    education: "Formation",
    awards: "Prix",
    leadership: "Engagement",
    platforms: "Où je m'entraîne",
    platformsIntro: "J'entretiens ma résolution de problèmes sur des sites de défis de programmation.",
    certificates: "Certificats",
    liveBanner: "Statistiques en direct de {name}",
    current: "Actuel",
    region: "Expérience professionnelle",
    track: "Cartes d'expérience. Utilisez les flèches du clavier pour passer de l'une à l'autre.",
    previous: "Poste précédent",
    next: "Poste suivant",
    goTo: "Aller à {org}",
    slide: "{i} sur {n} : {org}",
    announce: "Poste {i} sur {n} : {title} chez {org}",
  },
  offTheClock: {
    label: "Personnel",
    title: "Hors du bureau",
    intro: "La partie moins formelle. Quand je ne code pas :",
    funFacts: "Le saviez-vous ?",
  },
  puzzles: {
    label: "Puzzles",
    title: "Vous vous ennuyez ? Résolvez un puzzle",
    intro: "Comprendre, puis résoudre. Tracez une ligne du cercle jusqu'à la sortie, sans qu'elle se croise. Chaque onglet ajoute une règle :",
    choose: "Choisissez une règle",
    modes: {
      maze: { name: "Labyrinthe", rules: "Certains chemins manquent. Trouvez la route jusqu'à la sortie." },
      dots: { name: "Hexagones", rules: "La ligne doit passer sur tous les hexagones." },
      colors: { name: "Couleurs", rules: "La ligne découpe le plateau en zones. Une zone ne peut pas contenir des carrés des deux couleurs." },
      triangles: { name: "Triangles", rules: "Une case avec des triangles doit avoir exactement autant de ses 4 côtés sur la ligne." },
    },
    boardLabel: "Plateau du puzzle. Glissez depuis le cercle, ou utilisez les flèches pour tracer la ligne.",
    time: "Temps",
    newPuzzle: "Nouveau puzzle",
    hint: "Partez du grand cercle et glissez jusqu'à la sortie, le petit trait en haut à droite.",
    wrong: "Presque : les symboles en rouge enfreignent une règle. Recommencez depuis le cercle.",
    solved: "Résolu en {time}. Bravo !",
    keys: "Clavier : les flèches tracent la ligne, Échap l'efface.",
  },
  labs: { label: "Fondateur", title: "Ce que je construis", comingSoon: "Bientôt" },
  contact: {
    label: "Contact",
    title: "Parlons-en",
    intro: "Un projet, une question, ou juste un bonjour : ma boîte mail est ouverte.",
    send: "Envoyer un e-mail",
  },
  footer: { built: "Réalisé avec Next.js, Tailwind CSS & Vercel" },
  cv: {
    back: "← Retour à l'accueil",
    download: "Télécharger le PDF",
    experience: "Expérience professionnelle",
    awards: "Prix",
    education: "Formation",
    leadership: "Activités associatives",
    skills: "Compétences",
    languages: "Langues",
    softSkills: "Soft skills",
    hobbies: "Loisirs",
  },
};

const DICTIONARIES: Record<Lang, Dict> = { en, es, fr };

export function getDictionary(lang: Lang): Dict {
  return DICTIONARIES[lang];
}

/** Fill {placeholders}: t("Job {i} of {n}", { i: 2, n: 5 }) → "Job 2 of 5" */
export function t(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
