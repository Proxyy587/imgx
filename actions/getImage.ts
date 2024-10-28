"use server";

interface ImageResponse {
	prompt: string;
	model: string;
	height: number;
	width: number;
	steps: number;
	seed: number;
}

export async function getImage(params: ImageResponse) {
	try {
		const options = {
			width: params.width,
			height: params.height,
			seed: params.seed,
			model: params.model,
			steps: params.steps,
			nologo: true,
			enhance: false,
		};

		const baseUrl = "https://image.pollinations.ai/prompt/";
		const encodedPrompt = encodeURIComponent(params.prompt);
		const queryParams = new URLSearchParams({
			width: options.width.toString(),
			height: options.height.toString(),
			seed: options.seed.toString(),
			model: options.model,
			steps: options.steps.toString(),
			nologo: options.nologo.toString(),
			enhance: options.enhance.toString(),
		});

		const imageUrl = `${baseUrl}${encodedPrompt}?${queryParams}`;

		const response = await fetch(imageUrl, {
			cache: 'no-store',
			headers: {
				'Accept': 'image/*'
			}
		});
		if (!response.ok) {
			throw new Error(`Failed to generate image: ${response.statusText}`);
		}

		const blob = await response.blob();
		const arrayBuffer = await blob.arrayBuffer();

		return {
			buffer: Buffer.from(arrayBuffer),
			type: blob.type,
		};
	} catch (error) {
		console.error("Error generating image:", error);
		throw error;
	}
}
