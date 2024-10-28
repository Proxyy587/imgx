"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface OutputProps {
	isLoading: boolean;
	generatedImage: string | null;
}

export default function Output({ isLoading, generatedImage }: OutputProps) {
	const handleDownload = async () => {
		if (!generatedImage) return;

		try {
			const response = await fetch(generatedImage);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "imgx-abhijee.com.jpg";
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error("Error downloading image:", error);
		}
	};

	return (
		<div className="w-full mt-8 rounded-lg overflow-hidden">
			{isLoading && (
				<div className="relative w-full aspect-square">
					<Skeleton className="w-full h-full absolute inset-0" />
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="flex flex-col items-center gap-4">
							<div className="w-8 h-8 border-4 border-zinc-600 border-t-zinc-200 rounded-full animate-spin" />
							<p className="text-sm text-zinc-400">Generating your image...</p>
						</div>
					</div>
				</div>
			)}
			{!isLoading && generatedImage && (
				<div className="group relative w-full aspect-square transition-all duration-500 ease-in-out">
					<Image
						src={generatedImage}
						alt="Generated image"
						fill
						className={cn(
							"object-cover rounded-lg shadow-lg",
							"group-hover:scale-[1.02] transition-transform duration-300"
						)}
						priority
					/>
					<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<Button
							onClick={handleDownload}
							className="flex items-center gap-2"
							variant="secondary"
							size="sm"
						>
							<Download size={16} />
							Download Image
						</Button>
					</div>
				</div>
			)}
			{!isLoading && !generatedImage && (
				<div className="w-full aspect-square bg-zinc-900/50 rounded-lg flex items-center justify-center">
					<p className="text-zinc-500 text-sm">
						Your generated image will appear here
					</p>
				</div>
			)}
		</div>
	);
}
