const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


// const task = [
//   {
//     title : "Learn NodeJs",
//     description : "Need to learn MongoDB with in a month basic to Intermediate",
//     timeStamp : Date.now(),
//     category : "ToDo"
// },
//   {
//     title : "Learn React",
//     description : "Need to learn MongoDB with in a month basic to Intermediate",
//     timeStamp : Date.now(),
//     category : "Done"
// },
//   {
//     title : "Learn Javascript",
//     description : "Need to learn MongoDB with in a month basic to Intermediate",
//     timeStamp : Date.now(),
//     category : "InProgress"
// },
//   {
//     title : "Learn Nextjs",
//     description : "Need to learn MongoDB with in a month basic to Intermediate",
//     timeStamp : Date.now(),
//     category : "ToDo"
// },
//   {
//     title : "Learn TypeScript",
//     description : "Need to learn MongoDB with in a month basic to Intermediate",
//     timeStamp : Date.now(),
//     category : "InProgress"
// },
//   {
//     title : "Learn GSAP",
//     description : "Need to learn MongoDB with in a month basic to Intermediate",
//     timeStamp : Date.now(),
//     category : "ToDo"
// },
// ]
// collection.updateMany({},{$set:{position:1}})
{/* <div class="flex h-8 w-8 absolute"><span class="animate-ping absolute h-8 w-8 -top-4 -left-4 rounded-full bg-gray-200 opacity-75"></span><span class="relative rounded-full h-8 w-8 -top-4 -left-4 bg-gray-200"></span></div> */}

app.get("/tasks",async(req, res)=>{
  const {category} = req.query;
  const filter = {};
  if(category){
    filter.category = category
  }
  const result = (await collection.find(filter).toArray());
  res.status(200).send({message:"Category ToDos fetched", result})
});

app.put("/tasks", async (req, res) => {
  try {
    console.log("Received update request with tasks:", req.body.tasks);
    const { tasks } = req.body;

    if (!tasks || tasks.length === 0) {
        return res.status(400).json({ error: "No tasks provided" });
    }

    const bulkOperations = tasks.map((task) => ({
        updateOne: {
            filter: { _id: new ObjectId(task._id)},
            update: { $set: { position: task.position, category: task.category } }, 
        },
    }));

    await collection.bulkWrite(bulkOperations);

    res.status(200).send({ message: "All tasks updated successfully" });
} catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).send({ error: "Internal Server Error" });
}
});

app.delete("/tasks/:id", async(req, res)=>{
  try{
    const {id} = req.params;
  const query = {_id : new ObjectId(id)};
  const result = await collection.deleteOne(query);
  res.status(200).send({ message: "All tasks updated successfully", result });
  }catch(error){
    console.error("Error updating tasks:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
})


app.get("/", async(req,res)=>{
    res.send("ToDo App is Online")
})

app.listen(port, ()=>{
    console.log(`ToDo app is running on PORT : ${process.env.PORT}`)
})


