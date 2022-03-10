//This was a test file and is unused now. It gests the most popular
//character from the anilist api

import axios from 'axios';

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
      query { # Define which variables will be used in the query (id)
        Character (sort:FAVOURITES_DESC) {
            name {
              full
            }
            image {
              medium
            }
            favourites
            description
          }
      }
      `,
    },
  }).then((result) => result.data.data.Character);
