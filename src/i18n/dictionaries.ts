// UI texts (everything that isn't CV content) in every language.
// English defines the shape; Spanish and French must match it exactly (TypeScript checks it).
// Texts with {placeholders} are filled in with t("Job {i} of {n}", { i: 2, n: 5 }).
// Only plain strings here (no functions), so they can be passed to Client Components too.

import type { Lang } from "@/i18n/config";
import type { FilterId } from "@/lib/vision";

type FilterText = { label: string; explain: string; note?: string };
// Annotated types (not "as"): TypeScript checks every filter / palette has a text, in every language.
type FilterTexts = Record<FilterId, FilterText>;
type PaletteNames = Record<string, string>; // palette id → name (palettes.test.ts checks none is missing)

// A separate annotated constant: TypeScript checks every filter has an English text
const EN_FILTERS: FilterTexts = {
  original: { label: "Original", explain: "What the camera captures: a grid of red, green and blue numbers from 0 to 255." },
  grayscale: {
    label: "Grayscale",
    explain: "Brightness = 0.299·R + 0.587·G + 0.114·B. Green weighs most because our eyes are most sensitive to it. Most vision algorithms start here.",
  },
  blur: { label: "Gaussian blur", explain: "Each pixel becomes a weighted average of its neighbours. It removes noise before detecting edges.", note: "÷ 16" },
  sharpen: { label: "Sharpen", explain: "Boost the center, subtract the neighbours: differences get bigger, so details pop." },
  edges: {
    label: "Edges (Sobel)",
    explain: "Measures how fast brightness changes. Edges are the first step for lane detection, robots finding objects, or reading text.",
    note: "+ its vertical twin",
  },
  emboss: {
    label: "Emboss",
    explain: "Bright on one diagonal side, dark on the other: surfaces look lit from one corner, like a relief. The weights add up to 1, so overall brightness stays the same.",
  },
  threshold: { label: "Threshold", explain: "Every pixel becomes black or white. The simplest segmentation: separate the object from the background." },
};

