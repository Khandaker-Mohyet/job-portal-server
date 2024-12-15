const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors())
app.use(express.json());

// Job_hunter
// R7a4N1Fv3YfTsQsw



// const uri = "mongodb+srv://Job_hunter:R7a4N1Fv3YfTsQsw@cluster0.47f5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.47f5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const jobCollection = client.db('JobPortal').collection('jobs')
    const jobApplication = client.db('JobPortal').collection('application')

    app.get('/jobs', async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { hr_email: email }
      }
      const cursor = jobCollection.find(query)
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await jobCollection.findOne(query)
      res.send(result)
    })

    app.post('/jobs', async (req, res) => {
      const newJobs = req.body;
      const result = await jobCollection.insertOne(newJobs)
      res.send(result)
    })

    app.get('/job-application', async (req, res) => {
      const email = req.query.email;
      const query = { applicant_email: email }
      const result = await jobApplication.find(query).toArray()
      for (const application of result) {
        console.log(application.job_id)
      }
      res.send(result);
    })

    app.get('/job-application/jobs/:job_id', async (req, res) => {
      const jobId = req.params.job_id;
      const query = { job_id: jobId };
      const result = await jobApplication.find(query).toArray()
      res.send(result)
    })

    app.post('/job-application', async (req, res) => {
      const application = req.body;
      const result = await jobApplication.insertOne(application)
      res.send(result)
    })

    app.patch('/job-application/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: data.status
                }
            }
            const result = await jobApplication.updateOne(filter, updatedDoc);
            res.send(result)
        })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('job is falling from the sky')
})

app.listen(port, () => {
  console.log(`job is waiting at ${port}`)
})