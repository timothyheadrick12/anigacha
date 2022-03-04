import Character from "../models/Characters";
import { ReqCharacterData } from "../typings/CharacterData";

const summonBuffer: Array<ReqCharacterData> = [];

export const summon = async (amount: number): Promise<Character | null> {
    if (summonBuffer.length < amount) {
        
    }
}