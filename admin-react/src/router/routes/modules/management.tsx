import { Suspense, lazy } from "react";
import { Navigate, Outlet } from "react-router";

import { Icon } from "@/components/icon";
import { LineLoading } from "@/components/loading";

import type { AppRouteObject } from "#/router";

const ProfilePage = lazy(() => import("@/pages/management/user/profile"));
const AccountPage = lazy(() => import("@/pages/management/user/account"));

const PermissioPage = lazy(() => import("@/pages/management/system/permission"));

const UserManagePage = lazy(() => import("@/pages/management/user/manage"));
const RolePage = lazy(() => import("@/pages/management/role"));
const MenuPage = lazy(() => import("@/pages/management/menu"));
const DepartmentPage = lazy(() => import("@/pages/management/department"));
const PostPage = lazy(() => import("@/pages/management/post"));

const management: AppRouteObject = {
	order: 2,
	path: "management",
	element: (
		<Suspense fallback={<LineLoading />}>
			<Outlet />
		</Suspense>
	),
	meta: {
		label: "sys.menu.management",
		icon: <Icon icon="local:ic-management" className="ant-menu-item-icon" size="24" />,
		key: "/management",
	},
	children: [
		{
			index: true,
			element: <Navigate to="blog" replace />,
		},
		{
			path: "user",
			element: <UserManagePage />,
			meta: {
				label: "sys.menu.user.index",
				key: "/management/user",
				icon: <Icon icon="fa6-solid:user" size="18" />,
			},
		},
		{
			path: "role",
			element: <RolePage />,
			meta: {
				label: "sys.menu.role.index",
				key: "/management/role",
				icon: <Icon icon="fa6-solid:user-group" size="18" />,
			},
		},
		{
			path: "menu",
			element: <MenuPage />,
			meta: {
				label: "sys.menu.menu.index",
				key: "/management/menu",
				icon: <Icon icon="fa6-solid:list-ul" size="18" />,
			},
		},
		{
			path: "department",
			element: <DepartmentPage />,
			meta: {
				label: "sys.menu.department.index",
				key: "/management/department",
				icon: <Icon icon="fa6-solid:building-columns" size="18" />,
			},
		},
		{
			path: "post",
			element: <PostPage />,
			meta: {
				label: "sys.menu.post.index",
				key: "/management/post",
				icon: <Icon icon="fa6-solid:address-card" size="18" />,
			},
		},
		{
			path: "user/profile",
			element: <ProfilePage />,
			meta: {
				hideMenu: true,
				label: "sys.menu.user.profile",
				key: "/management/user/profile",
			},
		},
		{
			path: "user/account",
			element: <AccountPage />,
			meta: {
				hideMenu: true,
				label: "sys.menu.user.account",
				key: "/management/user/account",
			},
		},
		{
			path: "system",
			meta: { label: "sys.menu.system.index", key: "/management/system" },
			element: <PermissioPage />,
		},
	],
};

export default management;
