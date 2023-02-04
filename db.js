//const mongoose = require('mongoose');
const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://kdas:4Ee3cald6rVEx1R1@cluster0.wygtwdc.mongodb.net/?retryWrites=true&w=majority"

mongoose.set("strictQuery", false);
const connectToMongo = () => {
    mongoose.connect(mongoURI, ()=> {
        console.log("DB connected");
    })
}

module.exports = connectToMongo;

