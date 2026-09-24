import "dotenv/config"
import cors from "cors";
import express from "express";
import aiRouter from "./routes/ai"
import accountRouter from "./routes/account"
import analyticsRouter from "./routes/analytics"
import classRouter from "./routes/class"
import habitsRouter from "./routes/habits"
import homeRouter from "./routes/home"
import pomodoroRouter from "./routes/pomodoro"
import profileRouter from "./routes/profile"
import scheduleRouter from "./routes/schedule"
import tasksRouter from "./routes/tasks"
import { requireAuth } from "./middleware/requireAuth";




process.on("uncaughtException", (err) => {
    console.error("Uncaught exception (server stayed alive):", err)
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection (server stayed alive):", reason)
})


const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json({limit: "1mb"}));

app.get("/api/health", (_req, res) => {
    res.json({ok: true});
});

app.use("/api/ai", requireAuth, aiRouter);
app.use("/api/home", requireAuth, homeRouter);
app.use("/api/class", requireAuth, classRouter)
app.use("/api/tasks", requireAuth, tasksRouter);
app.use("/api/habits", requireAuth, habitsRouter);
app.use("/api/schedule", requireAuth, scheduleRouter);
app.use("/api/analytics", requireAuth, analyticsRouter);
app.use("/api/pomodoro", requireAuth, pomodoroRouter);
app.use("/api/profile", requireAuth, profileRouter);
app.use("/api/account", requireAuth, accountRouter)


app.listen(PORT, () => {
    console.log(`lsync-server listening on http://localhost:${PORT}`);
});