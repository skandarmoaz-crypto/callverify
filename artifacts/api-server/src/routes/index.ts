import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sessionsRouter from "./sessions";
import incomingCallRouter from "./incomingCall";
import adminRouter from "./admin";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sessionsRouter);
router.use(incomingCallRouter);
router.use("/admin", adminRouter);
router.use("/admin", settingsRouter);

export default router;
