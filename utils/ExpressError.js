class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // Call parent constructor (Error)
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
