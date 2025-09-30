export class BadRequestError extends Error {
  name: string;
  error: unknown;
  statusCode: number;

  constructor({ name, message, error }: { name?: string; message?: string; error?: string }) {
    super(message || "The request is Invalid");
    this.name = name || "BadRequest";
    this.error = error;
    this.statusCode = 400;
  }
}

export class InternalRequestError extends Error {
  name: string;
  error: unknown;
  statusCode: number

  constructor({ name, message, error }: { name?: string; message?: string; error?: string }) {
    super(message || "Something went wrong");
    this.name = name || "InternalRequestError";
    this.error = error;
    this.statusCode = 500;
  }
}

export class UnauthorizedError extends Error {
  name: string;
  error: unknown;
  statusCode: number

  constructor({ name, error, message }: { message?: string; name?: string; error?: unknown } = {}) {
    super(message ?? "You are not allowed to access this resource");
    this.name = name || "UnauthorizedError";
    this.error = error;
    this.statusCode = 401;
  }
}


export class ForbiddenRequestError extends Error {
  name: string;
  error: unknown;
  statusCode: number

  constructor({
    name,
    error,
    message,
    details
  }: { message?: string; name?: string; error?: unknown; details?: unknown } = {}) {
    super(message ?? "You are not allowed to access this resource");
    this.name = name || "ForbiddenError";
    this.error = error;
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  name: string;
  error: unknown;
  statusCode: number

  constructor({ name, error, message }: { message?: string; name?: string; error?: unknown }) {
    super(message ?? "The requested entity is not found");
    this.name = name || "NotFoundError";
    this.error = error;
    this.statusCode = 404;
  }
}

export class RateLimitError extends Error {
  statusCode: number

  constructor({ message }: { message?: string }) {
    super(message || "Rate limit exceeded");
    this.name = "RateLimitExceeded";
    this.statusCode = 429
  }
}