const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


const port  = process.env.PORT || 8000;

const app = express()
app.use(express.json());
app.use(cors());


const uri = process.env.MONGO_DB_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const collection = client.db("MyToDoApp").collection("AllTasks");


// const task = {
//     title : "Learn MongoDB",
//     description : "Need to learn MongoDB with in a month basic to Intermediate",
//     timeStamp : Date.now(),
//     category : "InProgress"
// }
// collection.insertOne(task)
{/* <div class="flex h-8 w-8 absolute"><span class="animate-ping absolute h-8 w-8 -top-4 -left-4 rounded-full bg-gray-200 opacity-75"></span><span class="relative rounded-full h-8 w-8 -top-4 -left-4 bg-gray-200"></span></div> */}


app.get("/", async(req,res)=>{
    res.send("ToDo App is Online")
})

app.listen(port, ()=>{
    console.log(`ToDo app is running on PORT : ${process.env.PORT}`)
})


