import { append, create } from 'stage1';
import './app.xcss';
import { Debug } from './components/Debug';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Router } from './router';

export function render(): void {
  const app = create('div');
  const wrapper = create('div');
  const main = create('main');

  app.id = 'app';
  wrapper.className = 'df h100';
  main.className = 'microdoc-main';

  append(Header(), app);
  append(Sidebar(), wrapper);
  append(Router(), main);
  append(main, wrapper);
  append(wrapper, app);
  append(app, document.body);

  if (process.env.NODE_ENV === 'development') {
    append(Debug(), document.body);
  }
}
