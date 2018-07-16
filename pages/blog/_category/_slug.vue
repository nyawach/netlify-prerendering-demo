<template lang="pug">
main.blog-slug
  .logo
    nuxt-link.logo__link(to="/") hyme
  transition(appear)
    article
      h1 {{ post.fields.title }}
      .thumb(v-if="thumbnail")
        img(:src="thumbnail" alt="thumbnail")
      .content(v-html="renderedBody")
</template>


<script>
import marked from 'marked'
import createClient from '~/plugins/contentful'

const client = createClient()

export default {
  name: 'BlogSlug',

  async asyncData({env, params}) {
    const {slug} = params
    const posts = await client.getEntries({
      'content_type': env.CTF_BLOG_ID,
      'fields.slug': slug,
    }).catch(console.error)

    return {
      post: posts.items[0]
    }
  },

  head() {
    return {
      title: this.post.fields.title,
      meta: [
        { hid: 'description', name: 'description', content: this.post.fields.description },
        { property: 'og:image', content: this.thumbnail },
        { property: 'og:description', content: this.post.fields.description },
        { property: 'twitter:image', content: this.thumbnail },
        { property: 'twitter:description', content: this.post.fields.description },
      ]
    }
  },

  computed: {
    renderedBody() {
      if (!this.post) return ''
      return marked(this.post.fields.body)
    },
    thumbnail() {
      if (!this.post || !this.post.fields.thumbnail) return null
      return this.post.fields.thumbnail.fields.file.url
    }
  }
}
</script>


<style lang="scss" scoped>
@import "~assets/common";

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: $unit * 8;
}

.logo__link {
  text-decoration: none;
  font-weight: bold;
  color: $c-font-dark;
}

article {
  margin: 0 auto;
  padding: $unit * 5 0;
  max-width: $article-width;
}

h1 {
  margin-bottom: $unit * 4;
  font-size: $s-font-main;
  font-weight: bold;
  color: $c-font-dark;
  line-height: 1.4;
}

article /deep/ {
  p {
    + p {
      margin-top: $unit * 4;
    }
  }
  h2 {
    margin: $unit * 8 0 $unit * 4;
    font-size: $s-font-base * (7.7 / 5);
    font-weight: bold;
    color: $c-font-dark;
  }
  h3 {
    margin: $unit * 8 0 $unit * 4;
    font-size: $s-font-base;
    font-weight: bold;
    color: $c-font-dark;
  }
  h4 {
    margin: $unit * 8 0 $unit * 4;
    font-size: $s-font-base;
  }
  a {
    word-break: break-all;
    color: $c-font-link;
    &:active,
    &:hover {
      text-decoration: none;
      color: $c-font-active;
    }
  }
  blockquote:not([class]) {
    padding: 24px;
    background-color: $c-bg-dark;
    color: $c-font-dark;
  }
  pre:not([class]) > code {
    display: block;
    padding: $s-font-base;
    background-color: $c-bg-dark;
    color: $c-font-dark;
    margin: $s-font-base 0;
    font-size: 14px;
    line-height: 1.6;
  }
  code:not([class]) {
    box-sizing: border-box;
    padding: 0.2em 0.4em;
    background-color: $c-bg-dark;
    color: $c-font-dark;
    font-size: 14px;
    line-height: $s-font-base;
  }
  img {
    display: block;
    margin: $unit * 4 0;
    max-width: 100%;
  }
}


.v-enter-active {
  animation: fade-in .24s ease-out 0s 1 both;
}

.v-leave-active {
  animation: fade-out .24s ease-out 0s 1 both;
}
</style>
