// required library
const mongoose = require('mongoose');

// connecting to databse on mongodb cloud
mongoose.connect('mongodb+srv://sayrabano8888:37F0zJxW5Er9AxvY@cluster0.fs0uvsw.mongodb.net/',{
    useNewUrlParser:true
})

// establishing connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

// opening connection
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

// exporting db
module.exports = db;