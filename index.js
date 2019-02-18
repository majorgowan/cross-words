const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const Puzzle = require("./src/Puzzle.js");
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// For parsing json requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Global variables for configuring initial app
var config = {"puzzleId": null}


// ==================================================
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

app.get("/api/defaultPuzzle", (req, res) => {

    if (config["puzzleId"]) {
        Puzzle.findOne( {"_id": config["puzzleId"]}, (err, puzzle) => {
            if (!err) {
                res.json(puzzle);
                console.log("Sent puzzle!");
            } else {
                res.json({});
            }
        });
    } else {
        res.json({});
    }
});


// Receive puzzle json
app.post("/api/sendpuzzle", (req, res) => {
    console.log(req.body);

    console.log("inserting into database!");

    Puzzle.create(req.body, (err) => {
        if (err) {
            res.json({"code": 1,
                      "message": "unable to insert into collection " + err})
        } else {
            res.json({"code": 0,
                      "failure": "no problems"});
        }
    });
});

// ==================================================

// The react app, send back React's index.html file, with
// or without setting config variable based on parameter and queries
app.get("/:puzzleId", (req, res) => {
    // TODO: https://stackoverflow.com/questions/37359872/server-side-variables-to-client-side-with-react-engine-and-express
    // if route included a puzzle id, set global variable on server
    // on component mount, query server for possible puzzle id, then if there is one, set state.puzzle accordingly
    console.log(req.params);
    if (req.params.puzzleId) {
        config["puzzleId"] = req.params.puzzleId;
    }
    console.log(config);
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// ==================================================
// The "catchall handler: for any request that doesn't
// match one above, send back React's index.html file.
//app.get("*", (req, res) => {
//    res.sendFile(path.join(__dirname + "/client/build/index.html"));
//});


const port = process.env.PORT || 5000;
app.listen(port);

console.log(`cross-words server listening on port ${port}`);
