// My CV as data. Written once, used everywhere:
//   - the /cv page (Phase 1)
//   - the board game cards (Phase 2)
//   - later moved into Supabase (Phase 3)
// Keeping DATA separate from DISPLAY means changing a job here updates every page.

// ---------- Types: the "shape" of the data ----------

/** A month in "YYYY-MM" format, e.g. "2025-07". */
export type YearMonth = `${number}-${number}`;

/** One block on the CV: a job, a degree, a project or an activity. */
export type Entry = {
  slug: string; // unique id, e.g. "iter-systems" (the board squares will use it)
  title: string; // "Software Engineer"
  org: string; // "ITER Systems"
  logo?: string; // file in /public, e.g. "/logos/iter-systems.png" (initials are shown without it)
  location: string;
  start: YearMonth;
  end: YearMonth | null; // null = "Present"
  highlights: string[]; // bullet points
  tags?: string[]; // optional (the "?" means it can be missing)
};

export type SkillGroup = { name: string; items: string[] };

/** Icon names (the drawings live in src/components/Icon.tsx, data stays free of React). */
export type IconName = "drone" | "sailboat" | "palette" | "globe" | "languages" | "graduation" | "trophy" | "users" | "cpu";

/** Something with an icon and a sentence: hobbies, fun facts... */
export type IconItem = { icon: IconName; title?: string; text: string };

export type CV = {
  name: string;
  firstName: string;
  role: string;
  summary: string[]; // short paragraphs for the "About" section
  photo?: string; // file in /public, e.g. "/me.jpg"; initials are shown until it's set
  location: string;
  email: string;
  links: { label: string; href: string }[];
  pdfUrl?: string; // file in /public; the "Download PDF" button only shows when this is set
  experience: Entry[];
  education: Entry[];
  projects: Entry[];
  activities: Entry[];
  skills: SkillGroup[];
  languages: { name: string; level: string }[];
  softSkills: string[];
  hobbies: IconItem[];
  funFacts: IconItem[];
};

// ---------- The data ----------

