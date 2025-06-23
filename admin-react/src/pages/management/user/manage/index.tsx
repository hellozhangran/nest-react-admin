import userService, { UserApi, type ListUserReq } from "@/api/services/userService";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { useQuery } from "@tanstack/react-query";
import Table, { type ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { UserEntity } from "@/types/entity/index";

export default function UserManagePage() {
	const searchForm = useForm<ListUserReq>({
		defaultValues: {
			userName: "",
			phonenumber: "",
			status: "",
			pageNum: 1,
			pageSize: 10,
		},
	});
	const [userModalProps, setUserModalProps] = useState<UserModalProps>({
		formValue: {
			userName: "",
			nickName: "",
			phonenumber: "",
			email: "",
			status: "0",
		},
		title: "New",
		show: false,
		onOk: () => {
			setUserModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setUserModalProps((prev) => ({ ...prev, show: false }));
		},
	});

	const columns: ColumnsType<Partial<UserEntity>> = [
		{ title: "姓名", dataIndex: "userName", width: 100 },
		{ title: "昵称", dataIndex: "nickName", width: 100 },
		{ title: "手机号", dataIndex: "phonenumber", align: "center", width: 100 },
		{ title: "邮箱", dataIndex: "email", align: "center", width: 100 },
		{
			title: "状态",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => (
				<Badge variant={status === "0" ? "success" : "error"}>{status === "0" ? "正常" : "停用"}</Badge>
			),
		},
		{ title: "创建时间", dataIndex: "createTime", align: "center", width: 300 },
		{
			title: "操作",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray">
					<Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button variant="ghost" size="icon">
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
					</Button>
				</div>
			),
		},
	];

	// rowSelection objects indicates the need for row selection
	const rowSelection: TableRowSelection<Partial<UserEntity>> = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
		},
		onSelect: (record, selected, selectedRows) => {
			console.log(record, selected, selectedRows);
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			console.log(selected, selectedRows, changeRows);
		},
	};

	const {
		data: userList,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: [UserApi.UserList, searchForm.getValues()],
		queryFn: () => {
			const raw = searchForm.getValues();
			const params = Object.fromEntries(Object.entries(raw).filter(([_, v]) => v !== ""));
			return userService.getUserList(params);
		},
		select: (data) => data.list,
	});

	const onCreate = () => {
		setUserModalProps((prev) => ({
			...prev,
			show: true,
			title: "Create New",
			formValue: {
				...prev.formValue,
				nickName: "",
				userName: "",
				phonenumber: "",
				email: "",
				status: "0",
			},
		}));
	};

	const onEdit = (formValue: Partial<UserEntity>) => {
		console.log(formValue);
		// setOrganizationModalProps((prev) => ({
		// 	...prev,
		// 	show: true,
		// 	title: "Edit",
		// 	formValue,
		// }));
	};

	const handleReset = () => {
		searchForm.reset({
			userName: "",
			phonenumber: "",
			status: "",
			pageNum: 1,
			pageSize: 10,
		});
	};

	const handleSearch = () => {
		console.log(searchForm.getValues());
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
								name="userName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>姓名</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={searchForm.control}
								name="phonenumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>手机号</FormLabel>
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
										<Select onValueChange={field.onChange} value={field.value ?? ""}>
											<SelectTrigger>
												<SelectValue placeholder="请选择状态" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="0">
													<Badge variant="success">正常</Badge>
												</SelectItem>
												<SelectItem value="1">
													<Badge variant="error">停用</Badge>
												</SelectItem>
											</SelectContent>
										</Select>
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
						<div>用户列表</div>
						<Button onClick={onCreate}>New</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table
						rowKey="userId"
						size="small"
						scroll={{ x: "max-content" }}
						pagination={false}
						columns={columns}
						dataSource={userList || []}
						rowSelection={{ ...rowSelection }}
					/>
				</CardContent>
			</Card>

			<UserModal {...userModalProps} />
		</div>
	);
}

type UserModalProps = {
	formValue: Partial<UserEntity>;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};

function UserModal({ title, show, formValue, onOk, onCancel }: UserModalProps) {
	const form = useForm<Partial<UserEntity>>({
		defaultValues: formValue,
	});

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<div className="grid gap-4 py-4">
						<FormField
							control={form.control}
							name="nickName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="userName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>用户名</FormLabel>
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
												<RadioGroupItem value="disable" id="r2" />
												<Label htmlFor="r2">Disable</Label>
											</div>
										</RadioGroup>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button onClick={onOk}>Save</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
