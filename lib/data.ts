export type SectionId = "about" | "projects" | "skills" | "contact";

export const NAV_ITEMS: { id: SectionId; label: string; icon: string }[] = [
  { id: "about", label: "about.tsx", icon: "TS" },
  { id: "projects", label: "projects.json", icon: "{}" },
  { id: "skills", label: "skills.yaml", icon: "YML" },
  { id: "contact", label: "contact.sh", icon: "SH" },
];

export const PROJECTS = [
  {
    file: "chat/README.md",
    dot: "#6ee7b7",
    title: "Chat App",
    desc: "Real-time messaging with Socket.io, JWT auth, and persistent history. Built to handle concurrent rooms and typing indicators.",
    tags: ["MongoDB", "Express", "React", "Node.js", "Socket.io"],
    href: "https://github.com/pathak-ofc/chat",
  },
  {
    file: "jobs/README.md",
    dot: "#7dd3fc",
    title: "Job Portal",
    desc: "Full-stack job listing & application platform with role-based dashboards for seekers and recruiters.",
    tags: ["MongoDB", "Express", "React", "Node.js", "JWT"],
    href: "https://github.com/pathak-ofc/job-portal",
  },
  {
    file: "agency/landing.tsx",
    dot: "#ffb454",
    title: "Frontend Agency Site",
    desc: "Marketing site concept focused on performance, SEO, and clean design. Built with the App Router and Tailwind.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    href: "https://github.com/pathak-ofc/frontend-agency",
  },
] as const;

export const SKILLS = [
  { k: "frontend", v: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { k: "backend", v: ["Node.js", "Express.js"] },
  { k: "database", v: ["MongoDB"] },
  { k: "tools", v: ["Git", "GitHub"] },
] as const;

export const FULL_CODE = `const developer = {
  name: "Bimal Pathak",
  role: "Full-Stack Developer",
  stack: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind"],
  status: "open to internships & collaborations",
  learnsBy: "shipping real projects"
};`;

export const CONTACT = {
  email: "bimalpathak6667@gmail.com",
  github: "https://github.com/pathak-ofc",
  linkedin: "https://linkedin.com/in/bimal-pathak", // placeholder
};
