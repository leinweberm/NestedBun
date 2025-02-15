import { ApplicationError } from "./applicationError";

export class NotFoundError extends ApplicationError {
	constructor(message = 'Resource not found') {
		super(message, 404, 'NotFound', 'router.notFound');
	}
}
