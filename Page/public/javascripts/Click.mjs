/********************************************************
 *
 * Gestion du clic par le joueur
 *
 *******************************************************/
 class Click {

	// Nombre de couples d'images restant a trouver par le joueur
	#couplesRestant = 6;

	// Id de la premiere image a comparer
	#premiereImage = "";

	// Cases contenant un clic possible
	#casesCliquables = [];

	/**
	 * Constructeur
	 */
	constructor () {
	}
	
	/**
	 * Clic du joueur sur une case
	 * 
	 * @param caseCliquee Case du jeu sur laquelle le joueur clique
	 */
	async userClick(caseCliquee) {

		// S'il s'agit du premier clic du joueur
		if (gestionTemps.getDelai() == '') {

			// Lancement du temps de jeu
			gestionTemps.timerLaunch();
		}

		// Recuperation de l'image de la case
		let image = document.getElementById(caseCliquee).getElementsByTagName("img")[0];

		// Affichage de l'image
		image.setAttribute("style", "");

		// Desactivation du clic sur la case
		document.getElementById(caseCliquee).setAttribute("onClick", "");

		// S'il s'agit de la premiere image a comparer
		if (this.#premiereImage == "") {

			// Enregistrement de la premiere image pour comparaison future
			this.#premiereImage = image.getAttribute("id");
		}
		// S'il s'agit de la seconde image a comparer
		else {

			// Desactivation de tous les clics possibles restants
			this.disableClicks();

			// Comparaison de l'id des 2 images
			let compOK = (this.#premiereImage == image.getAttribute("id").concat("_2"))
				|| (this.#premiereImage.concat("_2") == image.getAttribute("id"));

			// Si les 2 images sont identiques
			if (compOK) {

				// Diminution du nombre de couples d'images restant a trouver
				this.#couplesRestant = this.#couplesRestant - 1;

				// Si tous les couples ont ete trouves
				if (this.#couplesRestant == 0) {

					// Affichage du libelle de victoire
					document.getElementById("gagne").setAttribute("style", "visibility: visible;");

					// Enregistrement du temps du joueur
					document.getElementById("duree").setAttribute("value", 20-gestionTemps.getSecRest());

					// Arret du temps de jeu
					clearInterval(gestionTemps.getDelai());
				}
			}
			// Si les 2 images sont differentes
			else {

				// Attente d'une demi-seconde pour laisser voir la seconde image
				await Time.sleep();

				// Masquage des 2 cases
				document.getElementById(this.#premiereImage).setAttribute("style", "display: none;");
				image.setAttribute("style", "display: none;");

				// Reactivation du clic sur les 2 cases
				document.getElementById(this.#premiereImage).parentNode.setAttribute("onClick", "gestionClic.userClick(this.id)");
				document.getElementById(caseCliquee).setAttribute("onClick", "gestionClic.userClick(this.id)");
			}

			// Reinitialisation de la premiere image a comparer
			this.#premiereImage = "";

			// Re-activation de tous les clics possibles restants
			this.#enableClicks();
		}
	}

	/**
	 * Desactivation de tous les clics possibles restants
	 */
	disableClicks() {

		// Pour chaque case
		for (let caseCliquable of document.getElementsByTagName("td")) {

			// Si la case est cliquable
			if (caseCliquable.outerHTML.includes("userClick")) {

				// Desactivation du clic sur la case
				caseCliquable.setAttribute("onClick", "");

				// Ajout actif dans le tableau des cases cliquables
				this.#casesCliquables.push(1);
			} else {

				// Ajout inactif dans le tableau des cases cliquables
				this.#casesCliquables.push(0);
			}
		}
	}

	/**
	 * Activation de tous les clics possibles restants
	 */
	#enableClicks() {

		// Pour chaque case
		for (let indexCaseCliquable in document.getElementsByTagName("td")) {

			// Si la case doit etre cliquable
			if (this.#casesCliquables[indexCaseCliquable] == 1) {

				// Aactivation du clic sur la case
				document.getElementsByTagName("td")[indexCaseCliquable].setAttribute("onClick", "gestionClic.userClick(this.id)");
			}
		}

		// Vidage du tableau des cases cliquables
		this.#casesCliquables = [];
	}
 }