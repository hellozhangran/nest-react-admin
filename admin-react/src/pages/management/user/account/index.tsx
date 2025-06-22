import { Icon } from "@/components/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import GeneralTab from "./general-tab";
import NotificationsTab from "./notifications-tab";
import SecurityTab from "./security-tab";
import { useState } from "react";
import userService, { UserApi } from "@/api/services/userService";
import { useQuery } from "@tanstack/react-query";

function UserAccount() {
	const [activeTab, setActiveTab] = useState("1");
	const { data: profile } = useQuery({
		queryKey: [UserApi.Profile],
		queryFn: userService.getProfile,
	});
	const getIconColor = (isActive: boolean) => (isActive ? "var(--primary)" : "var(--muted-foreground)");
	return (
		<Tabs defaultValue={activeTab} className="w-full" onValueChange={(value) => setActiveTab(value)}>
			<TabsList>
				<TabsTrigger value="1">
					<div className="flex items-center">
						<Icon icon="solar:user-id-bold" size={24} className="mr-2" color={getIconColor(activeTab === "1")} />
						<span>General</span>
					</div>
				</TabsTrigger>
				<TabsTrigger value="2">
					<div className="flex items-center">
						<Icon
							icon="solar:bell-bing-bold-duotone"
							size={24}
							className="mr-2"
							color={getIconColor(activeTab === "2")}
						/>
						<span>Notifications</span>
					</div>
				</TabsTrigger>
				<TabsTrigger value="3">
					<div className="flex items-center">
						<Icon
							icon="solar:key-minimalistic-square-3-bold-duotone"
							size={24}
							className="mr-2"
							color={getIconColor(activeTab === "3")}
						/>
						<span>Security</span>
					</div>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="1">
				<GeneralTab profile={profile || {}} />
			</TabsContent>
			<TabsContent value="2">
				<NotificationsTab />
			</TabsContent>
			<TabsContent value="3">
				<SecurityTab />
			</TabsContent>
		</Tabs>
	);
}

export default UserAccount;
