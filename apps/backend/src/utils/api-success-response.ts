export class ApiSuccessResponse<T> {
	public readonly success: boolean;
	public readonly statusCode: number;
	public readonly message: string;
	public readonly data?: T;

	constructor(
		success: boolean,
		statusCode: number,
		message: string,
		data?: T,
	) {
		this.success = success;
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
	}
}
