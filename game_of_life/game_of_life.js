// This is a JavaScript implementation of the Game of Life - 
// https://en.wikipedia.org/wiki/Conway's_Game_of_Life
// For the demo, please go to http://shreyas.io/demos/game_of_life/
(function () {
  var Controller = {
      populateWorld: function (rows, cols, config) {
        var initialWorld = [];
        for (var x = 0; x < rows; x++) {
          for (var y = 0; y < cols; y++) {
            if (!initialWorld[x]) {
              initialWorld[x] = [];
            }
            initialWorld[x][y] = new Cell(new Position(x, y), false);
          }
        }
        config.map(function (xy) {
          initialWorld[xy[0]][xy[1]].alive = true;
        });
        return initialWorld;
      },
      updateWorld: function (world) {
        var nextGenMap = [];
        var nextState;
        var aliveNeighboursCount;
        world.map(function (row) {
          row.map(function (cell) {
            aliveNeighboursCount = cell.aliveNeighboursCount(world);
            if (aliveNeighboursCount < 2 || aliveNeighboursCount > 3) {
              nextGenMap.push({
                x: cell.position.x,
                y: cell.position.y,
                nextState: false
              });
            }  // Dead cell comes to life amongst 3 alive neighbours
            else if (!cell.alive && aliveNeighboursCount === 3) {
              nextGenMap.push({
                x: cell.position.x,
                y: cell.position.y,
                nextState: true
              });
            }
          });
        });
        nextGenMap.map(function (val) {
          world[val.x][val.y].alive = val.nextState;
        });
        return world;
      }
    };
  function Cell(position, alive) {
    this.position = position;
    this.alive = alive && true;
  }
  Cell.prototype.aliveNeighboursCount = function (world) {
    var neighbors = this.position.neighbours(world.length, world[0].length);
    var count = 0;
    var position;
    for (var i = 0; i < neighbors.length; i++) {
      position = neighbors[i];
      if (world[position.x][position.y].alive) {
        count += 1;
      }
    }
    return count;
  };
  function Position(x, y) {
    this.x = x;
    this.y = y;
  }
  // The grid system used here is Cartesian.
  Position.prototype.neighbours = function (rowUpperBound, colUpperBound) {
    var x = this.x;
    var y = this.y;
    var neighborMap = [
        [
          x + 1,
          y
        ],
        [
          x,
          y + 1
        ],
        [
          x + 1,
          y + 1
        ],
        [
          x - 1,
          y + 1
        ],
        [
          x - 1,
          y
        ],
        [
          x,
          y - 1
        ],
        [
          x - 1,
          y - 1
        ],
        [
          x + 1,
          y - 1
        ]
      ];
    var neighbouringPositions = [];
    var withinBounds = function (x, y) {
      return x >= 0 && y >= 0 && x < rowUpperBound && y < colUpperBound;
    };
    for (var i = 0; i < neighborMap.length; i++) {
      if (withinBounds(neighborMap[i][0], neighborMap[i][1])) {
        neighbouringPositions.push(new Position(neighborMap[i][0], neighborMap[i][1]));
      }
    }
    return neighbouringPositions;
  };
  window.Controller = Controller;
  // Support for unsupported browsers.
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
      'use strict';
      var i, len;
      for (i = 0, len = this.length; i < len; ++i) {
        if (i in this) {
          fn.call(scope, this[i], i, this);
        }
      }
    };
  }
}.call(this));

// NG Setup
var app = angular.module('App', []);
angular.module('App').controller('MainCtrl', function($scope){
  var slider = [[4,3],[4,4],[4,5]];
  var glider = [[3,4],[4,4],[5,4],[5,3],[4,2]];
  var toad = [[4,4],[4,5],[4,6],[5,3],[5,4],[5,5]];

  $scope.cells = Controller.populateWorld(8,8,glider);
  $scope.toggleStatus = function(cell){
    cell.alive = !cell.alive;
  };
  $scope.runSimulation = function(){
    $scope.cells = Controller.updateWorld($scope.cells);
  };
});
