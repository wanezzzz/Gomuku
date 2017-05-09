// jshint esversion: 6

let files = ['MenuController.js', 'Game.js', 'View.js', 'GameController.js', 'Model.js'];

let App = function() {
   

   this.initialize = function() {
      this.menuController = new MenuController();
   };

   for (var i in files) {
      var script = document.createElement('script');
      script.src = files[i];
      document.getElementsByTagName('head')[0].appendChild(script);
   }

   window.onload = this.initialize;
};

app = new App();