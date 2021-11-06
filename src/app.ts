import { append, create } from 'stage1';
import './app.xcss';
import { Header } from './components/Header';
import { Sidenav } from './components/Sidenav';
import { Router } from './router';

export function render(): void {
  const app = create('div');
  const wrapper = create('div');
  const main = create('main');

  app.id = 'app';
  wrapper.className = 'df';
  main.className = 'microdoc-main';

  append(Header(), app);
  append(Sidenav(), wrapper);
  append(Router(), main);
  append(main, wrapper);
  append(wrapper, app);
  append(app, document.body);

  if (process.env.NODE_ENV === 'development') {
    import('./components/Debug')
      .then(({ Debug }) => append(Debug(), document.body))
      .catch(console.error);
  }
}
