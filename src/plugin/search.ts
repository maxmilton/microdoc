/**
 * Microdoc Search Plugin
 *
 * @see https://microdoc.js.org/#/plugins/search.md
 * docs/plugins/search.md
 */

// FIXME: Search input takes up too much space on narrow screens
//  ↳ Docusaurus use a button on small screens to open a search UI (actually on
//    large screens too but there it looks like a real search input)

// FIXME: Dismiss on click outside the search results dropdown

// TODO: Investigate using different client-side search engine for better search
// result quality and performance characteristics
//  ↳ https://github.com/nextapps-de/flexsearch

import Fuse from 'fuse.js';
import type { S1Node } from 'stage1';
import type { InternalMicrodoc } from '../types';

interface ContentData {
  body: string;
  title: string;
  url: string;
}

const {
  append,
  h,
  root: urlRoot,
  $routes,
} = window.microdoc as InternalMicrodoc;
let popup: ResultListComponent;
let fuse: Fuse<ContentData>;

async function loadContent() {
  const files: [fetchRes: Promise<Response>, title: string, url: string][] = [];
  const content = [];

  $routes.forEach((route) => {
    files.push([fetch(urlRoot + route.path.slice(1)), route.name, route.path]);
  });

  for (const file of files) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await file[0];
      // eslint-disable-next-line no-await-in-loop
      const body = await res.text();

      if (!res.ok) {
        throw new Error(body || `${res.status}`);
      }
      content.push({ body, title: file[1], url: file[2] });
    } catch (error) {
      console.error(error);
    }
  }

  return content;
}

type ResultListComponent = S1Node &
HTMLDivElement & {
  update: (results?: Fuse.FuseResult<ContentData>[]) => void;
};
type ResultItemComponent = S1Node & HTMLDivElement;
type SearchComponent = S1Node & HTMLDivElement;

type ResultsRefNodes = {
  list: HTMLUListElement;
};
type ResultItemRefNodes = {
  url: HTMLAnchorElement;
};
type SearchRefNodes = {
  button: HTMLButtonElement;
  input: HTMLInputElement;
};

const resultItemView = h`
  <li>
    <a #url></a>
  </li>
`;
const resultListView = h`
  <div class=microdoc-search-results hidden>
    <h3 class=mt0>Search Results</h3>

    <ul #list></ul>
  </div>
`;
// https://github.com/tabler/tabler-icons/blob/master/icons/x.svg
// https://github.com/feathericons/feather/blob/master/icons/search.svg
const searchView = h`
  <div class="microdoc-search microdoc-header-item">
    <button class="microdoc-button-search button-clear" #button>
      <svg viewBox="0 0 24 24" class=microdoc-icon-x>
        <line x1=18 y1=6 x2=6 y2=18 />
        <line x1=6 y1=6 x2=18 y2=18 />
      </svg>
    </button>
    <input type=search class=microdoc-search-input placeholder="Search docs..." #input>
    <svg viewBox="0 0 24 24" class=microdoc-icon-search>
      <circle cx=11 cy=11 r=8 />
      <line x1=21 y1=21 x2=16.65 y2=16.65 />
    </svg>
  </div>
`;

function ResultItem(result: Fuse.FuseResult<ContentData>): ResultItemComponent {
  const root = resultItemView.cloneNode(true) as ResultItemComponent;
  const { url } = resultItemView.collect<ResultItemRefNodes>(root);

  // TODO: If the match is in the body, show the relevant part
  // TODO: Highlight the matching part -- data in result.matches

  url.href = result.item.url;
  url.textContent = result.item.title;

  url.__click = () => {
    popup.update();
    // FIXME: Obviously need to do something better
    document.querySelector('.microdoc-search')!.classList.remove('expanded');
  };

  return root;
}

function ResultList(): ResultListComponent {
  const root = resultListView as ResultListComponent;
  const { list } = resultListView.collect<ResultsRefNodes>(root);

  root.update = (results) => {
    list.textContent = '';

    if (!results) {
      root.hidden = true;
      return;
    }

    results.forEach((result) => append(ResultItem(result), list));

    root.hidden = false;
  };

  return root;
}

function Search(): SearchComponent {
  const root = searchView as SearchComponent;
  const { button, input } = searchView.collect<SearchRefNodes>(root);

  const search = () => {
    const results = fuse.search(input.value);
    (popup ??= append(ResultList(), root)).update(results);
  };

  button.__click = () => {
    root.classList.toggle('expanded');
    input.focus();
  };

  input.onfocus = () => {
    if (input.value) {
      search();
    }
  };
  input.oninput = () => {
    if (!fuse) {
      // TODO: If a user tries to search before all the content has been loaded and
      // parsed show some feedback in the UI
      console.warn('Search index not ready yet');
      return;
    }

    if (input.value === '') {
      popup?.update();
    } else {
      search();
    }
  };
  input.onkeydown = (event) => {
    if (event.key === 'Escape') {
      input.value = '';
      popup?.update();
      root.classList.remove('expanded');
    }
  };

  return root;
}

append(Search(), document.querySelector('.microdoc-header')!);

loadContent()
  .then((content) => {
    fuse = new Fuse(content, {
      ignoreLocation: true,
      // includeScore: true, // useful for debugging
      includeMatches: true,
      keys: [
        // {
        //   name: 'body',
        //   weight: 0.9,
        // },
        'body',
        'title',
      ],
    });
  })
  .catch(console.error);
