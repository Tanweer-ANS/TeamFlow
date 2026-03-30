import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"

import orgRoutes from "./routes/org.routes.js"

//temp
import testRoutes from "./routes/test.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

//Authorization Routes
app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)

//Organization Routes
app.use("/api/org", orgRoutes)

app.get("/", (req, res) => {
  res.send("TeamFlow API Running...");
});

export default app;