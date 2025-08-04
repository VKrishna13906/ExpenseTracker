import express from "express";
import dotenv from "dotenv";
import { initDb } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./route/transactionRoute.js";
import cors from "cors"; // ✅


dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5002;

//middleware
app.use(rateLimiter);
app.use(express.json());
app.use(cors({
  origin: "*", // or your frontend IP
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

//middleware
/* here basically we are creating a folder structure same as api, so when the url contains the transact it will route to transactionRoute, infuture if i have to create more requrest but not related to transaction i can addd more request same as this 
app.use("/api/test", test)
*/
app.use("/api/transaction", transactionRoute);



initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is up and running on Port:${PORT}`)
    })
})