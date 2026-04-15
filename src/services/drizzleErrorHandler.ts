import { ServiceError } from "./serviceError";

export function handleDrizzleError(error: unknown): never {
    if (error instanceof Error && "code" in error) {
      switch (error.code) {
        case "ER_DUP_ENTRY":
          throw new ServiceError("DUPLICATE_ENTRY");
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }