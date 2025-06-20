import type { BaseEntity } from "../entity";

/**
 * 用户实体类
 */
export interface UserEntity extends BaseEntity {
	userId: number;
	deptId: number;
	userName: string;
	nickName: string;
	//00系统用户
	userType: string;
	email: string;
	phonenumber: string;
	//0男 1女 2未知
	sex: string;
	avatar: string;
	password: string;
	loginIp: string;
	loginDate: Date;
}

/**
 * 部门实体类
 */
export interface DeptEntity extends BaseEntity {
	deptId: number;
	parentId: number;
	ancestors: string;
	deptName: string;
	orderNum: number;
	leader: string;
	phone: string;
	email: string;
}

/**
 * 岗位实体类
 */
export interface PostEntity extends BaseEntity {
	postId: number;
	postCode: string;
	postName: string;
	postSort: number;
}

/**
 * 菜单实体类
 */
export interface MenuEntity extends BaseEntity {
	menuId: number;
	menuName: string;
	parentId: number;
	orderNum: number;
	path: string;
	component: string;
	query: string;
	isFrame: string;
	isCache: string;
	visible: string;
	menuType: string;
	perms: string;
	icon: string;
}

/**
 * 角色实体类
 */
export interface RoleEntity extends BaseEntity {
	roleId: number;
	roleName: string;
	roleSort: number;
	roleKey: string;
	//数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）
	dataScope: string;
	menuCheckStrictly: boolean;
	deptCheckStrictly: boolean;
}
