const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/hawkeyedb')
.then(console.log("MongoDB Connected"))
.catch((err) => console.log(err));


app.get("/", (req, res) => {
    res.send("Test server is running");
});