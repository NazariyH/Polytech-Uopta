/* This is the best game ever! */

class Game {
    constructor(sacrifice, ammunition, time, speed, ammoAmount) {
        this.sacrifice = sacrifice;
        this.ammunition = ammunition;
        this.time = time;
        this.totalSeconds = time * 60;
        this.speed = speed;
        this.ammoAmount = Number(ammoAmount);
        this.score = 0;
        this.unsuccessHits = 0;
        this.successHits = 0;


        // Adjusting gameplay congfig
        this.hitObjectRemoveTime = 2000;
        this.deactivateSacrificeTime = this.speed * 2;
        this.addScoreValue = 100;
        this.shakingTime = 300;
        this.screamerDeactivateDelay = 1000;
        this.loadAnimationTime = 200;


        // Game objects
        this.game = document.getElementById('game');
        this.ammoAmountObject = document.querySelector('.game__header--ammo--count');
        this.timerObject = document.querySelector('.game__header--timer');
        this.scoreObject = document.querySelector('.game__header--score--count');
        this.sacrificeObjects = document.querySelectorAll('.game__gameplay--block--sacrifice');
        this.screamerObject = document.getElementById('screamer');
        this.resultScreen = document.querySelector('.result');


        // Setintervals
        this.timerInterval = null;
        this.activateSacrificeInterval = null;


        // Sound effects
        this.sacrificeSoundEffect = this.game.querySelectorAll('.sacrifice-sound-effect');
        this.screamerSoundEffect = this.game.querySelector('#screamer-audio');
        this.hitSoundEffect = document.querySelector(`#hit_effect_${this.ammunition[this.ammunition.length - 1]}`);
        this.result_background_music = document.getElementById('result-background-music');
    }

    initializeGame() {
        // Initializing out game process

        this.setSacrificeImage();
        this.setGameCursor();
        this.showAmmoAmount();
        this.countDown();
        this.intializeSoundEffect();

        this.activateSacrificeInterval = setInterval(() => {
            this.activateSacrifice();
        }, this.speed);

        document.querySelector('.form-wrap').classList.add('d-none');
        this.game.classList.remove('d-none');
    }

    setSacrificeImage() {
        // Update screamer and sacrifice object inside pipes and add event listener for them

        const sacrificeObject = this.sacrificeObjects;
        sacrificeObject.forEach(obj => {
            obj.style.backgroundImage = `url(./assets/${this.sacrifice}/sacrifice.png)`;
            this.screamerObject.style.backgroundImage = `url(./assets/${this.sacrifice}/sacrifice.png)`;

            if (this.ammoAmount == false) return;

            const randomValue = Math.floor(Math.random() * this.sacrificeSoundEffect.length);

            obj.addEventListener('click', (event) => {
                if (obj.className === 'game__gameplay--block--sacrifice active') {
                    this.unsuccessHits--;
                    this.successHits++;

                    obj.classList.remove('active');
                    this.sacrificeSoundEffect[randomValue].play().catch(function (error) {
                        console.error('Error playing audio:', error);
                    });

                    this.updateScore();

                    document.body.classList.add('shake');
                    setTimeout(() => {
                        document.body.classList.remove('shake');
                    }, this.shakingTime);
                }
            });
        });
    }

    intializeSoundEffect() {
        // Initialize  sound effect
        this.sacrificeSoundEffect.forEach((audio, i) => {
            audio.src = `./assets/${this.sacrifice}/audio/sound_effect_${i + 1}.mp3`;
        });

        this.screamerSoundEffect.src = `./assets/${this.sacrifice}/audio/screamer.mp3`;
    }

    setGameCursor() {
        /* 
            Change base cursor to new gaming_cursor
            and add eventlistener when user click anywhere within game window
         */

        document.body.style.cursor = `url(./assets/gamePlay/ammunition/${this.ammunition}/cursor.png), auto`;
        if (!this.ammoAmount == false) this.game.addEventListener('click', (event) => this.showHitObject(event));
    }

    showHitObject(event) {
        // Create hit object and remove after a while

        if (this.ammoAmount == false) return;

        this.ammoAmount--;
        this.unsuccessHits++;
        this.showAmmoAmount();

        const positionX = event.clientX;
        const positionY = event.clientY;

        const hitObject = document.createElement('div');
        hitObject.style.backgroundImage = `url(./assets/gamePlay/ammunition/${this.ammunition}/trace.png)`;
        hitObject.classList.add('hit');

        hitObject.style.top = `${positionY}px`;
        hitObject.style.left = `${positionX}px`;

        this.hitSoundEffect.play();
        this.game.append(hitObject);

        // Remove hitObject
        setTimeout(() => {
            hitObject.remove();
        }, this.hitObjectRemoveTime);

        if (this.ammoAmount == false) this.endGame();
    }

