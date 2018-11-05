class AppError {
  constructor(name, statusCode, description, isOperational) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.name = name;
    this.statusCode = statusCode;
    this.description = description;
    this.isOperational = isOperational;
  }
}

export default AppError;
