import { useQuery } from '@tanstack/react-query'
import { sanityClient, projectsQuery, featuredProjectsQuery, projectsByCategoryQuery, projectsByLanguageQuery } from '@/lib/sanity'

export interface Project {
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
  createdAt?: string
  updatedAt?: string
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const projects = await sanityClient.fetch(projectsQuery)
      return projects
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ['featured-projects'],
    queryFn: async (): Promise<Project[]> => {
      const projects = await sanityClient.fetch(featuredProjectsQuery)
      return projects
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProjectsByCategory(category: string) {
  return useQuery({
    queryKey: ['projects-by-category', category],
    queryFn: async (): Promise<Project[]> => {
      const projects = await sanityClient.fetch(projectsByCategoryQuery(category))
      return projects
    },
    enabled: !!category && category !== 'All',
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProjectsByLanguage(language: string) {
  return useQuery({
    queryKey: ['projects-by-language', language],
    queryFn: async (): Promise<Project[]> => {
      const projects = await sanityClient.fetch(projectsByLanguageQuery(language))
      return projects
    },
    enabled: !!language && language !== 'All',
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
