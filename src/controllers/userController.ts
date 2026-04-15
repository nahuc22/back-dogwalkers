import { handler, HttpError } from "../lib/handler";
import { userLoginSchema , userRegistrationSchema } from "../schemas/userSchemas";
import { ServiceError } from "../services/serviceError";
import { registerUserService , loginUserService, getAllUsersService} from "../services/userService";
import { z } from "zod";

export const registerUser = handler({
  req: z.object({ body: userRegistrationSchema }),
  res: z.object({ id: z.number()}),
  async handler(req) {
    try {
      const userData = req.body;
      const newUser = await registerUserService(userData);
      return newUser;

    } catch (error) {
      if (error instanceof ServiceError){
        return new HttpError(400, error.code)
      } else {
        throw error;
      }
    }
  },
});

export const loginUser = handler({
  req: z.object({ body: userLoginSchema }),
  res: z.object({ id: z.number(), email: z.string(), name: z.string()}),
  async handler(req) {
    try {
      const { email, password } = req.body;
      const user = await loginUserService({ email, password })
      
      return  user ;
    } catch (error) {
      if (error instanceof ServiceError){
        return new HttpError(400, error.code)
      } else {
        throw error;
      }
    }
  },
});

export const getAllUsers = handler({
  req: z.object({}),
  res: z.array(z.object({
    id: z.number(),
    name: z.string(),
    lastname: z.string().nullable(),
    age: z.number().nullable(),
    email: z.string()
  })),
  async handler(req) {
    try {
      const users = await getAllUsersService();
      return users;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});
