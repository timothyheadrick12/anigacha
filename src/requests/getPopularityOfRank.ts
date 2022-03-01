import axios from 'axios'

export default async (rank: number) =>
  axios({
    url: 'https://graphql.anilist.co',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: {
      query: `
      query ($popularity_rank: Int) { # Define which variables will be used in the query (id)
        Page(page: $popularity_rank, perPage:1){
            characters (sort:FAVOURITES_DESC) {
              favourites
            }
          }
      }
      `,
      variables: {popularity_rank: rank},
    },
  }).then((result) => {
    return result.data.data.Page.characters[0].favourites
  })
