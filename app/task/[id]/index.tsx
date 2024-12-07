import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack, useGlobalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IError,
  ITask,
  ITaskStatuses,
  ITaskStatusUpdateReq,
} from "@/interfaces";
import {
  queryClient,
  TasksMutationConstants,
  TasksQueryConstants,
} from "@/queries";
import { format } from "date-fns";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  ITaskStatusModalRef,
  TaskStatusModal,
} from "@/components/TaskStatusModal";
import { useRef } from "react";
import BadgeStatus from "@/components/BadgeStatus";
import Toast from "react-native-toast-message";

export default function TaskDetailsScreen() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const modalRef = useRef<ITaskStatusModalRef>(null);

  // Queries
  const taskQuery = useQuery<
    any,
    IError,
    ITask,
    [TasksQueryConstants.GET_TASK, number]
  >({
    queryKey: [TasksQueryConstants.GET_TASK, Number(id)],
  });

  const taskStatusQuery = useQuery<
    any,
    IError,
    ITaskStatuses,
    [TasksQueryConstants.GET_TASK_STATUS]
  >({
    queryKey: [TasksQueryConstants.GET_TASK_STATUS],
  });

  // Mutations
  const doUpdateTaskStatusMutate = useMutation<
    any,
    IError,
    ITaskStatusUpdateReq
  >({
    mutationKey: [TasksMutationConstants.UPDATE_TASK_STATUS],
    onMutate: (task) => onMutate(task),
    onSuccess: (data, variables, restoreCache) =>
      onSuccess(data, variables, restoreCache),
    onSettled: () => onSettled(),
    onError: (error: IError, variables, restoreCache) =>
      onError(error, variables, restoreCache),
  });

  // Optimistic updates
  const onMutate = (request: ITaskStatusUpdateReq) => {
    if (taskQuery?.data) {
      const task: ITask = {
        ...taskQuery.data,
        status: request.status,
      };
      // updating the cache value with the values ​​previously entered by the user
      // we do this so that the user receives an "immediate update"
      queryClient.setQueryData<ITask>(
        [TasksQueryConstants.GET_TASK, Number(id)],
        task
      );
    }

    // returning the cache value in case it is needed later, for example in update errors
    return () =>
      queryClient.setQueryData<ITask>(
        [TasksQueryConstants.GET_TASK, Number(id)],
        taskQuery?.data
      );
  };

  const onSuccess = (
    data: ITask,
    _: ITaskStatusUpdateReq,
    restoreCache: any
  ) => {
    // if everything goes well, we need to restore the cache and update it with the values ​​returned by the api
    restoreCache();
    queryClient.setQueryData<ITask>(
      [TasksQueryConstants.GET_TASK, Number(id)],
      data
    );

    queryClient.invalidateQueries({
      queryKey: [TasksQueryConstants.GET_TASKS],
    });

    doCloseStatusesModal();

    Toast.show({
      position: "bottom",
      text1: "Task update successfully",
      type: "success",
    });
  };

  const onSettled = (): void => {
    queryClient.invalidateQueries({
      queryKey: [TasksQueryConstants.GET_TASKS],
    });
  };

  const onError = (
    error: IError,
    _: ITaskStatusUpdateReq,
    restoreCache: any
  ): void => {
    // if an error is happen, we need to restore the cache to the original state
    restoreCache();
    Toast.show({
      position: "bottom",
      text1: "An error occurred while trying to create the new task",
      type: "error",
    });
  };

  const doOpenStatusesModal = () => {
    modalRef.current?.open();
  };

  const doCloseStatusesModal = () => {
    modalRef.current?.close();
  };

  if (taskQuery.isError) {
    return (
      <>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: "#1763AB" },
            headerShown: true,
            headerTintColor: "white",
            headerTitle: "Details",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>{"We are sorry, something went worng :("}</Text>
          <TouchableOpacity onPress={() => taskQuery.refetch()}>
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
          headerTitle: "Details",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingVertical: 10,
            paddingBottom: 60,
            flexGrow: 1,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              marginBottom: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "#191817",
              }}
            >
              Task #{taskQuery?.data?.id}
            </Text>
            <Link href={`/task/${taskQuery?.data?.id}/edit`}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textDecorationLine: "underline",
                    color: "#4169E1",
                    fontSize: 16,
                  }}
                >
                  Edit
                </Text>
                <IconSymbol
                  size={17}
                  name="square.and.pencil"
                  color={"#4169E1"}
                />
              </View>
            </Link>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 4,
                color: "#191817",
              }}
            >
              Title
            </Text>
            <Text>{taskQuery?.data?.title}</Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 4,
                color: "#191817",
              }}
            >
              Description
            </Text>
            <Text style={{ textAlign: "justify" }}>
              {taskQuery?.data?.description}
            </Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 4,
                color: "#191817",
              }}
            >
              Status
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BadgeStatus status={taskQuery?.data?.status ?? 0} />
              <TouchableOpacity onPress={doOpenStatusesModal}>
                <Text
                  style={{
                    textDecorationLine: "underline",
                    color: "#4169E1",
                  }}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 4,
                color: "#191817",
              }}
            >
              Created
            </Text>
            <Text>
              {format(
                new Date(taskQuery?.data?.createdAt ?? new Date()),
                "PPpp"
              )}
            </Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 4,
                color: "#191817",
              }}
            >
              Last updated
            </Text>
            <Text>
              {format(
                new Date(taskQuery?.data?.updatedAt ?? new Date()),
                "PPpp"
              )}
            </Text>
          </View>
        </ScrollView>
        {taskStatusQuery?.data ? (
          <TaskStatusModal
            status={taskQuery.data?.status ?? 0}
            statuses={taskStatusQuery.data}
            onPress={(status) =>
              doUpdateTaskStatusMutate.mutate({ id: Number(id), status })
            }
            ref={modalRef}
          />
        ) : undefined}
      </SafeAreaView>
    </>
  );
}
