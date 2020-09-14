window.addEventListener('DOMContentLoaded', function () {
	const playBtn = document.getElementById('play-btn');
	const playAgainBtn = document.getElementById('play-button');
	const gameContainer = document.getElementById('game-container');
	const lettersContainer = document.getElementById('letters');
	const movieImgContainer = document.querySelector('.game-container__img');
	const finalMsg = document.getElementById('final-message');
	const popup = document.getElementById('popup-container');
	const notification = document.getElementById('notification-container');
	const figureParts = Array.from(document.querySelectorAll('.figure-part'));

	let alphabet = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'&',
		'.',
		':',
		"'",
		'-',
	];

	// create alphabet ul
	function createAlphabet() {
		myButtons = document.getElementById('buttons');
		letters = document.createElement('ul');
		letters.setAttribute('id', 'alphabet-list');

		letters.classList.add('alphabet-list');
		letters.innerHTML = `
${alphabet
	.map(
		(letter) => `
	  <li class="alphabet-button">
	  ${letter}
  </li>
  `
	)
	.join('')}
	`;

		myButtons.appendChild(letters);
	}

	// reset aplhabet
	function resetAlphabet() {
		let letters = document.getElementById('alphabet-list');
		if (letters != null) {
			letters.remove();
		}
	}

	playBtn.addEventListener('click', (e) => {
		getSingleMovie();
		resetAlphabet();
		createAlphabet();
	});

	// Restart game and play again
	playAgainBtn.addEventListener('click', () => {
		getSingleMovie();
		resetAlphabet();
		createAlphabet();

		popup.style.display = 'none';
	});

	async function getSingleMovie() {
		playBtn.innerText = 'Give up and select new movie title';

		const myMoviesApiKey = 'fe5659478ce11108e18453bb978ef0e1';
		const randomMoviePage = Math.floor(Math.random() * 390);
		const randomTopRatedMoviePage = `https://api.themoviedb.org/3/movie/top_rated?api_key=${myMoviesApiKey}&language=en-US&page=${randomMoviePage}`;
		const randomResult = Math.floor(Math.random() * 20);

		const response = await fetch(randomTopRatedMoviePage);
		const movieTitles = await response.json();
		const randomMovie = movieTitles.results[`${randomResult}`];

		let movieTitle = randomMovie.title.toLowerCase();
		console.log(movieTitle);

		let movieDate = randomMovie.release_date;

		movieImgContainer.innerHTML = `
								<img
									src="https://image.tmdb.org/t/p/w500/${randomMovie.backdrop_path}"
									class="movie__image"
									alt="${randomMovie.overview}"
									id="movie-img"
								/>
								<p class="movie__btn" id="next-btn">Release date: ${movieDate}</p>
							`;

		const movieImg = document.getElementById('movie-img');
		const movieImgHeight = getComputedStyle(movieImg);
		const maxHeight = movieImgHeight.height;

		////// hangman part

		let selectedWord = movieTitle;
		const wordEl = document.getElementById('word');
		const correctLetters = [];
		const wrongLetters = [];

		function resetLetters() {
			let letters = document.querySelectorAll('.alphabet-button');
			letters.forEach((letter) => {
				letter.classList.remove('clicked');
			});
		}

		resetLetters();

		// Show hidden word
		function displayWord() {
			let newWord = selectedWord.split(' ');

			wordEl.innerHTML = `${newWord
				.map((word) => {
					return word
						.split('')
						.map(
							(letter) =>
								`<li class="letter">${
									correctLetters.includes(letter) ? letter : ''
								}</li>`
						)
						.join('');
				})
				.join(`<p class="letter__separator"> </p>`)}`;

			const innerWord = wordEl.innerText.replace(/\n/g, '');

			if (innerWord === selectedWord.replace(/\s+/g, '')) {
				finalMsg.innerText = 'Congrats! You won!';
				popup.style.display = 'flex';
			}
		}

		displayWord();

		// Show notification
		function showNotification() {
			notification.classList.add('show');

			setTimeout(() => {
				notification.classList.remove('show');
			}, 3500);
		}

		function drawFigure() {
			// draw each part when wrong
			figureParts.forEach((part, index) => {
				const error = wrongLetters.length;

				if (index < error) {
					part.style.display = 'block';
				} else {
					part.style.display = 'none';
				}
			});

			// display notification when game over
			if (wrongLetters.length === figureParts.length) {
				finalMsg.innerText = 'YOU LOST! better luck next time';
				popup.style.display = 'flex';
			}
		}

		// hide figure parts after game over
		function resetFigure() {
			figureParts.forEach((part) => {
				part.style.display = 'none';
			});
		}

		resetFigure();

		// check for letter that was clicked on
		function clickedLetter() {
			let letters = document.querySelectorAll('.alphabet-button');

			let clickedLetters = letters.forEach((letter) => {
				letter.addEventListener('click', (e) => {
					let clickedLetter = e.target.innerText;
					e.target.classList.add('clicked');
					const innerWord = wordEl.innerText.replace(/\n/g, '');

					if (selectedWord.includes(clickedLetter)) {
						if (!correctLetters.includes(clickedLetter)) {
							correctLetters.push(clickedLetter);

							displayWord();
						} else if (innerWord != selectedWord) {
							notification.innerText = `word already contains letter ${clickedLetter.toUpperCase()}`;
							showNotification();
						}
					} else {
						if (!wrongLetters.includes(clickedLetter)) {
							wrongLetters.push(clickedLetter);

							drawFigure();
						} else {
							notification.innerText = `word does not contain letter ${clickedLetter.toUpperCase()} plus you already clicked it DUMBASS`;
							showNotification();
						}
					}
				});
			});

			return clickedLetters;
		}

		clickedLetter();

		function displayGame() {
			gameContainer.style.maxHeight =
				parseInt(maxHeight.replace(/px/, '')) + 3000 + 'px';
		}

		displayGame();
	}
});
