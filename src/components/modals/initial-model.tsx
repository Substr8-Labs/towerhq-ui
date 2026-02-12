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
		name: z.string().min(1, { message: "Server name is required" }),
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
					<DialogTitle className="text-2xl text-center font-bold">Customize your server</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Give your sever a personality with a name and an image. You can always change these later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							{/* Image upload disabled for now - UploadThing not configured */}
							<div className="flex items-center justify-center text-center">
								<div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
									{watch("name")?.[0]?.toUpperCase() || "?"}
								</div>
							</div>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Server name
										</FormLabel>

										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter server name"
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
								Create server
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
