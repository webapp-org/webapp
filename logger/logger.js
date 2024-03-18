import { createLogger, format, transports } from "winston";
import moment from "moment-timezone";

// Custom time zone format
const timezoneFormat = format((info) => {
  // Local Time
  info.timestamp = moment()
    .tz("America/New_York")
    .format("YYYY-MM-DD HH:mm:ss");
  // UTC
  // info.timestamp = moment().utc().format("YYYY-MM-DD HH:mm:ss");
  return info;
})();

const logger = createLogger({
  format: format.combine(timezoneFormat, format.json()),
  transports: [
    new transports.File({
      filename:
        process.env.ENV === "dev"
          ? "./webapp.log"
          : "/var/log/webapp/webapp.log",
    }),
  ],
});

export default logger;
