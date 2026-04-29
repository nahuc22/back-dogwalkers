import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TypeOf, z, ZodSchema } from "zod";

type HandlerOptions<TRequest extends ZodSchema, TResponse extends ZodSchema> = 
{
  req?: TRequest;
  res?: TResponse;
  handler: (req: TypeOf<TRequest>) => Promise<TypeOf<TResponse> | HttpError>;
};

export class HttpError extends Error {
  constructor(public readonly status: number, message?: string) {
    super(message);
  }
}

export function handler<TRequest extends ZodSchema,TResponse extends ZodSchema>
  (options: HandlerOptions<TRequest, TResponse>) {
      return async (
            req: Request<TypeOf<TRequest>>,
            res: Response<TypeOf<TResponse>>
      ) => {
    const parsedReq = options.req?.safeParse(req);
    if (parsedReq && parsedReq.error) {
      const errorMessages = parsedReq.error.errors.map((issue: any) => ({
        message: `${issue.path.join(".")} is ${issue.message}`,
      }));
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid data", details: errorMessages });
      return;
    }
    try {
      const response = await options.handler(parsedReq?.data);
      if (response instanceof HttpError) {
        res.status(response.status).json({ error: response.message, code: response.message });
        return;
      }
      if (options.res && response) {
        res.status(StatusCodes.OK).json(options.res.parse(response)); // sólo para remover propiedades no esperadas
      } else {
        res.status(StatusCodes.OK).end();
      }
    } catch (error) {
      console.error("❌ Handler error:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error", message: "Internal Server Error" });
    }
  };
}
