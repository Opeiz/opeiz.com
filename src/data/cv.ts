// My CV as data, in 3 languages. Written once, used everywhere (home page, /cv, later Supabase).
//
// How it's organized:
//   - SOURCE data (below, what I edit): every text is { en, es, fr }; dates, logos, links are shared.
//   - getCv(lang) turns it into a plain CV in ONE language (same shape the pages always used).
// If a translation is missing, TypeScript stops the build and points at it.
//
// French texts follow my original French CV. Spanish and the newer texts are translations: review them.

import type { L, Lang } from "@/i18n/config";

// ---------- Types: what the pages receive (one language) ----------

/** A month in "YYYY-MM" format, e.g. "2025-07". */
export type YearMonth = `${number}-${number}`;

/** One block on the CV: a job, a degree, an award or an activity. */
export type Entry = {
  slug: string; // unique id, e.g. "iter-systems"
  title: string;
  org: string;
  logo?: string; // file in /public, e.g. "/logos/iter-systems.png" (initials are shown without it)
  location: string;
  start: YearMonth;
  end: YearMonth | null; // null = "Present"
  highlights: string[]; // bullet points
  tags?: string[];
};

export type SkillGroup = { name: string; items: string[] };

/** Icon names (the drawings live in src/components/Icon.tsx, data stays free of React). */
export type IconName =
  | "drone"
  | "sailboat"
  | "palette"
  | "swords"
  | "brush"
  | "disc"
  | "globe"
  | "languages"
  | "graduation"
  | "trophy"
  | "users"
  | "cpu"
  | "tree"
  | "rat"
  | "dog"
  | "wrench";

/** Something with an icon and a sentence: hobbies, fun facts... */
export type IconItem = {
  icon: IconName;
  title?: string;
  text: string;
  image?: string; // photo in /public shown on hover (hobbies). Ignored until the file exists.
};

export type CV = {
  lang: Lang;
  name: string;
  firstName: string;
  role: string;
  motto: string; // personal slogan
  summary: string[];
  photo?: string; // file in /public, e.g. "/me.jpg"; initials are shown until it's set
  location: string;
  email: string;
  links: { label: string; href: string }[];
  pdfUrl?: string; // the "Download PDF" button only shows when this is set
  experience: Entry[];
  education: Entry[];
  projects: Entry[];
  activities: Entry[];
  skills: SkillGroup[];
  languages: { name: string; level: string }[];
  softSkills: string[];
  hobbies: IconItem[];
  funFacts: IconItem[];
  platforms: Platform[];
  ventures: Venture[];
};

/**
 * A coding practice site (HackerRank, CodinGame...). `logo` picks a brand logo in the page;
 * `banner` is a LIVE image the site itself draws (it updates by itself as I solve more).
 */
export type Platform = {
  name: string;
  url: string;
  logo?: "hackerrank"; // brands without a square logo show their initials
  text: string;
  banner?: { src: string; width: number; height: number };
  certificates: { name: string; url: string }[];
};

/** Something I founded or am building (e.g. UTS Labs). */
export type Venture = { name: string; role: string; text: string; status: "soon" | "live" };

// ---------- Types: the source (every text in every language) ----------

type LList = Record<Lang, string[]>; // a list of texts per language

type SourceEntry = Omit<Entry, "title" | "location" | "highlights"> & { title: L; location: L; highlights: LList };
type SourceIconItem = { icon: IconName; title?: L; text: L; image?: string };

/**
 * The full source shape. "const source: Source" makes TypeScript CHECK every object
 * (a missing "fr" is an error). Don't use "as Source": "as" only asserts and would hide it.
 */
type Source = {
  name: string;
  firstName: string;
  role: L;
  motto: L;
  summary: LList;
  location: L;
  email: string;
  links: { label: string; href: string }[];
  pdfUrl?: Partial<L>; // one PDF per language, any can be missing
  experience: SourceEntry[];
  education: SourceEntry[];
  projects: SourceEntry[];
  activities: SourceEntry[];
  skills: { name: L; items: string[] }[];
  languages: { name: L; level: L }[];
  softSkills: LList;
  hobbies: SourceIconItem[];
  funFacts: SourceIconItem[];
  platforms: (Omit<Platform, "text" | "certificates"> & { text: L; certificates: { name: L; url: string }[] })[];
  ventures: { name: string; role: L; text: L; status: Venture["status"] }[];
};

