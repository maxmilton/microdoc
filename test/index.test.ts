import * as assert from 'uvu/assert';
import { reset } from './setup';
import { consoleSpy, describe } from './utils';

describe('microdoc', (test) => {
  test.after(reset);

  test('renders core app', async () => {
    const checkConsoleCalls = consoleSpy();

    // eslint-disable-next-line import/extensions, global-require
    require('../microdoc.js');

    await happyDOM.whenAsyncComplete();

    // TODO: Better assertions
    assert.is(document.body.innerHTML.length > 450, true, 'body has content');
    const firstNode = document.body.firstChild as HTMLDivElement;
    assert.instance(firstNode, window.HTMLDivElement);
    assert.is(firstNode.id, 'microdoc', 'first element id=microdoc');

    checkConsoleCalls(assert);
  });

  // TODO: Test app renders with each plugin and with all plugins
  // TODO: Test app render with various configs
});
