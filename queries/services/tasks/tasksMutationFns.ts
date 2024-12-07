import { MutationFunction } from "@tanstack/react-query";

import {
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "./tasksApi";
import { TasksMutationConstants } from "./tasksQueryConstants";
import { ITaskReq, ITaskStatusUpdateReq, ITaskUpdateReq } from "@/interfaces";

export default {
  // create a new task
  [TasksMutationConstants.CREATE_TASK]: (data: ITaskReq) => {
    return createTask(data);
  },

  // update task
  [TasksMutationConstants.UPDATE_TASK]: (data: ITaskUpdateReq) => {
    return updateTask(data.id, data.task);
  },

  // update task status
  [TasksMutationConstants.UPDATE_TASK_STATUS]: (
    status: ITaskStatusUpdateReq
  ) => {
    return updateTaskStatus(status.id, status.status);
  },

  // delete task
  [TasksMutationConstants.DELETE_TASK]: (id: number) => {
    return deleteTask(id);
  },
} as Record<TasksMutationConstants, MutationFunction>;
