export class Cell {
    constructor(public row: number, public col: number) {
        this.row = row;
        this.col = col;
    }

    topNeighbor: boolean = true;
    bottomNeighbor: boolean = true;
    leftNeighbor: boolean = true;
    rightNeighbor: boolean = true;
    visitedDuringGeneration: boolean = false;
    visitedDuringPathfinding: boolean = false;
    neighborsToExplore: Cell[] = [];
    connectedRight: boolean = false;
    connectedLeft: boolean = false;
    connectedTop: boolean = false;
    connectedBottom: boolean = false;
}