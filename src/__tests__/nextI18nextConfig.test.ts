import fs from 'fs';
import path from 'path';

/**
 * The locale files are loaded through this config, and next-i18next resolves
 * a relative path against the server's working directory on every request.
 * A deployment whose working directory is not the project root then loads
 * every namespace empty and renders raw keys ("Titles.Accounts") site-wide,
 * which is why this config resolves the location before handing it over.
 */
describe('next-i18next config', () => {
  const configPath = path.join(process.cwd(), 'next-i18next.config.js');

  const loadConfig = () => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(configPath);
  };

  it('states an already-resolved path, not a relative one', () => {
    const { localePath } = loadConfig();

    expect(path.isAbsolute(localePath)).toBe(true);
    expect(localePath).toBe(path.resolve('./public/locales'));
  });

  it('points at a folder that holds the namespaces it declares', () => {
    const { localePath, i18n } = loadConfig();
    const resolved = path.resolve(process.cwd(), localePath);

    for (const locale of i18n.locales) {
      const dir = path.join(resolved, locale);
      expect(fs.existsSync(dir)).toBe(true);
      expect(
        fs.readdirSync(dir).filter(file => file.endsWith('.json')).length,
      ).toBeGreaterThan(0);
    }
  });
});