    updateScore() {
        // Update score value
        this.score += this.addScoreValue;
        this.scoreObject.textContent = this.score;
    }

    formatTime(totalSeconds) {
        // Format time
        const minutesFormatted = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secondsFormatted = String(totalSeconds % 60).padStart(2, '0');

        return `${minutesFormatted}:${secondsFormatted}`;
    }

    countDown() {
        // Start countdown

        this.timerObject.textContent = this.formatTime(this.totalSeconds);

        this.timerInterval = setInterval(() => {
            this.totalSeconds--;
            this.timerObject.textContent = this.formatTime(this.totalSeconds);

            if (this.totalSeconds === 0) this.endGame();
        }, 1000);
    }

    showAmmoAmount() {
        let formatedAmmoAmount = '';

        switch (this.ammoAmount % 10) {
            case 1:
                formatedAmmoAmount = `${this.ammoAmount} - Яйце`;
                break;

            case 2:
            case 3:
            case 4:
                formatedAmmoAmount = `${this.ammoAmount} - Яйця`;
                break;

            default:
                formatedAmmoAmount = `${this.ammoAmount} - Яєць`;
                break;
        }

        this.ammoAmountObject.textContent = formatedAmmoAmount;
    }

    activateSacrifice() {
        // Move random sacrifice object

        const randomValue = Math.floor(Math.random() * this.sacrificeObjects.length);
        this.sacrificeObjects[randomValue].classList.add('active');

        setTimeout(() => {
            if (this.sacrificeObjects[randomValue].className === 'game__gameplay--block--sacrifice active') {
                this.sacrificeObjects[randomValue].classList.remove('active');
            }
        }, this.deactivateSacrificeTime);
    }

    runScreamer() {
        // Launch screamer

        this.screamerObject.classList.add('activated');
        this.screamerSoundEffect.play();
    }

    updateResultScreen() {
        // Update result screen info

        this.resultScreen.querySelector('.form__content--text--time').textContent = this.formatTime(this.time * 60 - this.totalSeconds);
        this.resultScreen.querySelector('.form__content--text--spended--ammo').textContent = this.unsuccessHits + this.successHits;
        this.resultScreen.querySelector('.form__content--text--accuracy').textContent = Math.round(this.successHits * 100 / (this.successHits + this.unsuccessHits)) + '%';
        this.resultScreen.querySelector('.form__content--text--speed').textContent = this.speed / 1000 + ' сек';
        this.resultScreen.classList.remove('d-none');

        const backgroundSong = document.querySelector('#gameplay-music');
        backgroundSong.pause();
    }

    loadResultScreenAnimation() {
        const finalResultBlocks = document.querySelectorAll('.form__block.loading');

        finalResultBlocks.forEach((block, i) => {
            setTimeout(() => {
                block.classList.remove('loading');
            }, this.loadAnimationTime * i);
        });
    }

    endGame() {
        // End game

        clearInterval(this.timerInterval);
        clearInterval(this.activateSacrificeInterval);

        this.runScreamer();
        setTimeout(() => {
            this.updateResultScreen();
            this.loadResultScreenAnimation();
            document.querySelector('.game').classList.add('d-none');
            this.result_background_music.play();
            this.screamerObject.classList.remove('activated');
            document.body.style.cursor = 'url(./assets/gamePlay/gamePlayObjects/cursor.png), auto';
        }, this.screamerDeactivateDelay * 2);
    }
}

