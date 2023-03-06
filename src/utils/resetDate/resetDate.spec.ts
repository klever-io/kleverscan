import { resetDate } from '.';

describe('test resetDate function', () => {
  const query = {
    account: 'klv16sd7crk4jlc8csrv7lwskqrpjgjklvcsmlhexuesa9p6a3dm57rs5vh0hq',
    tab: 'Transactions',
    startdate: '1665457200000',
    enddate: '1666321200000',
  };
  test('check if "RESET" the date filter', () => {
    const result = resetDate(query);
    expect(result).toEqual({
      account: 'klv16sd7crk4jlc8csrv7lwskqrpjgjklvcsmlhexuesa9p6a3dm57rs5vh0hq',
      tab: 'Transactions',
    });
  });
});
