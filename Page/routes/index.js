'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var classement = '';

/**
 * Recuperation du classement
 */
async function getClassement(res) {
    let client;
    var url = "mongodb://localhost:27017/";

    try {
        // Connexion a la base de donnees
        client = await MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            let dbo = db.db("memorydb");

            // Recuperation du classement
            dbo.collection("classement").findOne({}, function (err, result) {
                if (result) {
                    classement = result;
                } else {
                    // Premiere partie: on cree le classement en base de donnnees
                    createClassement(dbo);

                    // Alimentation du classement initial pour eviter une relecture de base
                    classement = { best: 0, meilleurTemps: 20, deuxiemeTemps: 20, troisiemeTemps: 20 };
                }
                db.close();

                // Redirection vers le jeu
                res.render('index', {
                    meilleurTemps: classement.meilleurTemps,
                    deuxiemeTemps: classement.deuxiemeTemps,
                    troisiemeTemps: classement.troisiemeTemps
                });
            });
        });
    } catch (err) {
        console.log(err.stack);
    }

    if (client) {
        console.log("Recuperation du classement OK.");
        client.close();
    }
}

/**
 * Premiere partie: on cree le classement en base de donnnees
 */
async function createClassement(dbo) {
    let client;
    var url = "mongodb://localhost:27017/";

    try {
        // Connexion a la base de donnees
        client = await MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            let dbo = db.db("memorydb");
            classement = { best: 0, meilleurTemps: 20, deuxiemeTemps: 20, troisiemeTemps: 20 };

            // Insertion du classement en base de donnees
            dbo.collection("classement").insertOne(classement, function (err, res) {
                if (err) throw err;
                console.log("Creation OK.");
            });
        });
    } catch (err) {
        console.log(err.stack);
    }

    if (client) {
        console.log("Creation du classement OK.");
        client.close();
    }
}
/**
 * Mise-a-jour du classement en bdd et re-affichage d'une partie vierge
 */
async function updateClassement(duree, res) {
    let url = "mongodb://localhost:27017/";
    let client;

    try {
        // Connexion a la base de donnees
        client = await MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            let dbo = db.db("memorydb");

            // Recuperation du classement en base de donnees
            dbo.collection("classement").findOne({}, function (err, result) {
                let classementNouveau = [];
                if (result) {
                    classement = result;

                    // Tri des 4 scores et selection des 3 premiers
                    classementNouveau = [parseInt(classement.meilleurTemps),
                    parseInt(classement.deuxiemeTemps),
                    parseInt(classement.troisiemeTemps),
                    parseInt(duree)];
                    classementNouveau.sort(function (a, b) { return a - b });

                    var myQuery = { best: 0 };
                    var newValues = {
                        $set: {
                            best: 0
                            , meilleurTemps: classementNouveau[0]
                            , deuxiemeTemps: classementNouveau[1]
                            , troisiemeTemps: classementNouveau[2]
                        }
                    };
                    // Mise-a-jour du classement en base de donnees
                    majClassement(url, dbo, myQuery, newValues, classementNouveau, res);
                } else {
                    console.log("Absence de donnees en base de donnees.");
                }
                db.close();
            });
        });
    } catch (err) {
        console.log(err.stack);
    }

    if (client) {
        console.log("Mise-a-jour du classement OK.");
        client.close();
    }
}
/**
 * Mise-a-jour du classement en base de donnees
 */
async function majClassement(url, dbo, myQuery, newValues, classementNouveau, res) {
    let url2 = "mongodb://localhost:27017/";
    let client;

    try {
        // Connexion a la base de donnees
        client = await MongoClient.connect(url2, function (err, db) {
            if (err) throw err;
            let dbo = db.db("memorydb");

            // Mise-a-jour du classement en base de donnees
            dbo.collection("classement").updateOne(myQuery, newValues, function (err, result) {
                if (result) {
                    console.log("MAJ du classement OK.");
                } else {
                    console.log("Probleme de MAJ.");
                }
                db.close();

                // Redirection vers le jeu avec le nouveau classement
                res.render('index', {
                    meilleurTemps: classementNouveau[0],
                    deuxiemeTemps: classementNouveau[1],
                    troisiemeTemps: classementNouveau[2]
                });
            });
        });
    } catch (err) {
        console.log(err.stack);
    }

    if (client) {
        console.log("classement: " + classement);
        client.close();
    }
}

/**
 * Ouverture du jeu
 */
router.get('/', function (req, res) {

    // Recuperation du classement
    getClassement(res);
});

/**
 * Re-affichage du jeu par le bouton de sauvegarde du score
 */ 
router.post('/', function (req, res) {

    // Mise-a-jour du classement en bdd et re-affichage d'une partie vierge
    updateClassement(req.body.duree, res);
});

module.exports = router;