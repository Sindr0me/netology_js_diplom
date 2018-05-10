'use strict';

class Vector{
  constructor (x = 0, y = 0){
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

class Actor{
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
  
  isIntersect () {
    
  }
} 

class Level {
  
}

const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);

// const grid = [
//   new Array(3),
//   ['wall', 'wall', 'lava']
// ];
// const level = new Level(grid);
// runLevel(level, DOMDisplay);