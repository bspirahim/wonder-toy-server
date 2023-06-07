const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyu72pb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const AllToysCollection = client.db("wonderToy").collection("alltoys");


    app.get('/altoys', async(req, res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email }
      }
      if(req.query?.category){
        query = {category: req.query.category}
      }
      const result = await AllToysCollection.find(query).toArray();
      res.send(result)
    })



    app.get('/altoys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await AllToysCollection.findOne(query)
      res.send(result)
    })

    app.post('/alltoys', async(req, res)=>{
      const allToy = req.body;
      const result = await AllToysCollection.insertOne(allToy)
      res.send(result);
    })

    app.put('/altoys/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedToy = req.body;
      const toy = {
        $set:{
          category: updatedToy.category,
          price : updatedToy.price,
          toyName: updatedToy.toyName, 
          quantity: updatedToy.quantity,  
          rating: updatedToy.rating,
          photo: updatedToy.photo, 
          comment: updatedToy.comment
        }
      }
      const result = await AllToysCollection.updateOne(filter, toy, options)
      res.send(result)
    })


    app.delete('/altoys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await AllToysCollection.deleteOne(query);
      res.send(result);
    })

    





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   /*  await client.close(); */
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
  res.send('wonder toy is running')
})


app.listen(port, ()=>{
    console.log(`wonder toy is running on port ${port}`)
})