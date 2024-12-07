import { AxiosResponse } from "axios";
import API from "@/api";
import {
  IPaginatedResults,
  ITask,
  ITaskReq,
  ITaskStatuses,
} from "@/interfaces";
import { TaskStatus } from "@/constants";

// Queries
const getTasks = async (): Promise<AxiosResponse<ITask[]>> => {
  const response = await API.get<AxiosResponse<ITask[]>>("/tasks");
  return response.data;
};

const getTaskById = async (id: number): Promise<AxiosResponse<ITask>> => {
  const response = await API.get<AxiosResponse<ITask>>(`/tasks/${id}`);
  return response.data;
};

const getTaskStatus = async (): Promise<AxiosResponse<ITaskStatuses>> => {
  const response = await API.get<AxiosResponse<ITaskStatuses>>(
    "/tasks/statuses"
  );
  return response.data;
};

// Mutations
const createTask = async (task: ITaskReq): Promise<AxiosResponse<ITask>> => {
  const response = await API.post<AxiosResponse<ITask>>("/tasks/", task);
  return response.data;
};

const updateTask = async (
  id: number,
  task: ITaskReq
): Promise<AxiosResponse<ITask>> => {
  const response = await API.put<AxiosResponse<ITask>>(`/tasks/${id}`, task);
  return response.data;
};

const updateTaskStatus = async (
  id: number,
  status: TaskStatus
): Promise<AxiosResponse<ITask>> => {
  const response = await API.patch<AxiosResponse<ITask>>(
    `/tasks/${id}/status`,
    {
      status,
    }
  );
  return response.data;
};

const deleteTask = async (id: number): Promise<AxiosResponse<{}>> => {
  const response = await API.delete<AxiosResponse<{}>>(`/tasks/${id}`);
  return response.data;
};

export {
  // Queries
  getTasks,
  getTaskById,
  getTaskStatus,
  // Mutations
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
