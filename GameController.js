// jshint esversion: 6

let GameController = function(view, model) {
   this.view = view;
   this.model = model;

   this.initialize = function() {
      this.view.canvas.onclick = this.clickHandler.bind(this);
   };

   this.clickHandler = function(event) {
      if (this.model.isPlaying()){
         return;
      }
      let coords = this.view.getCellByCoordinates(event.pageX, event.pageY),
         x = coords[0],
         y = coords[1];

      this.move(x, y);
   };

   this.move = function(x, y) {
      if (this.moveUser(x,y)) {
         this.moveAI();
      };
   };

   this.moveUser = function(x, y) {
      let userMove = model.userMove(x, y);
      if (!userMove) {
         return userMove;
      }
      // рисуем ход игрока
      view.drawMove(x, y);
      this.checkWin(x, y);
      return userMove;
   };

   this.moveAI = function() {
      let AIMove = model.AIMove();
      let x = AIMove[0];
      let y = AIMove[1];
      view.drawMove(x, y);
      this.checkWin(x, y);
   };
   
   this.checkWin = function(x, y) {
      if (model.isWin(x, y)==model.firstMove+1) {
         document.getElementById('grid').classList.add('hidden');
         document.getElementById('win').classList.remove('hidden');
      }
    
   };

   this.initialize();

};