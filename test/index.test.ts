import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
  mocksSetup, mocksTeardown, setup, teardown,
} from './utils';

test.before.each(setup);
test.before.each(mocksSetup);
test.after.each(mocksTeardown);
test.after.each(teardown);

test('renders microdoc core app', () => {
  // eslint-disable-next-line import/extensions, global-require
  require('../dist/microdoc.js');

  // TODO: Better assertions
  assert.is(document.body.innerHTML.length > 600, true, 'body has content');
  const firstNode = document.body.firstChild as HTMLDivElement;
  assert.is(firstNode.id, 'app', 'first element has id=app');
  // TODO: Remove assertion once we remove the WIP alert
  assert.is(
    (firstNode.firstChild as HTMLDivElement).id,
    'alert',
    'apps first element has id=alert',
  );
});

// TODO: Test app renders with each plugin and with all plugins
// TODO: Test app render with various configs

test.run();
