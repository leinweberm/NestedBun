import { ValidationError } from "../errors/validationError";

export function validateUrlString(input: string) {
	const invalidChars = [",", "<", ">", "|", "%", "#"];

	if (!/^\/.*/.test(input)) {
		console.log('url does not start with /');
		throw new ValidationError(
			'url segment must start with "/"',
			'PrefixMismatch'
		);
	}

	if (/.*\/$/.test(input)) {
		console.log('url does end with /');
		throw new ValidationError(
			'url segment can not end with "/"',
			'PatternMismatch',
		);
	}

	if (/[,><|%#]/.test(input)) {
		console.log('url includes invalid chars');
		throw new ValidationError(
			`url cant include any of the following chars: ${invalidChars}`,
			'InvalidCharacter'
		);
	}
};