export const cv: CV = {
  name: "Joaquin Opazo Yentzen",
  firstName: "Joaquin",
  role: "Software Engineer · Embedded Systems · Robotics",
  // DRAFT written from my CV: rewrite in my own voice
  summary: [
    "I'm a software engineer working where code meets hardware: C++/Qt applications, robotics with ROS, and Python automation.",
    "Today I'm at ITER Systems near Chambéry, building the software that displays, controls and pilots uncrewed surface vessels. Before that: Dassault Systèmes, CNRS research, and drones in Chile.",
    "I like turning messy, manual work into clean, automated systems, and I use AI agents every day to get there faster.",
  ],
  // photo: "/me.jpg", // TODO: add a square photo to /public and uncomment
  location: "Chambéry, France",
  email: "ja.opazoy@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/Opeiz" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/joaquin-opazo-yentzen/" },
  ],
  // TODO: when the English PDF is ready, put it in public/cv/ and uncomment:
  // pdfUrl: "/cv/joaquin-opazo-cv-en.pdf",

  experience: [
    {
      slug: "iter-systems",
      logo: "/logos/iter-systems.png",
      title: "C++ / Python Software & Automation Engineer",
      org: "ITER Systems",
      location: "La Motte-Servolex, France",
      start: "2025-07",
      end: null,
      highlights: [
        "Built the C++/Qt architecture for 2D/3D display and control communication of a 3-component software suite.",
        "Set up the ROS architecture used to pilot uncrewed surface vessels.",
        "Use AI agents and Claude Code daily to speed up development and optimize pipelines.",
        "Automated testing and enterprise file parsing in Python to modernize 3 major software modules.",
      ],
      tags: ["C++", "Qt", "ROS", "Python"],
    },
    {
      slug: "dassault-systemes",
      logo: "/logos/dassault-systemes.png",
      title: "Software & API Integration Engineer",
      org: "Dassault Systèmes",
      location: "Vélizy-Villacoublay, France",
      start: "2024-04",
      end: "2024-10",
      highlights: [
        "Final-year internship: designed a new control panel in C++ and Python to automate HDR and 360° image generation.",
        "Integrated AI agents and REST APIs to optimize visual workflows, fully automating the processing pipeline and cutting parallel computation time.",
      ],
      tags: ["C++", "Python", "REST API"],
    },
    {
      slug: "cnrs-lab-sticc",
      logo: "/logos/lab-sticc.png",
      title: "R&D Engineer, Data Processing",
      org: "CNRS, Lab-STICC",
      location: "Brest, France",
      start: "2023-04",
      end: "2023-07",
      highlights: [
        "Research internship on satellite image interpolation to estimate sea surface height.",
        "Wrote Python and PyTorch scripts on Linux to automate the evaluation of machine learning models (4DVarNet), making analysis 25% faster on real datasets.",
      ],
      tags: ["Python", "PyTorch", "Linux"],
    },
    {
      slug: "utfsm-teaching",
      logo: "/logos/utfsm.png",
      title: "Teaching Assistant, Software Engineering & AI",
      org: "UTFSM",
      location: "Valparaíso, Chile",
      start: "2019-08",
      end: "2022-12",
      highlights: [
        "Taught and mentored students in software engineering and deep learning, supporting 75+ students per term.",
        "Automated the grading of coding assignments and built algorithm visualization tools in Python and C++.",
      ],
      tags: ["Python", "C++", "Deep Learning"],
    },
    {
      slug: "robomotic",
      logo: "/logos/robomotic.png",
      title: "Robotics Systems Integration Engineer",
      org: "Robomotic SPA",
      location: "Santiago, Chile",
      start: "2020-11",
      end: "2022-03",
      highlights: [
        "Designed, programmed and assembled control software for custom drones.",
        "Automated flight tests, calibrated onboard sensors and handled the technical client relationship, reaching a 100% pass rate in hardware/software validation.",
      ],
      tags: ["Drones", "Embedded", "Testing"],
    },
  ],

  education: [
    {
      slug: "imt-atlantique",
      logo: "/logos/imt-atlantique.png",
      title: "Master's-level Engineering Degree (Diplôme d'Ingénieur)",
      org: "IMT Atlantique",
      location: "Brest, France",
      start: "2022-07",
      end: "2025-02",
      highlights: [
        "Double degree in computer engineering, specialized in software development and embedded systems.",
        "Programming (Python, C++), software design and hardware/software integration.",
      ],
    },
    {
      slug: "utfsm",
      logo: "/logos/utfsm.png",
      title: "Telematics Engineering Degree",
      org: "UTFSM",
      location: "Valparaíso, Chile",
      start: "2017-03",
      end: "2025-02",
      highlights: [
        "Double degree focused on software development and embedded systems.",
        "Image processing, computer vision, digital systems, OOP, databases and electronic design.",
      ],
    },
  ],

  projects: [
    {
      slug: "thales-risc-v",
      logo: "/logos/thales.png",
      title: "1st Prize, 4th Thales RISC-V Student Contest",
      org: "Thales, CNRS",
      location: "France",
      start: "2023-09",
      end: "2024-04",
      highlights: [
        "Optimized a handwritten digit recognition algorithm (MNIST) on a RISC-V platform.",
        "Implemented it on a Zynq 7000 FPGA using hardware and software development tools.",
      ],
      tags: ["RISC-V", "FPGA", "Vivado", "Verilog", "Vitis", "Linux", "MNIST"],
    },
  ],

  activities: [
    {
      slug: "bdi-president",
      logo: "/logos/bdi.png",
      title: "President, International Students Office (BDI)",
      org: "IMT Atlantique",
      location: "Brest, France",
      start: "2023-01",
      end: "2024-01",
      highlights: [
        "Led a team of 6 volunteers helping ~100 international students settle in: ~6 events, group management and day-to-day support (arrival, paperwork, campus life).",
      ],
    },
  ],

  skills: [
    { name: "Languages & Libraries", items: ["Python", "C++", "OOP", "Qt/QML", "VTK", "OpenCV"] },
    { name: "DevOps", items: ["GitLab", "Linux", "Docker", "Kubernetes"] },
    { name: "AI & Robotics", items: ["PyTorch", "TensorFlow", "ROS", "QGroundControl"] },
    { name: "Tools", items: ["REST APIs", "Claude Code", "VS Code", "AI agents"] },
  ],

  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "C1 (IELTS)" },
    { name: "French", level: "C1 (DELF)" },
  ],

  softSkills: ["Strong team spirit", "Peer support and mentoring", "Complex problem solving", "Leadership"],

  hobbies: [
    // DRAFT: make these sound like me
    { icon: "drone", title: "FPV drone racing", text: "Racing small drones in first-person view, through goggles." },
    { icon: "sailboat", title: "Sailing", text: "Skipper with the French Sailing Federation." },
    { icon: "palette", title: "Graphic design", text: "My creative side, away from the code." },
  ],

  // DRAFT: add my own geeky ones ("Favorite algorithm: ...", "Coffees per day: ...")
  funFacts: [
    { icon: "globe", text: "From Valparaíso, Chile to the French Alps." },
    { icon: "languages", text: "Spanish is my first language. English and French: C1." },
    { icon: "graduation", text: "Two engineering degrees at once: one in Chile, one in France." },
    { icon: "trophy", text: "Won 1st prize at the Thales RISC-V student contest with an FPGA." },
    { icon: "users", text: "Led 6 volunteers welcoming ~100 international students in Brest." },
  ],
};

// ---------- Helpers ----------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-07" → "Jul 2025" */
export function formatMonth(value: YearMonth): string {
  const [year, month] = value.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** Entry dates → "Jul 2025 – Present" */
export function formatRange(start: YearMonth, end: YearMonth | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
