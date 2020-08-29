var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const MovieSchema = new Schema({
    name: { type: String, required: true, unique: true },
    imdb_score: { type: Number, required: true},
    director: { type: String, required: true},
    '99popularity': { type: Number, required: true},
    genre: { type: Array, required: true}
})

module.exports = mongoose.model('Movie', MovieSchema);