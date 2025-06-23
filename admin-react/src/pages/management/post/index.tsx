import postService, { PostApi, type ListPostReq } from "@/api/services/postService";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import Table, { type ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { PostEntity } from "@/types/entity/index";

export default function PostPage() {
	const searchForm = useForm<ListPostReq>({
		defaultValues: {
			postName: "",
			postCode: "",
			status: "",
			pageNum: 1,
			pageSize: 10,
		},
	});
	const [modalProps, setModalProps] = useState<PostModalProps>({
		formValue: {
			postName: "",
			postCode: "",
			postSort: 0,
			status: "0",
			remark: "",
		},
		title: "新建岗位",
		show: false,
		onOk: () => setModalProps((prev) => ({ ...prev, show: false })),
		onCancel: () => setModalProps((prev) => ({ ...prev, show: false })),
	});

	const columns: ColumnsType<Partial<PostEntity>> = [
		{ title: "岗位名称", dataIndex: "postName", width: 120 },
		{ title: "岗位编码", dataIndex: "postCode", width: 120 },
		{ title: "岗位顺序", dataIndex: "postSort", width: 100 },
		{
			title: "状态",
			dataIndex: "status",
			width: 100,
			render: (status) => (
				<Badge variant={status === "0" ? "success" : "error"}>{status === "0" ? "正常" : "停用"}</Badge>
			),
		},
		{ title: "备注", dataIndex: "remark", width: 180 },
		{ title: "创建时间", dataIndex: "createTime", width: 180 },
		{
			title: "操作",
			key: "operation",
			align: "center",
			width: 120,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray">
					<Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => onDelete(record)}>
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
					</Button>
				</div>
			),
		},
	];

	const rowSelection: TableRowSelection<Partial<PostEntity>> = {
		onChange: (selectedRowKeys, selectedRows) => {
			// 可选：处理多选
			console.log(selectedRowKeys, selectedRows);
		},
	};

	const {
		data: postList,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: [PostApi.PostList, searchForm.getValues()],
		queryFn: () => {
			const raw = searchForm.getValues();
			const params = Object.fromEntries(Object.entries(raw).filter(([_, v]) => v !== ""));
			return postService.getPostList(params);
		},
		select: (data) => data.list,
	});

	const onCreate = () => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "新建岗位",
			formValue: {
				postName: "",
				postCode: "",
				postSort: 0,
				status: "0",
				remark: "",
			},
		}));
	};

	const onEdit = (formValue: Partial<PostEntity>) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "编辑岗位",
			formValue,
		}));
	};

	const onDelete = (record: Partial<PostEntity>) => {
		if (!record.postId) return;
		postService.deletePost(record.postId).then(() => {
			refetch();
		});
	};

	const handleReset = () => {
		searchForm.reset({
			postName: "",
			postCode: "",
			status: "",
			pageNum: 1,
			pageSize: 10,
		});
	};

	const handleSearch = () => {
		refetch();
	};

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardContent>
					<Form {...searchForm}>
						<div className="flex items-center gap-4">
							<FormField
								control={searchForm.control}
								name="postName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>岗位名称</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={searchForm.control}
								name="postCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>岗位编码</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={searchForm.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>状态</FormLabel>
										<FormControl>
											<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-2">
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="0" id="r1" />
													<Label htmlFor="r1">正常</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="1" id="r2" />
													<Label htmlFor="r2">停用</Label>
												</div>
											</RadioGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<div className="flex ml-auto">
								<Button variant="outline" onClick={handleReset}>
									重置
								</Button>
								<Button className="ml-4" disabled={isFetching} onClick={handleSearch}>
									{isFetching && <Icon icon="lucide:loader-2" className="animate-spin mr-2" />}
									搜索
								</Button>
							</div>
						</div>
					</Form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>岗位列表</div>
						<Button onClick={onCreate}>新建岗位</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table
						rowKey="postId"
						size="small"
						scroll={{ x: "max-content" }}
						pagination={false}
						columns={columns}
						dataSource={postList || []}
						rowSelection={{ ...rowSelection }}
					/>
				</CardContent>
			</Card>

			<PostModal
				{...modalProps}
				onOk={() => {
					modalProps.onOk();
					refetch();
				}}
			/>
		</div>
	);
}

type PostModalProps = {
	formValue: Partial<PostEntity>;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};

function PostModal({ title, show, formValue, onOk, onCancel }: PostModalProps) {
	const form = useForm<Partial<PostEntity>>({
		defaultValues: formValue,
	});

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	const handleSubmit = (values: Partial<PostEntity>) => {
		const submitValues = {
			...values,
			postSort: values.postSort ?? 0,
			status: values.status ?? "0",
		};
		if (formValue.postId) {
			postService.updatePost({ ...submitValues, postId: formValue.postId } as any).then(onOk);
		} else {
			postService.createPost(submitValues as any).then(onOk);
		}
	};

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="postName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>岗位名称</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="postCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>岗位编码</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="postSort"
								render={({ field }) => (
									<FormItem>
										<FormLabel>岗位顺序</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>状态</FormLabel>
										<FormControl>
											<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-2">
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="0" id="r1" />
													<Label htmlFor="r1">正常</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="1" id="r2" />
													<Label htmlFor="r2">停用</Label>
												</div>
											</RadioGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="remark"
								render={({ field }) => (
									<FormItem>
										<FormLabel>备注</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={onCancel} type="button">
								取消
							</Button>
							<Button type="submit">保存</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
