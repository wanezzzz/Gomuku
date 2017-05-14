// jshint esversion: 6

const BG_COLOR = 'white';
const BORDER_COLOR = 'black';
const WIN_LINE_COLOR = 'green';
const X_COLOR = '#C1876B';
const O_COLOR = '#BEBD7F';

let View = function (width, height, cellSize, container, model) {
    this.height = height;
    this.width = width;
    this.container = container;
    this.cellSize = cellSize;

    this.cross = cellSize / 4;
    this.radius = cellSize / 3.5;
    this.model = model;

    this.initialize = function () {
        let canvas = document.getElementById('canvas');
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.canvas.height = this.height * this.cellSize;
        this.canvas.width = this.width * this.cellSize;
        this.render();

    };


    this.render = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = BG_COLOR;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.strokeStyle = BORDER_COLOR;
        this.context.lineWidth = 1;
        for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.canvas.height);
        }
        for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
        }
        this.context.moveTo(0,this.canvas.height);
        this.context.lineTo(this.canvas.width, this.canvas.height);    
        this.context.stroke();
    };

    //x,y - координаты клетки
    this.drawMove = function (x, y) {
        if (this.model.getCell(x, y) === 1) {
            this.drawX(x, y);
        } else {
            this.drawO(x, y);
        }
    };

    this.getCellByCoordinates = function (x, y) {
        let ratio = window.outerWidth / window.innerWidth;
        let cellSize = this.cellSize * ratio;
        return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
    };

    this.drawX = function (x, y) {
        let ctx = this.context,
            lx = x * this.cellSize + this.cellSize / 2,
            ly = y * this.cellSize + this.cellSize / 2;
        ctx.beginPath();
        ctx.fillStyle = BG_COLOR;
        ctx.strokeStyle = X_COLOR;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.moveTo(lx - this.cross, ly - this.cross);
        ctx.lineTo(lx + this.cross, ly + this.cross);
        ctx.moveTo(lx - this.cross, ly + this.cross);
        ctx.lineTo(lx + this.cross, ly - this.cross);
        ctx.stroke();
    };

    this.drawWinLine = function (coord) {
        let start = coord[0];
        let finish = coord[coord.length - 1];
        let ctx = this.context;
        let startX = start[0] * this.cellSize + this.cellSize / 2;
        let startY = start[1] * this.cellSize + this.cellSize / 2;
        let endX = finish[0] * this.cellSize + this.cellSize / 2;
        let endY = finish[1] * this.cellSize + this.cellSize / 2;
        ctx.beginPath();
        ctx.fillStyle = WIN_LINE_COLOR;
        ctx.strokeStyle = WIN_LINE_COLOR;
        ctx.lineWidth = 6;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    this.drawO = function (x, y) {
        let ctx = this.context;
        ctx.beginPath();
        let lx = x * this.cellSize + this.cellSize / 2;
        let ly = y * this.cellSize + this.cellSize / 2;
        ctx.fillStyle = BG_COLOR;
        ctx.strokeStyle = O_COLOR;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.arc(lx, ly, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    };

    this.initialize();
};