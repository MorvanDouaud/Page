'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');

/**
 * Ouverture du jeu
 */
router.get('/', function (req, res) {

    // Recuperation du classement
    var classementJSON = fs.readFileSync('../Page/public/data/memory.json');
    var classement = JSON.parse(classementJSON);

    // Redirection vers le jeu
    res.render('index', {
        meilleurTemps: classement.meilleurTemps,
        deuxiemeTemps: classement.deuxiemeTemps,
        troisiemeTemps: classement.troisiemeTemps
    });
});

/**
 * Re-affichage du jeu par le bouton de sauvegarde du score
 */ 
router.post('/', function (req, res) {

    // Recuperation de la duree de jeu passee par le joueur
    var duree = req.body.duree;

    // Recuperation du classement en base de donnees
    var classementJSON = fs.readFileSync('../Page/public/data/memory.json');
    var classement = JSON.parse(classementJSON);

    // Tri des 4 scores et selection des 3 premiers
    var classementNouveau = [parseInt(classement.meilleurTemps),
        parseInt(classement.deuxiemeTemps),
        parseInt(classement.troisiemeTemps),
        duree];
    classementNouveau.sort(function (a, b) { return a - b });
    classement = {
        meilleurTemps: classementNouveau[0],
        deuxiemeTemps: classementNouveau[1],
        troisiemeTemps: classementNouveau[2]
    };

    // Enregistrement du classement en base de donnees
    var classementMAJ = JSON.stringify(classement);
    fs.writeFileSync('../Page/public/data/memory.json', classementMAJ);

    // Redirection vers le jeu avec le nouveau classement
    res.render('index', {
        meilleurTemps: classement.meilleurTemps,
        deuxiemeTemps: classement.deuxiemeTemps,
        troisiemeTemps: classement.troisiemeTemps
    });
});

module.exports = router;