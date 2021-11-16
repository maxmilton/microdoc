import { h } from 'stage1';
import './App.xcss';

// type RefNodes = {
//   button: HTMLButtonElement;
// };

const view = h(`
  <div>
    <h1>Microdoc Site Showcase</h1>

    TODO
  </div>
`);

export const App = () => {
  const root = view;
  // const { button } = view.collect<RefNodes>(root);

  return root;
};
