import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"

//temp
import testRoutes from "./routes/test.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)

app.get("/", (req, res) => {
  res.send("TeamFlow API Running...");
});

export default app;