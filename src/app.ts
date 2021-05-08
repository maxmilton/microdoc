import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Router } from './router';
import { append, create } from './utils';
import './app.xcss';

export function render(): void {
  const wrapper = create('div');
  const main = create('main');

  wrapper.className = 'df h100';
  main.className = 'docs-main';

  append(Header(), document.body);
  append(Sidebar(), wrapper);
  append(Router(), main);
  append(main, wrapper);
  append(wrapper, document.body);
}
