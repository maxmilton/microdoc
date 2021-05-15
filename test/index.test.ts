import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { setup, teardown } from './utils';

test.before.each(setup);
test.after.each(teardown);

test('renders microdoc core app', () => {
  // eslint-disable-next-line import/extensions, global-require
  require('../dist/index.js');

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
