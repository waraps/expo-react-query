import { TaskStatus } from "@/constants";
import { getTaskStatusName } from "./getTaskStatusName";
import { ColorValue } from "react-native";

interface IBadgeStyles {
  title: string;
  borderColor: ColorValue;
  backgroundColor: ColorValue;
}

export const getTaskBadgeStyles = (status: TaskStatus): IBadgeStyles => {
  const title = getTaskStatusName(status);
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return {
        title,
        borderColor: "#FF5F1F",
        backgroundColor: "#FFF5EE",
      };
    case TaskStatus.DONE:
      return {
        title,
        borderColor: "#16833A",
        backgroundColor: "#E4F7EA",
      };
    default:
      return {
        title,
        borderColor: "#1763AB",
        backgroundColor: "#E4F2FF",
      };
  }
};
