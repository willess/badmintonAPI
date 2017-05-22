/**
 * Created by Wilco on 05/12/16.
 */

require('mongoose-pagination');

var playerController = function (Player) {
    var newPageNext, newPagePrev;

    var post = function (req, res) {
        var player = new Player(req.body);

        if(!req.body.name) {
            res.status(400);
            res.send("Name is required!");
        }
        else if(!req.body.country){
            res.status(400);
            res.send("Country is required!");
        }
        else if(!req.body.gender){
            res.status(400);
            res.send("Gender is required!");
        }
        else {
            player.save();
            res.status(201);
            res.send(player);
        }
    };

    var get = function (req, res, next) {

        var page = parseInt(req.query.start) || 1;

        var query = {};

        if(req.query.client) {
            query.client = req.query.client;
        }

        Player.find().exec((err, countData) => {
            if (err) {
                return next(err);
            }
            var countItems = countData.length;
        var limit = parseInt(req.query.limit) || countItems;
        var playersObject = {};
        var exclude = {__v: 0};

        Player.find({}, exclude)
            .paginate(page, limit)
            .exec((err, data) => {
            if (err) {
                return next(err);
            }
            else {

                if (limit > countItems) {
            limit = countItems;
        }
    }

        var totalPages = Math.ceil(countItems / limit);

        if (err) {
            res.status(500).send(err);
        }
        else {
            if (!req.accepts('json')) {
                res.status(406).send('its not a right format');
            }
            else {
                if (totalPages <= 1) {
                    newPagePrev = 1;
                    nextPagePrev = 1;
                }

                if (page <= totalPages) {
                    newPageNext = page + 1;
                }

                if (page > 1) {
                    newPagePrev = page - 1;
                }

                var items = playersObject.items = [];
                var links = playersObject._links = {};
                links.self = {};
                links.self.href = 'http://' + req.headers.host + '/api/players';

                var pagination = playersObject.pagination = {};
                pagination.currentPage = page;
                pagination.currentItems = limit;
                pagination.totalPages = totalPages;
                pagination.totalItems = countItems;

                var paginationLinks = pagination._links = {};
                paginationLinks.first = {};
                paginationLinks.last = {};
                paginationLinks.previous = {};
                paginationLinks.next = {};

                paginationLinks.first.page = 1;
                paginationLinks.first.href = 'http://' + req.headers.host + '/api/players/?' + 'start=' + 1 + '&limit=' + limit;

                paginationLinks.last.page = totalPages;
                paginationLinks.last.href = 'http://' + req.headers.host + '/api/players/?' + 'start=' + totalPages + '&limit=' + limit;

                paginationLinks.previous.page = newPagePrev;
                paginationLinks.previous.href = 'http://' + req.headers.host + '/api/players/?' + 'start=' + newPagePrev + '&limit=' + limit;

                paginationLinks.next.page = newPageNext;
                paginationLinks.next.href = 'http://' + req.headers.host + '/api/players/?' + 'start=' + newPageNext + '&limit=' + limit;

                data.forEach(function (element, index, array) {
                    var newPlayer = element.toJSON();
                    var linksPlayer = newPlayer._links = {};
                    linksPlayer.self = {};
                    linksPlayer.collection = {};

                    linksPlayer.self.href = 'http://' + req.headers.host + '/api/players/' + newPlayer._id;
                    linksPlayer.collection.href = 'http://' + req.headers.host + '/api/players/';

                    items.push(newPlayer);
                });

                res.json(playersObject);
            }
        }
    });
    });
    };

    var options = function(req, res){
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.end();
    };

    var getPlayer = function (req, res) {

        var returnPlayer = req.player.toJSON();
        returnPlayer._links = {};
        returnPlayer._links.self = {};
        returnPlayer._links.collection = {};

        returnPlayer._links.self.href = 'http://' + req.headers.host + '/api/players/' + req.player._id;
        returnPlayer._links.collection.href = 'http://' + req.headers.host + '/api/players/';

        res.json(returnPlayer);
    };

    var putPlayer = function (req, res) {

        if(!req.body.name) {
            res.status(400);
            res.send("Name is required!");
        }
        else if(!req.body.country){
            res.status(400);
            res.send("Country is required!");
        }
        else if(!req.body.gender){
            res.status(400);
            res.send("Gender is required!");
        }
        else {
            req.player.name = req.body.name;
            req.player.country = req.body.country;
            req.player.gender = req.body.gender;
            req.player.weight = req.body.weight;
            req.player.save(function (err) {
                if(err) {
                    res.status(500).send(err);
                }
                else {
                    res.json(req.player);
                }
            });
        }
    };

    var patchPlayer = function (req, res) {

        if(req.body._id) {
            delete req.body._id;
        }
        for(var p in req.body) {
            req.player[p] = req.body[p];
        }

        req.player.save(function (err) {

            if(err) {
                res.status(500).send(err);
            }
            else {
                res.json(req.player);
            }

        });

    };

    var deletePlayer = function (req, res) {
        req.player.remove(function (err) {
            if(err) {
                res.status(500).send(err);
            }
            else {
                res.status(204).send('Removed');
            }
        });
    };

    var optionsPlayer = function(req, res){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.end();
    };

    return {
        post: post,
        get: get,
        options: options,

        getPlayer: getPlayer,
        putPlayer: putPlayer,
        patchPlayer: patchPlayer,
        deletePlayer: deletePlayer,
        optionsPlayer: optionsPlayer

    }

};

module.exports = playerController;