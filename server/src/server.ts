import express, { Express } from "express";
import { router } from "./routes";
 
const app = express();
const port = 8000;
 
app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
