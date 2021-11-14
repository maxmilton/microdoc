import {
  append, create, h, S1Node,
} from 'stage1';
import './Debug.xcss';

export type DebugComponent = S1Node & HTMLDivElement;

const view = h(`
  <div id=debug class=hide-on-hover>
  </div>
`);

export function Debug(): DebugComponent {
  const root = view as DebugComponent;

  const mediaRules: Record<string, MediaQueryList> = {};

  for (const sheet of document.styleSheets) {
    // Exclude cross-origin stylesheets
    if (!sheet.href || sheet.href.startsWith(window.location.origin)) {
      for (const rule of sheet.cssRules) {
        if (rule.type === CSSRule.MEDIA_RULE) {
          const condition = (rule as CSSMediaRule).media.mediaText;

          if (!(condition in mediaRules)) {
            mediaRules[condition] = matchMedia(condition);
          }
        }
      }
    }
  }

  for (const [text, media] of Object.entries(mediaRules)) {
    const el = create('div');
    el.textContent = text;

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const setClassName = ({ matches }: { matches: boolean }) => {
      el.className = matches ? 'green5' : 'red5';
    };

    setClassName(media);
    media.addListener(setClassName);

    append(el, root);
  }

  return root;
}
