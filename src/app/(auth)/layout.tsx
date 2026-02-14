import type { Metadata } from "next";



export const metadata: Metadata = {
	title: "TowerHQ - Sign In",
	description: "Sign in to your AI executive team.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <div className="flex h-screen justify-center items-center">{children}</div>;
}
