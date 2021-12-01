const defaultCellCount = 8;

interface ICell {
  value: number;
  ellipsis?: boolean;
}

const calculate = (total: number, position: number): ICell[] => {
  const cells: ICell[] = [];

  const offset = total - position;
  const pivot = Math.floor(defaultCellCount / 2);

  if (total > defaultCellCount) {
    cells[0] = { value: 1 };
    cells[1] = { value: 2 };
    cells[defaultCellCount - 2] = { value: total - 1 };
    cells[defaultCellCount - 1] = { value: total };

    if (position <= pivot) {
      cells[defaultCellCount - 2].ellipsis = true;

      for (let i = 2; i < defaultCellCount - 2; i++) {
        cells[i] = { value: i + 1 };
      }
    } else if (offset < pivot) {
      cells[1].ellipsis = true;

      for (let i = 2; i < defaultCellCount - 2; i++) {
        cells[i] = { value: total - defaultCellCount + i + 1 };
      }
    } else {
      cells[1].ellipsis = true;
      cells[defaultCellCount - 2].ellipsis = true;

      cells[pivot] = { value: position };

      for (let i = 1; i < defaultCellCount - 5; i++) {
        cells[pivot + i] = { value: position + i };
        cells[pivot - i] = { value: position - i };
      }
    }
  } else {
    for (let i = 0; i < total; i++) {
      cells[i] = { value: i + 1, ellipsis: false };
    }
  }

  return cells;
};

export default calculate;
