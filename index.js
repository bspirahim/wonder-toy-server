const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())



console.log(process.env.DB_PASS)



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
      const result = await AllToysCollection.find(query).toArray();
      res.send(result)
    })


    app.get('/altoys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: {  img: 1, Price: 1, ProductName:1, Quantity:1, SellerName:1, email:1, details:1 },
      };
      const result = await AllToysCollection.findOne(query, options)
      res.send(result)
    })

    app.post('/alltoys', async(req, res)=>{
      const allToy = req.body;
      const result = await AllToysCollection.insertOne(allToy)
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