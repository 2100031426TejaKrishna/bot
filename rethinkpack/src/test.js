const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://rethinkpack:RTfhUb5xVCI4QUhK@rtpdb.eswmapx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

async function insertQuestion(questionData) {
  try {
    await client.connect();

    const database = client.db("Questions");
    const collection = database.collection("Questions");
    const result = await collection.insertOne(questionData);

    return result;
  } finally {
    await client.close();
  }
}

module.exports = { insertQuestion };