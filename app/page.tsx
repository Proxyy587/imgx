import ImageForm from "@/components/shared/ImageForm";
import Image from "next/image";

export default function Home() {
	return (
		<main className="min-h-screen text-zinc-100 p-4 md:p-8 tracking-tight lowercase">
			<div className="max-w-xl mx-auto">
				<h1 className="text-3xl font-bold">imgx</h1>
				<p className="text-muted-foreground text-sm">
					Generate images from text prompts with the Flux.
				</p>
				<ImageForm />
			</div>
		</main>
	);
}
