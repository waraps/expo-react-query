/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MutationFunction,
  QueryCache,
  QueryClient,
  QueryFunction,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import tasksQueryFns from "./services/tasks/tasksQueryFns";
import tasksMutationFns from "./services/tasks/tasksMutationFns";
import rickAndMortyQueryFns from "./services/rick-and-morty/rickAndMortyQueryFns";

// here we merge all the queries
const queryFnMap: Record<any, QueryFunction> = {
  ...tasksQueryFns,
  ...rickAndMortyQueryFns,
};

// here we merge all the mutations
const mutationFnMap: Record<any, MutationFunction> = {
  ...tasksMutationFns,
};

function createQueryClient() {
  const queryCache = new QueryCache();
  const defaultQueryClient = new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        queryFn: async (context) => {
          const queryKey = (
            Array.isArray(context.queryKey)
              ? context.queryKey[0]
              : context.queryKey
          ) as string;
          if (!queryKey) {
            return Promise.resolve();
          }
          // get the query function by key
          return queryFnMap[queryKey](context);
        },
      },
      mutations: {
        onError: (err: any) => {
          const errorMessage = err?.message || "An error occurred";
          Toast.show({
            position: "bottom",
            text1: errorMessage,
            type: "error",
          });
        },
      },
    },
  });

  // We'll iterate through every mutation key/function on mutationFnMap, and we'll set the default function for each
  // This way we can, on every part of the app, just use useMutation(mutationKey)
  Object.entries(mutationFnMap).forEach(([key, mutationFn]) =>
    defaultQueryClient.setMutationDefaults([key], {
      mutationFn: mutationFn,
    })
  );

  return defaultQueryClient;
}

export const queryClient: QueryClient = createQueryClient();
