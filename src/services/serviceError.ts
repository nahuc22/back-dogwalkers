export class ServiceError extends Error {
    constructor(public readonly code: 'DUPLICATE_ENTRY' | "INVALID_USERNAME_OR_PASSWORD") {
      super()
    }
  }