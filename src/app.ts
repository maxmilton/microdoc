import { h } from 'stage1';
import './app.xcss';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Router } from './router';
import { append, create } from './utils';

export function render(): void {
  const app = create('div');
  const wrapper = create('div');
  const main = create('main');

  app.id = 'app';
  wrapper.className = 'df h100';
  main.className = 'udoc-main';

  // TODO: Remove temporary warning (and its assossiated styles)
  append(
    h`
      <div id=alert class="alert alert-warn tc">
        <strong>Warning:</strong> These docs and microdoc itself are a <abbr title="Work In Progress">WIP</abbr>, please <a href=https://github.com/MaxMilton/microdoc/issues rel=noreferrer>report issues</a>!
      </div>
    `,
    app,
  );

  append(Header(), app);
  append(Sidebar(), wrapper);
  append(Router(), main);
  append(main, wrapper);
  append(wrapper, app);
  append(app, document.body);
}
