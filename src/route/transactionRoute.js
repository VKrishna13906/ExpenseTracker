import express from "express";
import { createTransaction, deleteTransaction, getSummaryByUserId, getTransactionsByUserId } from "../controller/transactionController.js";

const router = express.Router();

router.get("/:user_id", getTransactionsByUserId)

router.get("/summary/:user_id", getSummaryByUserId)

router.delete("/:id", deleteTransaction)

router.post("/", createTransaction)

export default router