import { isDataEmpty } from '../validateSender';

describe('test validate sender', () => {
  describe('test isDataEmpty function', () => {
    test('return true if array of strings is empty', () => {
      const empty: string[] = [];
      const data: string[] = ['3030303830'];
      const data2: string[] = [''];
      expect(isDataEmpty(empty)).toEqual(true);
      expect(isDataEmpty(data)).toEqual(false);
      expect(isDataEmpty(data2)).toEqual(true);
    });
  });
});
