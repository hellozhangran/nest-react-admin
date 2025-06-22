import { UploadAvatar } from "@/components/upload";
import type { UserEntity } from "@/types/entity/index";
import { Button } from "@/ui/button";
import { Card, CardContent, CardFooter } from "@/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { useForm } from "react-hook-form";
import userService, { type UpdateProfileReq } from "@/api/services/userService";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

const UpdateProfileReqSchema: z.ZodType<UpdateProfileReq> = z.object({
	nickName: z.string().optional(),
	email: z.string().optional(),
	phonenumber: z.string().optional(),
	sex: z.string().optional(),
	avatar: z.string().optional(),
	// remark: z.string().optional(),
});

export default function GeneralTab({ profile }: { profile: Partial<UserEntity> }) {
	const profileMutation = useMutation({
		mutationFn: userService.putProfile,
		onSuccess: () => {
			toast.success("Update success!");
		},
		onError: () => {
			toast.error("Update failed!");
		},
	});

	const form = useForm<z.infer<typeof UpdateProfileReqSchema>>({
		defaultValues: {
			nickName: "",
			email: "",
			phonenumber: "",
			sex: "0",
			avatar: "",
			remark: "",
		},
	});

	useEffect(() => {
		if (profile) {
			const parsedProfile = UpdateProfileReqSchema.parse(profile);
			form.reset(parsedProfile);
		}
	}, [profile, form.reset]);

	const handleSubmit = () => {
		profileMutation.mutate(form.getValues());
	};

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div className="flex-1">
				<Card className="flex-col px-6! pb-10! pt-20!">
					<UploadAvatar defaultAvatar={profile?.avatar} />
				</Card>
			</div>
			<div className="flex-2">
				<Card>
					<CardContent>
						<Form {...form}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="nickName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>NickName</FormLabel>
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
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phonenumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="sex"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Sex</FormLabel>
											<FormControl>
												<RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="0" id="r-male" />
														<Label htmlFor="r-male">男</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="1" id="r-female" />
														<Label htmlFor="r-female">女</Label>
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
											<FormLabel>Remark</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="avatar"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Avatar</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</Form>
					</CardContent>
					<CardFooter>
						<Button onClick={handleSubmit}>Save Changes</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
