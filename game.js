$(document).ready(function(){
  var Grid = function(size) {
    this.size = size;

    this.draw = function() {
      for (var i=0; i < size; i++) {
        $('.grid').append("<div class='col" + i + "'></div>")
        for (var j=0; j < size; j++) {
          $(".col" + i).append("<span class='cell dead'></span>")
        }
      }
    }
  }

  var Cell = function(row, col) {
    this.row = row;
    this.col = col;

    var cell = function() {
      return $($('.col' + col).children()[row]);
    }

    this.isAlive = function() {
      return cell().hasClass('alive');
    }

    this.isDead = function() {
      return cell().hasClass('dead');
    }

    this.isOnGrid = function() {
      return $('.col' + col).children()[row] !== undefined;
    }

    this.bringToLife = function() {
      cell().removeClass('dead');
      cell().addClass('alive');
    }

    this.kill = function() {
      cell().removeClass('alive');
      cell().addClass('dead');
    }

    this.neibhours = function() {
      var rows = [row-1, row, row+1];
      var cols = [col-1, col, col+1];
      neibhourCells = [];

      for(var i=0; i < rows.length; i++) {
        for(var j=0; j < cols.length; j++) {
          if(!(col === cols[j] && row === rows[i])) {
            var cell = new Cell(rows[i], cols[j])
            if(cell.isOnGrid()) {
              neibhourCells.push(cell);
            }
          }
        }
      }

      return neibhourCells;
    }
  }

  var Cells = function(cells) {
    this.cells = cells;

    this.aliveCells = function() {
      return this.cells.filter(function(cell) {
        return cell.isAlive();
      });
    }

    this.killAll = function() {
      $.each(cells, function(index, cell){
        cell.kill();
      });
    }

    this.bringAllToLife = function() {
      $.each(cells, function(index, cell){
        cell.bringToLife();
      });
    }
  }

  var cellsMovingToNextGen = []
  var cellsToKill = []

  var play =function(){
    for(var j=0; j < grid.size; j++){
      for(var i=0; i < grid.size; i++) {
        var cell = new Cell(j, i);
        var aliveCells = new Cells(cell.neibhours()).aliveCells().length;

        if(cell.isAlive() && (aliveCells < 2 || aliveCells > 3)) {
          cellsToKill.push(cell)
        } else if(cell.isDead() && aliveCells === 3) {
          cellsMovingToNextGen.push(cell)
        }
      }
    }

    new Cells(cellsToKill).killAll();
    new Cells(cellsMovingToNextGen).bringAllToLife();
    cellsMovingToNextGen = []
    cellsToKill = []
  }

  var grid = new Grid(40);
  grid.draw();

  $('.cell.dead').click(function(e) {
    $(this).addClass('alive');
    $(this).removeClass('dead');
  });

  $('.start-game').click(function(e) {
    setInterval(play, 200);
  });
})();
