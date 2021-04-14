import { render } from './app';
import { setupRouter } from './router';
import { setDefaults } from './utils';

export * from './types';

setDefaults();
setupRouter();
render();
