const mongoose = require("mongoose");

// Access your MongoDB connection string from secrets
const mongoURI = process.env.MONGODB;

const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser : true,
      useUnifiedTopology : true
    });
    if(connection){
      console.log("Connected Successfully.")
    }
  } catch(error){
    console.log("Connection failed", error)
  }
}

module.exports = {initializeDatabase}

