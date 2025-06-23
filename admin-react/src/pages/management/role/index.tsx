import roleService, { RoleApi, type ListRoleReq } from "@/api/services/roleService";
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
import type { RoleEntity } from "@/types/entity/index";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

export default function RolePage() {
	const searchForm = useForm<ListRoleReq>({
		defaultValues: {
			roleName: "",
			roleKey: "",
			status: "",
			pageNum: 1,
			pageSize: 10,
		},
	});
	const [modalProps, setModalProps] = useState<RoleModalProps>({
		formValue: {
			roleName: "",
			roleKey: "",
			roleSort: 0,
			status: "0",
			dataScope: "1",
			remark: "",
			menuCheckStrictly: false,
			deptCheckStrictly: false,
		},
		title: "新建角色",
		show: false,
		onOk: () => setModalProps((prev) => ({ ...prev, show: false })),
		onCancel: () => setModalProps((prev) => ({ ...prev, show: false })),
	});

	const columns: ColumnsType<Partial<RoleEntity>> = [
		{ title: "角色名称", dataIndex: "roleName", width: 120 },
		{ title: "角色标识", dataIndex: "roleKey", width: 120 },
		{ title: "排序", dataIndex: "roleSort", width: 80 },
		{
			title: "数据范围",
			dataIndex: "dataScope",
			width: 120,
			render: (scope) => {
				switch (scope) {
					case "1":
						return "全部数据权限";
					case "2":
						return "自定数据权限";
					case "3":
						return "本部门数据权限";
					case "4":
						return "本部门及以下数据权限";
					default:
						return scope;
				}
			},
		},
		{
			title: "状态",
			dataIndex: "status",
			width: 80,
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

	const rowSelection: TableRowSelection<Partial<RoleEntity>> = {
		onChange: (selectedRowKeys, selectedRows) => {
			// 可选：处理多选
			console.log(selectedRowKeys, selectedRows);
		},
	};

	const {
		data: roleList = [],
		refetch,
		isFetching,
	} = useQuery({
		queryKey: [RoleApi.RoleList, searchForm.getValues()],
		queryFn: () => {
			const raw = searchForm.getValues();
			const params = Object.fromEntries(Object.entries(raw).filter(([_, v]) => v !== ""));
			return roleService.getRoleList(params);
		},
		select: (data) => data.list,
	});

	const onCreate = () => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "新建角色",
			formValue: {
				roleName: "",
				roleKey: "",
				roleSort: 0,
				status: "0",
				dataScope: "1",
				remark: "",
				menuCheckStrictly: false,
				deptCheckStrictly: false,
			},
		}));
	};

	const onEdit = (formValue: Partial<RoleEntity>) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "编辑角色",
			formValue,
		}));
	};

	const onDelete = (record: Partial<RoleEntity>) => {
		if (!record.roleId) return;
		roleService.deleteRole(record.roleId).then(() => {
			refetch();
		});
	};

	const handleReset = () => {
		searchForm.reset({
			roleName: "",
			roleKey: "",
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
								name="roleName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>角色名称</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={searchForm.control}
								name="roleKey"
								render={({ field }) => (
									<FormItem>
										<FormLabel>角色标识</FormLabel>
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
						<div>角色列表</div>
						<Button onClick={onCreate}>新建角色</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table
						rowKey="roleId"
						size="small"
						scroll={{ x: "max-content" }}
						pagination={false}
						columns={columns}
						dataSource={roleList}
						rowSelection={{ ...rowSelection }}
					/>
				</CardContent>
			</Card>

			<RoleModal
				{...modalProps}
				onOk={() => {
					modalProps.onOk();
					refetch();
				}}
			/>
		</div>
	);
}

type RoleModalProps = {
	formValue: Partial<RoleEntity>;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};

function RoleModal({ title, show, formValue, onOk, onCancel }: RoleModalProps) {
	const form = useForm<Partial<RoleEntity>>({
		defaultValues: formValue,
	});

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	const handleSubmit = (values: Partial<RoleEntity>) => {
		const submitValues = {
			...values,
			roleSort: values.roleSort ?? 0,
			status: values.status ?? "0",
			dataScope: values.dataScope ?? "1",
			menuCheckStrictly: values.menuCheckStrictly ?? false,
			deptCheckStrictly: values.deptCheckStrictly ?? false,
		};
		if (formValue.roleId) {
			roleService.updateRole({ ...submitValues, roleId: formValue.roleId } as any).then(onOk);
		} else {
			roleService.createRole(submitValues as any).then(onOk);
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
								name="roleName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>角色名称</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="roleKey"
								render={({ field }) => (
									<FormItem>
										<FormLabel>角色标识</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="roleSort"
								render={({ field }) => (
									<FormItem>
										<FormLabel>排序</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dataScope"
								render={({ field }) => (
									<FormItem>
										<FormLabel>数据范围</FormLabel>
										<FormControl>
											<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-2">
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="1" id="d1" />
													<Label htmlFor="d1">全部数据权限</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="2" id="d2" />
													<Label htmlFor="d2">自定数据权限</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="3" id="d3" />
													<Label htmlFor="d3">本部门数据权限</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="4" id="d4" />
													<Label htmlFor="d4">本部门及以下数据权限</Label>
												</div>
											</RadioGroup>
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
													<RadioGroupItem value="0" id="s1" />
													<Label htmlFor="s1">正常</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="1" id="s2" />
													<Label htmlFor="s2">停用</Label>
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
