"use strict";

/********************************************************
 *
 * Algorithme de gestion du jeu Memory
 *
 *******************************************************/

// Nombre de couples d'images restant a trouver par le joueur
var couplesRestant = 6;

// Nombre de secondes restantes avant la fin du jeu
var secRest = 20;

// Id de la premiere image a comparer
var premiereImage = "";

// Chaque case du tableau contiendra le nom de l'image
var cases = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// Cases contenant un clic possible
var casesCliquables = [];

// Fonction s'executant chaque seconde
var delai = '';

// Recuperation du classement depuis la base de donnees
var classement = "";

/********************************************************
 * 
 * Gestion des images
 * 
 *******************************************************/

/**
 * Ouverture du jeu
 */
function gameLoad() {

    // Determination d'une image pour chaque case du jeu
    imagePick();

    // Placement de chaque image sur sa case
    imageDisplay();
}

/**
 * Determination d'une image pour chaque case du jeu
 */
function imagePick() {

    // Selection de la premiere case (de 0 a 11)
    let caseLibre = (Math.floor(Math.random() * 100)) % 12;

    // Selection de la premiere image (de 1 a 18)
    let image = ((Math.floor(Math.random() * 100)) % 18) + 1;

    // Placement de l'image dans sa premiere case
    cases[caseLibre] = image;

    // Selection de la seconde case pour la meme image
    caseLibre = caseSelect();

    // Placement de l'image dans sa seconde case
    cases[caseLibre] = image;

    // Tant qu'il existe une case sans image
    while (cases.includes(0)) {

        // Selection d'une case libre
        caseLibre = caseSelect();

        // Selection d'une image disponible
        image = imageSelect();

        // Placement de l'image dans sa premiere case
        cases[caseLibre] = image;

        // Selection de la seconde case pour la meme image
        caseLibre = caseSelect();

        // Placement de l'image dans sa seconde case
        cases[caseLibre] = image;
    }
}

/**
 * Selection d'une case libre (donc qui est sans image)
 */
function caseSelect() {

    // Selection d'une case
    let caseLibre = (Math.floor(Math.random() * 100)) % 12;

    // Tant que la case est deja utilisee, on en cherche une autre
    while (cases[caseLibre] != 0) {

        // Selection d'une case
        caseLibre = (Math.floor(Math.random() * 100)) % 12;
    }

    return caseLibre;
}

/**
 * Selection d'une image disponible (donc qui n'a pas ete utilisee)
 */
function imageSelect() {

    // Selection d'une image
    let image = ((Math.floor(Math.random() * 100)) % 18) + 1;

    // Tant que l'image a deja ete utilisee, on en cherche une autre
    while (cases.includes(image)) {

        // Selection d'une image
        image = ((Math.floor(Math.random() * 100)) % 18) + 1;
    }

    return image;
}

/**
 * Placement de chaque image sur sa case
 */
function imageDisplay() {

    // Images deja placees dans le tableau
    let imagesPlacees = [];

    // Pour chaque image, placement sur sa case
    for (let i = 0; i < 12; i++) {

        // Creation de l'image
        let image = document.createElement("img");

        // Si cette image a deja ete placee dans le tableau
        if (imagesPlacees.includes(cases[i])) {

            // Modification de l'id de l'image pour unicite HTML
            image.setAttribute("id", "image".concat(cases[i]).concat('_2'));
        } else {
            image.setAttribute("id", "image".concat(cases[i]));

            // ajout de l'image aux images deja placees dans le tableau
            imagesPlacees.push(cases[i]);
        }

        image.setAttribute("src", "../images/".concat(cases[i]).concat(".png"));
        image.setAttribute("alt", "image".concat(cases[i]));
        image.setAttribute("style", "display: none;");

        // Placement de l'image sur sa case
        document.getElementById("cell".concat(i + 1)).appendChild(image);
    }
}

/********************************************************
 *
 * Gestion du clic par le joueur
 *
 *******************************************************/

/**
 * Clic du joueur sur une case
 * 
 * @param caseCliquee Case du jeu sur laquelle le joueur clique
 */
