import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config"
import routes from "./src/routes/index.js";
mongoose.set("strictQuery",true);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/v1", routes);

const port = process.env.PORT || 3000
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URL).then(()=> {
    console.log("MongoDB Connected");
    server.listen(port,()=>{
        console.log(`Server is listening on Port ${port}`);
    });
}).catch((err)=>{
    console.log({err});
    process.exit(1)
})