const express =require('express')
const cors =require('cors')
const app =express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleWare
app.use(cors({
  origin:[
   'http://localhost:5173',
   'https://b9-assignment-11.web.app'
  ]
}))
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
    const commentCollection = client.db("blogDB").collection('comment')

// get
app.get('/blog',async(req,res)=>{
  const cursor =blogCollection.find().sort({time: -1});
  const result =await cursor.toArray()
  res.send(result)
})

// wish get
app.get('/wishlist/:userEmail', async (req, res) => {
  const email= req.params.userEmail;
  const query = { userEmail: (email) }
  const wishBLog = await wishCollection.find(query).toArray();
  res.send(wishBLog);
})

  // update
app.get('/blog/:id',async(req,res)=>{
    const id= req.params.id
    const query={_id:new ObjectId(id)}
    const result=await blogCollection.findOne(query)
    res.send(result)
  })
  
  // update
app.put('/blog/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id:new ObjectId(id)}
  const options={upsert:true}
  const updatedBlog=req.body
  const blog={
    $set:{
      image:updatedBlog.image,
       title:updatedBlog.title,
       category:updatedBlog.category,description:updatedBlog.description, longdescription:updatedBlog.longdescription,
    }
  }
const result=await blogCollection.updateOne(filter,blog,options)
res.send(result)
})

// post
app.post('/blog',async(req,res)=>{
    const newBlog=req.body
    delete newBlog._id
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


// delete
app.delete('/wishlist/:id',async(req,res)=>{
  const id= req.params.id
  console.log(id)
  const query={_id:new ObjectId(id)}
  const result=await wishCollection.deleteOne(query)
  res.send(result)
})


// comment related

   // Post new comment
   app.post('/comment', async (req, res) => {
    const comment = req.body;
    // console.log(comment)
    const result = await commentCollection.insertOne(comment);
    res.send(result)

    
  });
// comment get
  app.get('/comment',async(req,res)=>{
    const cursor =commentCollection.find()
    const result =await cursor.toArray()
    res.send(result)
  })

    
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