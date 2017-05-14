// jshint esversion: 6

let GameController = function (view, model) {
    this.view = view;
    this.model = model;



    this.initialize = function () {
        this.view.canvas.onclick = this.clickHandler.bind(this);
        if (model.getFirstPlayer() == 1) {
            this.moveAI();
        }

    };

    this.clickHandler = function (event) {
        if (this.model.isPlaying()) {
            return;
        }
        let coords = this.view.getCellByCoordinates(event.pageX, event.pageY),
            x = coords[0],
            y = coords[1];

        this.move(x, y);
    };

    this.move = function (x, y) {
        if (this.moveUser(x, y) && !model.isWin(x, y)) {
            this.moveAI();
        };
    };

    this.moveUser = function (x, y) {
        let userMove = model.userMove(x, y);
        if (!userMove) {
            return userMove;
        }
        // рисуем ход игрока
        view.drawMove(x, y);
        this.checkWin(x, y);
        return userMove;
    };

    this.moveAI = function () {
        let AIMove = model.AIMove();
        let x = AIMove[0];
        let y = AIMove[1];
        view.drawMove(x, y);
        this.checkWin(x, y);
    };

    this.showResult = function (win, fm) {
        
        let text = document.getElementById('win');
        let container = document.getElementById('result2');
        container.classList.remove('hidden');
        document.getElementsByTagName('body')[0].classList.add('overflow');
        if (win.player == fm) {
            text.innerHTML = "you win";
            container.classList.add('result_win');
        } else {
            text.innerHTML = "you lose";
            container.classList.add('result_lose');
        }
    }
    this.checkWin = function (x, y) {
        let win = model.isWin(x, y);
        let fm = model.firstMove + 1;
        
        if (win) { 
            this.view.drawWinLine(win.line);
            document.getElementById('result').classList.remove('hidden');
            setTimeout(function(){
                this.showResult(win, fm);
            }.bind(this), 1000);
            
        }

    };

    this.initialize();

};
