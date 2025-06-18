import useLocale from "@/locales/use-locale";
import { StyleProvider } from "@ant-design/cssinjs";
import type { ThemeConfig } from "antd";
import { App, ConfigProvider, theme } from "antd";
import { ThemeMode } from "#/enum";
import { baseThemeTokens } from "../tokens/base";
import { darkColorTokens, lightColorTokens, presetsColors } from "../tokens/color";
import type { UILibraryAdapter } from "../type";

import { useSettings } from "@/store/settingStore";
import { removePx } from "@/utils/theme";

/**
 * 适配antd组件库
 * 设置antd的token，包括颜色、字体、边框等
 * 设置antd的多语言适配
 * @param mode 主题模式
 * @param children 子组件
 * @returns
 */
export const AntdAdapter: UILibraryAdapter = ({ mode, children }) => {
	const { language } = useLocale();
	console.info("------- AntdAdapter");
	const { themeColorPresets, fontFamily, fontSize } = useSettings();
	const algorithm = mode === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm;

	const colorTokens = mode === ThemeMode.Light ? lightColorTokens : darkColorTokens;

	const primaryColorToken = presetsColors[themeColorPresets];

	const token: ThemeConfig["token"] = {
		colorPrimary: primaryColorToken.default,
		colorSuccess: colorTokens.palette.success.default,
		colorWarning: colorTokens.palette.warning.default,
		colorError: colorTokens.palette.error.default,
		colorInfo: colorTokens.palette.info.default,

		colorBgLayout: colorTokens.background.default,
		colorBgContainer: colorTokens.background.paper,
		colorBgElevated: colorTokens.background.default,

		wireframe: false,
		fontFamily: fontFamily,
		fontSize: fontSize,

		borderRadiusSM: removePx(baseThemeTokens.borderRadius.sm),
		borderRadius: removePx(baseThemeTokens.borderRadius.default),
		borderRadiusLG: removePx(baseThemeTokens.borderRadius.lg),
	};

	const components: ThemeConfig["components"] = {
		Breadcrumb: {
			separatorMargin: removePx(baseThemeTokens.spacing[1]), // 设置面包屑分隔符的边距
		},
		Menu: {
			colorFillAlter: "transparent", // 设置菜单项的背景颜色
			itemColor: colorTokens.text.secondary, // 设置菜单项的文本颜色
			motionDurationMid: "0.125s", // 设置菜单项的动画持续时间
			motionDurationSlow: "0.125s", // 设置菜单项的动画持续时间
			darkItemBg: darkColorTokens.background.default, // 设置菜单项的背景颜色
		},
		Layout: {
			siderBg: darkColorTokens.background.default, // 设置侧边栏的背景颜色
		},
	};

	return (
		<ConfigProvider
			locale={language.antdLocal}
			theme={{ algorithm, token, components }}
			tag={{
				style: {
					borderRadius: removePx(baseThemeTokens.borderRadius.md),
					fontWeight: 700,
					padding: `0 ${baseThemeTokens.spacing[1]}`,
					margin: `0 ${baseThemeTokens.spacing[1]}`,
					borderWidth: 0,
				},
			}}
		>
			<StyleProvider hashPriority="high">
				<App>{children}</App>
			</StyleProvider>
		</ConfigProvider>
	);
};
