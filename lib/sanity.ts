import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'lkszte6x',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Query to get all projects
export const getProjects = async () => {
  const query = `*[_type == "project"] | order(order asc, featured desc, stars desc) {
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
  }`
  
  try {
    const data = await client.fetch(query)
    return data
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error)
    throw error
  }
}

// Query to get featured projects only
export const getFeaturedProjects = async () => {
  const query = `*[_type == "project" && featured == true] | order(order asc, stars desc) {
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
  }`
  
  try {
    const data = await client.fetch(query)
    return data
  } catch (error) {
    console.error("Error fetching featured projects from Sanity:", error)
    throw error
  }
}