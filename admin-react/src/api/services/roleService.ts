import type { Pagination } from "@/types/page";
import apiClient from "../apiClient";
import type { RoleEntity } from "@/types/entity/index";

export interface ListRoleReq extends Pagination {
	roleName?: string;
	roleKey?: string;
	status?: string;
	roleId?: string;
}

export interface CreateRoleReq {
	roleName: string;
	roleKey: string;
	menuIds?: Array<number>;
	deptIds?: Array<number>;
	roleSort?: number;
	status?: string;
	dataScope: string;
	remark?: string;
	menuCheckStrictly?: boolean;
	deptCheckStrictly?: boolean;
}

export type UpdateRoleReq = CreateRoleReq & { roleId: number };

export const RoleApi = {
	RoleGet: "/system/role",
	RoleList: "/system/role/list",
	RoleCreate: "/system/role/create",
	RoleUpdate: "/system/role/update",
	RoleDelete: "/system/role/delete",
} as const;

const getRole = (id: number) => apiClient.get<RoleEntity>({ url: `${RoleApi.RoleGet}/${id}` });
const getRoleList = (data: ListRoleReq) =>
	apiClient.get<{ list: RoleEntity[]; total: number }>({ url: RoleApi.RoleList, data });
const createRole = (data: CreateRoleReq) => apiClient.post<string>({ url: RoleApi.RoleCreate, data });
const updateRole = (data: UpdateRoleReq) => apiClient.post<string>({ url: RoleApi.RoleUpdate, data });
const deleteRole = (id: number) => apiClient.post<string>({ url: `${RoleApi.RoleDelete}/${id}` });

export default {
	getRole,
	getRoleList,
	createRole,
	updateRole,
	deleteRole,
};
