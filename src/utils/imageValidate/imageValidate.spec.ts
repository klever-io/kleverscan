import FakeTimers from '@sinonjs/fake-timers';
import { isImage, validateImgRequestHeader, validateImgUrl } from '.';

describe('test ImageValidate', () => {
  const clock = FakeTimers.install();
  describe('test validateImgUrl', () => {
    test('return true if url is valid', async () => {
      const url1 = await validateImgUrl(
        'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.png',
        2000,
      );
      expect(url1).toEqual(true);
    });
  });

  describe('test isImage function', () => {
    const url =
      'https://cdn-images-1.medium.com/max/720/1*2Wu5yLlLrfsfz6wMYFlYtQ.png';
    test("if return false, if it's not a html image src", async () => {
      const expected = false;
      (global.fetch = jest.fn() as jest.Mock).mockReturnValueOnce(url);
      const result = isImage(url, 2000);
      await clock.tickAsync(5000);

      await expect(result).resolves.toEqual(expected);
    });
  });

  describe('test validateImgRequestHeader function', () => {
    test('return true if url type is "image"', async () => {
      const expected = true;
      (global.fetch = jest.fn() as jest.Mock).mockReturnValueOnce({
        headers: {
          get: (contentType: string) => (contentType = 'image/klv'),
        },
      });
      const result = validateImgRequestHeader('/assets/klv-logo.png', 2000);
      await clock.tickAsync(5000);

      await expect(result).resolves.toEqual(expected);
    });
    test('return false if url type is not "image"', async () => {
      const expected = false;
      (global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ headers: '/klv' }),
        }),
      ) as jest.Mock).mockReturnValueOnce({
        headers: {
          get: (contentType: string) => (contentType = 'klv'),
        },
      });
      const result = validateImgRequestHeader('/assets/klv-logo.png', 2000);
      await clock.tickAsync(5000);

      await expect(result).resolves.toEqual(expected);
    });
  });
});
