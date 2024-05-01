const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL,{
    useNewParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('connected', ()=> {
    console.log('Connected to MOngoDB server');
});

db.on('error', (err)=> {
    console.log('MongoDB connection error: ', err);
});

db.on('disconnection', ()=>{
    console.log('MongoDB disconnected');
});

module.exports = db;
