import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'lkszte6x',
  dataset: 'production',
  apiVersion: '2024-01-01', // Use today's date or your preferred version
  useCdn: false, // Set to false for development, true for production
  // token: process.env.VITE_SANITY_TOKEN, // Optional: for authenticated requests
})

// Query to get all projects
export const projectsQuery = `
  *[_type == "project"] | order(order asc, featured desc, stars desc) {
    _id,
    name,
    description,
    language,
    stars,
    forks,
    category,
    featured,
    type,
    demoUrl,
    codeUrl,
    color,
    order,
    technologies,
    "imageUrl": image.asset->url,
    createdAt,
    updatedAt
  }
`

// Query to get featured projects only
export const featuredProjectsQuery = `
  *[_type == "project" && featured == true] | order(order asc, stars desc) {
    _id,
    name,
    description,
    language,
    stars,
    forks,
    category,
    featured,
    type,
    demoUrl,
    codeUrl,
    color,
    order,
    technologies,
    "imageUrl": image.asset->url,
    createdAt,
    updatedAt
  }
`

// Query to get projects by category
export const projectsByCategoryQuery = (category: string) => `
  *[_type == "project" && category == $category] | order(order asc, featured desc, stars desc) {
    _id,
    name,
    description,
    language,
    stars,
    forks,
    category,
    featured,
    type,
    demoUrl,
    codeUrl,
    color,
    order,
    technologies,
    "imageUrl": image.asset->url,
    createdAt,
    updatedAt
  }
`

// Query to get projects by language
export const projectsByLanguageQuery = (language: string) => `
  *[_type == "project" && language == $language] | order(order asc, featured desc, stars desc) {
    _id,
    name,
    description,
    language,
    stars,
    forks,
    category,
    featured,
    type,
    demoUrl,
    codeUrl,
    color,
    order,
    technologies,
    "imageUrl": image.asset->url,
    createdAt,
    updatedAt
  }
`
