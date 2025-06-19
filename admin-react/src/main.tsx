import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
// import worker from "./_mock";
import "./locales/i18n";
import "./global.css";
import "./theme/theme.css";
import App from "./App";
import { registerLocalIcons } from "./components/icon";
import { RouteLoadingProgress } from "./components/loading";

const charAt = "═══════ Nest React Admin ═══════";
console.info(`%c${charAt}`, "color: #5FE49B; font-weight: bold;");
console.info("------- main.tsx");

await registerLocalIcons();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<HelmetProvider>
		<QueryClientProvider client={new QueryClient()}>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			<Suspense>
				{/* TODO： 这里是伪监听，用了固定的倒计时500ms，后续可以优化下其实真正拿到Suspense的状态以精准的控制进度条 */}
				<RouteLoadingProgress />
				<App />
			</Suspense>
		</QueryClientProvider>
	</HelmetProvider>,
);

// TODO：MSW 的 mock 是通过监听全部的请求达成的，不仅监听了xhr请求也包括资源文件的请求，这会导致network面板混乱
// 🥵 start service worker mock in development mode
// worker.start({ onUnhandledRequest: "bypass", quiet: false });
