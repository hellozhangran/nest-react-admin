import apiClient from "../apiClient";
import type { DeptEntity } from "@/types/entity/index";

export interface CreateDeptReq {
	parentId: number;
	deptName: string;
	orderNum: number;
	leader?: string;
	phone?: string;
	email?: string;
	status?: string;
}

export type UpdateDeptReq = CreateDeptReq & { deptId: number };

export interface ListDeptReq {
	deptName?: string;
	status?: string;
}

export const DeptApi = {
	DeptGet: "/system/dept",
	DeptList: "/system/dept/list",
	DeptCreate: "/system/dept/create",
	DeptUpdate: "/system/dept/update",
	DeptDelete: "/system/dept/delete",
} as const;

const getDept = (id: number) => apiClient.get<DeptEntity>({ url: `${DeptApi.DeptGet}/${id}` });
const getDeptList = (params: ListDeptReq) => apiClient.get<DeptEntity[]>({ url: DeptApi.DeptList, params });
const createDept = (data: CreateDeptReq) => apiClient.post<string>({ url: DeptApi.DeptCreate, data });
const updateDept = (data: UpdateDeptReq) => apiClient.post<string>({ url: DeptApi.DeptUpdate, data });
const deleteDept = (id: number) => apiClient.post<string>({ url: `${DeptApi.DeptDelete}/${id}` });

export default {
	getDept,
	getDeptList,
	createDept,
	updateDept,
	deleteDept,
};
