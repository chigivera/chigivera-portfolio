# Sanity CMS Setup for Dynamic Projects

## Overview
This project now uses Sanity CMS to dynamically manage projects instead of hardcoded data. Projects can be created, edited, and managed through the Sanity Studio interface.

## Setup Instructions

### 1. Start Sanity Studio
```bash
cd sanity
npm run dev
```

This will start the Sanity Studio at `http://localhost:3333`

### 2. Create Projects
1. Open Sanity Studio in your browser
2. Navigate to the "Project" section
3. Click "Create new" to add a new project
4. Fill in the required fields:
   - **Name**: Project name
   - **Description**: Project description
   - **Category**: Choose from web, mobile, ai, devops, etc.
   - **Type**: Choose from web, mobile, server, desktop, game
   - **Color**: Choose from primary, secondary, accent
   - **Language**: Programming language used
   - **Stars/Forks**: GitHub metrics (optional)
   - **Demo URL**: Live demo link (optional)
   - **Code URL**: Source code link (optional)
   - **Featured**: Mark as featured project
   - **Order**: Display order (lower numbers appear first)
   - **Technologies**: Array of technologies used
   - **Image**: Project screenshot (optional)

### 3. Project Schema Features
- **Automatic Ordering**: Projects are ordered by featured status, order field, and popularity
- **Dynamic Filtering**: Languages and categories are automatically extracted from your data
- **Image Support**: Upload project screenshots with hotspot editing
- **Validation**: Required fields ensure data consistency

### 4. Available Categories
- web
- mobile
- ai
- devops
- desktop
- game
- data
- security
- blockchain

### 5. Available Types
- web
- mobile
- server
- desktop
- game

### 6. Color Themes
- primary
- secondary
- accent

## Frontend Integration

The Projects component now automatically:
- Fetches projects from Sanity
- Shows loading states while fetching
- Displays error messages if fetching fails
- Filters projects by category, language, and status
- Sorts projects by popularity, recency, and featured status

## Data Flow
1. Sanity Studio → Create/Edit Projects
2. Sanity API → Frontend fetches data
3. React Query → Caches and manages data
4. Projects Component → Renders dynamic content

## Troubleshooting

### Projects Not Loading
- Check if Sanity Studio is running
- Verify project ID and dataset in `lib/sanity.ts`
- Check browser console for API errors
- Ensure projects have required fields filled
- Check browser console for "Fetching projects from Sanity..." logs

### Current Status
✅ Sanity Studio configuration updated
✅ Project schema created
✅ Sanity client configured
✅ Projects component updated to fetch from Sanity
⚠️ Need to create test projects in Sanity Studio

### Next Steps to Test
1. Start Sanity Studio: `cd sanity && npm run dev`
2. Open http://localhost:3333 in browser
3. Navigate to "Project" section
4. Create a new project or import from `sample-projects.json`
5. Check browser console for fetch logs
6. Projects should appear on your portfolio page

### Images Not Showing
- Verify image uploads in Sanity Studio
- Check if `useCdn` is set correctly
- Ensure proper image field configuration

### Filtering Issues
- Check if projects have correct category and language values
- Verify the filter logic in the component

## Next Steps
- Add more project fields as needed
- Implement image optimization
- Add project search functionality
- Create project detail pages
- Add project analytics tracking
