const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://rethinkpack:RTfhUb5xVCI4QUhK@rtpdb.eswmapx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

const database = client.db("rethinkpackDB");
const collectionName = "Question";
const collection = database.collection(collectionName);

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

async function insertQuestionData(data) {
  try {
    if (!client.isConnected()) {
      await client.connect();
    }
    await collection.insertOne(data);
    console.log("Data inserted successfully");
  } catch (e) {
    console.error(e);
  }
}

module.exports = { insertQuestionData };