// ---------- The data ----------

const source: Source = {
  name: "Joaquin Opazo Yentzen",
  firstName: "Joaquin",
  role: {
    en: "Software Engineer · Embedded Systems · Robotics",
    es: "Ingeniero de Software · Sistemas Embebidos · Robótica",
    fr: "Ingénieur Développement Logiciel · Systèmes Embarqués · Robotique",
  },
  // My personal slogan
  motto: { en: "Understand, then solve.", es: "Entender, luego resolver.", fr: "Comprendre, puis résoudre." },
  // DRAFT written from my CV: rewrite in my own voice
  summary: {
    en: [
      "I'm a software engineer working where code meets hardware: C++/Qt applications, robotics with ROS, and Python automation.",
      "Today I'm at ITER Systems near Chambéry, building the software that displays, controls and pilots uncrewed surface vessels. Before that: Dassault Systèmes, CNRS research, and drones in Chile.",
      "I like turning messy, manual work into clean, automated systems, and I use AI agents every day to get there faster.",
    ],
    es: [
      "Soy ingeniero de software y trabajo donde el código se encuentra con el hardware: aplicaciones C++/Qt, robótica con ROS y automatización en Python.",
      "Hoy estoy en ITER Systems, cerca de Chambéry, desarrollando el software que visualiza, controla y pilotea drones de superficie. Antes: Dassault Systèmes, investigación en el CNRS y drones en Chile.",
      "Me gusta convertir trabajo manual y desordenado en sistemas limpios y automatizados, y uso agentes de IA todos los días para lograrlo más rápido.",
    ],
    fr: [
      "Je suis ingénieur logiciel, là où le code rencontre le matériel : applications C++/Qt, robotique avec ROS et automatisation en Python.",
      "Aujourd'hui chez ITER Systems, près de Chambéry, je développe le logiciel qui affiche, contrôle et pilote des drones de surface. Avant : Dassault Systèmes, la recherche au CNRS et les drones au Chili.",
      "J'aime transformer un travail manuel et désordonné en systèmes propres et automatisés, et j'utilise des agents d'IA chaque jour pour y arriver plus vite.",
    ],
  },
  // photo: "/me.jpg", // TODO: add a square photo to /public and uncomment
  location: { en: "Chambéry, France", es: "Chambéry, Francia", fr: "Chambéry, France" },
  email: "ja.opazoy@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/Opeiz" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/joaquin-opazo-yentzen/" },
  ],
  // TODO: PDFs without my phone number → put them in public/cv/ and fill in (one per language):
  // pdfUrl: { en: "/cv/joaquin-opazo-cv-en.pdf", fr: "/cv/joaquin-opazo-cv-fr.pdf" },

  experience: [
    {
      slug: "iter-systems",
      logo: "/logos/iter-systems.png",
      title: {
        en: "C++ / Python Software & Automation Engineer",
        es: "Ingeniero de Software C++ / Python y Automatización",
        fr: "Ingénieur Logiciel C++ / Python & Automatisation",
      },
      org: "ITER Systems",
      location: { en: "La Motte-Servolex, France", es: "La Motte-Servolex, Francia", fr: "La Motte-Servolex, France" },
      start: "2025-07",
      end: null,
      highlights: {
        en: [
          "Built the C++/Qt architecture for 2D/3D display and control communication of a 3-component software suite.",
          "Set up the ROS architecture used to pilot uncrewed surface vessels.",
          "Use AI agents and Claude Code daily to speed up development and optimize pipelines.",
          "Automated testing and enterprise file parsing in Python to modernize 3 major software modules.",
        ],
        es: [
          "Desarrollo de la arquitectura C++/Qt para la visualización 2D/3D y la comunicación de control de una suite de software de 3 componentes.",
          "Configuración de la arquitectura ROS para el pilotaje de drones de superficie.",
          "Uso diario de agentes de IA y Claude Code para acelerar el desarrollo y optimizar los pipelines.",
          "Automatización de pruebas y lectura de archivos empresariales en Python para modernizar 3 módulos de software principales.",
        ],
        fr: [
          "Développement de l'architecture C++/Qt pour l'affichage 2D/3D et la communication par contrôle d'une suite logicielle de 3 composants.",
          "Configuration de l'architecture ROS pour le pilotage de drones de surface.",
          "Intégration quotidienne d'agents d'IA et de Claude Code pour l'accélération du développement et l'optimisation des pipelines.",
          "Automatisation des tests et lecture de fichiers d'entreprise en Python pour moderniser 3 modules logiciels majeurs.",
        ],
      },
      tags: ["C++", "Qt", "ROS", "Python"],
    },
    {
      slug: "dassault-systemes",
      logo: "/logos/dassault-systemes.png",
      title: {
        en: "Software & API Integration Engineer",
        es: "Ingeniero de Software e Integración de APIs",
        fr: "Ingénieur Logiciel & Intégration d'APIs",
      },
      org: "Dassault Systèmes",
      location: { en: "Vélizy-Villacoublay, France", es: "Vélizy-Villacoublay, Francia", fr: "Vélizy-Villacoublay, France" },
      start: "2024-04",
      end: "2024-10",
      highlights: {
        en: [
          "Final-year internship: designed a new control panel in C++ and Python to automate HDR and 360° image generation.",
          "Integrated AI agents and REST APIs to optimize visual workflows, fully automating the processing pipeline and cutting parallel computation time.",
        ],
        es: [
          "Práctica de fin de estudios: diseño de un nuevo panel de control en C++ y Python para automatizar la generación de imágenes HDR y 360°.",
          "Integración de agentes de IA y APIs REST para optimizar los flujos visuales, automatizando por completo el pipeline de procesamiento y reduciendo los tiempos de cálculo simultáneos.",
        ],
        fr: [
          "Stage de fin d'études : conception d'un panneau de contrôle innovant en C++ et Python pour l'automatisation de la génération d'images HDR et 360°.",
          "Intégration d'agents d'IA et d'APIs REST pour optimiser les flux visuels, automatisant complètement le pipeline de traitement et réduisant les temps de calculs simultanés.",
        ],
      },
      tags: ["C++", "Python", "REST API"],
    },
    {
      slug: "cnrs-lab-sticc",
      logo: "/logos/lab-sticc.png",
      title: {
        en: "R&D Engineer, Data Processing",
        es: "Ingeniero de I+D en Procesamiento de Datos",
        fr: "Ingénieur Recherche & Développement en Traitement de Données",
      },
      org: "CNRS, Lab-STICC",
      location: { en: "Brest, France", es: "Brest, Francia", fr: "Brest, France" },
      start: "2023-04",
      end: "2023-07",
      highlights: {
        en: [
          "Research internship on satellite image interpolation to estimate sea surface height.",
          "Wrote Python and PyTorch scripts on Linux to automate the evaluation of machine learning models (4DVarNet), making analysis 25% faster on real datasets.",
        ],
        es: [
          "Práctica de investigación sobre la interpolación de imágenes satelitales para estimar la altura del mar.",
          "Desarrollo de scripts en Python y PyTorch bajo Linux para automatizar la evaluación de modelos de aprendizaje automático (4DVarNet), acelerando un 25% el análisis sobre datos reales.",
        ],
        fr: [
          "Stage de recherche centré sur l'interpolation d'images satellitaires pour l'estimation de la hauteur de la mer.",
          "Développement de scripts en Python et PyTorch pour l'automatisation de l'évaluation de modèles d'apprentissage automatique (4DVarNet) sous Linux, améliorant de 25% la rapidité d'analyse sur des bases de données réelles.",
        ],
      },
      tags: ["Python", "PyTorch", "Linux"],
    },
    {
      slug: "utfsm-teaching",
      logo: "/logos/utfsm.png",
      title: {
        en: "Teaching Assistant, Software Engineering & AI",
        es: "Ayudante Docente, Ingeniería de Software e IA",
        fr: "Assistant d'Enseignement, Génie Logiciel & IA",
      },
      org: "UTFSM",
      location: { en: "Valparaíso, Chile", es: "Valparaíso, Chile", fr: "Valparaíso, Chili" },
      start: "2019-08",
      end: "2022-12",
      highlights: {
        en: [
          "Taught and mentored students in software engineering and deep learning, supporting 75+ students per term.",
          "Automated the grading of coding assignments and built algorithm visualization tools in Python and C++.",
        ],
        es: [
          "Apoyo docente a estudiantes de ingeniería de software y deep learning, con acompañamiento personalizado a más de 75 estudiantes por semestre.",
          "Automatización de la corrección de ejercicios de programación y creación de herramientas de visualización de algoritmos en Python y C++.",
        ],
        fr: [
          "Encadrement pédagogique des étudiants en génie logiciel et deep learning, avec un accompagnement personnalisé de plus de 75 étudiants par session.",
          "Automatisation de la correction de codes pratiques et création de modules de visualisation d'algorithmes en Python et C++.",
        ],
      },
      tags: ["Python", "C++", "Deep Learning"],
    },
    {
      slug: "robomotic",
      logo: "/logos/robomotic.png",
      title: {
        en: "Robotics Systems Integration Engineer",
        es: "Ingeniero de Integración de Sistemas Robóticos",
        fr: "Ingénieur Intégration & Systèmes Robotiques",
      },
      org: "Robomotic SPA",
      location: { en: "Santiago, Chile", es: "Santiago, Chile", fr: "Santiago, Chili" },
      start: "2020-11",
      end: "2022-03",
      highlights: {
        en: [
          "Designed, programmed and assembled control software for custom drones.",
          "Automated flight tests, calibrated onboard sensors and handled the technical client relationship, reaching a 100% pass rate in hardware/software validation.",
        ],
        es: [
          "Diseño, programación y ensamblaje de software de control para drones personalizados.",
          "Automatización de pruebas de vuelo, calibración de sensores embarcados y gestión técnica de la relación con el cliente, logrando un 100% de éxito en las validaciones de hardware/software.",
        ],
        fr: [
          "Conception, programmation et assemblage de logiciels de contrôle pour drones personnalisés.",
          "Automatisation des tests de vol, calibrage des capteurs embarqués et gestion technique de la relation client, atteignant un taux de réussite de 100% lors des validations matérielles/logicielles (SW/HW).",
        ],
      },
      tags: ["Drones", "Embedded", "Testing"],
    },
  ],

  education: [
    {
      slug: "imt-atlantique",
      logo: "/logos/imt-atlantique.png",
      title: {
        en: "Master's-level Engineering Degree (Diplôme d'Ingénieur)",
        es: "Título de Ingeniero, nivel máster (Diplôme d'Ingénieur)",
        fr: "Diplôme d'Ingénieur Généraliste",
      },
      org: "IMT Atlantique",
      location: { en: "Brest, France", es: "Brest, Francia", fr: "Brest, France" },
      start: "2022-07",
      end: "2025-02",
      highlights: {
        en: [
          "Double degree in computer engineering, specialized in software development and embedded systems.",
          "Programming (Python, C++), software design and hardware/software integration.",
        ],
        es: [
          "Doble título en ingeniería informática, especializado en desarrollo de software y sistemas embebidos.",
          "Programación (Python, C++), diseño de software e integración de sistemas hardware/software.",
        ],
        fr: [
          "Double diplôme en ingénierie informatique, spécialisé dans le développement logiciel et les systèmes embarqués.",
          "Programmation (Python, C++), conception de logiciels et intégration de systèmes matériels et logiciels (SW/HW).",
        ],
      },
    },
    {
      slug: "utfsm",
      logo: "/logos/utfsm.png",
      title: {
        en: "Telematics Engineering Degree",
        es: "Ingeniería Civil Telemática",
        fr: "Diplôme d'Ingénieur Télématique",
      },
      org: "UTFSM",
      location: { en: "Valparaíso, Chile", es: "Valparaíso, Chile", fr: "Valparaíso, Chili" },
      start: "2017-03",
      end: "2025-02",
      highlights: {
        en: [
          "Double degree focused on software development and embedded systems.",
          "Image processing, computer vision, digital systems, OOP, databases and electronic design.",
        ],
        es: [
          "Doble título enfocado en desarrollo de software y sistemas embebidos.",
          "Procesamiento de imágenes, visión por computador, sistemas digitales, POO, bases de datos y diseño electrónico.",
        ],
        fr: [
          "Double diplôme axé sur le développement logiciel et les systèmes embarqués.",
          "Traitement d'images, vision par ordinateur, systèmes numériques, programmation orientée objet (POO), bases de données et conception électronique.",
        ],
      },
    },
  ],

  projects: [
    {
      slug: "thales-risc-v",
      logo: "/logos/thales.png",
      title: {
        en: "1st Prize, 4th Thales RISC-V Student Contest",
        es: "1er Premio, 4° Concurso Estudiantil Thales RISC-V",
        fr: "1er Prix du 4e Concours Étudiant Thales RISC-V",
      },
      org: "Thales, CNRS",
      location: { en: "France", es: "Francia", fr: "France" },
      start: "2023-09",
      end: "2024-04",
      highlights: {
        en: [
          "Optimized a handwritten digit recognition algorithm (MNIST) on a RISC-V platform.",
          "Implemented it on a Zynq 7000 FPGA using hardware and software development tools.",
        ],
        es: [
          "Optimización de un algoritmo de reconocimiento de dígitos (MNIST) sobre una plataforma RISC-V.",
          "Implementación en una FPGA Zynq 7000 con herramientas de desarrollo de hardware y software.",
        ],
        fr: [
          "Optimisation d'un algorithme de reconnaissance de chiffres (MNIST) sur plateforme RISC-V.",
          "Implémentation sur FPGA Zynq 7000 avec outils de développement matériels et logiciels.",
        ],
      },
      tags: ["RISC-V", "FPGA", "Vivado", "Verilog", "Vitis", "Linux", "MNIST"],
    },
  ],

  activities: [
    {
      slug: "bdi-president",
      logo: "/logos/bdi.png",
      title: {
        en: "President, International Students Office (BDI)",
        es: "Presidente, Oficina de Estudiantes Internacionales (BDI)",
        fr: "Président du Bureau des Étudiants Internationaux (BDI)",
      },
      org: "IMT Atlantique",
      location: { en: "Brest, France", es: "Brest, Francia", fr: "Brest, France" },
      start: "2023-01",
      end: "2024-01",
      highlights: {
        en: [
          "Led a team of 6 volunteers helping ~100 international students settle in: ~6 events, group management and day-to-day support (arrival, paperwork, campus life).",
        ],
        es: [
          "Lideré un equipo de 6 voluntarios para facilitar la integración de ~100 estudiantes internacionales: ~6 eventos, gestión de grupos y acompañamiento diario (llegada, trámites, vida en el campus).",
        ],
        fr: [
          "Dirigé une équipe de 6 bénévoles pour faciliter l'intégration de ~100 étudiants internationaux : organisation de ~6 événements, gestion de groupes et accompagnement personnalisé au quotidien (accueil, démarches, vie sur le campus).",
        ],
      },
    },
  ],

  skills: [
    { name: { en: "Languages & Libraries", es: "Lenguajes y Librerías", fr: "Langages & Bibliothèques" }, items: ["Python", "C++", "OOP", "Qt/QML", "VTK", "OpenCV"] },
    { name: { en: "DevOps", es: "DevOps", fr: "DevOps" }, items: ["GitLab", "Linux", "Docker", "Kubernetes"] },
    { name: { en: "AI & Robotics", es: "IA y Robótica", fr: "IA & Robotique" }, items: ["PyTorch", "TensorFlow", "ROS", "QGroundControl"] },
    { name: { en: "Tools", es: "Herramientas", fr: "Outils" }, items: ["REST APIs", "Claude Code", "VS Code", "AI agents"] },
  ],

  languages: [
    { name: { en: "Spanish", es: "Español", fr: "Espagnol" }, level: { en: "Native", es: "Nativo", fr: "Langue maternelle" } },
    { name: { en: "English", es: "Inglés", fr: "Anglais" }, level: { en: "C1 (IELTS)", es: "C1 (IELTS)", fr: "C1 (IELTS)" } },
    { name: { en: "French", es: "Francés", fr: "Français" }, level: { en: "C1 (DELF)", es: "C1 (DELF)", fr: "C1 (DELF)" } },
  ],

  softSkills: {
    en: ["Strong team spirit", "Peer support and mentoring", "Complex problem solving", "Leadership"],
    es: ["Gran espíritu de equipo", "Apoyo y acompañamiento a pares", "Resolución de problemas complejos", "Liderazgo"],
    fr: ["Esprit d'équipe prononcé", "Entraide et support aux pairs", "Résolution de problèmes complexes", "Leadership"],
  },

  // DRAFT: make these sound like me
  // image: drop a photo with that name in public/hobbies/ and it shows on hover (no code change)
  hobbies: [
    {
      icon: "sailboat",
      image: "/hobbies/sailing.jpg",
      title: { en: "Sailing", es: "Vela", fr: "Voile" },
      text: {
        en: "Skipper with the French Sailing Federation.",
        es: "Patrón (skipper) de la Federación Francesa de Vela.",
        fr: "Skipper à la Fédération Française de Voile.",
      },
    },
    {
      icon: "drone",
      image: "/hobbies/fpv-drone.jpg",
      title: { en: "FPV drone racing", es: "Carreras de drones FPV", fr: "Course de drones FPV" },
      text: {
        en: "Racing small drones in first-person view, through goggles.",
        es: "Carreras de drones pequeños en primera persona, con gafas FPV.",
        fr: "Des courses de petits drones en vue subjective, avec un casque FPV.",
      },
    },
    {
      icon: "palette",
      image: "/hobbies/graphic-design.jpg",
      title: { en: "Graphic design", es: "Diseño gráfico", fr: "Design graphique" },
      text: {
        en: "My creative side, away from the code.",
        es: "Mi lado creativo, lejos del código.",
        fr: "Mon côté créatif, loin du code.",
      },
    },
    {
      icon: "swords",
      image: "/hobbies/riftbound.jpg",
      title: { en: "Riftbound player", es: "Jugador de Riftbound", fr: "Joueur de Riftbound" },
      text: {
        en: "The League of Legends trading card game: building decks and planning every turn.",
        es: "El juego de cartas coleccionables de League of Legends: armar mazos y planificar cada turno.",
        fr: "Le jeu de cartes à collectionner de League of Legends : construire des decks et planifier chaque tour.",
      },
    },
    {
      icon: "brush",
      image: "/hobbies/miniatures.jpg",
      title: { en: "Miniature painting", es: "Pintura de miniaturas", fr: "Peinture de figurines" },
      text: {
        en: "Bringing tiny figures to life, one brushstroke at a time.",
        es: "Dar vida a figuras diminutas, pincelada a pincelada.",
        fr: "Donner vie à de toutes petites figurines, un coup de pinceau à la fois.",
      },
    },
    {
      icon: "disc",
      image: "/hobbies/dj.jpg",
      title: { en: "DJ", es: "DJ", fr: "DJ" },
      text: {
        en: "Mixing tracks and reading the room from behind the decks.",
        es: "Mezclar canciones y leer a la pista desde las tornamesas.",
        fr: "Mixer des morceaux et sentir la piste depuis les platines.",
      },
    },
  ],

  // My fun facts: add new ones here (all 3 languages)
  funFacts: [
    {
      icon: "tree",
      text: {
        en: "I met 5 of my 8 great-grandparents.",
        es: "Conocí a 5 de mis 8 bisabuelos.",
        fr: "J'ai connu 5 de mes 8 arrière-grands-parents.",
      },
    },
    {
      icon: "rat",
      text: {
        en: "One of my many nicknames is Splinter, for my love of cheese and video games.",
        es: "Uno de mis miles de sobrenombres es Splinter, por mi amor al queso y los videojuegos.",
        fr: "L'un de mes mille surnoms est Splinter, pour mon amour du fromage et des jeux vidéo.",
      },
    },
    {
      icon: "dog",
      text: { en: "Team dog, all the way.", es: "Soy team perro.", fr: "Team chien, sans hésiter." },
    },
    {
      icon: "wrench",
      text: {
        en: "I love knowing how things work, so I take everything apart.",
        es: "Me encanta saber cómo funcionan las cosas, por eso desarmo todo.",
        fr: "J'adore savoir comment les choses fonctionnent, alors je démonte tout.",
      },
    },
  ],

  // Where I practice problem solving (shown under the puzzle)
  platforms: [
    {
      name: "CodinGame",
      url: "https://www.codingame.com/profile/fc82c2dc7dc4d51fd9976ce6249ee7be6996126",
      text: {
        en: "Bot programming and algorithm puzzles",
        es: "Programación de bots y puzzles de algoritmos",
        fr: "Programmation de bots et puzzles d'algorithmes",
      },
      certificates: [],
    },
    {
      name: "CodeAbbey",
      url: "https://www.codeabbey.com/index/user_profile/tgn",
      text: { 
        en: "Classic programming problems", 
        es: "Problemas de programación clásicos", 
        fr: "Problèmes de programmation classiques" 
      },
      banner: { src: "https://www.codeabbey.com/index/user_banner/tgn.png", width: 200, height: 60 },
      certificates: [],
    },
    {
      name: "HackerRank",
      url: "https://www.hackerrank.com/ja_opazoy",
      logo: "hackerrank",
      text: { 
        en: "Verified skill certificates", 
        es: "Certificados de habilidades verificados", 
        fr: "Certificats de compétences vérifiés" 
      },
      certificates: [
        {
          name: { en: "Python (Basic)", es: "Python (Básico)", fr: "Python (Basique)" },
          url: "https://www.hackerrank.com/certificates/dd4a8a43d886",
        },
        {
          name: { en: "Software Engineer", es: "Ingeniero de Software", fr: "Ingénieur Logiciel" },
          url: "https://www.hackerrank.com/certificates/c4ac9dacea2e",
        },
      ],
    },
  ],

  // Things I founded. status "soon" shows a "Coming soon" badge.
  ventures: [
    {
      name: "UTS Labs",
      role: { en: "Founder", es: "Fundador", fr: "Fondateur" },
      // DRAFT: describe UTS Labs when it's ready to share
      text: {
        en: "Something new is being built. More soon.",
        es: "Algo nuevo se está construyendo. Pronto, más noticias.",
        fr: "Quelque chose de nouveau se prépare. Plus d'infos bientôt.",
      },
      status: "soon",
    },
  ],
};

