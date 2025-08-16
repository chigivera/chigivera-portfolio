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
  const query = `*[_type == "blog"] | order(_createdAt desc, order asc, featured desc, stars desc) {
    _id,
    "name": title,
    "description": coalesce(description, smallDescription, "No description available"),
    "language": coalesce(language, "Not specified"),
    "stars": coalesce(stars, 0),
    "forks": coalesce(forks, 0),
    "category": coalesce(category, "web"),
    "featured": coalesce(featured, false),
    "type": coalesce(type, "web"),
    "demoUrl": coalesce(demoUrl, ""),
    "codeUrl": coalesce(codeUrl, ""),
    "color": coalesce(color, "primary"),
    "order": coalesce(order, 999),
    "technologies": coalesce(technologies, []),
    "imageUrl": coalesce(image.asset->url, titleImage.asset->url, ""),
    slug,
    "createdAt": _createdAt,
    "updatedAt": _updatedAt
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
  const query = `*[_type == "blog" && featured == true] | order(_createdAt desc, order asc, stars desc) {
    _id,
    "name": title,
    "description": coalesce(description, smallDescription, "No description available"),
    "language": coalesce(language, "Not specified"),
    "stars": coalesce(stars, 0),
    "forks": coalesce(forks, 0),
    "category": coalesce(category, "web"),
    "featured": coalesce(featured, false),
    "type": coalesce(type, "web"),
    "demoUrl": coalesce(demoUrl, ""),
    "codeUrl": coalesce(codeUrl, ""),
    "color": coalesce(color, "primary"),
    "order": coalesce(order, 999),
    "technologies": coalesce(technologies, []),
    "imageUrl": coalesce(image.asset->url, titleImage.asset->url, ""),
    slug,
    "createdAt": _createdAt,
    "updatedAt": _updatedAt
  }`
  
  try {
    const data = await client.fetch(query)
    return data
  } catch (error) {
    console.error("Error fetching featured projects from Sanity:", error)
    throw error
  }
}