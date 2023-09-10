import { Maze } from "./maze";

function main() {
    const numOfRows: number = 5;
    const numOfCols: number = 5;
    const newMaze: Maze = new Maze(numOfRows, numOfCols);
    newMaze.generateMaze();
    newMaze.findPath(numOfRows - 1, numOfCols - 1);
    newMaze.printMaze();
}

main();