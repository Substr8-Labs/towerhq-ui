import { SideBar } from "@/components/layout/side-bar";
import { AssistantProvider } from "@/components/assistant/assistant-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "TowerHQ",
	description:
		"AI Executive Team for Solo Founders",
	openGraph: {
		type: "website",
	},
};

export default async function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AssistantProvider>
			<section className="h-full">
				<div className="hidden md:flex w-[72px] z-30 flex-col fixed inset-y-0">
					<SideBar />
				</div>
				<main className="h-full md:pl-[72px]">{children}</main>
			</section>
		</AssistantProvider>
	);
}
