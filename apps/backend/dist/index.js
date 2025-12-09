console.log("STARTING INDEX.TS");
import dotenv from "dotenv";
dotenv.config({
    path: "C:/WebDevPro/procom/apps/backend/.env",
});
import app from "./app.js";
import { connectDB } from "./db/index.db.js";
let port = process.env.PORT;
connectDB()
    .then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error("Something went wrong with Database", error);
});
