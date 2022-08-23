import RecordController from "../controllers/record.controller.js";
import { Router } from "express";

const { create, getRecords, getRecordsByUser, removeRecord } = RecordController;
// const isAuth = require("../middlewares/Auth");

var router = Router();

router.post("/", create);
router.get("/", getRecords);
router.get("/:userId", getRecordsByUser);
router.delete("/:recordId", removeRecord);
/* A route that will be used to update a record. */
// router.put("/:id", updateOperation);
export default router;
