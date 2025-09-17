export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(resource: string, id?: number | string) {
    super(
      404,
      "NOT_FOUND",
      id !== undefined
        ? `${resource} with id ${id} not found`
        : `${resource} not found`
    );
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request") {
    super(400, "BAD_REQUEST", message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, "UNAUTHORIZED", message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(403, "FORBIDDEN", message);
  }
}