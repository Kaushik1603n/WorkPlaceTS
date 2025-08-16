import { IJob } from "../models/Projects";

export interface AdminPaginatedProjects {
  result: IJob[];
  totalPage: number;
}
