import { createClient } from '@sanity/client'
import sampleProjects from './sample-blog-projects.json' assert { type: 'json' }

const client = createClient({
  projectId: 'lkszte6x',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // You'll need to create a token in Sanity Studio
  useCdn: false,
})

async function importProjects() {
  try {
    console.log('Starting blog projects import...')
    
    for (const project of sampleProjects) {
      // Add timestamps
      const projectWithTimestamps = {
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const result = await client.create(projectWithTimestamps)
      console.log(`Created blog project: ${project.title} with ID: ${result._id}`)
    }
    
    console.log('All blog projects imported successfully!')
  } catch (error) {
    console.error('Error importing blog projects:', error)
  }
}

importProjects()
