export const extractMessageFromAPIError = (err: any) => {
	// Pulls the error off of the error response
	const description = err?.response?.data?.error?.description ?? 'Unknown Error';
	const solution =
		err?.response?.data?.error?.solution ?? 'Please contact brocklchelle@gmail.com for help';

	return { description, solution };
};
