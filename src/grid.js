var Grid = function(content) {
  this.cells = {};
  this.rows = {};
  this.columns = {};
  this.boxes = {};
  this.content = content;
  this.numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  this.column_letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  this.cell_box_indexes = "111222333111222333111222333444555666444555666444555666777888999777888999777888999";
};

Grid.prototype.init = function() {
  this._buildCells();
  this._createGridFilters();
  this._buildGridFilters();
};

Grid.prototype.solve = function() {
  var _this = this;
  while (this._isSolved() === false) {
    for (var i in this.cells)
      _this.solveCell(i);
  }
};

Grid.prototype._isSolved = function() {
  var solved;
  var _this = this;
  for (var coord in this.cells)
    if(_this.cells[coord].value === null)
      solved = false;
  return solved;
};

Grid.prototype.printSolution = function() {
  var solution = "";
  var _this = this;
  for (var coord in this.cells)
    solution += _this.cells[coord].value;
  return solution;
};

Grid.prototype.solveCell = function(coord) {
  if (!this.cells[coord].value && this.findCellSolutions(coord).length === 1) 
    this.cells[coord].value = this.findCellSolutions(coord).pop();
};

Grid.prototype.findCellSolutions = function(coord) {
  var _this = this;
  var options = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var solutions = [];
  options.forEach(function(option) {
    if (!_this.isValuePossible(coord, option)) {
      solutions.push(option);
    }
  });
  return solutions;
};

Grid.prototype.isValuePossible = function(coord, value) {
  var _this = this;
    return (_this.checkFilterHasValue(_this.rows, coord.split("").pop(), value) ||
    _this.checkFilterHasValue(_this.columns, coord.split("").reverse().pop(), value) ||
    _this.checkFilterHasValue(_this.boxes, _this.cells[coord].box_zone, value) );
};

Grid.prototype.loadPuzzle = function(string) {
  var _this = this;
  var i = 0;
  for (var coord in this.cells) {
    if(string.split("")[i] === ".") {
      _this.cells[coord].value = null;
    } else {
      _this.cells[coord].value = string.split("")[i]; 
    }
    i++;
  }
};

Grid.prototype.isReady = function() {
  var _this = this;
  var ready_check = true;
  for (var coord in this.cells)
    if (_this.cells[coord].value === undefined) { ready_check = false; } 
  return ready_check;
};

Grid.prototype.checkFilterHasValue = function(filter_type, filter_no, value) {
  var filtered = filter_type[filter_no].filter(function(cell) {
    return cell.value === value;
  });
  return filtered.length === 1;
};

Grid.prototype._buildGridFilters = function() {
  this._buildFilter(this.numbers, this._isInBox, this.boxes); 
  this._buildFilter(this.numbers, this._isInRow, this.rows); 
  this._buildFilter(this.column_letters, this._isInColumn, this.columns); 
};

Grid.prototype._buildFilter = function(indexes, filter_check, filter) {
  var _this = this;
  indexes.forEach(function(index) {
    for (var coord in _this.cells)
      if(filter_check(coord, index, _this)) { filter[index].push(_this.cells[coord]); }
  });
};

Grid.prototype._isInBox = function(coord, index, that) {
  return that.cells[coord].box_zone === index;
};

Grid.prototype._isInRow = function(coord, index) {
  return coord.split("").pop() === index;
};

Grid.prototype._isInColumn = function(coord, index) {
  return coord.split("").reverse().pop() === index;
};

Grid.prototype._createGridFilters = function() {
  this._createFilter(this.numbers, this.boxes);
  this._createFilter(this.column_letters, this.columns);
  this._createFilter(this.numbers, this.rows);
};

Grid.prototype._createFilter = function(indexes, filter) {
  indexes.forEach(function(index) {
    filter[index] = [];
  });
};

Grid.prototype._buildCells = function() {
  var _this = this;
  var i = 0;
  _this.column_letters.forEach(function(l) { 
    _this.numbers.forEach(function(n) {
      _this.cells[l+n] = new _this.content(); 
      _this.cells[l+n].box_zone = _this.cell_box_indexes.split("")[i];
      i++;
    });
  });
};

module.exports = Grid;
