<template lang="pug">
main.blog
  .logo
    nuxt-link.logo__link(to="/") hyme
  .lead なにもない。
  ul
    li(v-for="post in posts")
      nuxt-link(:to="postLink(post)")
        time {{ post.sys.updatedAt }}
        p {{ post.fields.title }}
</template>

<script>
import createClient from '~/plugins/contentful'

const client = createClient()

export default {
  name: 'Blog',

  async asyncData({env}) {
    const posts = await client.getEntries({
      'content_type': env.CTF_BLOG_ID,
      order: '-sys.createdAt'
    }).catch(console.error)

    return {
      posts: posts.items
    }
  },

  head: () => ({
    title: 'blog',
  }),

  computed: {
    postLink() {
      return (post) => {
        if (!post) return null
        return `/blog/${post.fields.category.fields.slug}/${post.fields.slug}/`
      }
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
  height: $unit * 10;
}

.logo__link {
  text-decoration: none;
  font-weight: bold;
  color: $c-font-dark;
}

.lead {
  text-align: center;
  color: $c-font-dark;
  font-size: 14px;
}

ul {
  margin: 0 auto;
  padding: $unit * 5 0;
  max-width: $article-width;
}
li {
  + li {
    margin-top: $unit * 4;
    padding-top: $unit * 4;
    border-top: 2px solid lighten($c-font-base, 60);
  }
}
time {
  font-size: 14px;
}
a {
  text-decoration: none;
  font-weight: bold;
  color: $c-font-dark;
}
</style>
