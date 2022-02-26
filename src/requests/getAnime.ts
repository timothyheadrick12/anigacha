import axios from "axios";
import { randomInt } from "crypto";

export async function getAnime() {
  return axios({
    url: "https://graphql.anilist.co",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: {
      query: `
      query ($popularity_greater: Int) { # Define which variables will be used in the query (id)
        Media (popularity_greater: $popularity_greater, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
          id
          title {
            romaji
            english
            native
          }
        }
      }
      `,
      variables: { popularity_greater: randomInt(31900, 544000) },
    },
  }).then((result) =>
    result.data.data.Media.title.english
      ? result.data.data.Media.title.english
      : result.data.data.Media.title.romaji
  );
}
