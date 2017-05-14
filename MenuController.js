// jshint esversion: 6

const WIDTH = 50;
const HEIGHT = 50;

let MenuController = function () {
    this.difficultyLevel = 0;
    this.firstMove = 0; // 0 - игорк, 1 - компьютер
    this.difficultyButtons = [];
    this.firstMoveButtons = [];

    this.initialize = function () {
        // Подписка на клики по кнопкам сложности
        this.difficultyButtons = document.getElementById('difficult').getElementsByClassName('button');
        for (i = 0; i < this.difficultyButtons.length; i++) {
            this.difficultyButtons[i].onclick = this.difficultyClick.bind(this);
        }
        // Подписка на клики по кнопкам первого хода
        this.firstMoveButtons = document.getElementById('fm').getElementsByClassName('button');
        for (i = 0; i < this.firstMoveButtons.length; i++) {
            this.firstMoveButtons[i].onclick = this.firstMoveClick.bind(this);
        }
        // Подписка на кнопку New Game 
        this.newGameButton = document.getElementById('new_game');
        this.newGameButton.onclick = this.newGame.bind(this);
        //подписка на кнопку main Menu
        this.mainMenuButton = document.getElementById('mainMenu');
        this.mainMenuButton.onclick = this.mainMenu.bind(this);
        //Подписка на кнопку Retry
        this.retryButton = document.getElementById('retry');
        this.retryButton.onclick = this.newGame.bind(this);
        
        //подписка на приглашение к скролу
        this.scrollButton = document.getElementById('scroll');
        this.scrollButton.onclick = this.scroll.bind(this);
    };
    
    this.scroll = function(){
        this.scrollButton.classList.add('hidden');
    }
    
    this.mainMenu = function () {

        document.getElementById('result').classList.add('hidden');
        document.getElementById('result2').classList.add('hidden');
        document.getElementById('menu').classList.remove('hidden');
    }

    this.newGame = function () {
        if (this.game) {
            delete this.game;
        }
        this.game = new Game(WIDTH, HEIGHT, this.difficultyLevel, this.firstMove);
        document.getElementById('grid').classList.remove('hidden');
        document.getElementById('result').classList.add('hidden');
        document.getElementById('result2').classList.add('hidden');
        document.getElementById('menu').classList.add('hidden');
        document.getElementsByTagName('body')[0].classList.remove('overflow');
    };

    this.difficultyClick = function (event) {
        let id = parseInt(event.target.id);
        this.difficultyLevel = id;
        this.toggleButtonSelection(this.difficultyButtons, id);
    };

    this.firstMoveClick = function (event) {
        let id = parseInt(event.target.id);
        this.firstMove = id;
        this.toggleButtonSelection(this.firstMoveButtons, id);
    };

    this.toggleButtonSelection = function (buttons, selected) {
        for (i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('button_active');
        }
        buttons[selected].classList.add('button_active');
    };

    this.initialize();

};
