import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import useGithubRepos, { FilterType } from '../hooks/useGithubRepos';
import PhoneModel from './PhoneModel';
import ServerRack from './ServerRack';
import { ExternalLink, Github, Star, GitFork } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  // Use our GitHub repos hook with filtering functionality
  const { 
    repos, 
    isLoading, 
    error, 
    filter, 
    setFilter, 
    languages, 
    languageFilter, 
    setLanguageFilter 
  } = useGithubRepos();
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value as FilterType);
  };
  
  // Handle language filter change
  const handleLanguageFilterChange = (value: string) => {
    setLanguageFilter(value);
  };
  
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
          className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs 
            value={filter} 
            onValueChange={handleFilterChange}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full md:w-[400px]">
              <TabsTrigger value="all" className="font-orbitron">All</TabsTrigger>
              <TabsTrigger value="popular" className="font-orbitron">Popular</TabsTrigger>
              <TabsTrigger value="recent" className="font-orbitron">Recent</TabsTrigger>
              <TabsTrigger value="language" className="font-orbitron">By Language</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filter === "language" && (
            <Select 
              value={languageFilter} 
              onValueChange={handleLanguageFilterChange}
            >
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
          )}
        </motion.div>
        
        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-background rounded-lg overflow-hidden border border-primary p-4"
              >
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center text-red-500 py-10">
            Error loading projects. Please try again later.
          </div>
        ) : (
          // Projects grid
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {repos.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-10">
                No repositories found with the selected filters.
              </div>
            ) : (
              repos.map((repo, index) => {
                // Determine a consistent color for each repo
                const colors = ["primary", "secondary", "accent"];
                const colorIndex = index % colors.length;
                const color = colors[colorIndex];
                
                return (
                  <motion.div
                    key={repo.id}
                    className={`project-card bg-background rounded-lg overflow-hidden border border-${color} hover:neon-border-${color} transition-all duration-300`}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative">
                      {index % 5 === 0 ? (
                        <div className="h-40">
                          <PhoneModel />
                        </div>
                      ) : index % 7 === 0 ? (
                        <div className="h-40">
                          <ServerRack />
                        </div>
                      ) : (
                        <div className="h-40 bg-card flex items-center justify-center">
                          <div className="text-6xl text-muted-foreground p-4">
                            {repo.language ? (
                              <span className="font-orbitron text-3xl text-accent">
                                {repo.language.slice(0, 2)}
                              </span>
                            ) : (
                              <Github size={60} className="text-muted-foreground opacity-20" />
                            )}
                          </div>
                        </div>
                      )}
                      
                      {repo.stargazers_count > 0 && (
                        <div className={`absolute top-0 right-0 bg-${color} text-${color}-foreground font-orbitron px-3 py-1`}>
                          ★ {repo.stargazers_count}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className={`font-orbitron text-xl mb-2 text-${color} truncate`}>
                        {repo.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 h-12 overflow-hidden">
                        {repo.description || "No description available"}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.language && (
                          <span 
                            className={`px-2 py-1 bg-card text-${color} text-xs rounded-md`}
                          >
                            {repo.language}
                          </span>
                        )}
                        
                        {repo.forks_count > 0 && (
                          <span 
                            className="px-2 py-1 bg-card text-muted-foreground text-xs rounded-md flex items-center gap-1"
                          >
                            <GitFork className="h-3 w-3" /> {repo.forks_count}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline flex items-center">
                          <Github className="h-4 w-4 mr-1" /> View Code
                        </a>
                        
                        <a href={`https://github.com/${repo.html_url.split('/').slice(-2).join('/')}/issues`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                          <ExternalLink className="h-4 w-4 mr-1" /> Issues
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
