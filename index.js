const express = require("express");
const path = require("path");

const Puzzle = require("./src/Puzzle.js");
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Put all API endpoints under "/api"
app.get("/api/puzzlelist", (req, res) => {

    //if (req.query.species) {
    //    query.species = req.query.species;
    //}   

    var query = {};
    var options = {
            "_id": 0,
            "title": 1,
            "author": 1
        };

    Puzzle.find( query, options, (err, puzzlelist) => {
        if (!err) {
            res.json(puzzlelist);
        } else {
            res.json({});
        }   
    }); 

    console.log("Sent puzzle list!");
});

app.get("/api/puzzle/:title", (req, res) => {

    var query = {"title": req.params.title};

    Puzzle.findOne( query, (err, puzzle) => {
        if (!err) {
            res.json(puzzle);
        } else {
            res.json({});
        }   
    }); 

    console.log("Sent puzzle!");
});


// The "catchall handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`cross-words server listening on port ${port}`);
