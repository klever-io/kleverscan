const defaultCellCount = 9;

interface ICell {
  value: number;
  leftEllipsis?: true | undefined;
  rightEllipsis?: true | undefined;
}

const calculate = (total: number, position: number): ICell[] => {
  const cells: ICell[] = [];

  if (total > defaultCellCount) {
    // position += 1;
    if (position >= 5 && position <= total - 4) {
      cells[0] = { value: 1 };

      cells[1] =
        position - 3 > 2
          ? { value: position - 3, leftEllipsis: true }
          : { value: 2 };

      cells[2] = { value: position - 2 };
      cells[3] = { value: position - 1 };
      cells[4] = { value: position };
      cells[5] = { value: position + 1 };
      cells[6] = { value: position + 2 };

      cells[7] =
        position + 3 < total - 1
          ? { value: position + 3, rightEllipsis: true }
          : { value: position + 3 };

      cells[8] = { value: total };
    } else if (position < 5) {
      cells[0] = { value: 1 };
      cells[1] = { value: 2 };
      cells[2] = { value: 3 };
      cells[3] = { value: 4 };
      cells[4] = { value: 5 };
      cells[5] = { value: 6 };
      cells[6] = { value: 7 };

      cells[7] =
        8 + 1 === total ? { value: 8 } : { value: 8, rightEllipsis: true };

      cells[8] = { value: total };
    } else {
      cells[0] = { value: 1 };
      cells[1] = { value: total - 7, leftEllipsis: true };
      cells[2] = { value: total - 6 };
      cells[3] = { value: total - 5 };
      cells[4] = { value: total - 4 };
      cells[5] = { value: total - 3 };
      cells[6] = { value: total - 2 };
      cells[7] = { value: total - 1 };
      cells[8] = { value: total };
    }
  } else {
    for (let i = 0; i < total; i++) {
      cells[i] = { value: i + 1 };
    }
  }
  return cells;
};

export default calculate;
