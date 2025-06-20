import apiClient from "../apiClient";
import type { MenuEntity } from "@/types/entity/index";

export interface ListMenuReq {
	menuName?: string;
	status?: string;
}

export interface CreateMenuReq {
	menuName: string;
	orderNum: number;
	parentId: number;
	path?: string;
	query: string;
	component?: string;
	icon?: string;
	menuType: string;
	isCache: string;
	isFrame: string;
	status: string;
	visible: string;
	perms: string;
}

export type UpdateMenuReq = CreateMenuReq & { menuId: number };

export const MenuApi = {
	MenuGet: "/system/menu",
	MenuList: "/system/menu/list",
	MenuCreate: "/system/menu/create",
	MenuUpdate: "/system/menu/update",
	MenuDelete: "/system/post/delete",
	MenuTree: "/system/menu/treeselect",
} as const;

const getMenu = (id: number) => apiClient.get<MenuEntity>({ url: `${MenuApi.MenuGet}/${id}` });
const getMenuList = (params: ListMenuReq) => apiClient.get<MenuEntity[]>({ url: MenuApi.MenuList, params });
const createMenu = (data: CreateMenuReq) => apiClient.post<string>({ url: MenuApi.MenuCreate, data });
const updateMenu = (data: UpdateMenuReq) => apiClient.post<string>({ url: MenuApi.MenuUpdate, data });
const deleteMenu = (id: number) => apiClient.post<string>({ url: `${MenuApi.MenuDelete}/${id}` });
const getMenuTree = () => apiClient.get<any>({ url: MenuApi.MenuTree });

export default {
	getMenu,
	getMenuList,
	createMenu,
	updateMenu,
	deleteMenu,
	getMenuTree,
};
