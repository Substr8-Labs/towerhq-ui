"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";

export function InitialModel() {
	const router = useRouter();

	const schema = z.object({
		name: z.string().min(1, { message: "Project name is required" }),
		imageUrl: z.string().optional(),
	});
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			imageUrl: "",
		},
	});

	const { register, handleSubmit, formState, watch } = form;

	const isLoading = formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof schema>) => {
		console.log(values);
		try {
			await axios.post("/api/servers", values);
			router.refresh();
			form.reset();
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Dialog open>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">🌟 Welcome to Control Tower</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Start your first project. Tell us what you're building and we'll assemble your AI executive team.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							{/* Team preview */}
							<div className="flex items-center justify-center gap-2 text-center">
								<div className="flex -space-x-2">
									<div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg border-2 border-white" title="Ori - Concierge">🌟</div>
									<div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg border-2 border-white" title="Ada - CTO">✦</div>
									<div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white text-lg border-2 border-white" title="Grace - CPO">🚀</div>
									<div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg border-2 border-white" title="Tony - CMO">🔥</div>
									<div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg border-2 border-white" title="Val - CFO">📊</div>
								</div>
							</div>
							<p className="text-center text-xs text-zinc-400">
								Your AI executive team: Ori (Concierge) • Ada (CTO) • Grace (CPO) • Tony (CMO) • Val (CFO)
							</p>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											What are you building?
										</FormLabel>

										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="e.g., Subscription box for pet owners"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button type="submit" variant="primary" disabled={isLoading} className="w-full">
								🚀 Start Project
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
