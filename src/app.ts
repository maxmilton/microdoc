import { append, create } from 'stage1';
import './app.xcss';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Router } from './router';

export function render(): void {
  const app = create('div');
  const wrapper = create('div');
  const main = create('main');

  app.id = 'app';
  wrapper.className = 'df h100';
  main.className = 'udoc-main';

  append(Header(), app);
  append(Sidebar(), wrapper);
  append(Router(), main);
  append(main, wrapper);
  append(wrapper, app);
  append(app, document.body);
}
