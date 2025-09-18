/*
  Crossword Puzzle Generator
    By Matt Johnson (crosswordlabs.com)

  DISCLAIMER: I don't own this code and I am not affiliated with the original author in any way.
    They are the sole owner of this code, I should not take any credit for it. I am simply borrowing it
    for personal use and to share with others as a convenience.

    I highly incurage the usage and support of the original website https://crosswordlabs.com/
    This repository in which this code is hosted should only be considered as a convenience to those
    who want to tinker with the code, improve it and/or learn from it.
*/

function getSymbols(string) {
  try {
    string = string.normalize('NFC');
  } catch (e) {
    console.log('can\'t normalize')
  }
  var index = 0;
  var length = string.length;
  var output = [];
  for (; index < length; ++index) {
    var charCode = string.charCodeAt(index);
    if (charCode >= 55296 && charCode <= 56319) {
      charCode = string.charCodeAt(index + 1);
      if (charCode >= 56320 && charCode <= 57343) {
        output.push(string.slice(index, index + 2).toLowerCase());
        ++index;
        continue;
      }
    }
    output.push(string.charAt(index).toLowerCase());
  }
  return output;
}
Array.prototype.rotate = (
  function () {
    var unshift = Array.prototype.unshift,
    splice = Array.prototype.splice;
    return function (count) {
      var len = this.length >>> 0,
      count = count >> 0;
      unshift.apply(this, splice.call(this, count % len, len));
      return this;
    };
  }
) ();
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
var MersenneTwister = function (seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  }
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 2567483615;
  this.UPPER_MASK = 2147483648;
  this.LOWER_MASK = 2147483647;
  this.mt = new Array(this.N);
  this.mti = this.N + 1;
  this.init_genrand(seed);
}
MersenneTwister.prototype.init_genrand = function (s) {
  this.mt[0] = s >>> 0;
  for (this.mti = 1; this.mti < this.N; this.mti++) {
    var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
    this.mt[this.mti] = (
      ((((s & 4294901760) >>> 16) * 1812433253) << 16) + (s & 65535) * 1812433253
    )
    + this.mti;
    this.mt[this.mti] >>>= 0;
  }
}
MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
  var i,
  j,
  k;
  this.init_genrand(19650218);
  i = 1;
  j = 0;
  k = (this.N > key_length ? this.N : key_length);
  for (; k; k--) {
    var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
    this.mt[i] = (
      this.mt[i] ^ (
        ((((s & 4294901760) >>> 16) * 1664525) << 16) + ((s & 65535) * 1664525)
      )
    )
    + init_key[j] + j;
    this.mt[i] >>>= 0;
    i++;
    j++;
    if (i >= this.N) {
      this.mt[0] = this.mt[this.N - 1];
      i = 1;
    }
    if (j >= key_length) j = 0;
  }
  for (k = this.N - 1; k; k--) {
    var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
    this.mt[i] = (
      this.mt[i] ^ (
        ((((s & 4294901760) >>> 16) * 1566083941) << 16) + (s & 65535) * 1566083941
      )
    )
    - i;
    this.mt[i] >>>= 0;
    i++;
    if (i >= this.N) {
      this.mt[0] = this.mt[this.N - 1];
      i = 1;
    }
  }
  this.mt[0] = 2147483648;
}
MersenneTwister.prototype.genrand_int32 = function () {
  var y;
  var mag01 = new Array(0, this.MATRIX_A);
  if (this.mti >= this.N) {
    var kk;
    if (this.mti == this.N + 1)
    this.init_genrand(5489);
    for (kk = 0; kk < this.N - this.M; kk++) {
      y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
      this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 1];
    }
    for (; kk < this.N - 1; kk++) {
      y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
      this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 1];
    }
    y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
    this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 1];
    this.mti = 0;
  }
  y = this.mt[this.mti++];
  y ^= (y >>> 11);
  y ^= (y << 7) & 2636928640;
  y ^= (y << 15) & 4022730752;
  y ^= (y >>> 18);
  return y >>> 0;
}
MersenneTwister.prototype.genrand_int31 = function () {
  return (this.genrand_int32() >>> 1);
}
MersenneTwister.prototype.genrand_real1 = function () {
  return this.genrand_int32() * (1 / 4294967295);
}
MersenneTwister.prototype.random = function () {
  return this.genrand_int32() * (1 / 4294967296);
}
MersenneTwister.prototype.genrand_real3 = function () {
  return (this.genrand_int32() + 0.5) * (1 / 4294967296);
}
MersenneTwister.prototype.genrand_res53 = function () {
  var a = this.genrand_int32() >>> 5,
  b = this.genrand_int32() >>> 6;
  return (a * 67108864 + b) * (1 / 9007199254740992);
}
function shuffle(o, random) {
  if (!random) {
    random = Math.random
  }
  for (
    var j,
    x,
    i = o.length;
    i;
    j = Math.floor(random() * i),
    x = o[--i],
    o[i] = o[j],
    o[j] = x
  );
  return o;
}
function CrosswordCell(letter) {
  this.char = letter;
  this.across = null;
  this.down = null;
}
function CrosswordCellNode(is_start_of_word, index) {
  this.is_start_of_word = is_start_of_word;
  this.index = index;
}
function is_rtl(word) {
  return /[\u0591-\u07FF]/.test(word)
}
function WordElement(word, index) {
  this.word = word;
  this.index = index;
  this.symbols = getSymbols(word);
  this.rtl = null;
  if (is_rtl(word)) {
    var copy = this.symbols.slice()
    copy.reverse();
    this.rtl = copy;
  }
}
function Crossword(words_in, clues_in, seed) {
  var GRID_ROWS = 50;
  var GRID_COLS = 50;
  var char_index = {};
  var bad_words;
  var mt = new MersenneTwister(seed || 0)
  var random = function () {
    return mt.genrand_res53();
  }
  this.getSquareGrid = function (max_tries) {
    var best_grid = null;
    var best_ratio = 0;
    for (var i = 0; i < max_tries; i++) {
      var a_grid = this.getGrid(1);
      if (a_grid == null) continue;
      var ratio = Math.min(a_grid.length, a_grid[0].length) * 1 / Math.max(a_grid.length, a_grid[0].length);
      if (ratio > best_ratio) {
        best_grid = a_grid;
        best_ratio = ratio;
      }
      if (best_ratio == 1) break;
    }
    return best_grid;
  }
  this.getGridGreedy = function (max_tries) {
    var best_grid = null;
    var best_intersections = - 1;
    for (var i = 0; i < max_tries; i++) {
      var a_grid = this.getGrid(1);
      if (a_grid == null) {
        console.log('restarting')
        shuffle(word_elements, random);
        continue
      }
      var intersections = a_grid.intersections;
      if (intersections > best_intersections) {
        best_grid = a_grid;
        best_intersections = intersections;
      }
      return a_grid
    }
    return null;
  }
  this.getGridWithMaximizedIntersections = function (best_of, max_tries) {
    var best_grid = null;
    var best_intersections = - 1;
    var generated_count = 0;
    for (var i = 0; i < max_tries; i++) {
      shuffle(word_elements, random);
      var a_grid = this.getGrid(1);
      if (a_grid == null) continue;
      generated_count++;
      var intersections = a_grid.intersections;
      if (intersections > best_intersections) {
        best_grid = a_grid;
        best_intersections = intersections;
      }
      if (best_grid && generated_count == best_of) {
        return best_grid;
      }
    }
    return best_grid;
  }
  this.getGrid = function (max_tries) {
    for (var tries = 0; tries < max_tries; tries++) {
      clear();
      var start_dir = randomDirection();
      var r = Math.floor(grid.length / 2);
      var c = Math.floor(grid[0].length / 2);
      var word_element = word_elements[0];
      if (start_dir == 'across') {
        c -= Math.floor(word_element.symbols.length / 2);
      } else {
        r -= Math.floor(word_element.symbols.length / 2);
      }
      if (
        canPlaceWordAt(word_element.symbols, r, c, start_dir, word_element.rtl) !== false
      ) {
        placeWordAt(
          word_element.symbols,
          word_element.index,
          r,
          c,
          start_dir,
          word_element.rtl
        );
      } else {
        bad_words = [
          word_element
        ];
        return;
      }
      if (start_dir == 'across') {
        var r_max = r;
        var c_max = c + word_elements[0].symbols.length - 1;
      } else {
        var r_max = r + word_elements[0].symbols.length - 1;
        var c_max = c;
      }
      var r_min = r;
      var c_min = c;
      var intersections = 0;
      var groups = [];
      if (word_elements.length > 1) {
        groups.push(word_elements.slice(1));
      }
      var word_has_been_added_to_grid = true;
      for (var g = 0; g < groups.length; g++) {
        word_has_been_added_to_grid = false;
        for (var i = 0; i < groups[g].length; i++) {
          var word_element = groups[g][i];
          var best_position = findBestPositionForWord(word_element.symbols, word_element.rtl);
          if (!best_position) {
            if (groups.length - 1 == g) groups.push([]);
            groups[g + 1].push(word_element);
          } else {
            intersections += best_position.intersections;
            var r = best_position['row'],
            c = best_position['col'],
            dir = best_position['direction'];
            placeWordAt(
              word_element.symbols,
              word_element.index,
              r,
              c,
              dir,
              word_element.rtl
            );
            word_has_been_added_to_grid = true;
            if (dir == 'across') {
              if (r > r_max) r_max = r;
              if (c + word_element.symbols.length > c_max) c_max = c + word_element.symbols.length - 1;
            } else {
              if (r + word_element.symbols.length > r_max) r_max = r + word_element.symbols.length - 1;
              if (c > c_max) c_max = c;
            }
            if (r < r_min) r_min = r;
            if (c < c_min) c_min = c;
          }
        }
        if (!word_has_been_added_to_grid) break;
      }
      if (word_has_been_added_to_grid) {
        var g = minimizeGrid(r_min, r_max, c_min, c_max);
        g.intersections = intersections;
        return g;
      }
    }
    bad_words = groups[groups.length - 1];
    return null;
  }
  this.getBadWords = function () {
    return bad_words;
  }
  this.getLegend = function (grid) {
    var groups = {
      'across': [],
      'down': []
    };
    var position = 1;
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        var cell = grid[r][c];
        var increment_position = false;
        for (var k in groups) {
          if (cell && cell[k] && cell[k]['is_start_of_word']) {
            var index = cell[k]['index'];
            groups[k].push({
              'position': position,
              'index': index,
              'clue': clues_in[index],
              'word': words_in[index],
              'row': r,
              'col': c,
              'rtl': k == 'across' &&
              !!word_elements[index].rtl,
            });
            increment_position = true;
          }
        }
        if (increment_position) position++;
      }
    }
    return groups;
  }
  var minimizeGrid = function (r_min, r_max, c_min, c_max) {
    var rows = r_max - r_min + 1;
    var cols = c_max - c_min + 1;
    var new_grid = new Array(rows);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        new_grid[r] = new Array(cols);
      }
    }
    for (var r = r_min, r2 = 0; r2 < rows; r++, r2++) {
      for (var c = c_min, c2 = 0; c2 < cols; c++, c2++) {
        new_grid[r2][c2] = grid[r][c];
      }
    }
    return new_grid;
  }
  var addCellToGrid = function (
    word,
    index_of_word_in_input_list,
    index_of_char,
    r,
    c,
    direction,
    rtl
  ) {
    var char = word[index_of_char];
    if (grid[r][c] == null) {
      grid[r][c] = new CrosswordCell(char);
      if (!char_index[char]) char_index[char] = [];
      char_index[char].push({
        'row': r,
        'col': c
      });
    }
    var is_start_of_word = rtl ? (index_of_char == word.length - 1) : index_of_char == 0;
    grid[r][c][direction] = new CrosswordCellNode(is_start_of_word, index_of_word_in_input_list);
  }
  var placeWordAt = function (word, index_of_word_in_input_list, row, col, direction, rtl) {
    if (direction == 'across') {
      word = rtl ||
      word
      for (var c = col, i = 0; c < col + word.length; c++, i++) {
        addCellToGrid(word, index_of_word_in_input_list, i, row, c, direction, rtl);
      }
    } else if (direction == 'down') {
      for (var r = row, i = 0; r < row + word.length; r++, i++) {
        addCellToGrid(word, index_of_word_in_input_list, i, r, col, direction);
      }
    } else {
      throw 'Invalid Direction';
    }
  }
  var canPlaceCharAt = function (char, row, col, word_intersections) {
    if (grid[row][col] == null) return 0;
    if (grid[row][col]['char'] == char) {
      var across_word_index = grid[row][col]['across'] ? grid[row][col]['across']['index'] : null;
      var down_word_index = grid[row][col]['down'] ? grid[row][col]['down']['index'] : null;
      if (
        across_word_index !== null &&
        across_word_index in word_intersections
      ) {
        return false;
      }
      if (down_word_index !== null && down_word_index in word_intersections) {
        return false;
      }
      word_intersections[across_word_index] = true;
      word_intersections[down_word_index] = true;
      return 1;
    }
    return false;
  }
  var canPlaceWordAt = function (word, row, col, direction, rtl) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) return false;
    var word_intersections = {}
    if (direction == 'across') {
      word = rtl ||
      word
      if (col + word.length > grid[row].length) return false;
      if (col - 1 >= 0 && grid[row][col - 1] != null) return false;
      if (
        col + word.length < grid[row].length &&
        grid[row][col + word.length] != null
      ) return false;
      for (var r = row - 1, c = col, i = 0; r >= 0 && c < col + word.length; c++, i++) {
        var is_empty = grid[r][c] == null;
        var is_intersection = grid[row][c] != null &&
        grid[row][c]['char'] == word[i];
        var can_place_here = is_empty ||
        is_intersection;
        if (!can_place_here) return false;
      }
      for (
        var r = row + 1,
        c = col,
        i = 0;
        r < grid.length &&
        c < col + word.length;
        c++,
        i++
      ) {
        var is_empty = grid[r][c] == null;
        var is_intersection = grid[row][c] != null &&
        grid[row][c]['char'] == word[i];
        var can_place_here = is_empty ||
        is_intersection;
        if (!can_place_here) return false;
      }
      var intersections = 0;
      for (var c = col, i = 0; c < col + word.length; c++, i++) {
        var result = canPlaceCharAt(word[i], row, c, word_intersections);
        if (result === false) return false;
        intersections += result;
      }
    } else if (direction == 'down') {
      if (row + word.length > grid.length) return false;
      if (row - 1 >= 0 && grid[row - 1][col] != null) return false;
      if (
        row + word.length < grid.length &&
        grid[row + word.length][col] != null
      ) return false;
      for (var c = col - 1, r = row, i = 0; c >= 0 && r < row + word.length; r++, i++) {
        var is_empty = grid[r][c] == null;
        var is_intersection = grid[r][col] != null &&
        grid[r][col]['char'] == word[i];
        var can_place_here = is_empty ||
        is_intersection;
        if (!can_place_here) return false;
      }
      for (
        var c = col + 1,
        r = row,
        i = 0;
        r < row + word.length &&
        c < grid[r].length;
        r++,
        i++
      ) {
        var is_empty = grid[r][c] == null;
        var is_intersection = grid[r][col] != null &&
        grid[r][col]['char'] == word[i];
        var can_place_here = is_empty ||
        is_intersection;
        if (!can_place_here) return false;
      }
      var intersections = 0;
      for (var r = row, i = 0; r < row + word.length; r++, i++) {
        var result = canPlaceCharAt(word[i], r, col, word_intersections);
        if (result === false) return false;
        intersections += result;
      }
    } else {
      throw 'Invalid Direction';
    }
    return intersections == word.length ? false : intersections;
  }
  var randomDirection = function () {
    return Math.floor(random() * 2) ? 'across' : 'down';
  }
  var findBestPositionForWord = function (word, rtl) {
    var bests = [];
    for (var i = 0; i < word.length; i++) {
      var possible_locations_on_grid = char_index[word[i]];
      if (!possible_locations_on_grid) continue;
      for (var j = 0; j < possible_locations_on_grid.length; j++) {
        var point = possible_locations_on_grid[j];
        var r = point['row'];
        var c = point['col'];
        var spot = rtl ? (c - (word.length - 1 - i)) : c - i
        var intersections_across = canPlaceWordAt(word, r, spot, 'across', rtl);
        var intersections_down = canPlaceWordAt(word, r - i, c, 'down');
        if (intersections_across !== false) {
          bests.push({
            'intersections': intersections_across,
            'row': r,
            'col': spot,
            'direction': 'across'
          });
        }
        if (intersections_down !== false) {
          bests.push({
            'intersections': intersections_down,
            'row': r - i,
            'col': c,
            'direction': 'down'
          });
        }
      }
    }
    if (bests.length == 0) return false;
    shuffle(bests, random);
    var best = bests[0];
    return best;
  }
  var clear = function () {
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        grid[r][c] = null;
      }
    }
    char_index = {};
  }
  if (words_in.length != clues_in.length) throw 'The number of words must equal the number of clues';
  var grid = new Array(GRID_ROWS);
  for (var i = 0; i < GRID_ROWS; i++) {
    grid[i] = new Array(GRID_COLS);
  }
  var word_elements = [];
  for (var i = 0; i < words_in.length; i++) {
    word_elements.push(new WordElement(words_in[i], i));
  }
}
var CrosswordUtils = {
  PATH_TO_PNGS_OF_NUMBERS: 'numbers/',
  toHtml: function (grid, show_answers) {
    if (grid == null) return;
    var html = [];
    html.push('<table class=\'crossword\'>');
    var label = 1;
    for (var r = 0; r < grid.length; r++) {
      html.push('<tr>');
      for (var c = 0; c < grid[r].length; c++) {
        var cell = grid[r][c];
        var is_start_of_word = false;
        if (cell == null) {
          var char = '&nbsp;';
          var css_class = 'no-border';
        } else {
          var char = cell['char'];
          var css_class = '';
          var is_start_of_word = (cell['across'] && cell['across']['is_start_of_word']) ||
          (cell['down'] && cell['down']['is_start_of_word']);
        }
        if (is_start_of_word) {
          var img_url = CrosswordUtils.PATH_TO_PNGS_OF_NUMBERS + label + '.png';
          html.push(
            '<td class=\'' + css_class + '\' title=\'' + r + ', ' + c + '\' style="background-image:url(\'' + img_url + '\')">'
          );
          label++;
        } else {
          html.push('<td class=\'' + css_class + '\' title=\'' + r + ', ' + c + '\'>');
        }
        if (show_answers) {
          html.push(char);
        } else {
          html.push('&nbsp;');
        }
      }
      html.push('</tr>');
    }
    html.push('</table>');
    return html.join('\n');
  },
  get_cell: function (grid, r, c) {
    try {
      return grid[r][c]
    } catch (e) {
      return null;
    }
  },
  toSvg: function (grid, show_answers) {
    if (grid == null) return;
    var size = 30;
    var stroke_width = 1;
    var height = grid.length;
    var width = grid[0].length;
    var total_height = height * size * stroke_width * 1.5;
    var total_width = width * size + stroke_width * 1.5;
    var view_box = [
      - stroke_width / 2,
      - stroke_width / 2,
      width * size + stroke_width,
      height * size + stroke_width
    ].join(' ')
    var html = [];
    html.push(
      '<svg viewBox="' + view_box + '" style="width:100%; max-height:' + total_height + 'px; max-width:' + total_width + 'px" xmlns="http://www.w3.org/2000/svg">'
    )
    html.push(
      '<style> g rect { height:' + size + 'px; width:' + size + 'px; fill:rgb(255,255,255); stroke-width:' + stroke_width + '; stroke:rgb(0,0,0); } .cx-c { font-size:12px; font-family:monospace; pointer-events:none; font-weight:bold; } .cx-a { font-size:22px; font-family:monospace; text-anchor:middle; pointer-events:none; } </style>'
    )
    var label = 1;
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        var cell = grid[r][c];
        if (cell == null) {
          north = CrosswordUtils.get_cell(grid, r - 1, c)
          west = CrosswordUtils.get_cell(grid, r, c - 1)
          south = CrosswordUtils.get_cell(grid, r + 1, c)
          east = CrosswordUtils.get_cell(grid, r, c + 1)
          all_ = north &&
          south &&
          east &&
          west
          if (all_) {
            html.push(
              '<rect x="' + (c * size) + '" y="' + (r * size) + '" width="' + (size) + '" height="' + (size) + '" fill="#000000" />'
            );
          }
          continue
        }
        var char = cell['char'];
        var is_start_of_word = (cell['across'] && cell['across']['is_start_of_word']) ||
        (cell['down'] && cell['down']['is_start_of_word']);
        html.push('<g id="cx-' + r + '-' + c + '">')
        html.push(
          '<rect x="' + (c * size) + '" y="' + (r * size) + '" width="' + size + '" height="' + size + '" />'
        )
        if (is_start_of_word) {
          html.push(
            '<text class="cx-c" x="' + (c * size + 2) + '" y="' + (r * size + 12 / 2 + 4) + '">' + label + '</text>'
          )
          label += 1
        }
        html.push(
          '<text class="cx-a" x="' + (c * size + size / 2) + '" y="' + (r * size + size / 2 + 6) + '">' + (show_answers ? escapeHtml(char) : '') + '</text>'
        )
        html.push('</g>');
      }
    }
    html.push('</svg>');
    return html.join('\n');
  }
};
