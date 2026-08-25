import fs from 'fs';
import path from 'path';

/**
 * The locale files are loaded through this config, and next-i18next resolves
 * a relative path against the server's working directory on every request.
 * A deployment whose working directory is not the project root then loads
 * every namespace empty and renders raw keys ("Titles.Accounts") site-wide,
 * which is why the location is stated explicitly there.
 */
describe('next-i18next config', () => {
  const configPath = path.join(process.cwd(), 'next-i18next.config.js');

  const loadConfig = () => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(configPath);
  };

  afterEach(() => {
    delete process.env.LOCALES_PATH;
  });

  it('takes the locale path from the environment when it is set', () => {
    process.env.LOCALES_PATH = '/srv/app/public/locales';

    expect(loadConfig().localePath).toBe('/srv/app/public/locales');
  });

  it('falls back to the project-relative path for local runs', () => {
    delete process.env.LOCALES_PATH;

    expect(loadConfig().localePath).toBe('./public/locales');
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
