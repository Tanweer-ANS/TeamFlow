import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"
import orgRoutes from "./routes/org.routes.js"
import inviteRoutes from "./routes/invite.routes.js"
import projectRoutes from "./routes/project.routes.js"
import taskRoutes from "./routes/task.routes.js"

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

//Invite Routes
app.use("/api/invite", inviteRoutes);

//Project Routes
app.use("/api/projects", projectRoutes)

//Task Routes
app.use("/api/tasks", taskRoutes)

app.get("/", (req, res) => {
  res.send("TeamFlow API Running...");
});

export default app;