interface Point {
  row: number;
  col: number;
  parent?: Point;
  totalCost?: number;
}

function searchRoad(map: number[][]): Point[] {
  let start_row = 1,
    start_col = 0,
    end_row = map.length - 2,
    end_col = map[0].length - 1;

  let openList: Point[] = [{ row: start_row, col: start_col }], //优先队列
    closeList: Point[] = [], //访问过的路
    result: Point[] = [], //最佳路径
    result_index: number = -1; //最佳路径在优先队列中的索引

  do {
    let currentPoint = openList.pop()!;
    closeList.push(currentPoint);
    let surroundedPoints = getSurroundedPoints(currentPoint);
    for (let i in surroundedPoints) {
      let item = surroundedPoints[i]; //获得周围的上下左右四个点
      if (
        item.row >= 0 && //判断是否在地图上
        item.col >= 0 &&
        item.row < map.length &&
        item.col < map[0].length &&
        map[item.row][item.col] !== 1 && //判断是否是障碍物
        isExistedInArr(item, closeList) === -1 //判断是否是走过的路
      ) {
        let cost = Math.abs(end_row - item.row) + Math.abs(end_col - item.col);
        let currentCost =
          Math.abs(currentPoint.row - item.row) +
          Math.abs(currentPoint.col - item.col);
        if (isExistedInArr(item, openList) === -1) {
          //如果不在优先队列中
          item.totalCost = cost + currentCost; //曼哈顿距离
          item.parent = currentPoint;
          openList.push(item);
        }
      }
    }
    //如果优先队列空了，没有通路，结果为空数组
    if (openList.length === 0) {
      break;
    }

    openList.sort((a: Point, b: Point) => b.totalCost! - a.totalCost!); //这一步是为了循环回去的时候，找出代价值最小的 将它从 "开启列表" 中移掉
  } while (
    (result_index = isExistedInArr(
      { row: end_row, col: end_col },
      openList
    )) === -1
  );

  //判断最佳路径是否为空
  if (result_index !== -1) {
    let currentObj = openList[result_index];
    do {
      //把路劲节点添加到result当中
      let { row, col } = currentObj;
      result.unshift({
        row,
        col,
      });
      currentObj = currentObj.parent!; /*根据父节点进行回溯*/
      if(!currentObj){
        break
      }
    } while (currentObj.row !== start_row || currentObj.col !== end_col);
  }

  return result;
}

//获取上下左右四个点的值
function getSurroundedPoints(curPoint: Point): Array<Point> {
  let row = curPoint.row,
    col = curPoint.col;
  return [
    { row: row, col: col - 1 },
    { row: row + 1, col: col },
    { row: row, col: col + 1 },
    { row: row - 1, col: col },
  ];
}

//判断点是否存在在数组中，是的话返回的是索引号
function isExistedInArr(point: Point, list: Array<Point>): number {
  for (let i in list) {
    if (point.row === list[i].row && point.col === list[i].col) {
      return parseInt(i);
    }
  }
  return -1;
}

export { searchRoad, type Point };
