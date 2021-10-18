/**
 * Microdoc Search Plugin
 *
 * @fileoverview Fully client-side documentation-wide fuzzy search without a
 * backend! Behind the scenes this plugin will fetch all your routes, read their
 * content, and index it all into a fuse.js powered search engine.
 */

// TODO: Dismiss on click outside the search results dropdown

// TODO: Investigate using different client-side search engine for better search
// result quality and performance characteristics
//  ↳ https://github.com/nextapps-de/flexsearch

import Fuse from 'fuse.js';
import type { S1Node } from 'stage1';

interface ContentData {
  body: string;
  title: string;
  url: string;
}

const { append, h, root: urlRoot } = window.microdoc;
const reTextFileExt = /\.(md|txt)$/;
let popup: ResultListComponent;
let fuse: Fuse<ContentData>;

async function loadContent() {
  const files: [fetchRes: Promise<Response>, title: string, url: string][] = [];
  const content = [];

  for (const link of document.querySelectorAll('.udoc-sidebar a')) {
    const href = link.getAttribute('href');
    const title = link.textContent;

    if (href && reTextFileExt.test(href)) {
      files.push([fetch(urlRoot + href.slice(1)), title!, href]);
    }
  }

  for (const file of files) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await file[0];
      // eslint-disable-next-line no-await-in-loop
      const body = await res.text();
      if (!res.ok) throw new Error(body);
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
  input: HTMLInputElement;
};

const resultItemView = h`
  <li>
    <a #url></a>
  </li>
`;
const resultListView = h`
  <div class=udoc-search-results hidden>
    <h3 class=mt0>Search Results</h3>

    <ul #list class=pl3></ul>
  </div>
`;
// https://github.com/feathericons/feather/blob/master/icons/search.svg
const searchView = h`
  <div class="udoc-search-wrapper ml-auto mv-1">
    <input #input type=search class=udoc-search placeholder="Search docs...">
    <svg viewBox="0 0 24 24" class="udoc-icon udoc-icon-search">
      <circle cx=11 cy=11 r=8 />
      <line x1=24 y1=24 x2=16.65 y2=16.65 />
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

  url.__click = () => popup.update();

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

    for (const result of results) {
      append(ResultItem(result), list);
    }

    root.hidden = false;
  };

  return root;
}

function Search(): SearchComponent {
  const root = searchView as SearchComponent;
  const { input } = searchView.collect<SearchRefNodes>(root);

  const search = () => {
    const results = fuse.search(input.value);
    (popup ??= append(ResultList(), root)).update(results);
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
      console.warn('Search results not ready yet');
      return;
    }

    search();
  };
  input.onkeydown = (event) => {
    if (event.key === 'Escape') {
      input.value = '';
      popup?.update();
    }
  };

  return root;
}

append(Search(), document.querySelector('.udoc-header')!);

loadContent()
  .then((content) => {
    fuse = new Fuse(content, {
      ignoreLocation: true,
      // includeScore: true, // useful for debugging
      includeMatches: true,
      keys: [
        {
          name: 'body',
          weight: 0.9,
        },
        'title',
      ],
    });
  })
  .catch(console.error);
