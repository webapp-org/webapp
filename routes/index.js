import healthRouter from "./health-route.js";
import userRouter from "./user-route.js";

export default (app) => {
  app.use("/v2/user", userRouter);
  app.use("/", healthRouter);
};
