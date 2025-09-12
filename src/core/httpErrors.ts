export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends HttpError {
  constructor(entity: string, id?: number) {
    super(404, `${entity}${id ? ` with id=${id}` : ""} not found`);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request", details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}