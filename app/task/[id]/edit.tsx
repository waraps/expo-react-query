import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskSchema, taskSchemaType } from "@/schemes";
import {
  queryClient,
  TasksMutationConstants,
  TasksQueryConstants,
} from "@/queries";
import { IError, ITask, ITaskUpdateReq } from "@/interfaces";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export default function EditTaskScreen() {
  const { id } = useGlobalSearchParams<{ id: string }>();

  // Queries
  const task = queryClient.getQueryData<ITask>([
    TasksQueryConstants.GET_TASK,
    Number(id),
  ]);

  // Mutations
  const doUpdateNewTaskMutate = useMutation<any, IError, ITaskUpdateReq>({
    mutationKey: [TasksMutationConstants.UPDATE_TASK],
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [TasksQueryConstants.GET_TASK, Number(task?.id)],
        }),
        queryClient.invalidateQueries({
          queryKey: [TasksQueryConstants.GET_TASKS],
        }),
      ]);
      Toast.show({
        position: "bottom",
        text1: "Task update successfully",
        type: "success",
      });
      router.back();
    },
    onError: () => {
      Toast.show({
        position: "bottom",
        text1: "An error occurred while trying to create the new task",
        type: "error",
      });
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<taskSchemaType>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(taskSchema),
    criteriaMode: "firstError",
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
    },
  });

  const doEditTask = (data: taskSchemaType) => {
    if (task?.id) {
      doUpdateNewTaskMutate.mutate({ id: task.id, task: data });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#1763AB" },
          headerShown: true,
          headerTintColor: "white",
          headerTitle: "Edit",
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
            justifyContent: "space-between",
          }}
        >
          <View style={{ marginTop: 20 }}>
            <View style={{ marginVertical: 4 }}>
              <Text style={{ fontWeight: "bold" }}>Title</Text>
              <Controller
                name={"title"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={{
                      height: 40,
                      marginVertical: 5,
                      borderWidth: 1,
                      borderRadius: 4,
                      padding: 4,
                      borderColor: "#ccc",
                    }}
                    placeholder="task title ..."
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors?.title ? (
                <Text style={{ color: "red" }}>{errors.title?.message}</Text>
              ) : undefined}
            </View>
            <View style={{ marginVertical: 4 }}>
              <Text style={{ fontWeight: "bold" }}>Description</Text>
              <Controller
                name={"description"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={{
                      height: 220,
                      marginVertical: 5,
                      borderWidth: 1,
                      borderRadius: 4,
                      padding: 4,
                      borderColor: "#ccc",
                    }}
                    placeholder="task description ..."
                    onChangeText={onChange}
                    value={value}
                    multiline
                  />
                )}
              />
              {errors?.description ? (
                <Text style={{ color: "red" }}>
                  {errors.description?.message}
                </Text>
              ) : undefined}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSubmit(doEditTask)}
            style={{
              backgroundColor: "#1763AB",
              padding: 16,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
              Update task
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
