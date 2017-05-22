/**
 * Created by Wilco on 05/12/16.
 */
var express = require('express');

var routes = function (Player) {

    var playerRouter = express.Router();

    var playerController = require('../Controllers/playerController')(Player);

    playerRouter.route('/')

        .post(playerController.post)

        .get(playerController.get)

        .options(playerController.options);

    playerRouter.use('/:playerId', function (req, res, next) {
        var exclude = {__v: 0};

        Player.findById(req.params.playerId, exclude, function (err, player) {

            if(err){
                res.status(500).send(err);
            }
            else if(player) {
                req.player = player;
                next();
            }

            else {
                res.status(404).send('no player found');
            }
        });
    });

    playerRouter.route('/:playerId')
        .get(playerController.getPlayer)
        .put(playerController.putPlayer)
        .patch(playerController.patchPlayer)
        .delete(playerController.deletePlayer)
        .options(playerController.optionsPlayer)

    return playerRouter;
};

module.exports = routes;