const mongoose = require('mongoose');

const connectToDatabase = () => {
  const uri = "mongodb+srv://rethinkpack:RTfhUb5xVCI4QUhK@rtpdb.eswmapx.mongodb.net/?retryWrites=true&w=majority";

  return mongoose.connect(uri, {
    dbName: 'Questions',
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to Questions database');
  }).catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
};

module.exports = connectToDatabase;