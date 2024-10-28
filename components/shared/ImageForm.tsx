"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { getImage } from "@/actions/getImage";
import { useState } from "react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Output from "@/components/shared/Output";

const formSchema = z.object({
	prompt: z.string().min(2, {
		message: "Prompt must be at least 2 characters.",
	}),
	model: z.string(),
	width: z.number().min(256).max(1024),
	height: z.number().min(256).max(1024),
	steps: z.number().min(1).max(50),
	seed: z.number().min(0).max(4294967295),
});

export default function ImageForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [generatedImage, setGeneratedImage] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prompt: "",
			model: "flux",
			width: 512,
			height: 512,
			steps: 20,
			seed: Math.floor(Math.random() * 20),
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true);
			const imageBlob = await getImage({
				...values,
			});

			const base64String = Buffer.from(imageBlob.buffer).toString("base64");
			const imageUrl = `data:${imageBlob.type};base64,${base64String}`;
			setGeneratedImage(imageUrl);

			form.reset({
				...values,
				prompt: "",
				seed: Math.floor(Math.random() * 20),
			});

			toast.success("Image generated successfully!");
		} catch (error) {
			toast.error("Failed to generate image. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="max-w-2xl mx-auto mt-8">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="prompt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prompt</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Enter your image prompt..."
										className="min-h-[100px]"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Describe the image you want to generate.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="model"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Model</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a model" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="flux">Flux</SelectItem>
										<SelectItem value="flux-pro">Flux Pro</SelectItem>
										<SelectItem value="flux-realism">Flux Realism</SelectItem>
										<SelectItem value="flux-anime">Flux Anime</SelectItem>
										<SelectItem value="flux3d">Flux 3D</SelectItem>
										<SelectItem value="flux-cably">Flux CablyAI</SelectItem>
										<SelectItem value="flux-turbo">Flux Turbo</SelectItem>
									</SelectContent>
								</Select>
								<FormDescription>
									Choose the AI model for image generation
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex gap-4">
						<FormField
							control={form.control}
							name="width"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>Width: {field.value}px</FormLabel>
									<FormControl>
										<Slider
											min={256}
											max={1024}
											step={64}
											value={[field.value]}
											onValueChange={(value) => field.onChange(value[0])}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="height"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>Height: {field.value}px</FormLabel>
									<FormControl>
										<Slider
											min={256}
											max={1024}
											step={64}
											value={[field.value]}
											onValueChange={(value) => field.onChange(value[0])}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex gap-4">
						<FormField
							control={form.control}
							name="steps"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>Steps: {field.value}</FormLabel>
									<FormControl>
										<Slider
											min={1}
											max={50}
											value={[field.value]}
											onValueChange={(value) => field.onChange(value[0])}
										/>
									</FormControl>
									<FormDescription>
										Higher steps = better quality but slower generation
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="seed"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>Seed: {field.value}</FormLabel>
									<FormControl>
										<Slider
											min={0}
											max={50000}
											value={[field.value]}
											onValueChange={(value) => field.onChange(value[0])}
										/>
									</FormControl>
									<FormDescription>
										Same seed produces similar results
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						size="sm"
						className="w-full"
					>
						{isLoading ? "Generating..." : "Generate Image"}
					</Button>
				</form>
			</Form>

			<Output isLoading={isLoading} generatedImage={generatedImage} />
		</div>
	);
}
