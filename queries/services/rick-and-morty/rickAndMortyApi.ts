import { IPaginatedResults, IRickAndMortyCharacter } from "@/interfaces";
import axios, { AxiosResponse } from "axios";

// Queries
const getCharacters = async (
  page: number
): Promise<AxiosResponse<IPaginatedResults<IRickAndMortyCharacter>>> => {
  const response = await axios.get<
    AxiosResponse<IPaginatedResults<IRickAndMortyCharacter>>
  >(`https://rickandmortyapi.com/api/character/?page=${page}`);
  return response.data;
};

export {
  // Queries
  getCharacters,
};
