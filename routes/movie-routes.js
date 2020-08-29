const express = require('express');
var MoviesSchema = require('../model/movie');
var GenreSchema = require('../model/genre')

var router = express.Router();

router.get('/genres', (req, res) => {
    GenreSchema.find((err, docs) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Unable to retrieve genres data', error: err })
        }
        else {
            res.status(200).json({docs});
        }
    });
});

router.get('/', (req, res) => {
    MoviesSchema.find((err, docs) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Unable to retrieve movies data', error: err })
        }
        else {
            const moviesName = []
            const directorName = []
            docs.map(m => {
                moviesName.push(m._doc.name)
                directorName.push(m._doc.director)
            })
            res.status(200).json({docs, moviesName, directorName});
        }
    });
});

router.get('/search', (req, res) => {
    const result = []
    if(req.query.search === 'Movie'){
        MoviesSchema.find({ 'name': { $regex: new RegExp("^" + req.query.value.toLowerCase(), "i") } }, (err, docs) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Unable to retrieve movies data', error: err })
            }
            else {
                if (docs.length === 0) {
                    res.status(404).json({message: 'No records found'});
                }
                else {
                    result.push(...docs)
                    res.status(200).json(result);
                }
            }
        });
    }
    else if (req.query.search === 'Director'){
        MoviesSchema.find({ 'director': { $regex: new RegExp("^" + req.query.value.toLowerCase(), "i") } }, (err, docs) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Unable to retrieve movies data', error: err })
            }
            else {
                if (docs.length === 0) {
                    res.status(404).json({message: 'No records found'});
                }
                else {
                    result.push(...docs)
                    res.status(200).json(result);
                }
            }
        });
    }
});

router.post('/add', (req, res) => {
    let genres = []
    GenreSchema.find((err, docs) => {
        if(err)
            return
        else {
            docs.map((g,i) => {
                genres.push(g._doc.genre)
            })
        }
    })
    var newMovie = new MoviesSchema(req.body)
    newMovie.save((err, task) => {
        if (err) res.status(500).json(err);
        else {
            req.body.genre.map((g, i) => {
                if(!genres.includes(g)){
                    var newGenre = new GenreSchema({genre: g})
                    newGenre.save((err, docs) => {
                        if(err)
                            return
                        else {
                            console.log(docs)
                        }
                    })
                }
            }) 
            res.status(200).json(task);
        }
    })
})

router.put('/update/:id', function (req, res, next) {

    let genres = []
    GenreSchema.find((err, docs) => {
        if(err)
            return
        else {
            docs.map((g,i) => {
                genres.push(g._doc.genre)
            })
        }
    })

    MoviesSchema.findByIdAndUpdate(req.params.id, {
        '99popularity': req.body['99popularity'],
        imdb_score: req.body.imdb_score,
        director: req.body.director,
        genre: req.body.genre
    }, function (err, doc) {
        if (err) { res.status(500).json(err); }
        else {
            req.body.genre.map((g, i) => {
                if(!genres.includes(g)){
                    var newGenre = new GenreSchema({genre: g})
                    newGenre.save((err, docs) => {
                        if(err)
                            return
                        else {
                            console.log(docs)
                        }
                    })
                }
            }) 
            res.status(200).json(doc);
        }
    })
})

router.delete('/delete/:id', function (req, res) {
    MoviesSchema.findByIdAndRemove(req.params.id, function (err, doc) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(doc)
        }
    })
})

module.exports = router;