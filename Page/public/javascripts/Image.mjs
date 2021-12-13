/********************************************************
 * 
 * Gestion des images
 * 
 *******************************************************/
 class Image {

	// Chaque case du tableau contiendra le nom de l'image
	#cases = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	/**
	 * Constructeur
	 */
	constructor () {
	}

	/**
	 * Determination d'une image pour chaque case du jeu
	 */
	imagePick() {

		// Selection de la premiere case (de 0 a 11)
		let caseLibre = (Math.floor(Math.random() * 100)) % 12;

		// Selection de la premiere image (de 1 a 18)
		let image = ((Math.floor(Math.random() * 100)) % 18) + 1;

		// Placement de l'image dans sa premiere case
		this.#cases[caseLibre] = image;

		// Selection de la seconde case pour la meme image
		caseLibre = this.#caseSelect();

		// Placement de l'image dans sa seconde case
		this.#cases[caseLibre] = image;

		// Tant qu'il existe une case sans image
		while (this.#cases.includes(0)) {

			// Selection d'une case libre
			caseLibre = this.#caseSelect();

			// Selection d'une image disponible
			image = this.#imageSelect();

			// Placement de l'image dans sa premiere case
			this.#cases[caseLibre] = image;

			// Selection de la seconde case pour la meme image
			caseLibre = this.#caseSelect();

			// Placement de l'image dans sa seconde case
			this.#cases[caseLibre] = image;
		}
	}

	/**
	 * Selection d'une case libre (donc qui est sans image)
	 *
	 * @return Une case du jeu n'ayant pas encore recu d'image
	 */
	#caseSelect() {

		// Selection d'une case
		let caseLibre = (Math.floor(Math.random() * 100)) % 12;

		// Tant que la case est deja utilisee, on en cherche une autre
		while (this.#cases[caseLibre] != 0) {

			// Selection d'une case
			caseLibre = (Math.floor(Math.random() * 100)) % 12;
		}

		return caseLibre;
	}

	/**
	 * Selection d'une image disponible (donc qui n'a pas ete utilisee)
	 *
	 * @return Une image n'ayant pas ete choisie pour la partie en cours
	 */
	#imageSelect() {

		// Selection d'une image
		let image = ((Math.floor(Math.random() * 100)) % 18) + 1;

		// Tant que l'image a deja ete utilisee, on en cherche une autre
		while (this.#cases.includes(image)) {

			// Selection d'une image
			image = ((Math.floor(Math.random() * 100)) % 18) + 1;
		}

		return image;
	}

	/**
	 * Placement de chaque image sur sa case au niveau HTML
	 */
	imageDisplay() {

		// Images deja placees dans le tableau
		let imagesPlacees = [];

		// Pour chaque image, placement sur sa case
		for (let i = 0; i < 12; i++) {

			// Creation de l'image
			let image = document.createElement("img");

			// Si cette image a deja ete placee dans le tableau
			if (imagesPlacees.includes(this.#cases[i])) {

				// Modification de l'id de l'image pour unicite HTML
				image.setAttribute("id", "image".concat(this.#cases[i]).concat('_2'));
			} else {
				image.setAttribute("id", "image".concat(this.#cases[i]));

				// ajout de l'image aux images deja placees dans le tableau
				imagesPlacees.push(this.#cases[i]);
			}

			image.setAttribute("src", "../images/".concat(this.#cases[i]).concat(".png"));
			image.setAttribute("alt", "image".concat(this.#cases[i]));
			image.setAttribute("style", "display: none;");

			// Placement de l'image sur sa case
			document.getElementById("cell".concat(i + 1)).appendChild(image);
		}
	}
}