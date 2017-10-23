const Cell = require('../../cell.js');
const Tree = require('./tree.js');

class GenerateKruskal {

  constructor(maze) {

    this.N = "N";
    this.S = "S";
    this.E = "E";
    this.W = "W";
    this.DX = {
      "E": maze.len,
      "W": -maze.len,
      "N": 0,
      "S": 0,
    }
    this.DY = {
      "S": maze.len,
      "N": -maze.len,
      "W": 0,
      "E": 0,
    }
    this.OPPOSITE = {
      "S": "N",
      "N": "S",
      "W": "E",
      "E": "W",
    }

    this.maze = maze;
    this.edges = [];
    this.createGridAndSet();
    this.createEdges();
    this.algorithm();
  }

  createGridAndSet() {
    const maze = this.maze;
    this.grid = [];
    this.sets = [];
    for (let y=0; y < maze.w / maze.len; y++) {
      this.grid[y] = [];
      this.sets[y] = [];
      for (let x=0; x < maze.h / maze.len; x++) {
        this.grid[y].push(new Cell(x * maze.len, y * maze.len, maze.len));
        this.sets[y].push(new Tree());
      }
    }
  }

  createEdges() {
    const maze = this.maze;
    for (let y=0; y < maze.w / maze.len; y++) {
      for (let x=0; x < maze.h / maze.len; x++) {
        if (y > 0) {
          this.edges.push([x * maze.len, y * maze.len, this.N]);
        }
        if (x > 0) {
          this.edges.push([x * maze.len, y * maze.len, this.W]);
        }
      }
    }
    this.edges.sort((a, b) => 0.5 - Math.random());
  }

  algorithm() {
    if (this.edges.length > 0) {
      let poppedEdge = this.edges.pop();
      let x = poppedEdge[0];
      let y = poppedEdge[1];
      let dir = poppedEdge[2];

      let nx = x + this.DX[dir];
      let ny = y + this.DY[dir];

      let l = this.maze.len;
      let set1 = this.sets[y / l][x / l];
      let set2 = this.sets[ny / l][nx / l];
      if (!set1.connected(set2)) {

        set1.connect(set2);

        if (dir === "N") {
          this.grid[y/ l][x/ l].walls[0] = false;
          this.grid[ny/ l][nx/ l].walls[2] = false;
        } else if (dir === "S") {
          this.grid[y / l][x/ l].walls[2] = false;
          this.grid[ny / l][nx/ l].walls[0] = false;
        } else if (dir === "E") {
          this.grid[y / l][x/ l].walls[1] = false;
          this.grid[ny / l][nx/ l].walls[3] = false;
        } else {
          this.grid[y / l][x/ l].walls[3] = false;
          this.grid[ny / l][nx/ l].walls[1] = false;
        }

      }
      this.grid[y / l][x/ l].visited = true;
      this.grid[ny / l][nx/ l].visited = true;
    }
  }

  draw(ctx) {
    const maze = this.maze;
    ctx.clearRect(0, 0, maze.w, maze.h);
    this.algorithm();
    this.grid.forEach( row => {
      row.forEach( cell => {
        cell.draw(ctx);
      });
    });
    ctx.strokeRect(0, 0, maze.w, maze.h);
  }

}

module.exports = GenerateKruskal;