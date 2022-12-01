import Tokenizers from './Tokenizers';

/**
 * Converter for texts from slack mrkdwn format to html
 * @param string src - incoming string in the slack mrkdwn format
 */
export class SlackMarkdownConverter {
  /**
   * Previous iteration token
   * @private
   */
  private _lastToken;

  /**
   * The list of full-row tokens
   * @private
   */
  private _tokens = [];

  constructor(src) {
    //clear src
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/^ +$/gm, '')
      .replace(/(?<!\n)```(^\n)/gm, '\n```\n')
      .replace(/(?<!\n)```/gm, '\n```')
      .replace(/```(^\n)/gm, '```\n');
    src = `${src}\n`;

    while (src) {
      let itSrc = src;
      for (let i in Tokenizers) {
        let tokenizer = Tokenizers[i];
        let _tokenizer = new tokenizer(src, this._lastToken);
        if (_tokenizer.check()) {
          if (!_tokenizer.ignore) {
            this._tokens.push(_tokenizer);
            this._lastToken = _tokenizer;
          }
          src = _tokenizer.getNextSubstring();
          break;
        }
      }

      if (itSrc === src) {
        let _tokenizer = new Tokenizers.Paragraph(src, this._lastToken);
        _tokenizer.prepare(src);
        this._tokens.push(_tokenizer);
        src = _tokenizer.getNextSubstring();
      }
    }
  }

  /**
   * Render html elements
   */
  private _toHtml(): string {
    let htmls = [];
    for (let i in this._tokens) {
      let token = this._tokens[i];
      htmls.push(token.toHtml());
    }
    return htmls.join('');
  }
  /**
   * Render html elements into a shared container(div) with a class 'slack-markdown'
   */
  toHtml(): string {
    return `<div>${this._toHtml()}</div>`;
  }

  /**
   * Render html elements w/o shared container
   */
  innerHtml(): string {
    return this._toHtml();
  }
}
