import healthRouter from "./health-route.js";
import userRouter from "./user-route.js";
import verifyRouter from "./verify-route.js";

export default (app) => {
  app.use("/v1/user", userRouter);
  app.use("/verify", verifyRouter);
  app.use("/", healthRouter);
};
