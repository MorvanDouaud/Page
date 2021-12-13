"use strict";

/********************************************************
 *
 * Algorithme de gestion du jeu Memory
 *
 *******************************************************/

// Gestion du temps de jeu
var gestionTemps = '';

// Gestion du clic du joueur
var gestionClic = '';

/**
 * Ouverture du jeu
 */
function gameLoad() {

	// Gestion des images
	let gestionImage = new Image();

	// Determination d'une image pour chaque case du jeu
	gestionImage.imagePick();

	// Placement de chaque image sur sa case
	gestionImage.imageDisplay();

	// Gestion du temps de jeu
	gestionTemps = new Time();

	// Gestion du clic du joueur
	gestionClic = new Click();
}
