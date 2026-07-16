import { Router, type IRouter } from "express";
import healthRouter from "./health";
import candidaturaRouter from "./candidatura";
import paymentInterestRouter from "./payment-interest";

const router: IRouter = Router();

router.use(healthRouter);
router.use(candidaturaRouter);
router.use(paymentInterestRouter);

export default router;
