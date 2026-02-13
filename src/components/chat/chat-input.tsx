"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Smile } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import qs from "query-string";
import { useStore } from "@/store/store";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { useRouter } from "next/navigation";
import { isOrchestrationCommand, extractIdea, orchestrate, formatResults } from "@/lib/orchestrate";
import { useState } from "react";

interface ChatInputProps {
	apiUrl: string;
	query: Record<string, any>;
	name: string;
	type: "conversation" | "channel";
}

const formSchema = z.object({
	content: z.string().min(1),
});
export function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
	const router = useRouter();
	const onOpen = useStore.use.onOpen();
	const [isOrchestrating, setIsOrchestrating] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});
	const isLoading = form.formState.isSubmitting || isOrchestrating;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const content = values.content;
			
			// Check for orchestration command
			if (isOrchestrationCommand(content)) {
				setIsOrchestrating(true);
				const idea = extractIdea(content);
				
				if (!idea) {
					// Post help message
					const url = qs.stringifyUrl({ url: apiUrl, query });
					await axios.post(url, { 
						content: "💡 **Usage:** `/strategy [your startup idea]`\n\nExample: `/strategy A mobile app that helps busy parents meal prep`" 
					});
					form.reset();
					router.refresh();
					setIsOrchestrating(false);
					return;
				}
				
				// Post user's command
				const url = qs.stringifyUrl({ url: apiUrl, query });
				await axios.post(url, { content: `# 🏢 Strategy Analysis\n> **${idea}**\n\n*C-Suite is reviewing...*` });
				router.refresh();
				
				try {
					// Run orchestration with progressive updates
					const response = await fetch('/api/orchestrate/stream', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ message: idea })
					});

					const reader = response.body?.getReader();
					const decoder = new TextDecoder();
					let summaryParts: string[] = [];

					if (reader) {
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							
							const chunk = decoder.decode(value);
							const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
							
							for (const line of lines) {
								try {
									const data = JSON.parse(line.slice(6));
									if (data.type === 'exec') {
										// Post each exec's result
										const emoji = data.verdict === 'GREEN' ? '✅' : data.verdict === 'YELLOW' ? '⚠️' : '🚫';
										await axios.post(url, { 
											content: `### ${data.emoji} ${data.name} (${data.role}) ${emoji}\n\n${data.output}`
										});
										summaryParts.push(`${data.emoji} **${data.name}**: ${emoji}`);
										router.refresh();
									} else if (data.type === 'summary') {
										// Calculate overall verdict from verdicts array
										const verdicts = data.verdicts || [];
										const greenCount = verdicts.filter((v: string) => v === 'GREEN').length;
										const redCount = verdicts.filter((v: string) => v === 'RED').length;
										const yellowCount = verdicts.filter((v: string) => v === 'YELLOW').length;
										
										let overallVerdict = '🟢 **GO** — Build it!';
										if (redCount > 0) overallVerdict = '🔴 **NO-GO** — Major concerns need addressing';
										else if (yellowCount >= 2) overallVerdict = '🟡 **PROCEED WITH CAUTION** — Address the yellow flags first';
										
										// Post final summary with verdict
										await axios.post(url, { 
											content: `---\n\n## ${overallVerdict}\n\n${summaryParts.join('  •  ')}\n\n⏱️ *Analysis completed in ${(data.totalMs / 1000).toFixed(1)}s*`
										});
										router.refresh();
									}
								} catch (e) {
									// Skip malformed JSON
								}
							}
						}
					}
				} catch (orchError) {
					await axios.post(url, { 
						content: `❌ **Orchestration failed:** ${orchError instanceof Error ? orchError.message : 'Unknown error'}` 
					});
				}
				
				form.reset();
				router.refresh();
				setIsOrchestrating(false);
				return;
			}
			
			// Normal message flow
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            });
            await axios.post(url, values);
			form.reset();
			router.refresh();
        } catch (error) {
            console.error(error);
			setIsOrchestrating(false);
        }
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				{/* Typing indicator when orchestrating */}
				{isOrchestrating && (
					<div className="px-4 py-2 bg-indigo-500/10 border-l-4 border-indigo-500 mx-4 mb-2 rounded-r animate-pulse">
						<div className="flex items-center gap-2 text-sm text-indigo-400">
							<div className="flex gap-1">
								<span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
								<span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
								<span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
							</div>
							<span className="font-medium">C-Suite is analyzing your idea...</span>
							<span className="text-xs text-indigo-300">(~45 seconds)</span>
						</div>
					</div>
				)}
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative p-4 pb-6">
									<button
										type="button"
										onClick={() =>onOpen("messageFile", { apiUrl,query })}
										className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
									>
										<Plus className="text-white dark:text-[#313338]" />
									</button>
									<Input
										disabled={isLoading}
										className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
										placeholder={isOrchestrating ? "🏢 C-Suite analyzing..." : `Message ${type === "conversation" ? name : "#" + name} (try /strategy)`}
										{...field}
									/>
									<div className="absolute top-7 right-8">
										<EmojiPicker onChange={
											(value) => form.setValue("content", field.value + " " + value)
										} />
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