async function userClick(caseCliquee) {

    // S'il s'agit du premier clic du joueur
    if (delai == '') {

        // Lancement du temps de jeu
        timerLaunch();
    }

    // Recuperation de l'image de la case
    let image = document.getElementById(caseCliquee).getElementsByTagName("img")[0];

    // Affichage de l'image
    image.setAttribute("style", "");

    // Desactivation du clic sur la case
    document.getElementById(caseCliquee).setAttribute("onClick", "");

    // S'il s'agit de la premiere image a comparer
    if (premiereImage == "") {

        // Enregistrement de la premiere image pour comparaison future
        premiereImage = image.getAttribute("id");
    }
    // S'il s'agit de la seconde image a comparer
    else {

        // Desactivation de tous les clics possibles restants
        disableClicks();

        // Comparaison de l'id des 2 images
        let compOK = (premiereImage == image.getAttribute("id").concat("_2"))
            || (premiereImage.concat("_2") == image.getAttribute("id"));

        // Si les 2 images sont identiques
        if (compOK) {

            // Diminution du nombre de couples d'images restant a trouver
            couplesRestant = couplesRestant - 1;
        }
        // Si les 2 images sont differentes
        else {

            // Attente d'une demi-seconde pour laisser voir la seconde image
            await sleep();

            // Masquage des 2 cases
            document.getElementById(premiereImage).setAttribute("style", "display: none;");
            image.setAttribute("style", "display: none;");

            // Reactivation du clic sur les 2 cases
            document.getElementById(premiereImage).parentNode.setAttribute("onClick", "userClick(this.id)");
            document.getElementById(caseCliquee).setAttribute("onClick", "userClick(this.id)");
        }

        // Reinitialisation de la premiere image a comparer
        premiereImage = "";

        // Re-activation de tous les clics possibles restants
        enableClicks();
    }

    // Si tous les couples ont ete trouves
    if (couplesRestant == 0) {

        // Arret du temps de jeu
        clearInterval(delai);

        // Affichage du libelle de victoire
        document.getElementById("gagne").setAttribute("style", "visibility: visible;");

        // Enregistrement du temps du joueur
        document.getElementById("duree").setAttribute("value", 20-secRest);
    }
}

/**
 * Lancement du temps de jeu
 */
function timerLaunch() {

    // Chaque seconde, la fonction s'execute
    delai = setInterval(function () {

        // Perte d'une seconde
        secRest = secRest - 1;

        // Mise-a-jour du compteur de temps restant et barre de defilement
        document.getElementById("compteur").innerHTML = secRest;
        document.getElementById("temps").setAttribute("style", "width:".concat(15 * secRest).concat("px;"));

        // Si la duree de jeu est ecoulee
        if (secRest == 0) {

            // Arret du temps de jeu
            clearInterval(delai);

            // Desactivation de tous les clics possibles restants
            disableClicks();

            // Affichage du libelle de perte
            document.getElementById("perdu").setAttribute("style", "visibility: visible;");

            // Enregistrement du temps du joueur: le maximum
            document.getElementById("duree").setAttribute("value", 20);
        }
    }, 1000);
}

/**
 * Desactivation de tous les clics possibles restants
 */
function disableClicks() {

    // Pour chaque case
    for (let i = 0; i < 12; i++) {

        // Recuperation de la case
        let caseCliquable = document.getElementsByTagName("td")[i];

        // Si la case est cliquable
        if (caseCliquable.outerHTML.includes("userClick")) {

            // Desactivation du clic sur la case
            caseCliquable.setAttribute("onClick", "");

            // Ajout actif dans le tableau des cases cliquables
            casesCliquables.push(1);
        } else {

            // Ajout inactif dans le tableau des cases cliquables
            casesCliquables.push(0);
        }
    }
}

/**
 * Activation de tous les clics possibles restants
 */
function enableClicks() {

    // Pour chaque case
    for (let i = 0; i < 12; i++) {

        // Recuperation de la case
        let caseCliquable = document.getElementsByTagName("td")[i];

        // Si la case doit etre cliquable
        if (casesCliquables[i] == 1) {

            // Aactivation du clic sur la case
            caseCliquable.setAttribute("onClick", "userClick(this.id)");
        }
    }

    // Vidage du tableau des cases cliquables
    casesCliquables = [];
}

/********************************************************
 *
 * Outils
 *
 *******************************************************/

/**
 * Attente d'une demi-seconde
 */
function sleep() {
    return new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
}