$(document).ready(function(){
  var grid = function(size) {
    for (var i=0; i < size; i++) {
      $('.grid').append("<div class='col" + i + "'></div>")
      for (var j=0; j < size; j++) {
        $(".col" + i).append("<span class='cell dead'></span>")
      }
    }
  }

  grid(20);

  $('.cell.dead').click(function(e) {
    $(this).addClass('alive');
    $(this).removeClass('dead');
  });

  var findNeibhours = function(col, row) {
    var rows = [row-1, row, row+1];
    var cols = [col-1, col, col+1];
    cells = [];

    for(var i=0; i < rows.length; i++) {
      for(var j=0; j < cols.length; j++) {
        if(!(col === cols[j] && row === rows[i])) {
          cells.push($('.col' + cols[j]).children()[rows[i]]);
        }
      }
    }

    return cells.filter(Boolean);
  }

  var Cells = function(cells) {
    this.cells = cells;

    this.aliveCells = function() {
      return this.cells.filter(function(cell) {
        return $(cell).hasClass('alive');
      });
    }
  }

  var cellsMovingToNextGen = []
  var cellsToKill = []

  var bringToLife = function(cell) {
    $(cell).removeClass('dead');
    $(cell).addClass('alive');
  }

  var kill = function(cell) {
    $(cell).removeClass('alive');
    $(cell).addClass('dead');
  }

  var startGame =function(){
    console.log('game started!');
    for(var j=0; j<20; j++){
      for(var i=0; i<20; i++) {
        var cell = $(".col" + i).children()[j];
        var aliveCells = new Cells(findNeibhours(i, j)).aliveCells().length;
        if($(cell).hasClass('alive') && (aliveCells < 2 || aliveCells > 3)) {
          //kill(cell)
          cellsToKill.push({col: i, row: j})
        } else if($(cell).hasClass('dead') && aliveCells === 3) {
          //bringToLife(cell)
          cellsMovingToNextGen.push({col: i, row: j})
        }
      }
    }
    $.each(cellsToKill, function(index, cell){
      kill($(".col" + cell.col).children()[cell.row])
    });
    $.each(cellsMovingToNextGen, function(index, cell){ bringToLife($(".col" + cell.col).children()[cell.row]) })
    cellsMovingToNextGen = []
    cellsToKill = []
  }

  $('.start-game').click(function(e) {
    setInterval(startGame, 500);
  });


  //$('.start-game').click(function(e) {
    //console.log('game started!');
    //for(var i=0; i<40; i++) {
      //$.each($(".col" + i).children(), function(row, cell) {
        //var aliveCells = new Cells(findNeibhours(i, row)).aliveCells().length;
        //if($(cell).hasClass('alive') && (aliveCells < 2 || aliveCells > 3)) {
          //kill(cell)
        //} else if($(cell).hasClass('dead') && aliveCells === 3) {
          //bringToLife(cell)
        //}
      //});
    //}
  //});
})();
