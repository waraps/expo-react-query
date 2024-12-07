import Loading from "@/components/Loading";
import { RickAndMortyCard } from "@/components/RickAndMortyCard";
import {
  IError,
  IPaginatedResults,
  IRickAndMortyCharacter,
} from "@/interfaces";
import { queryClient } from "@/queries";
import { RickAndMortyQueryConstants } from "@/queries/services/rick-and-morty";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function RickAndMortyCharactersScreen() {
  const [list, setList] = useState<IRickAndMortyCharacter[]>([]);

  // Queries
  const rickAndMortyCharactersInfiniteQuery = useInfiniteQuery({
    queryKey: [RickAndMortyQueryConstants.GET_CHARACTERS],
    initialPageParam: 1,
    getNextPageParam: (
      currentRequest: IPaginatedResults<IRickAndMortyCharacter>
    ) => {
      if (currentRequest.info.next) {
        const nextPageNumber = Number(currentRequest.info.next.substring(48));
        return nextPageNumber;
      }
      return null;
    },
    select: useCallback(
      (data: InfiniteData<IPaginatedResults<IRickAndMortyCharacter>>) => {
        const formattedResults = data.pages.flatMap((page) => page.results);
        setList([...list, ...formattedResults]);
      },
      []
    ),
  });

  const loadMore = (): void => {
    if (
      rickAndMortyCharactersInfiniteQuery.hasNextPage &&
      !rickAndMortyCharactersInfiniteQuery.isFetchingNextPage
    ) {
      rickAndMortyCharactersInfiniteQuery.fetchNextPage();
    }
  };

  const resetInfiniteQueryPagination = (): void => {
    queryClient.setQueryData<
      InfiniteData<IPaginatedResults<IRickAndMortyCharacter>>
    >([RickAndMortyQueryConstants.GET_CHARACTERS], (oldData) => {
      if (!oldData) return undefined;

      return {
        ...oldData,
        pages: oldData.pages.slice(0, 1),
        pageParams: oldData.pageParams.slice(0, 1),
      };
    });
  };

  const doRefresh = (): void => {
    // to achieve a full refresh on infinite query, we need to reset the pagination
    // https://github.com/TanStack/query/discussions/5692
    resetInfiniteQueryPagination();
    rickAndMortyCharactersInfiniteQuery.refetch();
  };

  const renderItem = useCallback(
    ({
      item,
    }: ListRenderItemInfo<IRickAndMortyCharacter>): React.JSX.Element => (
      <RickAndMortyCard character={item} />
    ),
    []
  );

  const renderEmptyListComponent = useCallback((): React.JSX.Element => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {(rickAndMortyCharactersInfiniteQuery.isLoading ||
          rickAndMortyCharactersInfiniteQuery.isFetching) &&
        !list.length ? (
          <Loading />
        ) : (
          <>
            <Text style={{ marginTop: 30 }}>{`No characters found`}</Text>
          </>
        )}
      </View>
    );
  }, [
    rickAndMortyCharactersInfiniteQuery.isLoading,
    rickAndMortyCharactersInfiniteQuery.isFetching,
    list.length,
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#1763AB" },
          headerShown: true,
          headerTintColor: "white",
        }}
      />
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item: IRickAndMortyCharacter, index: number) =>
          String(item?.id) + index
        }
        refreshControl={
          <RefreshControl
            refreshing={
              rickAndMortyCharactersInfiniteQuery.isFetching ||
              rickAndMortyCharactersInfiniteQuery.isLoading
            }
            onRefresh={doRefresh}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.01}
        ListEmptyComponent={renderEmptyListComponent}
        ListFooterComponent={
          rickAndMortyCharactersInfiniteQuery.isFetchingNextPage ? (
            <ActivityIndicator />
          ) : null
        }
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 90,
        }}
      />
    </>
  );
}
