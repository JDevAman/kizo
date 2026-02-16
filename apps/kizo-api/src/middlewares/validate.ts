import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: {
    body?: AnyZodObject;
    query?: AnyZodObject;
    headers?: AnyZodObject;
  }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) req.body = await schema.body.parseAsync(req.body);
      if (schema.query) req.query = await schema.query.parseAsync(req.query);
      if (schema.headers) {
        // We only validate the specific headers we care about
        await schema.headers.parseAsync(req.headers);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
