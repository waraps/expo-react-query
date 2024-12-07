import { TaskStatus } from "@/constants";

export interface ITask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
