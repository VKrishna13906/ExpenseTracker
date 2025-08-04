
import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    try {
        const { user_id } = req.params;
        const transaction = await sql`
                SELECT * FROM transactions WHERE user_id = ${user_id} order by created_at desc
            `
        res.status(200).json(transaction)
    } catch (error) {
        console.log("Error while fetching the transaction", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createTransaction(req, res) {
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES (${user_id},${title},${amount},${category})
            RETURNING *
        `
        console.log(transaction);
        res.status(201).json(transaction[0]);

    } catch (error) {
        console.log("Error while creating the transaction", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;

        // it will check if the id is number only
        if (!/^\d+$/.test(id)) {
            return res.status(404).json({ message: "Invalid transaction Id" });
        }
        const transaction = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `
        if (transaction.length === 0) {
            return res.status(404).json({ message: "Transaction not found." });
        }
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.log("Error while deleting the transaction", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getSummaryByUserId(req, res) {
    try {
        const { user_id } = req.params;

        const balanceSheet = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${user_id}
        `
        const incomeSheet = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${user_id} AND amount > 0
        `        
        const expenseSheet = await sql`
            SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${user_id}
            AND amount < 0
        `

        res.status(200).json({
            balance: balanceSheet[0].balance,
            income: incomeSheet[0].income,
            expense: expenseSheet[0].expense,
        })
    } catch (error) {
        console.log("Error while fetching the transaction summary.", error);
        res.status(500).json({ message: "Internal server error" });        
    }
}