import apiClient from "../apiClient";

import type { UserInfo, UserToken } from "#/entity";
import type { Pagination } from "@/types/page";
import type { UserEntity } from "@/types/entity/index";

export interface LoginReq {
	userName: string;
	password: string;
}

export interface LoginRes {
	token: string;
}

export interface SignUpReq extends LoginReq {
	email: string;
}

export type SignInRes = UserToken & { user: UserInfo };

export interface ProfileRes {
	user: UserInfo;
}

export interface UpdateProfileReq {
	nickName?: string;
	email?: string;
	phonenumber?: string;
	sex?: string;
	avatar?: string;
	remark?: string;
}

export interface ListUserReq extends Pagination {
	deptId?: string;
	nickName?: string;
	email?: string;
	userName?: string;
	phonenumber?: string;
	status?: string;
}

export enum UserApi {
	SignUp = "/auth/signup",
	Login = "/system/user/login",
	Profile = "/system/user/profile",
	UserList = "/system/user/list",
	UserInfo = "/system/user/info",
}

const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const login = (data: LoginReq) => apiClient.post<LoginRes>({ url: UserApi.Login, data });
const getProfile = () => apiClient.get<UserEntity>({ url: UserApi.Profile });
const putProfile = (data: UpdateProfileReq) => apiClient.put<string>({ url: UserApi.Profile, data });
const getUserList = (params: ListUserReq) =>
	apiClient.get<{ list: UserEntity[]; total: number }>({ url: UserApi.UserList, params });
const getUserInfo = () => apiClient.get<UserEntity>({ url: UserApi.UserInfo });

export default {
	login,
	signup,
	getProfile,
	putProfile,
	getUserList,
	getUserInfo,
};
