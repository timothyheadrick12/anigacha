//Type used for data retrieved upon initially requesting a character
//from the anilist api in getCharacter.ts
//Important files: getCharacter.ts

export interface ReqCharacterData {
  id: number;
  name: string;
  anime: string;
  description: string;
  favourites: number;
  rarity: string;
  image_med: string;
  image_large: string;
}
