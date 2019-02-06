var mongoose = require('mongoose');

// connect to mongo database
var mongouri = process.env.MONGODB_URI;
mongoose.connect(mongouri);

var Schema = mongoose.Schema;

var puzzleSchema = new Schema( {
    title: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    date: {type: String, required: true},
    puzzle: [{
                clue: {type: String, required: true},
                answer: {type: String, required: true},
                across: {type: Boolean, required: true},
                start: [Number]
            }]
} );

module.exports = mongoose.model('Puzzle', puzzleSchema);
