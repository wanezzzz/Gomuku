// jshint esversion: 6

let Model = function (width, height, AILevel,firstMove) {
   /**
    * 0 - пустая клетка
    * 1 - крестик
    * 2 - нолик
    */
   this.matrix = [];
   this.width = width;
   this.height = height;
   this.turn = false; // true - ходят крестики, false - нолики
   this.AILevel = AILevel;
   this.playing = false;
   // длина победы - 1
   this.row = 4;
    this.firstMove=firstMove;

   this.initialize = function () {
      // пустая доска
      for (let i = 0; i < this.width; i++) {
         this.matrix[i] = [];
         for (let j = 0; j < this.height; j++) {
            this.matrix[i][j] = 0;
         }
      }
   };

   this.userMove = function (x, y) {
      if (this.isEmpty(x, y)) {
         this.matrix[x][y] = 1;
         return true;
      } else {
         return false;
      }
   };

   this.AIMove = function () {
      this.playing = true;
      let result;
      switch (this.AILevel) {
      case 1:
         result = this.mediumLevelAIMove();
         break;
      case 2:
         result = this.hightLevelAIMove();
         break;
      default:
         result = this.lowLevelAIMove();
         break;
      }
      this.playing = false;
      return result;
   };

   // Тупой AI
   this.lowLevelAIMove = function () {
      x = Math.round(Math.random() * (this.width - 1));
      y = Math.round(Math.random() * (this.height - 1));
      if (this.isEmpty(x, y)) {
         this.matrix[x][y] = 2;
         return [x, y];
      } else {
         return this.AIMove();
      }
   };

   this.isWin = function (x, y) {
      let i = x - this.row >= 0 ? x - this.row : 0;
      let width = x + this.row < this.width ? x + this.row : this.width - 1;
      let inRow = 0;
      let player = this.matrix[x][y];

      for (i; i <= width; i++) {
         if (this.matrix[i][y] == player) {
            inRow++;
         }
      }

      if (inRow >= 5) {
         return player;
      }

      return;
   };

   // Средний AI 
   this.mediumLevelAIMove = function () {
      for (let i = 0; i < this.width; i++){
          for (let j=0; j < this.height; j++){
              if (this.isEmpty(j, i)){
                  this.matrix[j][i]=2;
                  return [j,i];
              }
              
          }
      }
          
   };

   // Сложный AI
   this.highLevelAIMove = function () {
      return this.lowLevelAIMove();
   };

   this.isPlaying = function () {
      return this.playing;
   };

   this.isEmpty = function (x, y) {
      return this.matrix[x][y] === 0;
   };

   this.getCell = function (x, y) {
      return this.matrix[x][y];
   };

   this.initialize();
};