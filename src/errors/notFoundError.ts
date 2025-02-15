export class NotFoundError extends Error {
	statusCode: number;
	apiCode: string;

	constructor(message = 'Resource not found') {
		super(message);
		this.name = 'NotFoundError';
		this.apiCode = 'router.notFound';
		this.statusCode = 404;
		Error.captureStackTrace && Error.captureStackTrace(this, NotFoundError);
	}
}
