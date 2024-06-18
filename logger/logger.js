import { createLogger, format, transports } from "winston";

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      level: "debug",
      filename:
        process.env.ENV === "prod"
          ? "/var/log/webapp/webapp.log"
          : "logs/webapp.log",
    }),
  ],
});

export default logger;
