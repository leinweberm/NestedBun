import { ApplicationError } from "./applicationError";

export class ValidationError extends ApplicationError {
	constructor(message: string, statusText: string) {
		super(
			`ValidationError: ${message}`,
			403,
			statusText,
			'application.validationError'
		);
	}
}
