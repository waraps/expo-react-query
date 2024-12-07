import { TaskStatus } from "@/constants";

export interface ITaskStatusUpdateReq {
  id: number;
  status: TaskStatus;
}
