import { Maze } from "./maze";


function main() {
    const numOfRows: number = 10;
    const numOfCols: number = 10;
    const newMaze: Maze = new Maze(numOfRows, numOfCols);
    newMaze.generateMaze();
    newMaze.printMaze();
}
//TODO: pathfinding

main();