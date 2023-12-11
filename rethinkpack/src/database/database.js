const mongoose = require('mongoose');

const uri = "mongodb+srv://rethinkpack:RTfhUb5xVCI4QUhK@rtpdb.eswmapx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    const adminDb = db.db.admin();
    const databaseList = await adminDb.listDatabases();

    console.log("List of databases:");
    databaseList.databases.forEach((db) => {
      console.log(db.name);
    });
  } catch (error) {
    console.error('Error listing databases:', error);
  }
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

module.exports = { db };