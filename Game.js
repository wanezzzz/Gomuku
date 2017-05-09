// jshint esversion: 6

let Game = function(width, height, difficulty, firstMove) {
   this.width = width;
   this.height = height;

   this.initialize = function() {
      let cellSize = window.innerWidth / 15;

      this.model = new Model(this.width, this.height, difficulty,firstMove);
      this.view = new View(this.width, this.height, cellSize, document.getElementById('grid'), this.model);
      this.controller = new GameController(this.view, this.model);
   };

   this.initialize();
};