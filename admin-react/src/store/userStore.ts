import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import userService, { UserApi } from "@/api/services/userService";
import { toast } from "sonner";
import type { UserInfo, UserToken } from "#/entity";
import { StorageEnum } from "#/enum";

type UserStore = {
	userInfo: Partial<UserInfo>;
	userToken: UserToken;
	// 使用 actions 命名空间来存放所有的 action
	actions: {
		setUserInfo: (userInfo: UserInfo) => void;
		setUserToken: (token: UserToken) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: {},
			actions: {
				setUserInfo: (userInfo) => {
					set({ userInfo });
				},
				setUserToken: (userToken) => {
					set({ userToken });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: {} });
				},
			},
		}),
		{
			name: "userStore", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
			}),
		},
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useLogin = () => {
	const { setUserToken, setUserInfo } = useUserActions();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: userService.login,
		onSuccess: async (res) => {
			const { token } = res;
			setUserToken({ accessToken: token, refreshToken: "" });

			const userInfo = await queryClient.fetchQuery({
				queryKey: [UserApi.UserInfo],
				queryFn: userService.getUserInfo,
			});
			console.log(111111, userInfo as unknown as UserInfo);
			setUserInfo({
				...userInfo,
				avatar: userInfo.avatar || "https://avatars.githubusercontent.com/u/1559237?v=4",
				email: userInfo.email || "1234567890@qq.com",
				username: userInfo.userName || "admin",
				id: userInfo.userId || "1",
			} as unknown as UserInfo);
			toast.success("Sign in success!", {
				closeButton: true,
			});
		},
		onError: (err) => {
			toast.error(err.message, {
				position: "top-center",
			});
		},
	});
};

export default useUserStore;
