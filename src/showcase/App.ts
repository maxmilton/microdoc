import './App.xcss';

import type { S1Node } from 'stage1';
import type { InternalMicrodoc } from '../types';

// type RefNodes = {
//   button: HTMLButtonElement;
// };

const { h } = window.microdoc as InternalMicrodoc;

const view = h(`
  <div>
    <h1>Microdoc Site Showcase</h1>

    TODO
  </div>
`);

export const App = (): S1Node => {
  const root = view;
  // const { button } = view.collect<RefNodes>(root);

  return root;
};
