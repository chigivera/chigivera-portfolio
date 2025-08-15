export default {
    name:'blog',
    type:'document',
    title:'Blog',
    fields: [

        {
            name:'title',
            type:'string',
            title:'Title of blog article',
    
        },
        {
            name:'slug',
            type:'slug',
            title:'Slug of your blog article',
            options: {
                source: 'title',
            }
        },
        {
            name:'titleImage',
            type:'image',
            title:'Title Image'
        },
        {
            name:'smallDescription',
            type:'string',
            title:'Small Description'
        },
        {
            name:'content',
            type:'array',
            title:'Content',
            of: [

                {
                    type:'block',
                    marks: {
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'External link',
                                fields: [
                                  {
                                    name: 'href',
                                    type: 'url',
                                    title: 'URL'
                                  },
                                  {
                                    title: 'Open in new tab',
                                    name: 'blank',
                                    description: 'Read https://css-tricks.com/use-target_blank/',
                                    type: 'boolean'
                                  }
                                ]
                              },
                        ]
                    }
                }
            ]
        },
    ]
}