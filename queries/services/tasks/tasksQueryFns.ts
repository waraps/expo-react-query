import { QueryFunction, QueryFunctionContext } from "@tanstack/react-query";

import { getTasks, getTaskById, getTaskStatus } from "./tasksApi";
import { TasksQueryConstants } from "./tasksQueryConstants";

export default {
  // get all taks
  [TasksQueryConstants.GET_TASKS]: (
    _: QueryFunctionContext<[TasksQueryConstants.GET_TASKS]>
  ) => {
    return getTasks();
  },

  // get task by id
  [TasksQueryConstants.GET_TASK]: ({
    queryKey,
  }: QueryFunctionContext<[TasksQueryConstants.GET_TASK, number]>) => {
    return getTaskById(queryKey[1]);
  },

  // get task status
  [TasksQueryConstants.GET_TASK_STATUS]: (
    _: QueryFunctionContext<[TasksQueryConstants.GET_TASK_STATUS]>
  ) => {
    return getTaskStatus();
  },
} as Record<TasksQueryConstants, QueryFunction>;
