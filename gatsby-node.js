const path = require(`path`)
const _ = require(`lodash`)
const withDefaults = require(`./util/default-options`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allOrgContent(
          sort: { fields: [metadata___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              metadata {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allOrgContent.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions }, themeOptions) => {
  const { basePath, slug } = withDefaults(themeOptions)
  if (node.internal.type !== `OrgContent`) return

  const { createNodeField } = actions
  const paths = [basePath]
    .concat(
      slug.map(k => {
        if (k.startsWith("$")) {
          return _.get(node.metadata, k.substring(1))
        }
        return k
      })
    )
    .filter(k => k)

  createNodeField({
    node,
    name: `slug`,
    value: path.posix.join(...paths),
  })
}
