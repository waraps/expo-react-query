import { IError, ITask } from "@/interfaces";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { IconSymbol } from "./ui/IconSymbol";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
  queryClient,
  TasksMutationConstants,
  TasksQueryConstants,
} from "@/queries";
import Toast from "react-native-toast-message";
import BadgeStatus from "./BadgeStatus";

interface ITaskCard {
  task: ITask;
}

export const TaskCard = (props: ITaskCard) => {
  const { task } = props;

  const router = useRouter();

  const goToDetails = (): void => {
    router.navigate(`/task/${task.id}`);
  };

  // Mutations
  const doDeleteTaskMutate = useMutation<any, IError, number>({
    mutationKey: [TasksMutationConstants.DELETE_TASK],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TasksQueryConstants.GET_TASKS],
      });
      Toast.show({
        position: "bottom",
        text1: "Task deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      Toast.show({
        position: "bottom",
        text1: "An error occurred while trying to delete the task",
        type: "error",
      });
    },
  });

  const renderRightAction = (): JSX.Element => {
    const doDelete = () => doDeleteTaskMutate.mutate(task.id);

    return (
      <View
        style={{
          justifyContent: "center",
          margin: 4,
          paddingHorizontal: 20,
          borderRadius: 10,
          width: "30%",
          alignItems: "center",
          backgroundColor: "#ff5345",
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center" }}
          onPress={doDelete}
        >
          <IconSymbol size={28} name="trash" color={"white"} />
          <Text style={{ color: "white", fontWeight: "bold" }}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightAction}>
      <TouchableWithoutFeedback onPress={goToDetails}>
        <View
          style={{
            borderRadius: 10,
            backgroundColor: "white",
            padding: 15,
            marginVertical: 6,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <BadgeStatus status={task.status} />
            <Text
              style={{ fontSize: 12, fontWeight: "bold", color: "#191817" }}
            >
              {format(new Date(task.createdAt), "dd/MM/yyyy")}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontWeight: "bold", color: "#191817", fontSize: 16 }}
          >
            {task.title}
          </Text>
          <Text numberOfLines={3} ellipsizeMode="tail" style={{ marginTop: 1 }}>
            {task.description}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </Swipeable>
  );
};
