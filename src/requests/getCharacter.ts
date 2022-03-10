//Given a popularity rank this gets the id, favourites,
//full name, image, and description of a character.
//Also calculates the rarity of a character.
//Import files: typings/CharacterData.ts

import axios from 'axios';
import {randomInt} from 'crypto';
import {calculateRarity} from '../globals';
import {ReqCharacterData} from '../typings/CharacterData';

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
    const characterNode =
      result.data.data.Page.media[0].characters.edges[
        Math.floor(
          Math.random() * result.data.data.Page.media[0].characters.edges.length
        )
      ].node;
    const character: ReqCharacterData = {
      id: characterNode.id as number,
      name: characterNode.name.full as string,
      anime: (result.data.data.Page.media[0].title.english
        ? result.data.data.Page.media[0].title.english
        : result.data.data.Page.media[0].title.romaji) as string,
      description: characterNode.description as string,
      favourites: characterNode.favourites as number,
      rarity: calculateRarity(characterNode.favourites),
      image: characterNode.image.medium as string,
    };
    return character;
  });
