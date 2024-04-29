const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

// mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hv89ofo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const artCollection = client.db('artDB').collection('art');


     app.post('/postdata', async(req, res)=>{
                const artData = req.body;
                console.log(' art data is', artData);
                const result = await artCollection.insertOne(artData);
                res.send(result)

     });





     app.get('/postdata', async(req, res)=>{
            const cursor =   artCollection.find();
            const result = await cursor.toArray();
            res.send(result)
 
    
     });


   app.get( '/mycard/:email', async(req,res)=>{
       const emails =  req.params.email;
       const query = {User_Email : emails}
       const result = await artCollection.find(query).toArray()
       res.send(result)
        
 


   })
   app.get( '/finddata/:id', async(req,res)=>{
       const id =  req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await artCollection.find(query).toArray()
       res.send(result)
        

   })



   app.put('/updatedata/:id', async(req, res)=>{
    const ids = req.params.id;
    console.log('ids is ', ids);
      const updateInfo = req.body;
      console.log('updateInfo is', updateInfo);


      const filter = {_id: new ObjectId(ids)}

      const options = { upsert: true };

      const updateDoc ={
        $set:{
          
 
        Item_name:updateInfo.Item_name,
        Image:updateInfo.Image,
        Subcategory_Name:updateInfo.Subcategory_Name,
        Short_Description:updateInfo.Short_Description,
        Price:updateInfo.Price,
        Procassing_Time:updateInfo.Procassing_Time,
        Customization:updateInfo.Customization,
        Rating:updateInfo.Rating,
        Stuck_status:updateInfo.Stuck_status
        }

 


      }
      const result  = await artCollection.updateOne(filter, updateDoc, options)
      res.send(result)
   })


   app.delete('/deletedata/:id', async(req, res)=>{
    const id = req.params.id;
 
    const filter = {_id: new ObjectId(id)};
    const result = await artCollection.deleteOne(filter);
    res.send(result)
   })


 



 
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("my server is now running sucessfully");
});

app.listen(port, () => {
  console.log(`your surver is running port is${port}`);
});
