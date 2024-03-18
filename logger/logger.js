import { createLogger, format, transports } from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

const loggingWinston = new LoggingWinston();

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.json()
  ),
  transports: [
    new transports.File({
      filename:
        process.env.ENV === "dev" ? "webapp.log" : "/var/log/webapp/webapp.log",
    }),
    loggingWinston,
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export default logger;
