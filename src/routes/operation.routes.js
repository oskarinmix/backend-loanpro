import OperationController from "../controllers/operation.controller.js";
import { Router } from "express";

const { generateOperations, updateOperation, getOperations } =
  OperationController;
// const isAuth = require("../middlewares/Auth");

var router = Router();

router.get("/", getOperations);
router.post("/generate", generateOperations);
router.put("/:id", updateOperation);
export default router;
