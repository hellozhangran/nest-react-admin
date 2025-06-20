import type { Pagination } from "@/types/page";
import apiClient from "../apiClient";
import type { PostEntity } from "@/types/entity/index";

export interface CreatePostReq {
	postName: string;
	postCode: string;
	status?: string;
	remark?: string;
	postSort?: number;
}

export type UpdatePostReq = CreatePostReq & { postId: number };

export interface ListPostReq extends Pagination {
	postName?: string;
	postCode?: string;
	status?: string;
}

export const PostApi = {
	PostGet: "/system/post",
	PostList: "/system/post/list",
	PostCreate: "/system/post/create",
	PostUpdate: "/system/post/update",
	PostDelete: "/system/post/delete",
} as const;

const getPost = (id: number) => apiClient.get<PostEntity>({ url: `${PostApi.PostGet}/${id}` });
const getPostList = (params: ListPostReq) => apiClient.get<PostEntity[]>({ url: PostApi.PostList, params });
const createPost = (data: CreatePostReq) => apiClient.post<string>({ url: PostApi.PostCreate, data });
const updatePost = (data: UpdatePostReq) => apiClient.post<string>({ url: PostApi.PostUpdate, data });
const deletePost = (id: number) => apiClient.post<string>({ url: `${PostApi.PostDelete}/${id}` });

export default {
	getPost,
	getPostList,
	createPost,
	updatePost,
	deletePost,
};