const en = {
  meta: {
    title: "Joaquin Opazo Yentzen · Software Engineer",
    description: "Software engineer in C++, Python, robotics and embedded systems, based in Chambéry, France.",
    cvTitle: "Joaquin Opazo Yentzen · CV",
  },
  nav: { sections: "Sections", experience: "Experience", offTheClock: "Off the clock", vision: "Vision", labs: "UTS Labs", contact: "Contact" },
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
  },
  experience: {
    label: "Experience",
    title: "Experience",
    education: "Education",
    awards: "Awards",
    leadership: "Leadership",
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
  vision: {
    label: "Vision",
    title: "How a machine sees",
    intro:
      "I think visually, which is why I studied image processing and computer vision. To a computer, an image is just a grid of numbers, and a filter is a tiny grid that slides over it. Try it:",
    filterGroup: "Filter",
    original: "Original",
    compare: "Compare",
    level: "Level {level}",
    sampleScene: "Sample scene",
    yourPhoto: "Your photo",
    liveCamera: "Live camera",
    stopCamera: "Stop camera",
    privacy: "Processed in your browser, never uploaded",
    cameraError: "Camera not available, or permission was denied.",
    imageLabel: "{filter} applied to the {source}",
    sources: { scene: "sample mountain scene", photo: "photo", camera: "camera" },
    noKernel: "No kernel: each pixel is changed on its own.",
    kernel: "Kernel",
    howTitle: "How a filter works",
    howText: "Slide a 3×3 kernel over every pixel: multiply each neighbour by its weight and add them up",
    here: "Here:",
    clampedTo: "clamped to",
    cnnBefore: "A convolutional neural network (CNN) does exactly this, but",
    cnnLearns: "learns",
    cnnAfter: "thousands of kernels by itself.",
    filters: EN_FILTERS,
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
  nav: { sections: "Secciones", experience: "Experiencia", offTheClock: "Fuera de horario", vision: "Visión", labs: "UTS Labs", contact: "Contacto" },
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
  },
  experience: {
    label: "Experiencia",
    title: "Experiencia",
    education: "Formación",
    awards: "Premios",
    leadership: "Liderazgo",
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
  vision: {
    label: "Visión",
    title: "Cómo ve una máquina",
    intro:
      "Pienso de forma visual, por eso estudié procesamiento de imágenes y visión por computador. Para un computador, una imagen es solo una grilla de números, y un filtro es una grilla pequeña que se desliza sobre ella. Pruébalo:",
    filterGroup: "Filtro",
    original: "Original",
    compare: "Comparar",
    level: "Nivel {level}",
    sampleScene: "Escena de ejemplo",
    yourPhoto: "Tu foto",
    liveCamera: "Cámara en vivo",
    stopCamera: "Detener cámara",
    privacy: "Procesado en tu navegador, nunca se sube",
    cameraError: "Cámara no disponible, o se negó el permiso.",
    imageLabel: "{filter} aplicado a la {source}",
    sources: { scene: "escena de montaña de ejemplo", photo: "foto", camera: "cámara" },
    noKernel: "Sin kernel: cada píxel se cambia por sí solo.",
    kernel: "Kernel",
    howTitle: "Cómo funciona un filtro",
    howText: "Desliza un kernel de 3×3 sobre cada píxel: multiplica cada vecino por su peso y súmalos",
    here: "Aquí:",
    clampedTo: "limitado a",
    cnnBefore: "Una red neuronal convolucional (CNN) hace exactamente esto, pero",
    cnnLearns: "aprende",
    cnnAfter: "miles de kernels por sí sola.",
    filters: {
      original: { label: "Original", explain: "Lo que captura la cámara: una grilla de números rojos, verdes y azules, de 0 a 255." },
      grayscale: {
        label: "Escala de grises",
        explain: "Brillo = 0,299·R + 0,587·G + 0,114·B. El verde pesa más porque nuestros ojos son más sensibles a él. La mayoría de los algoritmos de visión empiezan aquí.",
      },
      blur: { label: "Desenfoque gaussiano", explain: "Cada píxel se vuelve un promedio ponderado de sus vecinos. Elimina el ruido antes de detectar bordes.", note: "÷ 16" },
      sharpen: { label: "Enfocar", explain: "Refuerza el centro y resta los vecinos: las diferencias crecen y los detalles resaltan." },
      edges: {
        label: "Bordes (Sobel)",
        explain: "Mide qué tan rápido cambia el brillo. Los bordes son el primer paso para detectar carriles, que un robot encuentre objetos o leer texto.",
        note: "+ su gemelo vertical",
      },
      emboss: {
        label: "Relieve",
        explain: "Claro en un lado diagonal y oscuro en el otro: las superficies parecen iluminadas desde una esquina, como un relieve. Los pesos suman 1, así que el brillo general se mantiene.",
      },
      threshold: { label: "Umbral", explain: "Cada píxel se vuelve negro o blanco. La segmentación más simple: separar el objeto del fondo." },
    },
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
  nav: { sections: "Sections", experience: "Expérience", offTheClock: "Hors du bureau", vision: "Vision", labs: "UTS Labs", contact: "Contact" },
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
  },
  experience: {
    label: "Expérience",
    title: "Expérience",
    education: "Formation",
    awards: "Prix",
    leadership: "Engagement",
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
  vision: {
    label: "Vision",
    title: "Comment voit une machine",
    intro:
      "Je pense en images, c'est pourquoi j'ai étudié le traitement d'images et la vision par ordinateur. Pour un ordinateur, une image n'est qu'une grille de nombres, et un filtre est une petite grille qui glisse dessus. Essayez :",
    filterGroup: "Filtre",
    original: "Original",
    compare: "Comparer",
    level: "Niveau {level}",
    sampleScene: "Scène d'exemple",
    yourPhoto: "Votre photo",
    liveCamera: "Caméra en direct",
    stopCamera: "Arrêter la caméra",
    privacy: "Traité dans votre navigateur, jamais envoyé",
    cameraError: "Caméra indisponible, ou autorisation refusée.",
    imageLabel: "{filter} appliqué à la {source}",
    sources: { scene: "scène de montagne d'exemple", photo: "photo", camera: "caméra" },
    noKernel: "Pas de noyau : chaque pixel est modifié seul.",
    kernel: "Noyau",
    howTitle: "Comment marche un filtre",
    howText: "On fait glisser un noyau 3×3 sur chaque pixel : chaque voisin est multiplié par son poids, puis on additionne",
    here: "Ici :",
    clampedTo: "ramené à",
    cnnBefore: "Un réseau de neurones convolutif (CNN) fait exactement cela, mais",
    cnnLearns: "apprend",
    cnnAfter: "seul des milliers de noyaux.",
    filters: {
      original: { label: "Original", explain: "Ce que capte la caméra : une grille de nombres rouges, verts et bleus, de 0 à 255." },
      grayscale: {
        label: "Niveaux de gris",
        explain: "Luminosité = 0,299·R + 0,587·G + 0,114·B. Le vert pèse le plus car nos yeux y sont les plus sensibles. La plupart des algorithmes de vision commencent ici.",
      },
      blur: { label: "Flou gaussien", explain: "Chaque pixel devient une moyenne pondérée de ses voisins. On retire le bruit avant de détecter les contours.", note: "÷ 16" },
      sharpen: { label: "Netteté", explain: "On renforce le centre et on soustrait les voisins : les différences grandissent, les détails ressortent." },
      edges: {
        label: "Contours (Sobel)",
        explain: "Mesure la vitesse à laquelle la luminosité change. Les contours sont la première étape pour détecter des voies, trouver des objets ou lire du texte.",
        note: "+ son jumeau vertical",
      },
      emboss: {
        label: "Relief",
        explain: "Clair d'un côté de la diagonale, sombre de l'autre : les surfaces semblent éclairées depuis un coin, comme un relief. Les poids font 1 au total, la luminosité générale reste la même.",
      },
      threshold: { label: "Seuillage", explain: "Chaque pixel devient noir ou blanc. La segmentation la plus simple : séparer l'objet du fond." },
    },
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