// ---------- One language ----------

function entryIn(entry: SourceEntry, lang: Lang): Entry {
  return { ...entry, title: entry.title[lang], location: entry.location[lang], highlights: entry.highlights[lang] };
}

function iconItemIn(item: SourceIconItem, lang: Lang): IconItem {
  return { icon: item.icon, title: item.title?.[lang], text: item.text[lang], image: item.image };
}

/** The whole CV in one language. Pages call getCv("fr") and get plain strings. */
export function getCv(lang: Lang): CV {
  const s = source;
  return {
    lang,
    name: s.name,
    firstName: s.firstName,
    role: s.role[lang],
    motto: s.motto[lang],
    summary: s.summary[lang],
    location: s.location[lang],
    email: s.email,
    links: s.links,
    pdfUrl: s.pdfUrl?.[lang],
    experience: s.experience.map((e) => entryIn(e, lang)),
    education: s.education.map((e) => entryIn(e, lang)),
    projects: s.projects.map((e) => entryIn(e, lang)),
    activities: s.activities.map((e) => entryIn(e, lang)),
    skills: s.skills.map((g) => ({ name: g.name[lang], items: g.items })),
    languages: s.languages.map((l) => ({ name: l.name[lang], level: l.level[lang] })),
    softSkills: s.softSkills[lang],
    hobbies: s.hobbies.map((h) => iconItemIn(h, lang)),
    funFacts: s.funFacts.map((f) => iconItemIn(f, lang)),
    platforms: s.platforms.map((p) => ({
      ...p,
      text: p.text[lang],
      certificates: p.certificates.map((c) => ({ name: c.name[lang], url: c.url })),
    })),
    ventures: s.ventures.map((v) => ({ name: v.name, role: v.role[lang], text: v.text[lang], status: v.status })),
  };
}

// ---------- Dates ----------

const MONTHS: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"],
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
};
const PRESENT: L = { en: "Present", es: "Actualidad", fr: "Aujourd'hui" };

/** "2025-07" → "Jul 2025" / "jul 2025" / "juil. 2025" */
export function formatMonth(value: YearMonth, lang: Lang = "en"): string {
  const [year, month] = value.split("-");
  return `${MONTHS[lang][Number(month) - 1]} ${year}`;
}

/** Entry dates → "Jul 2025 – Present" */
export function formatRange(start: YearMonth, end: YearMonth | null, lang: Lang = "en"): string {
  return `${formatMonth(start, lang)} – ${end ? formatMonth(end, lang) : PRESENT[lang]}`;
}
