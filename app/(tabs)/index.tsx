import Loading from "@/components/Loading";
import { TaskCard } from "@/components/TaskCard";
import { IError, ITask } from "@/interfaces";
import { TasksQueryConstants } from "@/queries";
import { useQuery } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  // Queries
  const tasksQuery = useQuery<
    any,
    IError,
    ITask[],
    [TasksQueryConstants.GET_TASKS]
  >({
    queryKey: [TasksQueryConstants.GET_TASKS],
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ITask>): React.JSX.Element => (
      <TaskCard task={item} />
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
        {(tasksQuery.isLoading || tasksQuery.isFetching) &&
        !tasksQuery?.data ? (
          <Loading />
        ) : (
          <>
            <Text style={{ marginTop: 30 }}>{`No tasks found`}</Text>
            <Link
              href="/new-task"
              style={{
                textDecorationLine: "underline",
                color: "#4169E1",
                fontWeight: "bold",
                marginTop: 6,
              }}
            >
              Create a new task
            </Link>
          </>
        )}
      </View>
    );
  }, [tasksQuery.isLoading, tasksQuery.isFetching, tasksQuery?.data?.length]);

  if (tasksQuery.isError) {
    return (
      <>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: "#1763AB" },
            headerShown: true,
            headerTintColor: "white",
          }}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>{"We are sorry, something went worng :("}</Text>
          <TouchableOpacity onPress={() => tasksQuery.refetch()}>
            <Text
              style={{
                textDecorationLine: "underline",
                color: "#4169E1",
                fontWeight: "bold",
                marginTop: 6,
              }}
            >
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

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
        data={tasksQuery?.data ?? []}
        renderItem={renderItem}
        keyExtractor={(item: ITask, index: number) => String(item?.id) + index}
        refreshControl={
          <RefreshControl
            refreshing={tasksQuery.isFetching || tasksQuery.isLoading}
            onRefresh={tasksQuery.refetch}
          />
        }
        ListEmptyComponent={renderEmptyListComponent}
        ListFooterComponent={
          tasksQuery.isLoading && tasksQuery?.data ? (
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
