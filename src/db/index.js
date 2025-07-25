import mongoose from "mongoose";
import express from "express";
import {DB_NAME} from "../constant.js"


const connectDB =  async () => {
    try {
        const connnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGODB CONNECTED! DB HOST: ${connnectionInstance.connection.host}`)
        
        
    } catch (error) {
        console.log("Mongo Db connnection error, ", error)
        process.exit(1)
    }
}

export default connectDB