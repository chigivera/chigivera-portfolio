"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import PhoneModel from "./PhoneModel"
import ServerRack from "./ServerRack"
import { ExternalLink, Github, GitFork, Code, Star, Filter } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// Sample project data
const projectsData = [
  {
    id: 1,
    name: "AI-Powered Analytics Dashboard",
    description: "A comprehensive analytics platform with predictive insights for e-commerce businesses.",
    language: "TypeScript",
    stars: 86,
    forks: 24,
    category: "ai",
    featured: true,
    type: "web",
    demoUrl: "#",
    codeUrl: "#",
    color: "primary",
  },
  {
    id: 2,
    name: "Neural Network Visualizer",
    description: "Interactive 3D visualization of neural networks with real-time training data.",
    language: "JavaScript",
    stars: 64,
    forks: 18,
    category: "ai",
    featured: true,
    type: "web",
    demoUrl: "#",
    codeUrl: "#",
    color: "secondary",
  },
  {
    id: 3,
    name: "Mobile E-Commerce App",
    description: "Cross-platform mobile application for online shopping with AR product previews.",
    language: "React Native",
    stars: 53,
    forks: 12,
    category: "mobile",
    featured: false,
    type: "mobile",
    demoUrl: "#",
    codeUrl: "#",
    color: "accent",
  },
  {
    id: 4,
    name: "Cloud Infrastructure Manager",
    description: "Automated deployment and scaling of microservices on Kubernetes clusters.",
    language: "Go",
    stars: 42,
    forks: 8,
    category: "devops",
    featured: false,
    type: "server",
    demoUrl: "#",
    codeUrl: "#",
    color: "primary",
  },
  {
    id: 5,
    name: "Real-time Chat Application",
    description: "Secure messaging platform with end-to-end encryption and file sharing.",
    language: "JavaScript",
    stars: 38,
    forks: 15,
    category: "web",
    featured: false,
    type: "web",
    demoUrl: "#",
    codeUrl: "#",
    color: "secondary",
  },
  {
    id: 6,
    name: "Data Visualization Library",
    description: "Comprehensive library for creating interactive charts and data visualizations.",
    language: "TypeScript",
    stars: 72,
    forks: 28,
    category: "web",
    featured: true,
    type: "web",
    demoUrl: "#",
    codeUrl: "#",
    color: "accent",
  },
]

// Available languages for filtering
const languages = ["All", "TypeScript", "JavaScript", "React Native", "Go", "Python"]

// Available categories for filtering
const categories = ["All", "web", "mobile", "ai", "devops"]

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  // Filter states
  const [activeFilter, setActiveFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  // Filter projects based on active filters
  const filteredProjects = projectsData.filter((project) => {
    // Filter by main filter
    if (activeFilter === "featured" && !project.featured) return false

    // Filter by language
    if (languageFilter !== "All" && project.language !== languageFilter) return false

    // Filter by category
    if (categoryFilter !== "All" && project.category !== categoryFilter) return false

    return true
  })

  // Sort projects based on active filter
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (activeFilter === "popular") return b.stars - a.stars
    if (activeFilter === "recent") return b.id - a.id
    return 0
  })

  return (
    <section id="projects" ref={ref} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2
          className="font-orbitron font-bold text-3xl md:text-5xl mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-accent neon-text-accent">PROJECT </span>
          <span className="text-foreground">SHOWCASE</span>
        </motion.h2>

        {/* Project Filters */}
        <motion.div
          className="flex flex-col items-center gap-4 mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
                <TabsTrigger value="all" className="font-orbitron">
                  All
                </TabsTrigger>
                <TabsTrigger value="featured" className="font-orbitron">
                  Featured
                </TabsTrigger>
                <TabsTrigger value="popular" className="font-orbitron">
                  Popular
                </TabsTrigger>
                <TabsTrigger value="recent" className="font-orbitron">
                  Recent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" className="md:ml-auto" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-4 p-4 border border-accent rounded-lg">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Language</label>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {sortedProjects.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No projects found with the selected filters.
            </div>
          ) : (
            sortedProjects.map((project) => (
              <motion.div
                key={project.id}
                className={`project-card bg-background rounded-lg overflow-hidden border border-${project.color} hover:neon-border-${project.color} transition-all duration-300`}
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="relative">
                  {project.type === "mobile" ? (
                    <div className="h-40">
                      <PhoneModel />
                    </div>
                  ) : project.type === "server" ? (
                    <div className="h-40">
                      <ServerRack />
                    </div>
                  ) : (
                    <div className="h-40 bg-card flex items-center justify-center">
                      <div className="text-6xl text-muted-foreground p-4">
                        {project.language ? (
                          <Code size={60} className={`text-${project.color}`} />
                        ) : (
                          <Github size={60} className="text-muted-foreground opacity-20" />
                        )}
                      </div>
                    </div>
                  )}

                  {project.stars > 0 && (
                    <div
                      className={`absolute top-0 right-0 bg-${project.color} text-${project.color}-foreground font-orbitron px-3 py-1 flex items-center`}
                    >
                      <Star className="h-3 w-3 mr-1" /> {project.stars}
                    </div>
                  )}

                  {project.featured && (
                    <div className="absolute top-0 left-0 bg-accent text-accent-foreground font-orbitron text-xs px-2 py-1">
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className={`font-orbitron text-xl mb-2 text-${project.color} truncate`}>{project.name}</h3>
                  <p className="text-muted-foreground mb-4 h-12 overflow-hidden">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 bg-card text-${project.color} text-xs rounded-md`}>
                      {project.language}
                    </span>

                    <span className={`px-2 py-1 bg-card text-${project.color} text-xs rounded-md capitalize`}>
                      {project.category}
                    </span>

                    {project.forks > 0 && (
                      <span className="px-2 py-1 bg-card text-muted-foreground text-xs rounded-md flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {project.forks}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline flex items-center"
                    >
                      <Github className="h-4 w-4 mr-1" /> View Code
                    </a>

                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" /> Live Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  )
}
