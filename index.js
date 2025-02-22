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
const users = client.db("MyToDoApp").collection("Users");

app.get("/tasks",async(req, res)=>{
  const {category} = req.query;
  const filter = {};
  if(category){
    filter.category = category
  }
  const result = (await collection.find(filter).toArray());
  res.status(200).send({message:"Category ToDos fetched", result})
});


app.post("/user/:email", async(req,res)=>{
  const {email} = req.params;
  const user = req.body;
  // console.log(user, email);
  const existUser = await users.findOne({email:email});
  if(!existUser){
    const result = await users.insertOne(user);
    res.status(200).send({message:"User Added on Database", result})
  }else{
    return;
  }; 
})

app.put("/tasks", async (req, res) => {
  try {
    // console.log("Received update request with tasks:", req.body.tasks);
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

app.post("/task",async(req, res)=>{
  const data = req.body;
  const result = await collection.insertOne(data);
  res.status(200).send({message:"successfully Added", result})
})

app.patch("/task/:id", async(req,res)=>{
  const {id} = req.params;
  const data = req.body;
  const cursor = {
    $set:{...data}
  }
  const result = await collection.updateOne({_id: new ObjectId(id)}, cursor, {upsert:true})
  res.status(200).send({message:"Task Updated", result});
})


app.get("/", async(req,res)=>{
    res.send("ToDo App is Online")
})

app.listen(port, ()=>{
    // console.log(`ToDo app is running on PORT : ${process.env.PORT}`)
})


