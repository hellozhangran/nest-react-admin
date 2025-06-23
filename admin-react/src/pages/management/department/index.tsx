import deptService, { DeptApi, type ListDeptReq } from "@/api/services/deptService";
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
import type { DeptEntity } from "@/types/entity/index";

export default function DepartmenPage() {
	const searchForm = useForm<ListDeptReq>({
		defaultValues: {
			deptName: "",
			status: "",
		},
	});
	const [modalProps, setModalProps] = useState<DeptModalProps>({
		formValue: {
			deptName: "",
			parentId: 0,
			orderNum: 0,
			leader: "",
			phone: "",
			email: "",
			status: "0",
		},
		title: "新建部门",
		show: false,
		onOk: () => setModalProps((prev) => ({ ...prev, show: false })),
		onCancel: () => setModalProps((prev) => ({ ...prev, show: false })),
	});

	const columns: ColumnsType<Partial<DeptEntity>> = [
		{ title: "部门名称", dataIndex: "deptName", width: 120 },
		{ title: "负责人", dataIndex: "leader", width: 100 },
		{ title: "负责人电话", dataIndex: "phone", width: 120 },
		{ title: "负责人邮箱", dataIndex: "email", width: 160 },
		{
			title: "状态",
			dataIndex: "status",
			width: 100,
			render: (status) => (
				<Badge variant={status === "0" ? "success" : "error"}>{status === "0" ? "正常" : "停用"}</Badge>
			),
		},
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

	const rowSelection: TableRowSelection<Partial<DeptEntity>> = {
		onChange: (selectedRowKeys, selectedRows) => {
			// 可选：处理多选
			console.log(selectedRowKeys, selectedRows);
		},
	};

	const {
		data: deptList,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: [DeptApi.DeptList, searchForm.getValues()],
		queryFn: () => {
			const raw = searchForm.getValues();
			const params = Object.fromEntries(Object.entries(raw).filter(([_, v]) => v !== ""));
			return deptService.getDeptList(params);
		},
		select: (data) => data,
	});

	const onCreate = () => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "新建部门",
			formValue: {
				deptName: "",
				parentId: 0,
				orderNum: 0,
				leader: "",
				phone: "",
				email: "",
				status: "0",
			},
		}));
	};

	const onEdit = (formValue: Partial<DeptEntity>) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "编辑部门",
			formValue,
		}));
	};

	const onDelete = (record: Partial<DeptEntity>) => {
		if (!record.deptId) return;
		deptService.deleteDept(record.deptId).then(() => {
			refetch();
		});
	};

	const handleReset = () => {
		searchForm.reset({
			deptName: "",
			status: "",
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
								name="deptName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>部门名称</FormLabel>
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
						<div>部门列表</div>
						<Button onClick={onCreate}>新建部门</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table
						rowKey="deptId"
						size="small"
						scroll={{ x: "max-content" }}
						pagination={false}
						columns={columns}
						dataSource={deptList || []}
						rowSelection={{ ...rowSelection }}
					/>
				</CardContent>
			</Card>

			<DeptModal
				{...modalProps}
				onOk={() => {
					modalProps.onOk();
					refetch();
				}}
			/>
		</div>
	);
}

type DeptModalProps = {
	formValue: Partial<DeptEntity>;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};

function DeptModal({ title, show, formValue, onOk, onCancel }: DeptModalProps) {
	const form = useForm<Partial<DeptEntity>>({
		defaultValues: formValue,
	});

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	const handleSubmit = (values: Partial<DeptEntity>) => {
		// 保证 parentId 字段有默认值
		const submitValues = {
			...values,
			parentId: values.parentId ?? 0,
			orderNum: values.orderNum ?? 0,
			status: values.status ?? "0",
		};
		if (formValue.deptId) {
			// 编辑
			deptService.updateDept({ ...submitValues, deptId: formValue.deptId } as any).then(onOk);
		} else {
			// 新建
			deptService.createDept(submitValues as any).then(onOk);
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
								name="deptName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>部门名称</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="parentId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>父部门ID</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="orderNum"
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
								name="leader"
								render={({ field }) => (
									<FormItem>
										<FormLabel>负责人</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>联系电话</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>邮箱</FormLabel>
										<FormControl>
											<Input {...field} />
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
