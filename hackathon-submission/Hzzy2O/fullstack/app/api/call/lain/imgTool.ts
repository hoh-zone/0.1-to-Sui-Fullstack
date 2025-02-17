
export async function generateImg(input: string) {
	const res = await fetch(`${process.env.FLUX_URL}/v1/chat/completions`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.FLUX_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			messages: [
				{
					role: "user",
					content: input,
				},
			],
		}),
	});
	const { url } = await res.json();
	
	return url;
}
