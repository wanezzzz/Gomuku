// jshint esversion: 6

let Model = function (width, height, AILevel, firstMove) {
    /**
     * 0 - пустая клетка
     * 1 - крестик
     * 2 - нолик
     */

    this.matrix = [];
    this.width = width;
    this.height = height;
    this.AILevel = AILevel;
    this.playing = false;
    // длина победы - 1
    this.row = 4;
    this.firstMove = firstMove;
    this.getFirstPlayer = function () {
        return this.firstMove;
    }

    //работаю
    //hardAI
    this.x;
    this.y;
    this.firstStepAI = true;
    this.who; // Логическая переменная - кто сейчас ходит: true - X, false - O
    this.hashStep; // Хеш-массив потенциальных ходов
    this.prePattern = [ // Шаблоны построения фигрур и их веса. Х в дальнейшем заменяется на крестик (1) или нолик (0), 0 - свободная ячейка
        {
            s: 'xxxxx',
            w: 99999
      }, // пять в ряд (финальная выигрышная линия)
        {
            s: '0xxxx0',
            w: 7000
      }, // Открытая четверка
        {
            s: '0xxxx',
            w: 4000
      }, // Закрытая четверка
        {
            s: 'xxxx0',
            w: 4000
      }, {
            s: '0x0xxx',
            w: 2000
      }, {
            s: '0xx0xx',
            w: 2000
      }, {
            s: '0xxx0x',
            w: 2000
      }, {
            s: 'xxx0x0',
            w: 2000
      }, {
            s: 'xx0xx0',
            w: 2000
      }, {
            s: 'x0xxx0',
            w: 2000
      }, {
            s: '0xxx0',
            w: 3000
      }, {
            s: '0xxx',
            w: 1500
      }, {
            s: 'xxx0',
            w: 1500
      }, {
            s: '0xx0x',
            w: 800
      }, {
            s: '0x0xx',
            w: 800
      }, {
            s: 'xx0x0',
            w: 800
      }, {
            s: 'x0xx0',
            w: 800
      }, {
            s: '0xx0',
            w: 200
      }
   ];
    this.pattern = [
      [],
      [],
      []
   ]; // Массив шаблонов для Х и 0, генерируется из предыдущих шаблонов
    this.patternWin = [0, /(1){5}/, /(2){5}/, /[01]*7[01]*/, /[02]*7[02]*/]; // Массив выигрышных шаблонов [1] и [2] и шаблон определения возможности поставить 5 в ряд
    this.directions = []; // Направления расчета потенциальных ходов
    this.size = 15; // Размер поля (15х15 ячеек)


    this.initialize = function () {
        // пустая доска
        for (let i = 0; i < this.width; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.matrix[i][j] = 0;
            }
        }
        if (firstMove == 0) {
            this.userSymbol = 1;
            this.AISymbol = 2;
        } else {
            this.userSymbol = 2;
            this.AISymbol = 1;
        }

        //hardAI
        this.startHardAI(); // заполняем массив с весом ходов и их комбинацией + будущие ходы
    };

    //hardAI
    this.startHardAI = function () {
        var s;
        var a;
        var l;
        var target = 'x';
        var pos;
        for (var i in this.prePattern) // Заполнение массива шаблонов построений фигур для крестиков (1) и ноликов (2)
        {
            s = this.prePattern[i].s;
            pos = -1;
            a = [];
            while ((pos = s.indexOf(target, pos + 1)) !== -1) {
                a[a.length] = s.substr(0, pos) + '7' + s.substr(pos + 1);
            }
            s = a.join('|');

            l = this.pattern[0].length;
            this.pattern[0][l] = this.prePattern[i].w; // Веса шаблонов
            this.pattern[1][l] = new RegExp(s.replace(/x/g, '1')); // Шаблоны для Х, например 01110 - открытая четверка
            this.pattern[2][l] = new RegExp(s.replace(/x/g, '2')); // Аналогично для 0 - 022220

        }
        for (var n = -2; n <= 2; n++) // Заполнение массива потенциальных ходов (в радиусе 2 клеток)
        { // и установка минимальных весов (используются для расчета первых ходов, пока не появятся шаблоны)
            for (var m = -2; m <= 2; m++) {
                if (n === 0 && m === 0)
                    continue;
                if (Math.abs(n) <= 1 && Math.abs(m) <= 1)
                    this.directions.push({
                        n: n,
                        m: m,
                        w: 3
                    });
                else if (Math.abs(n) === Math.abs(m) || n * m === 0)
                    this.directions.push({
                        n: n,
                        m: m,
                        w: 2
                    });
                else
                    this.directions.push({
                        n: n,
                        m: m,
                        w: 1
                    });
            }
        }
        this.who = true;
        this.winLine = [];
        this.hashStep = {
            7: {
                7: {
                    sum: 0,
                    attack: 1,
                    defence: 0,
                    attackPattern: 0,
                    defencePattern: 0
                }
            }
        }; // первый шаг, если АИ играет за Х
    };

    this.userMove = function (x, y) {
        if (this.isEmpty(x, y)) {
            this.matrix[x][y] = this.userSymbol;

            //hardAI
            this.who = !this.who; // Переход хода от Х к О, от О к Х
            this.x = y; //оси нарушены
            this.y = x;

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
                result = this.highLevelAIMove();
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
            this.matrix[x][y] = this.AISymbol;
            return [x, y];
        } else {
            return this.AIMove();
        }
    };

    this.isWin = function (x, y) {
        let fromHoriz = x - this.row >= 0 ? x - this.row : 0;
        let fromVert = y - this.row >= 0 ? y - this.row : 0;
        let toVert = y + this.row < this.height ? y + this.row : this.height - 1;
        let toHoriz = x + this.row < this.width ? x + this.row : this.width - 1;
        let inRow = 0;
        let player = this.matrix[x][y];
        let line = [];
        let j;

        //вертикаль
        for (let i = fromVert; i <= toVert; i++) {
            if (this.matrix[x][i] == player) {
                inRow++;
                line.push([x, i]);
                if (inRow == 5) {
                    return {
                        player: player,
                        line: line
                    };
                }
            } else {
                line = [];
                inRow = 0;

            }
        }
        line = [];
        inRow = 0;
        //горизонталь   
        for (let i = fromHoriz; i <= toHoriz; i++) {
            if (this.matrix[i][y] == player) {
                inRow++;
                line.push([i, y]);
                if (inRow == 5) {
                    return {
                        player: player,
                        line: line
                    };
                }
            } else {
                line = [];
                inRow = 0;
            }
        }
        line = [];
        inRow = 0;
        //диагональ юго-запад
        j = toHoriz;
        for (let i = fromVert; i <= toVert; i++) {
            if (this.matrix[j][i] == player) {
                inRow++;
                line.push([j, i]);
                if (inRow == 5) {
                    return {
                        player: player,
                        line: line
                    };
                }
            } else {
                line = [];
                inRow = 0;
            }
            j--;
            if (j < 0) {
                break;
            }
        }
        line = [];
        inRow = 0;
        //диагональ юго-восток
        j = fromVert;
        for (let i = fromHoriz; i <= toHoriz; i++) {
            if (this.matrix[i][j] == player) {
                inRow++;
                line.push([i, j]);
                if (inRow == 5) {
                    return {
                        player: player,
                        line: line
                    };
                }
            } else {
                line = [];
                inRow = 0;
            }
            j++;
        }
        line = [];
        inRow = 0;

        return false;
    };

    // Средний AI 
    this.mediumLevelAIMove = function () {
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                if (this.isEmpty(i, j)) {
                    this.matrix[i][j] = this.AISymbol;
                    return [i, j];
                }

            }
        }

    };


    // Сложный AI
    this.highLevelAIMove = function () {
        if (firstMove) {
            if (this.firstStepAI) {
                this.firstStepAI = false;
                this.moveAI();
            } else {
                // this.calculateHashMove(false);
                this.move(this.x, this.y, false);
                this.moveAI();
            }
        } else {
            this.move(this.x, this.y, false);
            this.moveAI();
        }

        if (this.isEmpty(this.x, this.y)) {
            this.matrix[this.x][this.y] = this.AISymbol;
            return [this.x, this.y];
        } else {
            return this.AIMove();
        }
    };
    //hardAI
    this.moveAI = function () { // Ход АИ
        //this.playing = false;
        var n, m;
        var max = 0;
        this.calculateHashMovePattern(); // Расчет весов по заданным шаблонам ходов
        for (n in this.hashStep) // Поиск веса лучшего хода
            for (m in this.hashStep[n])
                if (this.hashStep[n][m].sum > max)
                    max = this.hashStep[n][m].sum;
        var goodmoves = [];
        for (n in this.hashStep) // Поиск лучших ходов (если их несколько)
            for (m in this.hashStep[n])
                if (this.hashStep[n][m].sum === max) {
                    goodmoves[goodmoves.length] = {
                        n: parseInt(n),
                        m: parseInt(m)
                    };
                }
        var movenow = goodmoves[this.getRandomInt(0, goodmoves.length - 1)]; // Выбор хода случайным образом, если несколько ходов на выбор
        this.n = movenow.n;
        this.m = movenow.m;
        return this.move(this.n, this.m, true);
    };
    //hardAI
    this.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    //hardAI
    this.move = function (n, m, aiStep) { // Ход (АИ или пользователя)
        if (this.hashStep[n] && this.hashStep[n][m])
            delete this.hashStep[n][m]; // Если поле хода было в массиве потенциальных ходов, то поле удаляется из него
        //this.who = !this.who; // Переход хода от Х к О, от О к Х
        this.n = m; //костыль исправить позже
        this.m = n;
        if (this.playing)
            this.calculateHashMove(aiStep); // Рассчитываем веса потенциальных ходов (без шаблонов)
        console.log(++this.step + ': ' + n + ', ' + m);
        //return [n, m];
        this.x = n;
        this.y = m;
    };
    //hardAI
    this.calculateHashMove = function (attack) { // Расчет весов потенциальных ходов (без шаблонов), просто по количеству Х и О рядом (акуально в начале игры)
        for (var key in this.directions) {
            var n = this.n + this.directions[key].n;
            var m = this.m + this.directions[key].m;
            if (n < 0 || m < 0 || n >= this.size || m >= this.size)
                continue;
            if (this.matrix[n][m] !== 0)
                continue;
            if (!(n in this.hashStep))
                this.hashStep[n] = {};
            if (!(m in this.hashStep[n]))
                this.hashStep[n][m] = {
                    sum: 0,
                    attack: 0,
                    defence: 0,
                    attackPattern: 0,
                    defencePattern: 0
                };
            if (attack)
                this.hashStep[n][m].attack += this.directions[key].w;
            else
                this.hashStep[n][m].defence += this.directions[key].w;
        }
    };
    //hardAI
    this.calculateHashMovePattern = function () { // Расчет весов потенциальных ходов по заданным шаблонам
        var s;
        var k = 0;
        //var attack = 2 - this.who;
        //var defence = 2 - !this.who;
        var attack = 1;
        var defence = 2;
        var res;
        for (n in this.hashStep)
            for (m in this.hashStep[n]) // Перебор всех потенциальных ходов (*1)
        {
            this.hashStep[n][m].sum = this.hashStep[n][m].attack + this.hashStep[n][m].defence;
            this.hashStep[n][m].attackPattern = 0; // Обнуляем значение атаки по шаблону
            this.hashStep[n][m].defencePattern = 0; // Обнуляем значение защиты по шаблону
            n = parseInt(n);
            m = parseInt(m);
            for (var q = 1; q <= 2; q++) // Первым проходом расчитываем веса атаки, вторым - веса защиты
                for (var j = 1; j <= 4; j++) {
                    s = '';
                    for (var i = -4; i <= 4; i++) // Циклы перебора в радиусе 4 клеток от рассматриваемого хода (выбраннного в *1)
                        switch (j) { // Создание строк с текущим состоянием клеток по 4 направлениям, такого вида 000172222
                            case 1: // где 7 - это рассматриваемый ход, 0 - свободная ячейка, 1 - крестик, 2 - нолик
                                if (n + i >= 0 && n + i < this.size)
                                    s += (i === 0) ? '7' : this.matrix[n + i][m];
                                break;
                            case 2:
                                if (m + i >= 0 && m + i < this.size)
                                    s += (i === 0) ? '7' : this.matrix[n][m + i];
                                break;
                            case 3:
                                if (n + i >= 0 && n + i < this.size)
                                    if (m + i >= 0 && m + i < this.size)
                                        s += (i === 0) ? '7' : this.matrix[n + i][m + i];
                                break;
                            case 4:
                                if (n - i >= 0 && n - i < this.size)
                                    if (m + i >= 0 && m + i < this.size)
                                        s += (i === 0) ? '7' : this.matrix[n - i][m + i];
                                break;
                        }
                    res = (q === 1) ? this.patternWin[2 + attack].exec(s) : this.patternWin[2 + defence].exec(s);
                    if (res === null)
                        continue;
                    if (res[0].length < 5) // Если длина возможной линии <5, то построить 5 не удастся в принципе и расчет можно не производить
                        continue; // например, при восходящей диагонали для ячейки (0, 0) или (0, 1) или если с 2х сторон зажал соперник
                    if (q === 1) // для крестиков, если играем крестиками и наоборот. Формируем вес атаки на этом поле
                        for (var i in this.pattern[attack]) { // перебор по всем шаблонам
                            if (this.pattern[attack][i].test(s)) // если нашли соответствие
                                this.hashStep[n][m].attackPattern += this.pattern[0][i]; // увеличиваем значимость клетки на вес шаблона
                        }
                    else // для ноликов если играем крестиками
                        for (var i in this.pattern[defence])
                            if (this.pattern[defence][i].test(s))
                                this.hashStep[n][m].defencePattern += this.pattern[0][i];
                }
            this.hashStep[n][m].sum += 1.1 * this.hashStep[n][m].attackPattern + this.hashStep[n][m].defencePattern; // Атака на 10% важнее защиты
            k++;
        }
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
