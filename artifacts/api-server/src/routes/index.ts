import { Router, type IRouter } from "express";
import healthRouter from "./health";
import candidaturaRouter from "./candidatura";
import paymentInterestRouter from "./payment-interest";
import psicologosRouter from "./psicologos";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(candidaturaRouter);
router.use(paymentInterestRouter);
router.use(psicologosRouter);
router.use(adminRouter);

export default router;
