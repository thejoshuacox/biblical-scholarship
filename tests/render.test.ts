import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InlineText, PassageDisplay } from '../src/components/PassageDisplay';
import type { Passage } from '../src/bible/types';
describe('passage rendering', () => {
  it('keeps word spacing around translator notes while attaching punctuation', () => {
    const html = renderToStaticMarkup(
      createElement(InlineText, {
        items: [
          { kind: 'text', text: 'seeds' },
          { kind: 'note', id: 1, text: 'A note' },
          { kind: 'text', text: 'along the path' },
        ],
      }),
    );
    expect(html).toContain('> along the path</span>');
    const punctuation = renderToStaticMarkup(
      createElement(InlineText, {
        items: [
          { kind: 'note', id: 1, text: 'A note' },
          { kind: 'text', text: '”' },
        ],
      }),
    );
    expect(punctuation).toContain('>”</span>');
  });
  it('renders notes without invalid paragraph nesting and identifies the supplied translation', () => {
    const reference = {
      book: 'GEN',
      bookName: 'Genesis',
      start: { chapter: 1, verse: 1 },
      end: { chapter: 1, verse: 1 },
    };
    const passage: Passage = {
      reference,
      translation: {
        id: 'TEST',
        name: 'Test',
        attribution: 'Test only',
        url: 'https://example.org',
      },
      verses: [
        {
          chapter: 1,
          number: 1,
          paragraphStart: true,
          headings: [],
          subtitle: [],
          content: [
            { kind: 'text', text: 'Test verse' },
            { kind: 'note', id: 0, text: 'Test note' },
          ],
        },
      ],
    };
    const html = renderToStaticMarkup(
      createElement(PassageDisplay, { reference, passage, title: 'Genesis' }),
    );
    expect(html).toContain('TEST');
    expect(html).toContain('<details');
    expect(html).not.toContain('<p class="verse');
  });
});
