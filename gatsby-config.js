module.exports = {
  siteMetadata: {
    title: `LifeQuirks`,
    author: {
      name: `Nikhil Warke`,
      summary: `who loves to read and tinker with tech`,
    },
    description: `A brain dump about life`,
    siteUrl: `https://lifequirks.netlify.app/`,
    social: {
      twitter: `nickdex9`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-orga`,
      options: {
        metadata: [
          "title",
          `date(formatString: "MMMM Do, YYYY")`,
          "description",
          "tags",
        ],
      },
    },
    // `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `LifeQuirks`,
        short_name: `lifequirks`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