var startMenu = {
    selectedSacrifice: null,
    selectedBackground: null,
    selectedAmmunition: null,
    time: null,
    speed: null,
    sacrificeId: null,
    ammunitionId: null,
    ammoAmount: null,

    loadAnimationTime: 200,
    form: document.querySelector('form'),
    resultBlock: document.querySelector('#result-screen'),

    getData() {
        // Get sacrifice
        const sacrificeInputs = this.form.querySelectorAll('input[name="sacrifice"]');
        sacrificeInputs.forEach(input => {
            if (input.checked) this.selectedSacrifice = input.value;
        });

        const ammunitionInputs = this.form.querySelectorAll('input[name="ammunition"]');
        ammunitionInputs.forEach(input => {
            if (input.checked) this.selectedAmmunition = input.value;
        });

        // Get the game duration and speed
        this.time = this.form.querySelector('#time').value;
        this.speed = this.form.querySelector('#speed').value;
        this.ammoAmount = this.form.querySelector('#ammo-amount').value;

        return [this.selectedSacrifice, this.selectedAmmunition, this.time, this.speed, this.ammoAmount];
    },

    playPreloadAudio(event) {
        /* Play preloader sound when user select sacrifice */

        this.sacrificeId = event.currentTarget.getAttribute('data-sacrificeId');
        const sacrificePreloadAudio = this.form.querySelector(`#preload_${this.sacrificeId}`);
        sacrificePreloadAudio.play().catch(function (error) {
            console.error('Error playing audio:', error);
        });
    },

    playAmmunitionPreloadAudio(event) {
        // Play Preload sound when user select ammunition

        this.ammunitionId = event.currentTarget.getAttribute('data-ammunitionId');
        const ammunitionPreloadAudio = this.form.querySelector(`#hit_effect_${this.ammunitionId}`);
        ammunitionPreloadAudio.play().catch(function (error) {
            console.error('Error playing audio:', error);
        });
    },

    changeBackground(event) {
        // Get and change background

        const backgroundInputs = this.form.querySelectorAll('input[name="background"]');
        this.selectedBackground = null;

        backgroundInputs.forEach(input => {
            if (input.checked) this.selectedBackground = input.value;
        });

        document.body.style.backgroundImage = `url(./assets/gamePlay/backgrounds/${this.selectedBackground}.jpg)`;
        document.getElementById('swipe').play();

    },

    changeTheme(event) {
        /* Toggle theme */

        const resultScreen = document.querySelector('#result-screen');

        if (form.classList.contains('theme--dark')) {
            form.classList.remove('theme--dark');
            form.classList.add('theme--light');
            resultScreen.classList.remove('theme--dark');
            resultScreen.classList.add('theme--light');
            event.currentTarget.style.backgroundImage = "url('./assets/gamePlay/gamePlayObjects/sun.png')";
        } else {
            form.classList.remove('theme--light');
            form.classList.add('theme--dark');
            resultScreen.classList.remove('theme--light');
            resultScreen.classList.add('theme--dark');
            event.currentTarget.style.backgroundImage = "url('./assets/gamePlay/gamePlayObjects/moon.png')";
        }
    },

    loadFormBlock() {
        // Load animation

        const formBlocks = this.form.querySelectorAll('.form__block');
        formBlocks.forEach((block, i) => {
            setTimeout(() => {
                block.classList.remove('loading');
            }, this.loadAnimationTime * i);
        });

        startAudio();
    }
}


function startAudio() {
    /* Start background music */

    const audio = document.getElementById('start-background-music');
    audio.play().catch(function (error) {
        console.error('Error playing audio:', error);
    });
}

startMenu.changeBackground();
startMenu.loadFormBlock();


const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let [selectedSacrifice, selectedAmmunition, time, speed, ammoAmount] = startMenu.getData();
    document.getElementById('start-background-music').pause();

    const gameplayMusic = document.querySelector('#gameplay-music');
    gameplayMusic.volume = 0.5;
    gameplayMusic.play();


    let game = new Game(selectedSacrifice, selectedAmmunition, time, speed, ammoAmount);
    game.initializeGame();
});


const sacrificeImage = document.querySelectorAll('.form__image--sacrifice');
sacrificeImage.forEach(image => {
    image.addEventListener('click', event => {
        startMenu.playPreloadAudio(event);
    });
});


const ammunitionImage = document.querySelectorAll('.form__image--ammunition');
ammunitionImage.forEach(image => {
    image.addEventListener('click', event => {
        startMenu.playAmmunitionPreloadAudio(event);
    });
});


const backgroundImage = document.querySelectorAll('input[name="background"]');
backgroundImage.forEach(background => {
    background.addEventListener('input', () => startMenu.changeBackground(background));
});


const themeBtn = document.querySelector('#themeBtn');
themeBtn.addEventListener('click', event => {
    startMenu.changeTheme(event)
});


const homeBtn = document.querySelector('#home');
homeBtn.addEventListener('click', () => {
    location.reload();
});



const buttons = Array.from(document.getElementsByTagName('button'));
const additionalButtons = Array.from(document.getElementsByClassName('button'));
const numberInputs = Array.from(document.querySelectorAll('input[type="number"]'));
const allButtons = buttons.concat(additionalButtons, numberInputs);

allButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('button-click').play();
    });
});
