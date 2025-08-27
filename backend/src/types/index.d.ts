// types/express/index.d.ts
// telling ts that Request has field userId
import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string | null;
  }
}
