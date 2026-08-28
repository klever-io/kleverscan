import fs from 'fs';
import os from 'os';
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

  /**
   * The regression this file exists for, reproduced rather than described.
   *
   * The serverless runtime that serves this site starts in the application
   * root and handles requests from somewhere else. A value resolved while
   * the module loads survives that; a relative one is re-resolved per
   * request against the wrong directory, finds nothing, and every namespace
   * loads empty. Nothing raises: pages simply render their own keys, and
   * because many keys here are the English sentence, half the page still
   * reads correctly, which is why it went unnoticed across three
   * environments.
   */
  it('still finds the files when the working directory changes after load', () => {
    const { localePath } = loadConfig();
    const projectRoot = process.cwd();

    try {
      process.chdir(os.tmpdir());

      // Exactly what next-i18next does for each request.
      const requested = path.resolve(
        process.cwd(),
        `${localePath}/en/common.json`,
      );

      const found = fs.existsSync(requested);

      // Thrown rather than left to the matcher, so the failure explains
      // itself to whoever hits it instead of reading "expected true,
      // received false". The assertion below keeps it a real expectation.
      if (!found) {
        throw new Error(
          [
            `localePath "${localePath}" only resolves while the server runs from the project root.`,
            `After moving to another directory it looked for: ${requested}`,
            '',
            'next-i18next resolves a relative localePath against process.cwd() on every',
            'request, and the runtime that serves this site handles requests from a',
            'different directory than the one it started in. Every namespace then loads',
            'empty and pages render their own keys ("Titles.Accounts" instead of',
            '"Accounts"), with no error anywhere. Keep the path resolved in',
            'next-i18next.config.js while the module loads, as path.resolve() does.',
          ].join('\n'),
        );
      }

      expect(found).toBe(true);
    } finally {
      process.chdir(projectRoot);
    }
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
