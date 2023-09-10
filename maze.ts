import { Cell } from './cell';

export class Maze {
    constructor(public width: number, public height: number) {
        this.width = width;
        this.height = height;
        this.grid = this.generateGrid();

    }
    grid: Cell[][] = [];

    generateGrid(): Cell[][] {
        var grid: Cell[][] = [];
        for (var row = 0; row < this.height; row++) {
            var mazeRow: Cell[] = [];
            for (var col = 0; col < this.width; col++) 
                mazeRow.push(new Cell(row, col));
            grid.push(mazeRow);
        }

        //establishes the default neighbors of each cell
        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                const cell: Cell = grid[row][col];
                if (row == 0 && this.height >= 2) {
                    cell.neighborsToExplore.push(grid[row + 1][col]);
                    cell.topNeighbor = false;
                } else if (row == this.height - 1 && this.height >= 2) {
                    cell.neighborsToExplore.push(grid[row - 1][col]);
                    cell.bottomNeighbor = false;
                } else if (row > 0 && row < this.height - 1 && this.height >= 3) {
                    cell.neighborsToExplore.push(grid[row - 1][col]);
                    cell.neighborsToExplore.push(grid[row + 1][col]);
                }
                if (col == 0 && this.width >= 2) {
                    cell.neighborsToExplore.push(grid[row][col + 1]);
                    cell.leftNeighbor = false;
                } else if (col == this.width - 1 && this.width >= 2) {
                    cell.neighborsToExplore.push(grid[row][col - 1]);
                    cell.rightNeighbor = false;
                } else if (col > 0 && col < this.width - 1 && this.width >= 3) {
                    cell.neighborsToExplore.push(grid[row][col - 1]);
                    cell.neighborsToExplore.push(grid[row][col + 1]);
                }
            }
        }
        return grid;
    }

    connectCells(cell: Cell, neighboringCell: Cell): void {
        if (cell.row < neighboringCell.row && cell.row >= 0 && neighboringCell.row <= this.height - 1 && cell.bottomNeighbor && neighboringCell.topNeighbor) {
            cell.connectedBottom = true;
            neighboringCell.connectedTop = true;
        } else if (cell.row > neighboringCell.row &&  cell.row <= this.height - 1 && neighboringCell.row >= 0 && cell.topNeighbor && neighboringCell.bottomNeighbor) {
            cell.connectedTop = true;
            neighboringCell.connectedBottom = true;
        } else if (cell.col < neighboringCell.col && cell.col >= 0 && neighboringCell.col <= this.width - 1 && cell.rightNeighbor && neighboringCell.leftNeighbor) {
            cell.connectedRight = true;
            neighboringCell.connectedLeft = true;
        } else if (cell.col > neighboringCell.col && cell.col <= this.width - 1 && neighboringCell.col >= 0 && cell.leftNeighbor && neighboringCell.rightNeighbor) {
            cell.connectedLeft = true;
            neighboringCell.connectedRight= true;
        } else {
            console.log(`Error: Invalid connection between cells ${cell.row},${cell.col} and ${neighboringCell.row},${neighboringCell.col}`);
        }
    
        // Remove the neighboring cell from the current cell's neighborsToExplore array.
        const index: number = cell.neighborsToExplore.indexOf(neighboringCell);
        if (index > -1 && index <= 3) cell.neighborsToExplore.splice(index, 1);
        // Remove the current cell from the neighboring cell's neighborsToExplore array.
        const index2: number = neighboringCell.neighborsToExplore.indexOf(cell);
        if (index2 > -1 && index2 <= 3) neighboringCell.neighborsToExplore.splice(index2, 1);
    }
    
    getUnvisitedNeighbors(cell: Cell): Cell[] {
        const unvisited: Cell[] = [];
        for (var neighbor of cell.neighborsToExplore) {
            if (!neighbor.visitedDuringGeneration) unvisited.push(neighbor);
        }
        return unvisited;
    }

    generateMaze(): void {
        if (!this.grid || this.grid.length === 0) throw new Error("Grid not initialized. Call generateGrid first.");
    
        let startCell = this.grid[0][0];
        this.iterativeBacktracker(startCell);
    }
    
    iterativeBacktracker(cell: Cell): void {
        let stack: Cell[] = [];
        stack.push(cell);
        cell.visitedDuringGeneration = true;
        let numOfVisitedCells = 1;
    
        while (stack.length !== 0 && numOfVisitedCells <= this.width * this.height) {
            let current = stack[stack.length - 1];
            let neighbors = this.getUnvisitedNeighbors(current);
    
            if (neighbors.length !== 0) {
                let randomIndex = Math.floor(Math.random() * neighbors.length);
                let chosenNeighbor = neighbors[randomIndex];
    
                this.connectCells(current, chosenNeighbor);
                chosenNeighbor.visitedDuringGeneration = true;
                numOfVisitedCells++;
    
                stack.push(chosenNeighbor);
            } else {
                stack.pop();
            }
        }
    }

    prepareCellsForPathfinding(): void {
        if (!this.grid || this.grid.length === 0) throw new Error("Grid not initialized. Call generateGrid first.");
        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                const cell: Cell = this.grid[row][col];
                cell.visitedDuringPathfinding = false;
                cell.hCost = ((this.height - 1) - row) + ((this.width - 1) - col);
            }
        }
    }

    findPath(endRow: number, endCol: number): void {
        if (!this.grid || this.grid.length === 0) throw new Error("Grid not initialized. Call generateGrid first.");
        else this.prepareCellsForPathfinding();

        let currentCell = this.grid[0][0];
        let endCell = this.grid[endRow][endCol];

        while (currentCell != endCell) {
            currentCell.visitedDuringPathfinding = true;
            this.getConnectedNeighbors(currentCell);
            var minHCost = currentCell.connectedNeighbors[0].hCost;
            var nextCell = currentCell.connectedNeighbors[0];
            for (var neighbor of currentCell.connectedNeighbors) {
                if (!neighbor.visitedDuringPathfinding && neighbor.hCost <= minHCost) nextCell = neighbor;
            }
            currentCell = nextCell;
        }
        this.grid[endRow][endCol].visitedDuringPathfinding = true;
    }
            

    getConnectedNeighbors(cell: Cell): void {
        if (cell.connectedTop) cell.connectedNeighbors.push(this.grid[cell.row - 1][cell.col]);
        if (cell.connectedBottom) cell.connectedNeighbors.push(this.grid[cell.row + 1][cell.col]);
        if (cell.connectedLeft) cell.connectedNeighbors.push(this.grid[cell.row][cell.col - 1]);
        if (cell.connectedRight) cell.connectedNeighbors.push(this.grid[cell.row][cell.col + 1]);
    }
    
    printCellMiddleContents(cell: Cell): string {
        let result = "";
        if (cell.visitedDuringPathfinding && cell.visitedDuringGeneration) {
            if (cell.connectedRight) {
                result += " .  ";
            } else {
                result += " . |";
            }
        } else if (!cell.visitedDuringPathfinding && cell.visitedDuringGeneration) {
            if (cell.connectedRight) {
                result += "    ";
            } else {
                result += "   |";
            }
        }
        return result;
    }
    
    printCellBottomContents(cell: Cell): string {
        if (cell.connectedBottom) return "   +";
        else return "---+";
    }

    printMaze(): void {
        var grid: Cell[][] = this.grid;
        var maze: string = "+";
        for (var col = 0; col < this.width; col++) {
            maze += "---+";
        }
        maze += "\n";
        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                if (col == 0) maze += "|";
                var cell: Cell = grid[row][col];
                maze += this.printCellMiddleContents(cell);
            }
            maze += "\n";
            for (var col = 0; col < this.width; col++) {
                if (col == 0) maze += "+";
                var cell: Cell = grid[row][col];
                maze += this.printCellBottomContents(cell);
            }
            maze += "\n";
        }
        console.log(maze);
    }
}