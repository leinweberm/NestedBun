type TStringNumber = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export class ApplicationError extends Error {
	statusCode: number;
	statusText: string;
	apiCode: string;

	constructor(
		message: string,
		statusCode: number,
		statusText: string,
		apiCode: string
	) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.statusText = statusText;
		this.apiCode = apiCode;
	}

	toResponse(): Response {
		const chars = ["q", "p", "f", "j", "v", "x", "z", "u", "i", "g"];
		const timeStamp: TStringNumber[] = Array
			.from(Date.now().toString()) as TStringNumber[];

		let uid = '';
		for (let i = 0, length = timeStamp.length; i < length; i++) {
			uid += chars[timeStamp[parseInt(timeStamp[i])]];
		}

		const message = `{
	"apiCode": "${this.apiCode}",
	"message": "${this.message}",
	"uid": "${uid}"
}`;
		return new Response(message, {
			status: this.statusCode,
			statusText: this.statusText,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
