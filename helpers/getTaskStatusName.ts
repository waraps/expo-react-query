import { TaskStatus } from "@/constants";

export const getTaskStatusName = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return "IN PROGRESS";
    case TaskStatus.DONE:
      return "DONE";
    default:
      return "TO DO";
  }
};
