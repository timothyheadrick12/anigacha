import axios from 'axios'
import {randomInt} from 'crypto'

export default async () =>
  axios({
    url: 'https://graphql.anilist.co',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: {
      query: `
      query ($popularity_greater: Int) { # Define which variables will be used in the query (id)
        Media (popularity_greater: $popularity_greater, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
          characters {
            edges {
              node {
                name {
                  full
                }
                image {
                  medium
                }
                description
              }
            }
          }
        }
      }
      `,
      variables: {popularity_greater: randomInt(31900, 544000)},
    },
  }).then(
    (result) =>
      result.data.data.Media.characters.edges[
        Math.floor(
          Math.random() * result.data.data.Media.characters.edges.length
        )
      ].node
  )
