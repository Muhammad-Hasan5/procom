console.log("STARTING INDEX.TS");

import dotenv from "dotenv";
import app from "./app.js";
import { createServer } from "http";
import { connectDB } from "./db/index.db.js";
import { initRedis } from "./config/redis.js";
import { initWebSocket } from "./chat/index.js";

dotenv.config({
	path: "C:/WebDevPro/procom/apps/backend/.env",
});

let port = Number(process.env.PORT);

//redis cache
await initRedis();

// websocket connection
const server = createServer(app);
initWebSocket(server);

// database connection
await connectDB()
	.then(() => {
		server.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.error("Something went wrong with Database", error);
	});


