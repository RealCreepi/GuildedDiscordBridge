import { configure, getLogger } from "log4js";
import discord from "./discord";
import guilded from "./guilded";

const logger = getLogger("main");
let ready = 0;

configure({
	appenders: {
		console: { type: "stdout" },
		file: { type: "file", filename: "log.txt" }
	},
	categories: {
		default: {
			appenders: ["console"],
			level: "debug"
		}
	}
});

discord.once("ready", () => {
	ready++;
	if (ready == 2) {
		logger.info("Running.");
	}
});

guilded.once("ready", () => {
	ready++;
	if (ready == 2) {
		logger.info("Running.");
	}
});

discord.on("message", (data) => {
	guilded.emit("sendMsg", data);
});

guilded.on("message", (data) => {
	discord.emit("sendMsg", data);
});
