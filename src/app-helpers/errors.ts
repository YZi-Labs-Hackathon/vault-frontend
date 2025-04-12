export const getErrorMessage = (e: any): string => {
	let message: string = JSON.stringify(e);

	try {
		if (e.data && e.data.message) {
			const error_message = e.data.message
				.replace('execution reverted: ', '')
				.replace('execution reverted', '')
				.trim();

			if (error_message === '') {
				message = 'Unknown response error!';
			}

			message = error_message;
		} else if (e.reason) {
			// prettier-ignore
			const error_message = e.reason
				.replace('execution reverted: ', '')
				.replace('execution reverted', '')
				.trim();

			if (error_message === '') {
				message = 'Unknown response error!';
			}

			message = error_message;
		} else if (e.networkError?.result) {
			message = e.networkError?.result.message;
		} else if (e.error) {
			message = e.error?.message;
		} else {
			message = e.message;
		}

		const regex = /(.*?)\(/g;

		if (message.match(regex)) {
			const match = regex.exec(message);
			if (match) {
				message = match[1].trim();
			}
		}
	} catch (error) {}

	return message;
};
