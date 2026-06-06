import express from "express";
import router from "./routes";
import { errorHandler } from "./middleware/error.middleware";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api", router);

app.use(errorHandler);

export default app;
