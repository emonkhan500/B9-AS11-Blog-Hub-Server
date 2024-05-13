const express =require('express')
const cors =require('cors')
const app =express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


// middleWare
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hzfjxhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const blogCollection = client.db("blogDB").collection('blog')
    const wishCollection = client.db("blogDB").collection('wish')

// get

app.get('/blog',async(req,res)=>{
  const cursor =blogCollection.find().sort({time: -1});
  const result =await cursor.toArray()
  res.send(result)
})

// post
app.post('/blog',async(req,res)=>{
    const newBlog=req.body
    console.log(newBlog)
    const result = await blogCollection.insertOne(newBlog);
      res.send(result)
})
// wish

app.post('/wishlist', async (req, res) => {
  const  blog  = req.body;
 console.log(blog)
  const result = await wishCollection.insertOne(blog);
  res.send(result);
});





    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
res.send('assignment server is running')
})

app.listen(port,()=>{
    console.log(`server is running in port ${port}`)
})