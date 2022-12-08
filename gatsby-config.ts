import type { GatsbyConfig } from "gatsby";

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

interface SearchResult {
    allWcProducts: [
      {
        id: string
      }
    ]
}

interface ItemData {
  id: string
}

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Mr Cigars`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  // graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        // A unique name for the search index. This should be descriptive of
        // what the index contains. This is required.
        name: 'items',

        // Set the search engine to create the index. This is required.
        // The following engines are supported: flexsearch, lunr
        engine: 'flexsearch',

        // Provide options to the engine. This is optional and only recommended
        // for advanced users.
        //
        // Note: Only the flexsearch engine supports options.
        engineOptions: '',

        // GraphQL query used to fetch all data for the search index. This is
        // required.
        query: `
        {
          allWcProducts {
            nodes {
              id
              name
              slug
            }
          }
        }
        `,

        // Field used as the reference value for each document.
        // Default: 'id'.
        ref: 'name',

        // List of keys to index. The values of the keys are taken from the
        // normalizer function below.
        // Default: all fields
        index: ['id', 'name', 'slug'],

        // List of keys to store and make available in your UI. The values of
        // the keys are taken from the normalizer function below.
        // Default: all fields
        store: ['id', 'name', 'slug'],

        // Function used to map the result from the GraphQL query. This should
        // return an array of items to index in the form of flat objects
        // containing properties to index. The objects must contain the `ref`
        // field above (default: 'id'). This is required.
        //@ts-ignore
        normalizer: ({ data }) => {
          //@ts-ignore
          return data.allWcProducts.nodes.map(item => item)
        }
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: `gatsby-plugin-firebase-messaging`,
      options: {
        //required unless removeFirebaseServiceWorker == true
        config: {
          apiKey: process.env.GATSBY_FIREBASE_API_KEY,
          appId: process.env.GATSBY_FIREBASE_APP_ID,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          projectId: process.env.FIREBASE_PROJECT_ID,
        },
        //optionally override the firebase version used by the service worker
        firebaseVersion: "8.1.1", //e.g., '8.1.1'
        //optionally disables development service worker
        disableDevelopment: false,
        //optionally tells plugin to help unregistering/removing service worker
        removeFirebaseServiceWorker: false,
      },
    },
    // {
    //   resolve: "@pasdo501/gatsby-source-woocommerce",
    //   options: {
    //     // Base URL of WordPress site
    //     api: "dariwholesales.com",
    //     // true if using https. false otherwise.
    //     https: true,
    //     api_keys: {
    //       consumer_key: process.env.CONSUMER_KEY,
    //       consumer_secret: process.env.CONSUMER_SECRET,
    //     },
    //     // Array of strings with fields you'd like to create nodes for...
    //     fields: [
    //       "products", 
    //       "products/categories", 
    //       "variations"],
    //   },
    // },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/ // See below to configure properly
        }
      }
    },
    {
      resolve: "@pasdo501/gatsby-source-woocommerce",
      options: {
        // Base URL of WordPress site
        api: "cigars.local",
        verbose: true,
        // true if using https. false otherwise.
        https: false,
        query_string_auth: true, 
        api_keys: {
          consumer_key: 'ck_0162a2e56cab5fcf46bf2a78f55ef72c137bd995',
          consumer_secret: 'cs_62d1c26da64dd278da9b334b5706d3b6035ed2b7',
        },
        // Array of strings with fields you'd like to create nodes for...
        fields: ["products", "products/categories", "variations"],
      },
    },
  ],
};

export default config;
