export default {
  name: 'project',
  type: 'document',
  title: 'Project',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Project Name',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'language',
      type: 'string',
      title: 'Programming Language',
      options: {
        list: [
          'TypeScript',
          'JavaScript',
          'React Native',
          'Go',
          'Python',
          'Java',
          'C++',
          'C#',
          'PHP',
          'Ruby',
          'Swift',
          'Kotlin'
        ]
      }
    },
    {
      name: 'stars',
      type: 'number',
      title: 'GitHub Stars',
      validation: (Rule: any) => Rule.min(0)
    },
    {
      name: 'forks',
      type: 'number',
      title: 'GitHub Forks',
      validation: (Rule: any) => Rule.min(0)
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          'web',
          'mobile',
          'ai',
          'devops',
          'desktop',
          'game',
          'data',
          'security',
          'blockchain'
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured Project',
      initialValue: false
    },
    {
      name: 'type',
      type: 'string',
      title: 'Project Type',
      options: {
        list: [
          'web',
          'mobile',
          'server',
          'desktop',
          'game'
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'demoUrl',
      type: 'url',
      title: 'Live Demo URL'
    },
    {
      name: 'codeUrl',
      type: 'url',
      title: 'Source Code URL'
    },
    {
      name: 'color',
      type: 'string',
      title: 'Theme Color',
      options: {
        list: [
          'primary',
          'secondary',
          'accent'
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'order',
      type: 'number',
      title: 'Display Order',
      description: 'Lower numbers appear first'
    },
    {
      name: 'technologies',
      type: 'array',
      title: 'Technologies Used',
      of: [{ type: 'string' }]
    },
    {
      name: 'image',
      type: 'image',
      title: 'Project Image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      readOnly: true
    },
    {
      name: 'updatedAt',
      type: 'datetime',
      title: 'Updated At',
      readOnly: true
    }
  ],
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' }
      ]
    },
    {
      title: 'Most Popular',
      name: 'popularFirst',
      by: [
        { field: 'stars', direction: 'desc' }
      ]
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [
        { field: 'createdAt', direction: 'desc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image'
    }
  }
}
