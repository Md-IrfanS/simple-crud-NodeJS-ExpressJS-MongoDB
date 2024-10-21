const express = require('express');
const bodyParser = require('body-parser');
const { routeIndex } = require('./routes');
const connectDB = require('./config/db');
const app = express();

const port = 4000;

// Middleware
app.use(express.json());
// app.use(bodyParser.urlencoded({extended: false}));



connectDB()

app.get("/", (req, res)=> {
    res.send('<h1>Server Started</h1>')
});

app.use("/v1/api", routeIndex);

app.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`);
});

