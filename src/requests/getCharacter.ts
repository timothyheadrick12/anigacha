import axios from 'axios';
import {randomInt} from 'crypto';
import {calculateRarity} from '../globals';

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
      query ($popularity_rank: Int) { # Define which variables will be used in the query (id)
        Page(page: $popularity_rank, perPage:1){
          media (sort:POPULARITY_DESC, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
            title {
              romaji
              english
            }
            characters(sort:FAVOURITES_DESC) {
                edges {
                  node {
                    id
                    favourites
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
      }
      `,
      variables: {popularity_rank: randomInt(1, 1001)},
    },
  }).then((result) => {
    const character =
      result.data.data.Page.media[0].characters.edges[
        Math.floor(
          Math.random() * result.data.data.Page.media[0].characters.edges.length
        )
      ].node;
    character.anime = result.data.data.Page.media[0].title.english
      ? result.data.data.Page.media[0].title.english
      : result.data.data.Page.media[0].title.romaji;
    character.rarity = calculateRarity(character.favourites);
    return character;
  });
