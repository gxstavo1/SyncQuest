import "dotenv/config";
 
export const env = {
  port: Number(process.env.PORT) || 3333,
  jwtSecret: process.env.JWT_SECRET as string,
  nodeEnv: process.env.NODE_ENV || "development",
};