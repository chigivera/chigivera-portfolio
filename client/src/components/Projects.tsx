"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import PhoneModel from "./PhoneModel"
import ServerRack from "./ServerRack"
import { ExternalLink, Github, GitFork, Code, Star, Filter } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Project interface
interface Project {
  _id: string
  name: string
  description: string
  language?: string
  stars?: number
  forks?: number
  category: string
  featured: boolean
  type: 'web' | 'mobile' | 'server' | 'desktop' | 'game'
  demoUrl?: string
  codeUrl?: string
  color: 'primary' | 'secondary' | 'accent'
  order?: number
  technologies?: string[]
  imageUrl?: string
  slug?: {
    current: string
  }
  createdAt?: string
  updatedAt?: string
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  // State for projects data
  const [projectsData, setProjectsData] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch projects from local server (which proxies to Sanity)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
    
        const response = await fetch("/api/sanity/projects")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProjectsData(data || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter states
  const [activeFilter, setActiveFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique languages and categories from projects data
  const languages = useMemo(() => {
    if (!projectsData) return ["All"]
    const uniqueLanguages = Array.from(new Set(projectsData.map(p => p.language).filter(Boolean) as string[]))
    return ["All", ...uniqueLanguages]
  }, [projectsData])

  const categories = useMemo(() => {
    if (!projectsData) return ["All"]
    const uniqueCategories = Array.from(new Set(projectsData.map(p => p.category)))
    return ["All", ...uniqueCategories]
  }, [projectsData])

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
  const filteredProjects = useMemo(() => {
    if (!projectsData) return []
    
    return projectsData.filter((project) => {
      // Filter by main filter
      if (activeFilter === "featured" && !project.featured) return false

      // Filter by language
      if (languageFilter !== "All" && project.language !== languageFilter) return false

      // Filter by category
      if (categoryFilter !== "All" && project.category !== categoryFilter) return false

      return true
    })
  }, [projectsData, activeFilter, languageFilter, categoryFilter])

  // Sort projects based on active filter
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      if (activeFilter === "popular") return (b.stars || 0) - (a.stars || 0)
      if (activeFilter === "recent") return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      return 0
    })
  }, [filteredProjects, activeFilter])

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

        {/* Error State */}
        {error && (
          <motion.div
            className="text-center text-destructive mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p>Failed to load projects. Please try again later.</p>
          </motion.div>
        )}

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
        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-background rounded-lg overflow-hidden border border-border"
                variants={itemVariants}
              >
                <div className="h-40 bg-muted">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Projects Grid */}
        {!isLoading && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {sortedProjects.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-10">
                {projectsData ? "No projects found with the selected filters." : "Loading projects..."}
              </div>
            ) : (
              sortedProjects.map((project) => (
                <motion.div
                  key={project._id}
                  className={`project-card bg-background rounded-lg overflow-hidden border border-${project.color} hover:neon-border-${project.color} transition-all duration-300`}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative">
                    {project.imageUrl ? (
                      // Show actual project image if available
                      <div className="h-40 bg-card overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="h-40 bg-card flex items-center justify-center hidden">
                          <div className="text-6xl text-muted-foreground p-4">
                            {project.language ? (
                              <Code size={60} className={`text-${project.color}`} />
                            ) : (
                              <Github size={60} className="text-muted-foreground opacity-20" />
                            )}
                          </div>
                        </div>
                      </div>
                    ) : project.type === "mobile" ? (
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

                    {/* {project.stars && project.stars > 0 && (
                      <div
                        className={`absolute top-0 right-0 bg-${project.color} text-${project.color}-foreground font-orbitron px-3 py-1 flex items-center`}
                      >
                        <Star className="h-3 w-3 mr-1" /> {project.stars}
                      </div>
                    )} */}

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
                      {project.language && project.language !== "Not specified" && (
                        <span className={`px-2 py-1 bg-card text-${project.color} text-xs rounded-md`}>
                          {project.language}
                        </span>
                      )}

                      <span className={`px-2 py-1 bg-card text-${project.color} text-xs rounded-md capitalize`}>
                        {project.category}
                      </span>

                      {/* Split slug and display as tags */}
                      {project.slug && project.slug.current && (
                        <>
                          {project.slug.current.split('-').map((tag: string, index: number) => (
                            <span 
                              key={index} 
                              className={`px-2 py-1 bg-card text-${project.color} text-xs rounded-md capitalize`}
                            >
                              {tag}
                            </span>
                          ))}
                        </>
                      )}
                    </div>

                    {/* <div className="flex justify-between">
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
                    </div> */}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
