'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {     // Принимает один аргумент — вектор, объект Vector.
    if (!(vector instanceof Vector)) {
      throw new Error(`В метод plus передан не вектор`);
    }
    const addX = this.x + vector.x;
    const addY = this.y + vector.y;
    return new Vector(addX, addY); //Создает и возвращает новый объект типа Vector, с новыми координатами
  }

  times(factor) {
    const addX = this.x * factor;
    const addY = this.y * factor;
    return new Vector(addX, addY); //Создает и возвращает новый объект типа Vector, с новыми координатами
  }
}

class Actor {
  constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (!(position instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
      throw new Error(`В конструктор класса Actor передан не вектор`);
    }
    this.pos = position;
    this.size = size;
    this.speed = speed;
  }

  act() {
  }

  get type() {
    return 'actor';
  }

  get left() {//границы объекта по X
    return this.pos.x;
  }

  get right() {//границы объекта по X + размер
    return this.pos.x + this.size.x;
  }

  get top() { //границы объекта по Y
    return this.pos.y;
  }

  get bottom() { //границы объекта по Y + размер
    return this.pos.y + this.size.y
  }

  isIntersect(otherActor) { //Метод проверяет, пересекается ли текущий объект с переданным объектом.
    if (!(otherActor instanceof Actor)) {
      throw new Error(`В метод isIntersect не передан движущийся объект типа Actor`);
    }
    if (this === otherActor) { // если равен самому себе
      return false;
    }
    //проверяем, пересекается ли текущий объект с переданным объектом https://habr.com/post/128438/
    return this.right > otherActor.left &&
      this.left < otherActor.right &&
      this.top < otherActor.bottom &&
      this.bottom > otherActor.top;
  }
}

class Level {
  constructor(grid = [], actors = []) { //grid[] - сетка игрового поля, actors- список движущихся объектов игрового поля
    this.actors = actors.slice();
    this.grid = grid.slice();  //копия массива
    this.height = this.grid.length; // высота = длине массива
    this.width = this.grid.reduce((rez, item) => {
      if (rez > item.length) {
        return rez;
      } else {
        return item.length;
      }
    }, 0);
    this.status = null; // состояние прохождения уровня
    this.finishDelay = 1; //таймаут после окончания игры,
    this.player = this.actors.find(actor => actor.type === 'player');
  }

  isFinished() { //Определяет, завершен ли уровень
    return this.status !== null && this.finishDelay < 0;
  }

  actorAt(actor) { //Определяет, расположен ли какой-то другой движущийся объект в переданной позиции
    if (!(actor instanceof Actor)) {
      throw new Error(`В метод actorAt не передан движущийся объект типа Actor`);
    }
    return this.actors.find(actorEl => actorEl.isIntersect(actor));
  }

  obstacleAt(position, size) { //определяет, нет ли препятствия в указанном месте.
    if (!(position instanceof Vector) ||
      !(size instanceof Vector)) {
      throw new Error(`В метод obstacleAt передан не вектор`);
    }

    const borderLeft = Math.floor(position.x);
    const borderRight = Math.ceil(position.x + size.x);
    const borderTop = Math.floor(position.y);
    const borderBottom = Math.ceil(position.y + size.y);

    //Если описанная двумя векторами область выходит за пределы игрового поля, 
    //то метод вернет строку lava, если область выступает снизу. 
    //И вернет wall в остальных случаях. Будем считать, что игровое поле слева, 
    //сверху и справа огорожено стеной и снизу у него смертельная лава.

    if (borderLeft < 0 || borderRight > this.width || borderTop < 0) {
      return 'wall';
    }
    if (borderBottom > this.height) {
      return 'lava';
    }

    for (let y = borderTop; y < borderBottom; y++) {
      for (let x = borderLeft; x < borderRight; x++) {
        const gridLevel = this.grid[y][x];
        if (gridLevel) {
          return gridLevel;
        }
      }
    }
  }

  removeActor(actor) { // удаляет переданный объект с игрового поля
    const actorIndex = this.actors.indexOf(actor); //возвращает индекс объекта
    if (actorIndex !== -1) {
      this.actors.splice(actorIndex, 1); //удаляем один элемент с найденного индекса.
    }
  }

  noMoreActors(type) { //Определяет, остались ли еще объекты переданного типа на игровом поле
    return !this.actors.some((actor) => actor.type === type)
  }

  //playerTouched - Меняет состояние игрового поля при касании игроком каких-либо объектов или препятствий.
  playerTouched(touchedType, actor) {//Тип препятствия или объекта, движущийся объект  
    if (this.status !== null) {
      return;
    }
    if (['lava', 'fireball'].some((el) => el === touchedType)) { //если коснулись lava или fireball
      return this.status = 'lost'; // проиграли
    }
    if (touchedType === 'coin' && actor.type === 'coin') { //если коснулись монеты
      this.removeActor(actor); //удаляем ее
      if (this.noMoreActors('coin')) { //если монет больше нет
        return this.status = 'won' // выиграли
      }
    }
  }
}

class Player extends Actor {
  constructor(pos = new Vector(0, 0)) {
    super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
  }

  get type() {
    return 'player';
  }
}

// -------------start game-------------
const grid = [
  new Array(3),
  ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);

