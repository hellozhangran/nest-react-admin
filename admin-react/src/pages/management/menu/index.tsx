import menuService, { MenuApi, type ListMenuReq } from "@/api/services/menuService";
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
import type { MenuEntity } from "@/types/entity/index";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

export default function MenuPage() {
	const searchForm = useForm<ListMenuReq>({
		defaultValues: {
			menuName: "",
			status: "",
		},
	});
	const [modalProps, setModalProps] = useState<MenuModalProps>({
		formValue: {
			menuName: "",
			parentId: 0,
			orderNum: 0,
			path: "",
			component: "",
			perms: "",
			icon: "",
			visible: "0",
			status: "0",
		},
		title: "新建菜单",
		show: false,
		onOk: () => setModalProps((prev) => ({ ...prev, show: false })),
		onCancel: () => setModalProps((prev) => ({ ...prev, show: false })),
	});

	const columns: ColumnsType<Partial<MenuEntity>> = [
		{ title: "菜单名称", dataIndex: "menuName", width: 120 },
		{ title: "路由地址", dataIndex: "path", width: 120 },
		{ title: "组件路径", dataIndex: "component", width: 120 },
		{ title: "权限标识", dataIndex: "perms", width: 120 },
		{ title: "图标", dataIndex: "icon", width: 80 },
		{ title: "排序", dataIndex: "orderNum", width: 80 },
		{
			title: "显示",
			dataIndex: "visible",
			width: 80,
			render: (visible) => (
				<Badge variant={visible === "0" ? "success" : "error"}>{visible === "0" ? "显示" : "隐藏"}</Badge>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			width: 80,
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

	const rowSelection: TableRowSelection<Partial<MenuEntity>> = {
		onChange: (selectedRowKeys, selectedRows) => {
			// 可选：处理多选
			console.log(selectedRowKeys, selectedRows);
		},
	};

	const {
		data: menuList = [],
		refetch,
		isFetching,
	} = useQuery({
		queryKey: [MenuApi.MenuList, searchForm.getValues()],
		queryFn: () => {
			const raw = searchForm.getValues();
			const params = Object.fromEntries(Object.entries(raw).filter(([_, v]) => v !== ""));
			return menuService.getMenuList(params);
		},
		select: (data) => (Array.isArray(data) ? data : []),
	});

	const onCreate = () => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "新建菜单",
			formValue: {
				menuName: "",
				parentId: 0,
				orderNum: 0,
				path: "",
				component: "",
				perms: "",
				icon: "",
				visible: "0",
				status: "0",
			},
		}));
	};

	const onEdit = (formValue: Partial<MenuEntity>) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: "编辑菜单",
			formValue,
		}));
	};

	const onDelete = (record: Partial<MenuEntity>) => {
		if (!record.menuId) return;
		menuService.deleteMenu(record.menuId).then(() => {
			refetch();
		});
	};

	const handleReset = () => {
		searchForm.reset({
			menuName: "",
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
								name="menuName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>菜单名称</FormLabel>
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
						<div>菜单列表</div>
						<Button onClick={onCreate}>新建菜单</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table
						rowKey="menuId"
						size="small"
						scroll={{ x: "max-content" }}
						pagination={false}
						columns={columns}
						dataSource={menuList}
						rowSelection={{ ...rowSelection }}
					/>
				</CardContent>
			</Card>

			<MenuModal
				{...modalProps}
				onOk={() => {
					modalProps.onOk();
					refetch();
				}}
			/>
		</div>
	);
}

type MenuModalProps = {
	formValue: Partial<MenuEntity>;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
};

function MenuModal({ title, show, formValue, onOk, onCancel }: MenuModalProps) {
	const form = useForm<Partial<MenuEntity>>({
		defaultValues: formValue,
	});

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	const handleSubmit = (values: Partial<MenuEntity>) => {
		const submitValues = {
			...values,
			parentId: values.parentId ?? 0,
			orderNum: values.orderNum ?? 0,
			visible: values.visible ?? "0",
			status: values.status ?? "0",
		};
		if (formValue.menuId) {
			menuService.updateMenu({ ...submitValues, menuId: formValue.menuId } as any).then(onOk);
		} else {
			menuService.createMenu(submitValues as any).then(onOk);
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
								name="menuName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>菜单名称</FormLabel>
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
										<FormLabel>父菜单ID</FormLabel>
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
								name="path"
								render={({ field }) => (
									<FormItem>
										<FormLabel>路由地址</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="component"
								render={({ field }) => (
									<FormItem>
										<FormLabel>组件路径</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="perms"
								render={({ field }) => (
									<FormItem>
										<FormLabel>权限标识</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="icon"
								render={({ field }) => (
									<FormItem>
										<FormLabel>图标</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="visible"
								render={({ field }) => (
									<FormItem>
										<FormLabel>显示</FormLabel>
										<FormControl>
											<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-2">
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="0" id="v1" />
													<Label htmlFor="v1">显示</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="1" id="v2" />
													<Label htmlFor="v2">隐藏</Label>
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
