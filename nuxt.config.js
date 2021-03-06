const contentfulConfig = require("./.contentful.json")
const {createClient} = require("contentful")

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Netlify Prerendering Demo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Netlify Prerendering Demo (Nuxt.js project)' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    CTF_BLOG_ID: contentfulConfig.CTF_BLOG_ID,
    CTF_SPACE_ID: contentfulConfig.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: contentfulConfig.CTF_CDA_ACCESS_TOKEN,
  },
  generate: {
    routes: () => {
      const client = createClient({
        space: contentfulConfig.CTF_SPACE_ID,
        accessToken: contentfulConfig.CTF_CDA_ACCESS_TOKEN
      })
      return client.getEntries({
        'content_type': contentfulConfig.CTF_BLOG_ID
      })
      .then(posts => posts.items.map(post => {
        const slug = post.fields.slug
        const category = post.fields.category.fields.slug
        return `/blog/${category}/${slug}/`
      }))
      .catch(console.error)
    }
  }
}
