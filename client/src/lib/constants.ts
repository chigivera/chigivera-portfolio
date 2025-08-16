// Tech stack data
export const techStack = [
  { name: "React", icon: "react", color: "primary" },
  { name: "Python", icon: "python", color: "accent" },
  { name: "TensorFlow", icon: "brain", color: "secondary" },
  { name: "Node.js", icon: "node-js", color: "primary" },
  { name: "AWS", icon: "aws", color: "accent" },
];

// Skills data
export const skills = [
  { name: "Frontend Development", level: 95, color: "primary" },
  { name: "Backend Systems", level: 90, color: "secondary" },
  { name: "AI/ML Development", level: 85, color: "accent" },
  { name: "DevOps/Cloud Infrastructure", level: 80, color: "primary" },
];

// Services data
export const services = [
  {
    title: "SaaS CRM Development",
    icon: "laptop-code",
    color: "primary",
    description:
      "Custom CRM solutions tailored to your business needs with advanced features and integrations.",
    features: [
      "User-friendly interfaces",
      "Data analytics dashboards",
      "Third-party integrations",
    ],
  },
  {
    title: "E-commerce Solutions",
    icon: "shopping-cart",
    color: "secondary",
    description:
      "High-performance online stores with seamless checkout experiences and inventory management.",
    features: [
      "Responsive storefronts",
      "Payment gateway integration",
      "Inventory management systems",
    ],
  },
  {
    title: "AI Agent Development",
    icon: "robot",
    color: "accent",
    description:
      "Intelligent AI solutions that automate processes and deliver actionable insights.",
    features: [
      "Natural language processing",
      "Predictive analytics",
      "Custom ML model development",
    ],
  },
  {
    title: "Learning Management Systems",
    icon: "graduation-cap",
    color: "primary",
    description:
      "Educational platforms with intuitive course creation, student management, and analytics.",
    features: [
      "Interactive learning experiences",
      "Progress tracking",
      "Certification systems",
    ],
  },
  {
    title: "DevOps Architecture",
    icon: "server",
    color: "secondary",
    description:
      "Streamlined deployment pipelines and infrastructure solutions for optimal performance.",
    features: [
      "CI/CD pipeline setup",
      "Cloud infrastructure management",
      "Containerization & orchestration",
    ],
  },
  {
    title: "Mobile Development",
    icon: "mobile-alt",
    color: "accent",
    description:
      "Cross-platform mobile applications with native performance and engaging UX.",
    features: [
      "React Native & Flutter expertise",
      "Progressive Web Apps",
      "Offline-first capabilities",
    ],
  },
];

// Project data
export const projects = [
  {
    title: "AI-Powered Analytics Dashboard",
    description:
      "A comprehensive analytics platform with predictive insights for e-commerce businesses.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
    isFeatured: true,
    technologies: ["React", "TensorFlow", "Node.js", "AWS"],
    demoLink: "#",
    codeLink: "#",
    color: "primary",
  },
  {
    title: "SaaS Learning Platform",
    description:
      "An interactive learning management system with gamification elements for corporate training.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    isFeatured: false,
    technologies: ["Vue.js", "Django", "PostgreSQL", "Docker"],
    demoLink: "#",
    codeLink: "#",
    color: "secondary",
  },
  {
    title: "Smart Home Control App",
    description:
      "IoT mobile application for controlling smart home devices with voice commands and automation.",
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6",
    isFeatured: false,
    technologies: ["React Native", "Firebase", "MQTT", "Raspberry Pi"],
    demoLink: "#",
    codeLink: "#",
    color: "accent",
    isMobile: true,
  },
  {
    title: "Microservices Infrastructure",
    description:
      "Scalable cloud architecture with auto-scaling, monitoring, and self-healing capabilities.",
    image: "",
    isFeatured: false,
    technologies: ["Kubernetes", "Terraform", "Prometheus", "AWS"],
    demoLink: "#",
    codeLink: "#",
    color: "primary",
    isServer: true,
  },
];

// Server units for the server rack visualization
export const serverUnits = [
  { name: "Web Server", status: "active", color: "green" },
  { name: "Database", status: "active", color: "blue" },
  { name: "Cache", status: "warning", color: "yellow" },
  { name: "Load Balancer", status: "error", color: "red" },
  { name: "API Gateway", status: "active", color: "green" },
];

// Social links
export const socialLinks = [
  { name: "LinkedIn", icon: "linkedin-in", url: "https://www.linkedin.com/in/benchamkha-ayman-14aaa4292/", color: "primary" },
  {
    name: "GitHub",
    icon: "github",
    url: "https://github.com/chigivera",
    color: "secondary",
  },
  { name: "Twitter", icon: "twitter", url: "https://x.com/aforabysmal", color: "accent" },
  { name: "Medium", icon: "medium-m", url: "https://medium.com/@ayman.benchamkha", color: "primary" },
];

// GitHub username for API calls
export const GITHUB_USERNAME = "chigivera";
