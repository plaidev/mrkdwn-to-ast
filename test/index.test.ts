import { describe, expect, test } from 'vitest';
import { SlackMarkdownConverter } from '../src/index';

describe('to HTML', () => {
  test('simple', () => {
    const markdown = `hello\nworld`;
    const html = new SlackMarkdownConverter(markdown).toHtml();
    console.log(html);
  });

  test('multiple breaks', () => {
    const markdown = `1\n\n\n2`;
    const html = new SlackMarkdownConverter(markdown).toHtml();
    console.log(html);
  });
});
