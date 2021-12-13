/********************************************************
 *
 * Gestion du temps
 *
 *******************************************************/
 class Time {

	// Identifiant de la fonction s'executant chaque seconde
	#delai = '';

	// Nombre de secondes restantes avant la fin du jeu
	#secRest = 20;

	/**
	 * Constructeur
	 */
	constructor () {
	}

	/**
	 * Getter de delai
	 *
	 * @return delai
	 */
	getDelai() {
		return this.#delai;
	}

	/**
	 * Getter de secRest
	 *
	 * @return secRest
	 */
	getSecRest() {
		return this.#secRest;
	}
	
	/**
	 * Lancement du temps de jeu
	 */
	timerLaunch() {
		
		// Reference a this pour setInterval
		let self = this;
		
		// Chaque seconde, la fonction s'execute
		this.#delai = setInterval(function () {

			// Perte d'une seconde
			self.#secRest = self.#secRest - 1;

			// Mise-a-jour du compteur de temps restant et barre de defilement
			document.getElementById("compteur").innerHTML = self.#secRest;
			document.getElementById("temps").setAttribute("style", "width:".concat(15 * self.#secRest).concat("px;"));

			// Si la duree de jeu est ecoulee
			if (self.#secRest == 0) {

				// Desactivation de tous les clics possibles restants
				gestionClic.disableClicks();

				// Affichage du libelle de perte
				document.getElementById("perdu").setAttribute("style", "visibility: visible;");

				// Enregistrement du temps du joueur: le maximum
				document.getElementById("duree").setAttribute("value", 20);

				// Arret du temps de jeu
				clearInterval(self.#delai);
			}
		}, 1000);
	}
	
	/**
	 * Attente d'une demi-seconde
	 */
	static sleep() {
		return new Promise((resolve) => {
			setTimeout(resolve, 500);
		});
	}
 }