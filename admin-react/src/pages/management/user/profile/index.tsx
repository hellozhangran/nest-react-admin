import CoverImage from "@/assets/images/cover/cover_4.jpg";
import { Icon } from "@/components/icon";
import { themeVars } from "@/theme/theme.css";
import { Card } from "@/ui/card";
import { type CSSProperties, useState } from "react";
import ProfileTab from "./profile-tab";
import ProjectsTab from "./projects-tab";
import TeamsTab from "./teams-tab";
import { useQuery } from "@tanstack/react-query";
import userService, { UserApi } from "@/api/services/userService";

function UserProfile() {
	const [currentTabIndex, setcurrentTabIndex] = useState(0);
	console.info("management/user/profile index.tsx");
	const { data: profile } = useQuery({
		queryKey: [UserApi.Profile],
		queryFn: userService.getProfile,
	});

	const bgStyle: CSSProperties = {
		background: `url(${CoverImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	const tabs = [
		{
			icon: <Icon icon="solar:user-id-bold" size={24} className="mr-2" />,
			title: "Profile",
			content: <ProfileTab profile={profile || {}} />,
		},
		{
			icon: <Icon icon="mingcute:profile-fill" size={24} className="mr-2" />,
			title: "Teams",
			content: <TeamsTab />,
		},
		{
			icon: <Icon icon="mingcute:profile-fill" size={24} className="mr-2" />,
			title: "Projects",
			content: <ProjectsTab />,
		},
	];

	return (
		<div>
			<Card className="relative mb-6 h-[300px] flex-col rounded-2xl p-0! gap-0">
				<div style={bgStyle} className="h-full w-full">
					<div className="flex flex-col items-center justify-center pt-12 md:absolute md:bottom-6 md:left-6 md:flex-row md:pt-0">
						<img src={profile?.avatar} className="h-16 w-16 rounded-full md:h-32 md:w-32" alt="" />
						<div className="ml-6 mt-6 flex flex-col justify-center md:mt-0">
							<span className="mb-2 text-2xl font-medium text-common-white">{profile?.userName}</span>
							<span className="text-center text-text-secondary md:text-left">{profile?.nickName}</span>
						</div>
					</div>
				</div>
				<div className="z-10 min-h-[48px] w-full">
					<div className="mx-6 flex h-full justify-center md:justify-end">
						{tabs.map((tab, index) => (
							<button
								onClick={() => setcurrentTabIndex(index)}
								key={tab.title}
								type="button"
								style={{
									marginRight: index >= tabs.length - 1 ? "0px" : "40px",
									opacity: index === currentTabIndex ? 1 : 0.5,
									borderBottom:
										index === currentTabIndex ? `2px solid ${themeVars.colors.palette.primary.default}` : "",
								}}
							>
								{tab.icon}
								{tab.title}
							</button>
						))}
					</div>
				</div>
			</Card>
			<div>{tabs[currentTabIndex].content}</div>
		</div>
	);
}

export default UserProfile;
