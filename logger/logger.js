import { createLogger, format, transports } from "winston";

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      level: "debug",
      filename:
        process.env.ENV === "dev"
          ? "logs/webapp.log"
          : "/var/log/webapp/webapp.log",
    }),
  ],
});

export default logger;
