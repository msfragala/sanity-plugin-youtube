import {definePlugin} from 'sanity'
import {createScopedInputComponent} from './components/InputComponent'

export {type YoutubeVideoData} from './utils'

export const youtubeInput = definePlugin<{apiKey: string}>((config) => {
  return {
    name: 'sanity-plugin-youtube-input',
    schema: {
      types: [
        {
          name: 'youtubeVideo',
          type: 'object',
          components: {
            input: createScopedInputComponent(config.apiKey),
          },
          fields: [
            {
              name: 'id',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {name: 'title', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'publishedAt', type: 'string'},
            {name: 'thumbnails', type: 'array', of: [{type: 'string'}]},
            {name: 'aspectRatio', type: 'string'},
          ],
        },
      ],
    },
  }
})
