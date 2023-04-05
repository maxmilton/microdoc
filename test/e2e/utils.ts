/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console, no-multi-assign */

import getPort from 'get-port';
import colors from 'kleur';
import http from 'node:http';
import path from 'node:path';
import {
  chromium,
  type Browser,
  type ConsoleMessage,
  type Page,
} from 'playwright-chromium';
import sirv from 'sirv';

export interface TestContext {
  browser: Browser;
  consoleMessages: ConsoleMessage[];
  unhandledErrors: Error[];
  page: Page;
  /**
   * Fixture directory to render. Must be manually set in each test before
   * calling renderPage().
   */
  fixture?: string;
}

// increase limit from 10
global.Error.stackTraceLimit = 100;

const DIST_DIR = path.join(__dirname, '..', '..');
let port: number;
let server: http.Server;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function setup(context: TestContext): Promise<void> {
  if (server) {
    throw new Error('Server already exists, did you forget to run teardown()?');
  }

  server = http.createServer(
    sirv(DIST_DIR, {
      onNoMatch(req, res) {
        if (req.url === '/favicon.ico') return;

        if (context.fixture) {
          sirv(path.join(__dirname, '..', 'fixtures', context.fixture), {
            onNoMatch(req2) {
              throw new Error(`No file match for URL: ${req2.url!}`);
            },
          })(req, res);
          return;
        }

        throw new Error(`No file match for URL: ${req.url!}`);
      },
    }),
  );
  server.on('error', (err) => {
    if (err) throw err;
  });
  server.listen((port = await getPort()));
  context.browser = await chromium.launch();
}

export async function teardown(context: TestContext): Promise<void> {
  if (!server) {
    throw new Error('No server exists, did you forget to run setup()?');
  }

  await context.browser.close();
  server.close();
}

export async function renderPage(context: TestContext): Promise<void> {
  if (!context.browser) {
    throw new Error(
      'No browser instance exists, did you forget to run setup()?',
    );
  }
  if (context.page) {
    throw new Error(
      'Browser page already exists, did you forget to run cleanupPage()?',
    );
  }

  const page = await context.browser.newPage();
  context.page = page;
  context.unhandledErrors = [];
  context.consoleMessages = [];
  page.on('crash', (crashedPage) => {
    throw new Error(`Page crashed: ${crashedPage.url()}`);
  });
  page.on('pageerror', (err) => {
    console.error(colors.red('Page Error:'), err);
    context.unhandledErrors.push(err);
  });
  page.on('console', (msg) => {
    const loc = msg.location();
    console.log(
      colors.dim(
        `${loc.url}:${loc.lineNumber}:${loc.columnNumber} [${msg.type()}]`,
      ),
      msg.text(),
    );
    context.consoleMessages.push(msg);
  });
  await page.goto(`http://localhost:${port}/`, {
    // waitUntil: 'networkidle', // necessary due to CDN links... but makes tests slow
  });
}

export async function cleanupPage(context: TestContext): Promise<void> {
  if (!context.page) {
    throw new Error(
      'No browser page exists, did you forget to run renderPage()?',
    );
  }

  await context.page.close();
  // @ts-expect-error - reset for next renderPage
  // prettier-ignore
  context.unhandledErrors = context.consoleMessages = context.page = context.fixture = undefined;
}
