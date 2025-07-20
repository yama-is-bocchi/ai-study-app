import ky from "ky";

export const kyClient = ky.create({
	timeout: 300000,
	hooks: {
		afterResponse: [
			async (request, option, response) => {
				if (!response.ok) {
					const errorText = `failed to ${option.method} to ${request.url}: detail: ${response.statusText}`;
					console.error(errorText);
					throw new Error(errorText);
				}
				return response;
			},
		],
	},
});
