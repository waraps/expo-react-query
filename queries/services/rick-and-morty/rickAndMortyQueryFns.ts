import { QueryFunction, QueryFunctionContext } from "@tanstack/react-query";
import { RickAndMortyQueryConstants } from "./rickAndMortyQueryConstants";
import { getCharacters } from "./rickAndMortyApi";

export default {
  [RickAndMortyQueryConstants.GET_CHARACTERS]: ({
    pageParam = 1,
  }: QueryFunctionContext<[RickAndMortyQueryConstants]>) => {
    return getCharacters(pageParam as number);
  },
} as Record<RickAndMortyQueryConstants, QueryFunction>;
