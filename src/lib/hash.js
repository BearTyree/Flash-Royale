export default async function hash(text) {
	const textEncoded = new TextEncoder().encode(text);

	const digest = await crypto.subtle.digest(
		{
			name: "SHA-256",
		},
		textEncoded
	);

	const hashArray = Array.from(new Uint8Array(digest));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return hashHex;
}