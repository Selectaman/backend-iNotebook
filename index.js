if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}



// importing
const express = require('express');
const connectToMongo =require('./db.js');
const cors = require('cors');
//db config
connectToMongo();
//app config
const app = express();
const port = 8000;

// middle for req.body to send json otherwise undefined
app.use(cors());
app.use(express.json());

//routing
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.get('/', (req, res) => {
    res.send('HK');
})
// listen
app.listen(port, ()=> {
    console.log(`App is running on port ${port}`);
})