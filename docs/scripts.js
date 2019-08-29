/**
 * marked - a markdown parser
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

;(function(root) {
'use strict';

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: /^ {0,3}(`{3,}|~{3,})([^`~\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
    + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  nptable: noop,
  table: noop,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d{1,9}\.)/;
block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
block.item = edit(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex();

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
  + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
  + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
  + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
  + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
  + '|track|ul';
block._comment = /<!--(?!-?>)[\s\S]*?-->/;
block.html = edit(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
  .getRegex();

block.paragraph = edit(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} +')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}|~{3,})[^`\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
});

/**
 * Pedantic grammar (original John Gruber's loose markdown specification)
 */

block.pedantic = merge({}, block.normal, {
  html: edit(
    '^ *(?:comment *(?:\\n|\\s*$)'
    + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
    .replace('comment', block._comment)
    .replace(/tag/g, '(?!(?:'
      + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
      + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
      + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
    .getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
  fences: noop, // fences not supported
  paragraph: edit(block.normal._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' *#{1,6} *[^\n]')
    .replace('lheading', block.lheading)
    .replace('blockquote', ' {0,3}>')
    .replace('|fences', '')
    .replace('|list', '')
    .replace('|html', '')
    .getRegex()
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = Object.create(null);
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.pedantic) {
    this.rules = block.pedantic;
  } else if (this.options.gfm) {
    this.rules = block.gfm;
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  src = src.replace(/^ +$/gm, '');
  var next,
      loose,
      cap,
      bull,
      b,
      item,
      listStart,
      listItems,
      t,
      space,
      i,
      tag,
      l,
      isordered,
      istask,
      ischecked;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      var lastToken = this.tokens[this.tokens.length - 1];
      src = src.substring(cap[0].length);
      // An indented code block cannot interrupt a paragraph.
      if (lastToken && lastToken.type === 'paragraph') {
        lastToken.text += '\n' + cap[0].trimRight();
      } else {
        cap = cap[0].replace(/^ {4}/gm, '');
        this.tokens.push({
          type: 'code',
          codeBlockStyle: 'indented',
          text: !this.options.pedantic
            ? rtrim(cap, '\n')
            : cap
        });
      }
      continue;
    }

    // fences
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2] ? cap[2].trim() : cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (cap = this.rules.nptable.exec(src)) {
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = splitCells(item.cells[i], item.header.length);
        }

        this.tokens.push(item);

        continue;
      }
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];
      isordered = bull.length > 1;

      listStart = {
        type: 'list_start',
        ordered: isordered,
        start: isordered ? +bull : '',
        loose: false
      };

      this.tokens.push(listStart);

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      listItems = [];
      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) */, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull.length > 1 ? b.length === 1
            : (b.length > 1 || (this.options.smartLists && b !== bull))) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        if (loose) {
          listStart.loose = true;
        }

        // Check for task list items
        istask = /^\[[ xX]\] /.test(item);
        ischecked = undefined;
        if (istask) {
          ischecked = item[1] !== ' ';
          item = item.replace(/^\[[ xX]\] +/, '');
        }

        t = {
          type: 'list_item_start',
          task: istask,
          checked: ischecked,
          loose: loose
        };

        listItems.push(t);
        this.tokens.push(t);

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      if (listStart.loose) {
        l = listItems.length;
        i = 0;
        for (; i < l; i++) {
          listItems[i].loose = true;
        }
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
      tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
      if (!this.tokens.links[tag]) {
        this.tokens.links[tag] = {
          href: cap[2],
          title: cap[3]
        };
      }
      continue;
    }

    // table (gfm)
    if (cap = this.rules.table.exec(src)) {
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = splitCells(
            item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
            item.header.length);
        }

        this.tokens.push(item);

        continue;
      }
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2].charAt(0) === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: '^comment'
    + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noop,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
};

// list of punctuation marks from common mark spec
// without ` and ] to workaround Rule 17 (inline code blocks/links)
inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit(inline.tag)
  .replace('comment', block._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('label', inline._label)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label)
    .getRegex()
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
});

inline.gfm.url = edit(inline.gfm.url, 'i')
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text)
    .replace('\\b_', '\\b_| {2,}\\n')
    .replace(/\{2,\}/g, '*')
    .getRegex()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;

  if (!this.links) {
    throw new Error('Tokens array requires a `links` property.');
  }

  if (this.options.pedantic) {
    this.rules = inline.pedantic;
  } else if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = '',
      link,
      text,
      href,
      title,
      cap,
      prevCapZero;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(cap[1]);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.inRawBlock = true;
      } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.inRawBlock = false;
      }

      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      var lastParenIndex = findClosingBracket(cap[2], '()');
      if (lastParenIndex > -1) {
        var linkLen = 4 + cap[1].length + lastParenIndex;
        cap[2] = cap[2].substring(0, lastParenIndex);
        cap[0] = cap[0].substring(0, linkLen).trim();
        cap[3] = '';
      }
      src = src.substring(cap[0].length);
      this.inLink = true;
      href = cap[2];
      if (this.options.pedantic) {
        link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

        if (link) {
          href = link[1];
          title = link[3];
        } else {
          title = '';
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : '';
      }
      href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
      out += this.outputLink(cap, {
        href: InlineLexer.escapes(href),
        title: InlineLexer.escapes(title)
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(this.mangle(cap[1]));
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      if (cap[2] === '@') {
        text = escape(cap[0]);
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + text;
        } else {
          href = text;
        }
      }
      src = src.substring(cap[0].length);
      out += this.renderer.link(href, null, text);
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      if (this.inRawBlock) {
        out += this.renderer.text(this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0]);
      } else {
        out += this.renderer.text(escape(this.smartypants(cap[0])));
      }
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

InlineLexer.escapes = function(text) {
  return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = link.href,
      title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = '',
      l = text.length,
      i = 0,
      ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || marked.defaults;
}

Renderer.prototype.code = function(code, infostring, escaped) {
  var lang = (infostring || '').match(/\S*/)[0];
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw, slugger) {
  if (this.options.headerIds) {
    return '<h'
      + level
      + ' id="'
      + this.options.headerPrefix
      + slugger.slug(raw)
      + '">'
      + text
      + '</h'
      + level
      + '>\n';
  }
  // ignore IDs
  return '<h' + level + '>' + text + '</h' + level + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
  return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.checkbox = function(checked) {
  return '<input '
    + (checked ? 'checked="" ' : '')
    + 'disabled="" type="checkbox"'
    + (this.options.xhtml ? ' /' : '')
    + '> ';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  if (body) body = '<tbody>' + body + '</tbody>';

  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + body
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' align="' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }
  var out = '<a href="' + escape(href) + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }

  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * TextRenderer
 * returns only the textual part of the token
 */

function TextRenderer() {}

// no need for block level renderers

TextRenderer.prototype.strong =
TextRenderer.prototype.em =
TextRenderer.prototype.codespan =
TextRenderer.prototype.del =
TextRenderer.prototype.text = function(text) {
  return text;
};

TextRenderer.prototype.link =
TextRenderer.prototype.image = function(href, title, text) {
  return '' + text;
};

TextRenderer.prototype.br = function() {
  return '';
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer();
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
  this.slugger = new Slugger();
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  // use an InlineLexer with a TextRenderer to extract pure text
  this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, { renderer: new TextRenderer() })
  );
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  this.token = this.tokens.pop();
  return this.token;
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        unescape(this.inlineText.output(this.token.text)),
        this.slugger);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
          body = '',
          i,
          row,
          cell,
          j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      body = '';
      var ordered = this.token.ordered,
          start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';
      var loose = this.token.loose;
      var checked = this.token.checked;
      var task = this.token.task;

      if (this.token.task) {
        body += this.renderer.checkbox(checked);
      }

      while (this.next().type !== 'list_item_end') {
        body += !loose && this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }
      return this.renderer.listitem(body, task, checked);
    }
    case 'html': {
      // TODO parse inline content if parameter markdown=1
      return this.renderer.html(this.token.text);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
    default: {
      var errMsg = 'Token with "' + this.token.type + '" type was not found.';
      if (this.options.silent) {
        console.log(errMsg);
      } else {
        throw new Error(errMsg);
      }
    }
  }
};

/**
 * Slugger generates header id
 */

function Slugger() {
  this.seen = {};
}

/**
 * Convert string to unique id
 */

Slugger.prototype.slug = function(value) {
  var slug = value
    .toLowerCase()
    .trim()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
    .replace(/\s/g, '-');

  if (this.seen.hasOwnProperty(slug)) {
    var originalSlug = slug;
    do {
      this.seen[originalSlug]++;
      slug = originalSlug + '-' + this.seen[originalSlug];
    } while (this.seen.hasOwnProperty(slug));
  }
  this.seen[slug] = 0;

  return slug;
};

/**
 * Helpers
 */

function escape(html, encode) {
  if (encode) {
    if (escape.escapeTest.test(html)) {
      return html.replace(escape.escapeReplace, function(ch) { return escape.replacements[ch]; });
    }
  } else {
    if (escape.escapeTestNoEncode.test(html)) {
      return html.replace(escape.escapeReplaceNoEncode, function(ch) { return escape.replacements[ch]; });
    }
  }

  return html;
}

escape.escapeTest = /[&<>"']/;
escape.escapeReplace = /[&<>"']/g;
escape.replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || '';
  return {
    replace: function(name, val) {
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return this;
    },
    getRegex: function() {
      return new RegExp(regex, opt);
    }
  };
}

function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1,
      target,
      key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  var row = tableRow.replace(/\|/g, function(match, offset, str) {
        var escaped = false,
            curr = offset;
        while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
        if (escaped) {
          // odd number of slashes means | is escaped
          // so we leave it alone
          return '|';
        } else {
          // add space before unescaped |
          return ' |';
        }
      }),
      cells = row.split(/ \|/),
      i = 0;

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) cells.push('');
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

// Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
// /c*$/ is vulnerable to REDOS.
// invert: Remove suffix of non-c chars instead. Default falsey.
function rtrim(str, c, invert) {
  if (str.length === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  var suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < str.length) {
    var currChar = str.charAt(str.length - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.substr(0, str.length - suffLen);
}

function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  var level = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] === '\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
  }
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});
    checkSanitizeDeprecation(opt);

    var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    checkSanitizeDeprecation(opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.getDefaults = function() {
  return {
    baseUrl: null,
    breaks: false,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: new Renderer(),
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    xhtml: false
  };
};

marked.defaults = marked.getDefaults();

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.Slugger = Slugger;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  root.marked = marked;
}
})(this || (typeof window !== 'undefined' ? window : global));

;
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function (_self){

// Private helper vars
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
var uniqueId = 0;

var _ = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (Array.isArray(tokens)) {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).slice(8, -1);
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function deepClone(o, visited) {
			var clone, id, type = _.util.type(o);
			visited = visited || {};

			switch (type) {
				case 'Object':
					id = _.util.objId(o);
					if (visited[id]) {
						return visited[id];
					}
					clone = {};
					visited[id] = clone;

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = deepClone(o[key], visited);
						}
					}

					return clone;

				case 'Array':
					id = _.util.objId(o);
					if (visited[id]) {
						return visited[id];
					}
					clone = [];
					visited[id] = clone;

					o.forEach(function (v, i) {
						clone[i] = deepClone(v, visited);
					});

					return clone;

				default:
					return o;
			}
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need an object and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			var ret = {};

			for (var token in grammar) {
				if (grammar.hasOwnProperty(token)) {

					if (token == before) {
						for (var newToken in insert) {
							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					// Do not insert token which also occur in insert. See #1525
					if (!insert.hasOwnProperty(token)) {
						ret[token] = grammar[token];
					}
				}
			}

			var old = root[inside];
			root[inside] = ret;

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === old && key != inside) {
					this[key] = ret;
				}
			});

			return ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function DFS(o, callback, type, visited) {
			visited = visited || {};

			var objId = _.util.objId;

			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					var property = o[i],
					    propertyType = _.util.type(property);

					if (propertyType === 'Object' && !visited[objId(property)]) {
						visited[objId(property)] = true;
						DFS(property, callback, null, visited);
					}
					else if (propertyType === 'Array' && !visited[objId(property)]) {
						visited[objId(property)] = true;
						DFS(property, callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		_.highlightAllUnder(document, async, callback);
	},

	highlightAllUnder: function(container, async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run('before-highlightall', env);

		var elements = container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language = 'none', grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,'none'])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		var insertHighlightedCode = function (highlightedCode) {
			env.highlightedCode = highlightedCode;

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
			callback && callback.call(env.element);
		}

		_.hooks.run('before-sanity-check', env);

		if (!env.code) {
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (!env.grammar) {
			insertHighlightedCode(_.util.encode(env.code));
			return;
		}

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				insertHighlightedCode(evt.data);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
		}
	},

	highlight: function (text, grammar, language) {
		var env = {
			code: text,
			grammar: grammar,
			language: language
		};
		_.hooks.run('before-tokenize', env);
		env.tokens = _.tokenize(env.code, env.grammar);
		_.hooks.run('after-tokenize', env);
		return Token.stringify(_.util.encode(env.tokens), env.language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					if (greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						var match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						if (strarr[i] instanceof Token) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						pattern.lastIndex = 0;

						var match = pattern.exec(str),
							delNum = 1;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1] ? match[1].length : 0;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	},

	Token: Token
};

_self.Prism = _;

function Token(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
}

Token.stringify = function(o, language) {
	if (typeof o == 'string') {
		return o;
	}

	if (Array.isArray(o)) {
		return o.map(function(element) {
			return Token.stringify(element, language);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language
	};

	if (o.alias) {
		var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _;

})(_self);

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\s\S]*?-->/,
	'prolog': /<\?[\s\S]+?\?>/,
	'doctype': /<!DOCTYPE[\s\S]+?>/i,
	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
		greedy: true,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /^(\s*)["']|["']$/,
							lookbehind: true
						}
					]
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
	Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
	/**
	 * Adds an inlined language to markup.
	 *
	 * An example of an inlined language is CSS with `<style>` tags.
	 *
	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
	 * case insensitive.
	 * @param {string} lang The language key.
	 * @example
	 * addInlined('style', 'css');
	 */
	value: function addInlined(tagName, lang) {
		var includedCdataInside = {};
		includedCdataInside['language-' + lang] = {
			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
			lookbehind: true,
			inside: Prism.languages[lang]
		};
		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

		var inside = {
			'included-cdata': {
				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
				inside: includedCdataInside
			}
		};
		inside['language-' + lang] = {
			pattern: /[\s\S]+/,
			inside: Prism.languages[lang]
		};

		var def = {};
		def[tagName] = {
			pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, tagName), 'i'),
			lookbehind: true,
			greedy: true,
			inside: inside
		};

		Prism.languages.insertBefore('markup', 'cdata', def);
	}
});

Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

(function (Prism) {

	var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

	Prism.languages.css = {
		'comment': /\/\*[\s\S]*?\*\//,
		'atrule': {
			pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
			inside: {
				'rule': /@[\w-]+/
				// See rest below
			}
		},
		'url': {
			pattern: RegExp('url\\((?:' + string.source + '|[^\n\r()]*)\\)', 'i'),
			inside: {
				'function': /^url/i,
				'punctuation': /^\(|\)$/
			}
		},
		'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
		'string': {
			pattern: string,
			greedy: true
		},
		'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
		'important': /!important\b/i,
		'function': /[-a-z0-9]+(?=\()/i,
		'punctuation': /[(){};:,]/
	};

	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

	var markup = Prism.languages.markup;
	if (markup) {
		markup.tag.addInlined('style', 'css');

		Prism.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
				inside: {
					'attr-name': {
						pattern: /^\s*style/i,
						inside: markup.tag.inside
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/i,
						inside: Prism.languages.css
					}
				},
				alias: 'language-css'
			}
		}, markup.tag);
	}

}(Prism));


/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /[.\\]/
		}
	},
	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /\w+(?=\()/,
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'class-name': [
		Prism.languages.clike['class-name'],
		{
			pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
			lookbehind: true
		}
	],
	'keyword': [
		{
			pattern: /((?:^|})\s*)(?:catch|finally)\b/,
			lookbehind: true
		},
		{
			pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
			lookbehind: true
		},
	],
	'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
		alias: 'function'
	},
	'parameter': [
		{
			pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
			lookbehind: true,
			inside: Prism.languages.javascript
		},
		{
			pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
			inside: Prism.languages.javascript
		},
		{
			pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
			lookbehind: true,
			inside: Prism.languages.javascript
		},
		{
			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
			lookbehind: true,
			inside: Prism.languages.javascript
		}
	],
	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
		greedy: true,
		inside: {
			'template-punctuation': {
				pattern: /^`|`$/,
				alias: 'string'
			},
			'interpolation': {
				pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
				lookbehind: true,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\${|}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.markup.tag.addInlined('script', 'javascript');
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	/**
	 * @param {Element} [container=document]
	 */
	self.Prism.fileHighlight = function(container) {
		container = container || document;

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		Array.prototype.slice.call(container.querySelectorAll('pre[data-src]')).forEach(function (pre) {
			// ignore if already loaded
			if (pre.hasAttribute('data-src-loaded')) {
				return;
			}

			// load current
			var src = pre.getAttribute('data-src');

			var language, parent = pre;
			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (pre.className.match(lang) || [, ''])[1];
			}

			if (!language) {
				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
				language = Extensions[extension] || extension;
			}

			var code = document.createElement('code');
			code.className = 'language-' + language;

			pre.textContent = '';

			code.textContent = 'Loading…';

			pre.appendChild(code);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', src, true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {

					if (xhr.status < 400 && xhr.responseText) {
						code.textContent = xhr.responseText;

						Prism.highlightElement(code);
						// mark as loaded
						pre.setAttribute('data-src-loaded', '');
					}
					else if (xhr.status >= 400) {
						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					}
					else {
						code.textContent = '✖ Error: File does not exist or is empty';
					}
				}
			};

			xhr.send(null);
		});

		if (Prism.plugins.toolbar) {
			Prism.plugins.toolbar.registerButton('download-file', function (env) {
				var pre = env.element.parentNode;
				if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
					return;
				}
				var src = pre.getAttribute('data-src');
				var a = document.createElement('a');
				a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
				a.setAttribute('download', '');
				a.href = src;
				return a;
			});
		}

	};

	document.addEventListener('DOMContentLoaded', function () {
		// execute inside handler, for dropping Event as argument
		self.Prism.fileHighlight();
	});

})();

;/* PrismJS 1.16.0
https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+css+clike+javascript+bash+javadoclike+json+typescript+jsdoc+scss */
var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(g){var c=/\blang(?:uage)?-([\w-]+)\b/i,a=0,C={manual:g.Prism&&g.Prism.manual,disableWorkerMessageHandler:g.Prism&&g.Prism.disableWorkerMessageHandler,util:{encode:function(e){return e instanceof M?new M(e.type,C.util.encode(e.content),e.alias):Array.isArray(e)?e.map(C.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++a}),e.__id},clone:function n(e,t){var r,a,i=C.util.type(e);switch(t=t||{},i){case"Object":if(a=C.util.objId(e),t[a])return t[a];for(var l in r={},t[a]=r,e)e.hasOwnProperty(l)&&(r[l]=n(e[l],t));return r;case"Array":return a=C.util.objId(e),t[a]?t[a]:(r=[],t[a]=r,e.forEach(function(e,a){r[a]=n(e,t)}),r);default:return e}}},languages:{extend:function(e,a){var n=C.util.clone(C.languages[e]);for(var t in a)n[t]=a[t];return n},insertBefore:function(n,e,a,t){var r=(t=t||C.languages)[n],i={};for(var l in r)if(r.hasOwnProperty(l)){if(l==e)for(var o in a)a.hasOwnProperty(o)&&(i[o]=a[o]);a.hasOwnProperty(l)||(i[l]=r[l])}var s=t[n];return t[n]=i,C.languages.DFS(C.languages,function(e,a){a===s&&e!=n&&(this[e]=i)}),i},DFS:function e(a,n,t,r){r=r||{};var i=C.util.objId;for(var l in a)if(a.hasOwnProperty(l)){n.call(a,l,a[l],t||l);var o=a[l],s=C.util.type(o);"Object"!==s||r[i(o)]?"Array"!==s||r[i(o)]||(r[i(o)]=!0,e(o,n,l,r)):(r[i(o)]=!0,e(o,n,null,r))}}},plugins:{},highlightAll:function(e,a){C.highlightAllUnder(document,e,a)},highlightAllUnder:function(e,a,n){var t={callback:n,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};C.hooks.run("before-highlightall",t);for(var r,i=t.elements||e.querySelectorAll(t.selector),l=0;r=i[l++];)C.highlightElement(r,!0===a,t.callback)},highlightElement:function(e,a,n){for(var t,r="none",i=e;i&&!c.test(i.className);)i=i.parentNode;i&&(r=(i.className.match(c)||[,"none"])[1].toLowerCase(),t=C.languages[r]),e.className=e.className.replace(c,"").replace(/\s+/g," ")+" language-"+r,e.parentNode&&(i=e.parentNode,/pre/i.test(i.nodeName)&&(i.className=i.className.replace(c,"").replace(/\s+/g," ")+" language-"+r));var l={element:e,language:r,grammar:t,code:e.textContent},o=function(e){l.highlightedCode=e,C.hooks.run("before-insert",l),l.element.innerHTML=l.highlightedCode,C.hooks.run("after-highlight",l),C.hooks.run("complete",l),n&&n.call(l.element)};if(C.hooks.run("before-sanity-check",l),l.code)if(C.hooks.run("before-highlight",l),l.grammar)if(a&&g.Worker){var s=new Worker(C.filename);s.onmessage=function(e){o(e.data)},s.postMessage(JSON.stringify({language:l.language,code:l.code,immediateClose:!0}))}else o(C.highlight(l.code,l.grammar,l.language));else o(C.util.encode(l.code));else C.hooks.run("complete",l)},highlight:function(e,a,n){var t={code:e,grammar:a,language:n};return C.hooks.run("before-tokenize",t),t.tokens=C.tokenize(t.code,t.grammar),C.hooks.run("after-tokenize",t),M.stringify(C.util.encode(t.tokens),t.language)},matchGrammar:function(e,a,n,t,r,i,l){for(var o in n)if(n.hasOwnProperty(o)&&n[o]){if(o==l)return;var s=n[o];s="Array"===C.util.type(s)?s:[s];for(var g=0;g<s.length;++g){var c=s[g],u=c.inside,h=!!c.lookbehind,f=!!c.greedy,d=0,m=c.alias;if(f&&!c.pattern.global){var p=c.pattern.toString().match(/[imuy]*$/)[0];c.pattern=RegExp(c.pattern.source,p+"g")}c=c.pattern||c;for(var y=t,v=r;y<a.length;v+=a[y].length,++y){var k=a[y];if(a.length>e.length)return;if(!(k instanceof M)){if(f&&y!=a.length-1){if(c.lastIndex=v,!(x=c.exec(e)))break;for(var b=x.index+(h?x[1].length:0),w=x.index+x[0].length,A=y,P=v,O=a.length;A<O&&(P<w||!a[A].type&&!a[A-1].greedy);++A)(P+=a[A].length)<=b&&(++y,v=P);if(a[y]instanceof M)continue;N=A-y,k=e.slice(v,P),x.index-=v}else{c.lastIndex=0;var x=c.exec(k),N=1}if(x){h&&(d=x[1]?x[1].length:0);w=(b=x.index+d)+(x=x[0].slice(d)).length;var j=k.slice(0,b),S=k.slice(w),E=[y,N];j&&(++y,v+=j.length,E.push(j));var _=new M(o,u?C.tokenize(x,u):x,m,x,f);if(E.push(_),S&&E.push(S),Array.prototype.splice.apply(a,E),1!=N&&C.matchGrammar(e,a,n,y,v,!0,o),i)break}else if(i)break}}}}},tokenize:function(e,a){var n=[e],t=a.rest;if(t){for(var r in t)a[r]=t[r];delete a.rest}return C.matchGrammar(e,n,a,0,0,!1),n},hooks:{all:{},add:function(e,a){var n=C.hooks.all;n[e]=n[e]||[],n[e].push(a)},run:function(e,a){var n=C.hooks.all[e];if(n&&n.length)for(var t,r=0;t=n[r++];)t(a)}},Token:M};function M(e,a,n,t,r){this.type=e,this.content=a,this.alias=n,this.length=0|(t||"").length,this.greedy=!!r}if(g.Prism=C,M.stringify=function(e,a){if("string"==typeof e)return e;if(Array.isArray(e))return e.map(function(e){return M.stringify(e,a)}).join("");var n={type:e.type,content:M.stringify(e.content,a),tag:"span",classes:["token",e.type],attributes:{},language:a};if(e.alias){var t=Array.isArray(e.alias)?e.alias:[e.alias];Array.prototype.push.apply(n.classes,t)}C.hooks.run("wrap",n);var r=Object.keys(n.attributes).map(function(e){return e+'="'+(n.attributes[e]||"").replace(/"/g,"&quot;")+'"'}).join(" ");return"<"+n.tag+' class="'+n.classes.join(" ")+'"'+(r?" "+r:"")+">"+n.content+"</"+n.tag+">"},!g.document)return g.addEventListener&&(C.disableWorkerMessageHandler||g.addEventListener("message",function(e){var a=JSON.parse(e.data),n=a.language,t=a.code,r=a.immediateClose;g.postMessage(C.highlight(t,C.languages[n],n)),r&&g.close()},!1)),C;var e=document.currentScript||[].slice.call(document.getElementsByTagName("script")).pop();return e&&(C.filename=e.src,C.manual||e.hasAttribute("data-manual")||("loading"!==document.readyState?window.requestAnimationFrame?window.requestAnimationFrame(C.highlightAll):window.setTimeout(C.highlightAll,16):document.addEventListener("DOMContentLoaded",C.highlightAll))),C}(_self);"undefined"!=typeof module&&module.exports&&(module.exports=Prism),"undefined"!=typeof global&&(global.Prism=Prism);
Prism.languages.markup={comment:/<!--[\s\S]*?-->/,prolog:/<\?[\s\S]+?\?>/,doctype:/<!DOCTYPE[\s\S]+?>/i,cdata:/<!\[CDATA\[[\s\S]*?]]>/i,tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/i,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,inside:{punctuation:[/^=/,{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:/&#?[\da-z]{1,8};/i},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.hooks.add("wrap",function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))}),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(a,e){var s={};s["language-"+e]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[e]},s.cdata=/^<!\[CDATA\[|\]\]>$/i;var n={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:s}};n["language-"+e]={pattern:/[\s\S]+/,inside:Prism.languages[e]};var i={};i[a]={pattern:RegExp("(<__[\\s\\S]*?>)(?:<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\s*|[\\s\\S])*?(?=<\\/__>)".replace(/__/g,a),"i"),lookbehind:!0,greedy:!0,inside:n},Prism.languages.insertBefore("markup","cdata",i)}}),Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup;
!function(s){var e=/("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;s.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:/@[\w-]+?[\s\S]*?(?:;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:RegExp("url\\((?:"+e.source+"|.*?)\\)","i"),selector:RegExp("[^{}\\s](?:[^{};\"']|"+e.source+")*?(?=\\s*\\{)"),string:{pattern:e,greedy:!0},property:/[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,important:/!important\b/i,function:/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:,]/},s.languages.css.atrule.inside.rest=s.languages.css;var a=s.languages.markup;a&&(a.tag.addInlined("style","css"),s.languages.insertBefore("inside","attr-value",{"style-attr":{pattern:/\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:a.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:s.languages.css}},alias:"language-css"}},a.tag))}(Prism);
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,boolean:/\b(?:true|false)\b/,function:/\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/};
Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,lookbehind:!0}],keyword:[{pattern:/((?:^|})\s*)(?:catch|finally)\b/,lookbehind:!0},{pattern:/(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],number:/\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,function:/[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,operator:/-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/}),Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/,Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,lookbehind:!0,greedy:!0},"function-variable":{pattern:/[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore("javascript","string",{"template-string":{pattern:/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|[^\\`])*`/,greedy:!0,inside:{interpolation:{pattern:/\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,inside:{"interpolation-punctuation":{pattern:/^\${|}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}}}),Prism.languages.markup&&Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.js=Prism.languages.javascript;
!function(e){var a={variable:[{pattern:/\$?\(\([\s\S]+?\)\)/,inside:{variable:[{pattern:/(^\$\(\([\s\S]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,operator:/--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\([^)]+\)|`[^`]+`/,greedy:!0,inside:{variable:/^\$\(|^`|\)$|`$/}},/\$(?:[\w#?*!@]+|\{[^}]+\})/i]};e.languages.bash={shebang:{pattern:/^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,alias:"important"},comment:{pattern:/(^|[^"{\\])#.*/,lookbehind:!0},string:[{pattern:/((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,lookbehind:!0,greedy:!0,inside:a},{pattern:/(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/,greedy:!0,inside:a}],variable:a.variable,function:{pattern:/(^|[\s;|&])(?:add|alias|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|hash|head|help|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logout|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tail|tar|tee|test|time|timeout|times|top|touch|tr|traceroute|trap|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zip|zypper)(?=$|[\s;|&])/,lookbehind:!0},keyword:{pattern:/(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,lookbehind:!0},boolean:{pattern:/(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/,lookbehind:!0},operator:/&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];]/};var t=a.variable[1].inside;t.string=e.languages.bash.string,t.function=e.languages.bash.function,t.keyword=e.languages.bash.keyword,t.boolean=e.languages.bash.boolean,t.operator=e.languages.bash.operator,t.punctuation=e.languages.bash.punctuation,e.languages.shell=e.languages.bash}(Prism);
!function(p){var a=p.languages.javadoclike={parameter:{pattern:/(^\s*(?:\/{3}|\*|\/\*\*)\s*@(?:param|arg|arguments)\s+)\w+/m,lookbehind:!0},keyword:{pattern:/(^\s*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,lookbehind:!0},punctuation:/[{}]/};Object.defineProperty(a,"addSupport",{value:function(a,e){"string"==typeof a&&(a=[a]),a.forEach(function(a){!function(a,e){var n="doc-comment",t=p.languages[a];if(t){var r=t[n];if(!r){var i={"doc-comment":{pattern:/(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,alias:"comment"}};r=(t=p.languages.insertBefore(a,"comment",i))[n]}if(r instanceof RegExp&&(r=t[n]={pattern:r}),Array.isArray(r))for(var o=0,s=r.length;o<s;o++)r[o]instanceof RegExp&&(r[o]={pattern:r[o]}),e(r[o]);else e(r)}}(a,function(a){a.inside||(a.inside={}),a.inside.rest=e})})}}),a.addSupport(["java","javascript","php"],a)}(Prism);
Prism.languages.json={property:{pattern:/"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,greedy:!0},string:{pattern:/"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,greedy:!0},comment:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,number:/-?\d+\.?\d*(e[+-]?\d+)?/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:true|false)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}};
Prism.languages.typescript=Prism.languages.extend("javascript",{keyword:/\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,builtin:/\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/}),Prism.languages.ts=Prism.languages.typescript;
!function(a){var e=a.languages.javascript,n="{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})+}",s="(@(?:param|arg|argument|property)\\s+(?:"+n+"\\s+)?)";a.languages.jsdoc=a.languages.extend("javadoclike",{parameter:{pattern:RegExp(s+"[$\\w\\xA0-\\uFFFF.]+(?=\\s|$)"),lookbehind:!0,inside:{punctuation:/\./}}}),a.languages.insertBefore("jsdoc","keyword",{"optional-parameter":{pattern:RegExp(s+"\\[[$\\w\\xA0-\\uFFFF.]+(?:=[^[\\]]+)?\\](?=\\s|$)"),lookbehind:!0,inside:{parameter:{pattern:/(^\[)[$\w\xA0-\uFFFF\.]+/,lookbehind:!0,inside:{punctuation:/\./}},code:{pattern:/(=)[\s\S]*(?=\]$)/,lookbehind:!0,inside:e,alias:"language-javascript"},punctuation:/[=[\]]/}},"class-name":[{pattern:RegExp("(@[a-z]+\\s+)"+n),lookbehind:!0,inside:{punctuation:/[.,:?=<>|{}()[\]]/}},{pattern:/(@(?:augments|extends|class|interface|memberof!?|this)\s+)[A-Z]\w*(?:\.[A-Z]\w*)*/,lookbehind:!0,inside:{punctuation:/\./}}],example:{pattern:/(@example\s+)[^@]+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,lookbehind:!0,inside:{code:{pattern:/^(\s*(?:\*\s*)?).+$/m,lookbehind:!0,inside:e,alias:"language-javascript"}}}}),a.languages.javadoclike.addSupport("javascript",a.languages.jsdoc)}(Prism);
Prism.languages.scss=Prism.languages.extend("css",{comment:{pattern:/(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,lookbehind:!0},atrule:{pattern:/@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,inside:{rule:/@[\w-]+/}},url:/(?:[-a-z]+-)*url(?=\()/i,selector:{pattern:/(?=\S)[^@;{}()]?(?:[^@;{}()]|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,inside:{parent:{pattern:/&/,alias:"important"},placeholder:/%[-\w]+/,variable:/\$[-\w]+|#\{\$[-\w]+\}/}},property:{pattern:/(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/,inside:{variable:/\$[-\w]+|#\{\$[-\w]+\}/}}}),Prism.languages.insertBefore("scss","atrule",{keyword:[/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,{pattern:/( +)(?:from|through)(?= )/,lookbehind:!0}]}),Prism.languages.insertBefore("scss","important",{variable:/\$[-\w]+|#\{\$[-\w]+\}/}),Prism.languages.insertBefore("scss","function",{placeholder:{pattern:/%[-\w]+/,alias:"selector"},statement:{pattern:/\B!(?:default|optional)\b/i,alias:"keyword"},boolean:/\b(?:true|false)\b/,null:{pattern:/\bnull\b/,alias:"keyword"},operator:{pattern:/(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,lookbehind:!0}}),Prism.languages.scss.atrule.inside.rest=Prism.languages.scss;

;//! openseadragon 2.4.1
//! Built on 2019-07-03
//! Git commit: v2.4.1-0-244790e
//! http://openseadragon.github.io
//! License: http://openseadragon.github.io/license/


function OpenSeadragon(e){return new OpenSeadragon.Viewer(e)}!function(n){n.version={versionStr:"2.4.1",major:parseInt("2",10),minor:parseInt("4",10),revision:parseInt("1",10)};var t={"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regexp","[object Object]":"object"},i=Object.prototype.toString,o=Object.prototype.hasOwnProperty;n.isFunction=function(e){return"function"===n.type(e)};n.isArray=Array.isArray||function(e){return"array"===n.type(e)};n.isWindow=function(e){return e&&"object"==typeof e&&"setInterval"in e};n.type=function(e){return null==e?String(e):t[i.call(e)]||"object"};n.isPlainObject=function(e){if(!e||"object"!==OpenSeadragon.type(e)||e.nodeType||n.isWindow(e))return!1;if(e.constructor&&!o.call(e,"constructor")&&!o.call(e.constructor.prototype,"isPrototypeOf"))return!1;var t;for(var i in e)t=i;return void 0===t||o.call(e,t)};n.isEmptyObject=function(e){for(var t in e)return!1;return!0};n.freezeObject=function(e){Object.freeze?n.freezeObject=Object.freeze:n.freezeObject=function(e){return e};return n.freezeObject(e)};n.supportsCanvas=(e=document.createElement("canvas"),!(!n.isFunction(e.getContext)||!e.getContext("2d")));var e;n.isCanvasTainted=function(e){var t=!1;try{e.getContext("2d").getImageData(0,0,1,1)}catch(e){t=!0}return t};n.pixelDensityRatio=function(){if(n.supportsCanvas){var e=document.createElement("canvas").getContext("2d");var t=window.devicePixelRatio||1;var i=e.webkitBackingStorePixelRatio||e.mozBackingStorePixelRatio||e.msBackingStorePixelRatio||e.oBackingStorePixelRatio||e.backingStorePixelRatio||1;return Math.max(t,1)/i}return 1}()}(OpenSeadragon);!function($){$.extend=function(){var e,t,i,n,o,r,s=arguments[0]||{},a=arguments.length,l=!1,h=1;if("boolean"==typeof s){l=s;s=arguments[1]||{};h=2}"object"==typeof s||OpenSeadragon.isFunction(s)||(s={});if(a===h){s=this;--h}for(;h<a;h++)if(null!==(e=arguments[h])||void 0!==e)for(t in e){i=s[t];if(s!==(n=e[t]))if(l&&n&&(OpenSeadragon.isPlainObject(n)||(o=OpenSeadragon.isArray(n)))){if(o){o=!1;r=i&&OpenSeadragon.isArray(i)?i:[]}else r=i&&OpenSeadragon.isPlainObject(i)?i:{};s[t]=OpenSeadragon.extend(l,r,n)}else void 0!==n&&(s[t]=n)}return s};var isIOSDevice=function(){if("object"!=typeof navigator)return!1;var e=navigator.userAgent;return"string"==typeof e&&(-1!==e.indexOf("iPhone")||-1!==e.indexOf("iPad")||-1!==e.indexOf("iPod"))};$.extend($,{DEFAULT_SETTINGS:{xmlPath:null,tileSources:null,tileHost:null,initialPage:0,crossOriginPolicy:!1,ajaxWithCredentials:!1,loadTilesWithAjax:!1,ajaxHeaders:{},panHorizontal:!0,panVertical:!0,constrainDuringPan:!1,wrapHorizontal:!1,wrapVertical:!1,visibilityRatio:.5,minPixelRatio:.5,defaultZoomLevel:0,minZoomLevel:null,maxZoomLevel:null,homeFillsViewer:!1,clickTimeThreshold:300,clickDistThreshold:5,dblClickTimeThreshold:300,dblClickDistThreshold:20,springStiffness:6.5,animationTime:1.2,gestureSettingsMouse:{scrollToZoom:!0,clickToZoom:!0,dblClickToZoom:!1,pinchToZoom:!1,zoomToRefPoint:!0,flickEnabled:!1,flickMinSpeed:120,flickMomentum:.25,pinchRotate:!1},gestureSettingsTouch:{scrollToZoom:!1,clickToZoom:!1,dblClickToZoom:!0,pinchToZoom:!0,zoomToRefPoint:!0,flickEnabled:!0,flickMinSpeed:120,flickMomentum:.25,pinchRotate:!1},gestureSettingsPen:{scrollToZoom:!1,clickToZoom:!0,dblClickToZoom:!1,pinchToZoom:!1,zoomToRefPoint:!0,flickEnabled:!1,flickMinSpeed:120,flickMomentum:.25,pinchRotate:!1},gestureSettingsUnknown:{scrollToZoom:!1,clickToZoom:!1,dblClickToZoom:!0,pinchToZoom:!0,zoomToRefPoint:!0,flickEnabled:!0,flickMinSpeed:120,flickMomentum:.25,pinchRotate:!1},zoomPerClick:2,zoomPerScroll:1.2,zoomPerSecond:1,blendTime:0,alwaysBlend:!1,autoHideControls:!0,immediateRender:!1,minZoomImageRatio:.9,maxZoomPixelRatio:1.1,smoothTileEdgesMinZoom:1.1,iOSDevice:isIOSDevice(),pixelsPerWheelLine:40,pixelsPerArrowPress:40,autoResize:!0,preserveImageSizeOnResize:!1,minScrollDeltaTime:50,rotationIncrement:90,showSequenceControl:!0,sequenceControlAnchor:null,preserveViewport:!1,preserveOverlays:!1,navPrevNextWrap:!1,showNavigationControl:!0,navigationControlAnchor:null,showZoomControl:!0,showHomeControl:!0,showFullPageControl:!0,showRotationControl:!1,showFlipControl:!1,controlsFadeDelay:2e3,controlsFadeLength:1500,mouseNavEnabled:!0,showNavigator:!1,navigatorId:null,navigatorPosition:null,navigatorSizeRatio:.2,navigatorMaintainSizeRatio:!1,navigatorTop:null,navigatorLeft:null,navigatorHeight:null,navigatorWidth:null,navigatorAutoResize:!0,navigatorAutoFade:!0,navigatorRotate:!0,navigatorBackground:"#000",navigatorOpacity:.8,navigatorBorderColor:"#555",navigatorDisplayRegionColor:"#900",degrees:0,flipped:!1,opacity:1,preload:!1,compositeOperation:null,imageSmoothingEnabled:!0,placeholderFillStyle:null,showReferenceStrip:!1,referenceStripScroll:"horizontal",referenceStripElement:null,referenceStripHeight:null,referenceStripWidth:null,referenceStripPosition:"BOTTOM_LEFT",referenceStripSizeRatio:.2,collectionRows:3,collectionColumns:0,collectionLayout:"horizontal",collectionMode:!1,collectionTileSize:800,collectionTileMargin:80,imageLoaderLimit:0,maxImageCacheCount:200,timeout:3e4,useCanvas:!0,prefixUrl:"/images/",navImages:{zoomIn:{REST:"zoomin_rest.png",GROUP:"zoomin_grouphover.png",HOVER:"zoomin_hover.png",DOWN:"zoomin_pressed.png"},zoomOut:{REST:"zoomout_rest.png",GROUP:"zoomout_grouphover.png",HOVER:"zoomout_hover.png",DOWN:"zoomout_pressed.png"},home:{REST:"home_rest.png",GROUP:"home_grouphover.png",HOVER:"home_hover.png",DOWN:"home_pressed.png"},fullpage:{REST:"fullpage_rest.png",GROUP:"fullpage_grouphover.png",HOVER:"fullpage_hover.png",DOWN:"fullpage_pressed.png"},rotateleft:{REST:"rotateleft_rest.png",GROUP:"rotateleft_grouphover.png",HOVER:"rotateleft_hover.png",DOWN:"rotateleft_pressed.png"},rotateright:{REST:"rotateright_rest.png",GROUP:"rotateright_grouphover.png",HOVER:"rotateright_hover.png",DOWN:"rotateright_pressed.png"},flip:{REST:"flip_rest.png",GROUP:"flip_grouphover.png",HOVER:"flip_hover.png",DOWN:"flip_pressed.png"},previous:{REST:"previous_rest.png",GROUP:"previous_grouphover.png",HOVER:"previous_hover.png",DOWN:"previous_pressed.png"},next:{REST:"next_rest.png",GROUP:"next_grouphover.png",HOVER:"next_hover.png",DOWN:"next_pressed.png"}},debugMode:!1,debugGridColor:["#437AB2","#1B9E77","#D95F02","#7570B3","#E7298A","#66A61E","#E6AB02","#A6761D","#666666"]},SIGNAL:"----seadragon----",delegate:function(t,i){return function(){var e=arguments;void 0===e&&(e=[]);return i.apply(t,e)}},BROWSERS:{UNKNOWN:0,IE:1,FIREFOX:2,SAFARI:3,CHROME:4,OPERA:5},getElement:function(e){"string"==typeof e&&(e=document.getElementById(e));return e},getElementPosition:function(e){var t,i,n=new $.Point;i=getOffsetParent(e=$.getElement(e),t="fixed"==$.getElementStyle(e).position);for(;i;){n.x+=e.offsetLeft;n.y+=e.offsetTop;t&&(n=n.plus($.getPageScroll()));i=getOffsetParent(e=i,t="fixed"==$.getElementStyle(e).position)}return n},getElementOffset:function(e){var t,i,n=(e=$.getElement(e))&&e.ownerDocument,o={top:0,left:0};if(!n)return new $.Point;t=n.documentElement;void 0!==e.getBoundingClientRect&&(o=e.getBoundingClientRect());i=n==n.window?n:9===n.nodeType&&(n.defaultView||n.parentWindow);return new $.Point(o.left+(i.pageXOffset||t.scrollLeft)-(t.clientLeft||0),o.top+(i.pageYOffset||t.scrollTop)-(t.clientTop||0))},getElementSize:function(e){e=$.getElement(e);return new $.Point(e.clientWidth,e.clientHeight)},getElementStyle:document.documentElement.currentStyle?function(e){return(e=$.getElement(e)).currentStyle}:function(e){e=$.getElement(e);return window.getComputedStyle(e,"")},getCssPropertyWithVendorPrefix:function(e){var a={};$.getCssPropertyWithVendorPrefix=function(e){if(void 0!==a[e])return a[e];var t=document.createElement("div").style;var i=null;if(void 0!==t[e])i=e;else{var n=["Webkit","Moz","MS","O","webkit","moz","ms","o"];var o=$.capitalizeFirstLetter(e);for(var r=0;r<n.length;r++){var s=n[r]+o;if(void 0!==t[s]){i=s;break}}}return a[e]=i};return $.getCssPropertyWithVendorPrefix(e)},capitalizeFirstLetter:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},positiveModulo:function(e,t){var i=e%t;i<0&&(i+=t);return i},pointInElement:function(e,t){e=$.getElement(e);var i=$.getElementOffset(e),n=$.getElementSize(e);return t.x>=i.x&&t.x<i.x+n.x&&t.y<i.y+n.y&&t.y>=i.y},getEvent:function(e){$.getEvent=e?function(e){return e}:function(){return window.event};return $.getEvent(e)},getMousePosition:function(e){if("number"==typeof e.pageX)$.getMousePosition=function(e){var t=new $.Point;e=$.getEvent(e);t.x=e.pageX;t.y=e.pageY;return t};else{if("number"!=typeof e.clientX)throw new Error("Unknown event mouse position, no known technique.");$.getMousePosition=function(e){var t=new $.Point;e=$.getEvent(e);t.x=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;t.y=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;return t}}return $.getMousePosition(e)},getPageScroll:function(){var e=document.documentElement||{},t=document.body||{};if("number"==typeof window.pageXOffset)$.getPageScroll=function(){return new $.Point(window.pageXOffset,window.pageYOffset)};else if(t.scrollLeft||t.scrollTop)$.getPageScroll=function(){return new $.Point(document.body.scrollLeft,document.body.scrollTop)};else{if(!e.scrollLeft&&!e.scrollTop)return new $.Point(0,0);$.getPageScroll=function(){return new $.Point(document.documentElement.scrollLeft,document.documentElement.scrollTop)}}return $.getPageScroll()},setPageScroll:function(e){if(void 0!==window.scrollTo)$.setPageScroll=function(e){window.scrollTo(e.x,e.y)};else{var t=$.getPageScroll();if(t.x===e.x&&t.y===e.y)return;document.body.scrollLeft=e.x;document.body.scrollTop=e.y;var i=$.getPageScroll();if(i.x!==t.x&&i.y!==t.y){$.setPageScroll=function(e){document.body.scrollLeft=e.x;document.body.scrollTop=e.y};return}document.documentElement.scrollLeft=e.x;document.documentElement.scrollTop=e.y;if((i=$.getPageScroll()).x!==t.x&&i.y!==t.y){$.setPageScroll=function(e){document.documentElement.scrollLeft=e.x;document.documentElement.scrollTop=e.y};return}$.setPageScroll=function(e){}}return $.setPageScroll(e)},getWindowSize:function(){var e=document.documentElement||{},t=document.body||{};if("number"==typeof window.innerWidth)$.getWindowSize=function(){return new $.Point(window.innerWidth,window.innerHeight)};else if(e.clientWidth||e.clientHeight)$.getWindowSize=function(){return new $.Point(document.documentElement.clientWidth,document.documentElement.clientHeight)};else{if(!t.clientWidth&&!t.clientHeight)throw new Error("Unknown window size, no known technique.");$.getWindowSize=function(){return new $.Point(document.body.clientWidth,document.body.clientHeight)}}return $.getWindowSize()},makeCenteredNode:function(e){e=$.getElement(e);var t=[$.makeNeutralElement("div"),$.makeNeutralElement("div"),$.makeNeutralElement("div")];$.extend(t[0].style,{display:"table",height:"100%",width:"100%"});$.extend(t[1].style,{display:"table-row"});$.extend(t[2].style,{display:"table-cell",verticalAlign:"middle",textAlign:"center"});t[0].appendChild(t[1]);t[1].appendChild(t[2]);t[2].appendChild(e);return t[0]},makeNeutralElement:function(e){var t=document.createElement(e),i=t.style;i.background="transparent none";i.border="none";i.margin="0px";i.padding="0px";i.position="static";return t},now:function(){Date.now?$.now=Date.now:$.now=function(){return(new Date).getTime()};return $.now()},makeTransparentImage:function(e){$.makeTransparentImage=function(e){var t=$.makeNeutralElement("img");t.src=e;return t};$.Browser.vendor==$.BROWSERS.IE&&$.Browser.version<7&&($.makeTransparentImage=function(e){var t=$.makeNeutralElement("img"),i=null;(i=$.makeNeutralElement("span")).style.display="inline-block";t.onload=function(){i.style.width=i.style.width||t.width+"px";i.style.height=i.style.height||t.height+"px";t.onload=null;t=null};t.src=e;i.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+e+"', sizingMethod='scale')";return i});return $.makeTransparentImage(e)},setElementOpacity:function(e,t,i){var n;e=$.getElement(e);i&&!$.Browser.alpha&&(t=Math.round(t));if($.Browser.opacity)e.style.opacity=t<1?t:"";else if(t<1){n="alpha(opacity="+Math.round(100*t)+")";e.style.filter=n}else e.style.filter=""},setElementTouchActionNone:function(e){void 0!==(e=$.getElement(e)).style.touchAction?e.style.touchAction="none":void 0!==e.style.msTouchAction&&(e.style.msTouchAction="none")},addClass:function(e,t){(e=$.getElement(e)).className?-1===(" "+e.className+" ").indexOf(" "+t+" ")&&(e.className+=" "+t):e.className=t},indexOf:function(e,t,i){Array.prototype.indexOf?this.indexOf=function(e,t,i){return e.indexOf(t,i)}:this.indexOf=function(e,t,i){var n,o,r=i||0;if(!e)throw new TypeError;if(0===(o=e.length)||o<=r)return-1;r<0&&(r=o-Math.abs(r));for(n=r;n<o;n++)if(e[n]===t)return n;return-1};return this.indexOf(e,t,i)},removeClass:function(e,t){var i,n,o=[];i=(e=$.getElement(e)).className.split(/\s+/);for(n=0;n<i.length;n++)i[n]&&i[n]!==t&&o.push(i[n]);e.className=o.join(" ")},addEvent:function(){if(window.addEventListener)return function(e,t,i,n){(e=$.getElement(e)).addEventListener(t,i,n)};if(window.attachEvent)return function(e,t,i,n){(e=$.getElement(e)).attachEvent("on"+t,i)};throw new Error("No known event model.")}(),removeEvent:function(){if(window.removeEventListener)return function(e,t,i,n){(e=$.getElement(e)).removeEventListener(t,i,n)};if(window.detachEvent)return function(e,t,i,n){(e=$.getElement(e)).detachEvent("on"+t,i)};throw new Error("No known event model.")}(),cancelEvent:function(e){(e=$.getEvent(e)).preventDefault?$.cancelEvent=function(e){e.preventDefault()}:$.cancelEvent=function(e){(e=$.getEvent(e)).cancel=!0;e.returnValue=!1};$.cancelEvent(e)},stopEvent:function(e){(e=$.getEvent(e)).stopPropagation?$.stopEvent=function(e){e.stopPropagation()}:$.stopEvent=function(e){(e=$.getEvent(e)).cancelBubble=!0};$.stopEvent(e)},createCallback:function(i,n){var e,o=[];for(e=2;e<arguments.length;e++)o.push(arguments[e]);return function(){var e,t=o.concat([]);for(e=0;e<arguments.length;e++)t.push(arguments[e]);return n.apply(i,t)}},getUrlParameter:function(e){var t=URLPARAMS[e];return t||null},getUrlProtocol:function(e){var t=e.match(/^([a-z]+:)\/\//i);return null===t?window.location.protocol:t[1].toLowerCase()},createAjaxRequest:function(e){var t;try{t=!!new ActiveXObject("Microsoft.XMLHTTP")}catch(e){t=!1}if(t)window.XMLHttpRequest?$.createAjaxRequest=function(e){return e?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest}:$.createAjaxRequest=function(){return new ActiveXObject("Microsoft.XMLHTTP")};else{if(!window.XMLHttpRequest)throw new Error("Browser doesn't support XMLHttpRequest.");$.createAjaxRequest=function(){return new XMLHttpRequest}}return $.createAjaxRequest(e)},makeAjaxRequest:function(e,i,n){var t;var o;var r;if($.isPlainObject(e)){i=e.success;n=e.error;t=e.withCredentials;o=e.headers;r=e.responseType||null;e=e.url}var s=$.getUrlProtocol(e);var a=$.createAjaxRequest("file:"===s);if(!$.isFunction(i))throw new Error("makeAjaxRequest requires a success callback");a.onreadystatechange=function(){if(4==a.readyState){a.onreadystatechange=function(){};if(200<=a.status&&a.status<300||0===a.status&&"http:"!==s&&"https:"!==s)i(a);else{$.console.log("AJAX request returned %d: %s",a.status,e);$.isFunction(n)&&n(a)}}};try{a.open("GET",e,!0);r&&(a.responseType=r);if(o)for(var l in o)o.hasOwnProperty(l)&&o[l]&&a.setRequestHeader(l,o[l]);t&&(a.withCredentials=!0);a.send(null)}catch(t){var h=t.message;$.Browser.vendor==$.BROWSERS.IE&&$.Browser.version<10&&void 0!==t.number&&-2147024891==t.number&&(h+="\nSee http://msdn.microsoft.com/en-us/library/ms537505(v=vs.85).aspx#xdomain");$.console.log("%s while making AJAX request: %s",t.name,h);a.onreadystatechange=function(){};if(window.XDomainRequest){var c=new XDomainRequest;if(c){c.onload=function(e){$.isFunction(i)&&i({responseText:c.responseText,status:200,statusText:"OK"})};c.onerror=function(e){$.isFunction(n)&&n({responseText:c.responseText,status:444,statusText:"An error happened. Due to an XDomainRequest deficiency we can not extract any information about this error. Upgrade your browser."})};try{c.open("GET",e);c.send()}catch(e){$.isFunction(n)&&n(a,t)}}}else $.isFunction(n)&&n(a,t)}return a},jsonp:function(e){var i,t=e.url,n=document.head||document.getElementsByTagName("head")[0]||document.documentElement,o=e.callbackName||"openseadragon"+$.now(),r=window[o],s="$1"+o+"$2",a=e.param||"callback",l=e.callback;t=t.replace(/(\=)\?(&|$)|\?\?/i,s);t+=(/\?/.test(t)?"&":"?")+a+"="+o;window[o]=function(e){if(r)window[o]=r;else try{delete window[o]}catch(e){}l&&$.isFunction(l)&&l(e)};i=document.createElement("script");void 0===e.async&&!1===e.async||(i.async="async");e.scriptCharset&&(i.charset=e.scriptCharset);i.src=t;i.onload=i.onreadystatechange=function(e,t){if(t||!i.readyState||/loaded|complete/.test(i.readyState)){i.onload=i.onreadystatechange=null;n&&i.parentNode&&n.removeChild(i);i=void 0}};n.insertBefore(i,n.firstChild)},createFromDZI:function(){throw"OpenSeadragon.createFromDZI is deprecated, use Viewer.open."},parseXml:function(e){if(window.DOMParser)$.parseXml=function(e){return(new DOMParser).parseFromString(e,"text/xml")};else{if(!window.ActiveXObject)throw new Error("Browser doesn't support XML DOM.");$.parseXml=function(e){var t=null;(t=new ActiveXObject("Microsoft.XMLDOM")).async=!1;t.loadXML(e);return t}}return $.parseXml(e)},parseJSON:function(string){window.JSON&&window.JSON.parse?$.parseJSON=window.JSON.parse:$.parseJSON=function(string){return eval("("+string+")")};return $.parseJSON(string)},imageFormatSupported:function(e){return!!FILEFORMATS[(e=e||"").toLowerCase()]}});$.Browser={vendor:$.BROWSERS.UNKNOWN,version:0,alpha:!0};var FILEFORMATS={bmp:!1,jpeg:!0,jpg:!0,png:!0,tif:!1,wdp:!1},URLPARAMS={};!function(){var e=navigator.appVersion,t=navigator.userAgent;switch(navigator.appName){case"Microsoft Internet Explorer":if(window.attachEvent&&window.ActiveXObject){$.Browser.vendor=$.BROWSERS.IE;$.Browser.version=parseFloat(t.substring(t.indexOf("MSIE")+5,t.indexOf(";",t.indexOf("MSIE"))))}break;case"Netscape":if(window.addEventListener)if(0<=t.indexOf("Firefox")){$.Browser.vendor=$.BROWSERS.FIREFOX;$.Browser.version=parseFloat(t.substring(t.indexOf("Firefox")+8))}else if(0<=t.indexOf("Safari")){$.Browser.vendor=0<=t.indexOf("Chrome")?$.BROWSERS.CHROME:$.BROWSERS.SAFARI;$.Browser.version=parseFloat(t.substring(t.substring(0,t.indexOf("Safari")).lastIndexOf("/")+1,t.indexOf("Safari")))}else if(null!==new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})").exec(t)){$.Browser.vendor=$.BROWSERS.IE;$.Browser.version=parseFloat(RegExp.$1)}break;case"Opera":$.Browser.vendor=$.BROWSERS.OPERA;$.Browser.version=parseFloat(e)}var i,n,o,r=window.location.search.substring(1).split("&");for(o=0;o<r.length;o++)0<(n=(i=r[o]).indexOf("="))&&(URLPARAMS[i.substring(0,n)]=decodeURIComponent(i.substring(n+1)));$.Browser.alpha=!($.Browser.vendor==$.BROWSERS.IE&&$.Browser.version<9||$.Browser.vendor==$.BROWSERS.CHROME&&$.Browser.version<2);$.Browser.opacity=!($.Browser.vendor==$.BROWSERS.IE&&$.Browser.version<9)}();var nullfunction=function(e){};$.console=window.console||{log:nullfunction,debug:nullfunction,info:nullfunction,warn:nullfunction,error:nullfunction,assert:nullfunction};!function(e){var t=e.requestAnimationFrame||e.mozRequestAnimationFrame||e.webkitRequestAnimationFrame||e.msRequestAnimationFrame;var i=e.cancelAnimationFrame||e.mozCancelAnimationFrame||e.webkitCancelAnimationFrame||e.msCancelAnimationFrame;if(t&&i){$.requestAnimationFrame=function(){return t.apply(e,arguments)};$.cancelAnimationFrame=function(){return i.apply(e,arguments)}}else{var n,o=[],r=[],s=0;$.requestAnimationFrame=function(e){o.push([++s,e]);n||(n=setInterval(function(){if(o.length){var e=$.now();var t=r;r=o;o=t;for(;r.length;)r.shift()[1](e)}else{clearInterval(n);n=void 0}},20));return s};$.cancelAnimationFrame=function(e){var t,i;for(t=0,i=o.length;t<i;t+=1)if(o[t][0]===e){o.splice(t,1);return}for(t=0,i=r.length;t<i;t+=1)if(r[t][0]===e){r.splice(t,1);return}}}}(window);function getOffsetParent(e,t){return t&&e!=document.body?document.body:e.offsetParent}}(OpenSeadragon);!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&module.exports?module.exports=t():e.OpenSeadragon=t()}(this,function(){return OpenSeadragon});!function(e){var t={supportsFullScreen:!1,isFullScreen:function(){return!1},getFullScreenElement:function(){return null},requestFullScreen:function(){},exitFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",fullScreenErrorEventName:""};if(document.exitFullscreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.fullscreenElement};t.requestFullScreen=function(e){return e.requestFullscreen()};t.exitFullScreen=function(){document.exitFullscreen()};t.fullScreenEventName="fullscreenchange";t.fullScreenErrorEventName="fullscreenerror"}else if(document.msExitFullscreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.msFullscreenElement};t.requestFullScreen=function(e){return e.msRequestFullscreen()};t.exitFullScreen=function(){document.msExitFullscreen()};t.fullScreenEventName="MSFullscreenChange";t.fullScreenErrorEventName="MSFullscreenError"}else if(document.webkitExitFullscreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.webkitFullscreenElement};t.requestFullScreen=function(e){return e.webkitRequestFullscreen()};t.exitFullScreen=function(){document.webkitExitFullscreen()};t.fullScreenEventName="webkitfullscreenchange";t.fullScreenErrorEventName="webkitfullscreenerror"}else if(document.webkitCancelFullScreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.webkitCurrentFullScreenElement};t.requestFullScreen=function(e){return e.webkitRequestFullScreen()};t.exitFullScreen=function(){document.webkitCancelFullScreen()};t.fullScreenEventName="webkitfullscreenchange";t.fullScreenErrorEventName="webkitfullscreenerror"}else if(document.mozCancelFullScreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.mozFullScreenElement};t.requestFullScreen=function(e){return e.mozRequestFullScreen()};t.exitFullScreen=function(){document.mozCancelFullScreen()};t.fullScreenEventName="mozfullscreenchange";t.fullScreenErrorEventName="mozfullscreenerror"}t.isFullScreen=function(){return null!==t.getFullScreenElement()};t.cancelFullScreen=function(){e.console.error("cancelFullScreen is deprecated. Use exitFullScreen instead.");t.exitFullScreen()};e.extend(e,t)}(OpenSeadragon);!function(r){r.EventSource=function(){this.events={}};r.EventSource.prototype={addOnceHandler:function(t,i,e,n){var o=this;n=n||1;var r=0;var s=function(e){++r===n&&o.removeHandler(t,s);i(e)};this.addHandler(t,s,e)},addHandler:function(e,t,i){var n=this.events[e];n||(this.events[e]=n=[]);t&&r.isFunction(t)&&(n[n.length]={handler:t,userData:i||null})},removeHandler:function(e,t){var i,n=this.events[e],o=[];if(n&&r.isArray(n)){for(i=0;i<n.length;i++)n[i].handler!==t&&o.push(n[i]);this.events[e]=o}},removeAllHandlers:function(e){if(e)this.events[e]=[];else for(var t in this.events)this.events[t]=[]},getHandler:function(e){var o=this.events[e];if(!o||!o.length)return null;o=1===o.length?[o[0]]:Array.apply(null,o);return function(e,t){var i,n=o.length;for(i=0;i<n;i++)if(o[i]){t.eventSource=e;t.userData=o[i].userData;o[i].handler(t)}}},raiseEvent:function(e,t){var i=this.getHandler(e);if(i){t||(t={});i(this,t)}}}}(OpenSeadragon);!function(m){var h=[];var v={};m.MouseTracker=function(e){h.push(this);var t=arguments;m.isPlainObject(e)||(e={element:t[0],clickTimeThreshold:t[1],clickDistThreshold:t[2]});this.hash=Math.random();this.element=m.getElement(e.element);this.clickTimeThreshold=e.clickTimeThreshold||m.DEFAULT_SETTINGS.clickTimeThreshold;this.clickDistThreshold=e.clickDistThreshold||m.DEFAULT_SETTINGS.clickDistThreshold;this.dblClickTimeThreshold=e.dblClickTimeThreshold||m.DEFAULT_SETTINGS.dblClickTimeThreshold;this.dblClickDistThreshold=e.dblClickDistThreshold||m.DEFAULT_SETTINGS.dblClickDistThreshold;this.userData=e.userData||null;this.stopDelay=e.stopDelay||50;this.enterHandler=e.enterHandler||null;this.exitHandler=e.exitHandler||null;this.pressHandler=e.pressHandler||null;this.nonPrimaryPressHandler=e.nonPrimaryPressHandler||null;this.releaseHandler=e.releaseHandler||null;this.nonPrimaryReleaseHandler=e.nonPrimaryReleaseHandler||null;this.moveHandler=e.moveHandler||null;this.scrollHandler=e.scrollHandler||null;this.clickHandler=e.clickHandler||null;this.dblClickHandler=e.dblClickHandler||null;this.dragHandler=e.dragHandler||null;this.dragEndHandler=e.dragEndHandler||null;this.pinchHandler=e.pinchHandler||null;this.stopHandler=e.stopHandler||null;this.keyDownHandler=e.keyDownHandler||null;this.keyUpHandler=e.keyUpHandler||null;this.keyHandler=e.keyHandler||null;this.focusHandler=e.focusHandler||null;this.blurHandler=e.blurHandler||null;var o=this;v[this.hash]={click:function(e){t=e,o.clickHandler&&m.cancelEvent(t);var t},dblclick:function(e){t=e,o.dblClickHandler&&m.cancelEvent(t);var t},keydown:function(e){!function(e,t){if(e.keyDownHandler){t=m.getEvent(t);e.keyDownHandler({eventSource:e,keyCode:t.keyCode?t.keyCode:t.charCode,ctrl:t.ctrlKey,shift:t.shiftKey,alt:t.altKey,meta:t.metaKey,originalEvent:t,preventDefaultAction:!1,userData:e.userData})||m.cancelEvent(t)}}(o,e)},keyup:function(e){!function(e,t){if(e.keyUpHandler){t=m.getEvent(t);e.keyUpHandler({eventSource:e,keyCode:t.keyCode?t.keyCode:t.charCode,ctrl:t.ctrlKey,shift:t.shiftKey,alt:t.altKey,meta:t.metaKey,originalEvent:t,preventDefaultAction:!1,userData:e.userData})||m.cancelEvent(t)}}(o,e)},keypress:function(e){!function(e,t){if(e.keyHandler){t=m.getEvent(t);e.keyHandler({eventSource:e,keyCode:t.keyCode?t.keyCode:t.charCode,ctrl:t.ctrlKey,shift:t.shiftKey,alt:t.altKey,meta:t.metaKey,originalEvent:t,preventDefaultAction:!1,userData:e.userData})||m.cancelEvent(t)}}(o,e)},focus:function(e){!function(e,t){if(e.focusHandler){t=m.getEvent(t);!1===e.focusHandler({eventSource:e,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t)}}(o,e)},blur:function(e){!function(e,t){if(e.blurHandler){t=m.getEvent(t);!1===e.blurHandler({eventSource:e,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t)}}(o,e)},wheel:function(e){T(o,t=e,t);var t},mousewheel:function(e){i(o,e)},DOMMouseScroll:function(e){i(o,e)},MozMousePixelScroll:function(e){i(o,e)},mouseenter:function(e){!function(e,t){t=m.getEvent(t);S(e,t)}(o,e)},mouseleave:function(e){!function(e,t){t=m.getEvent(t);E(e,t)}(o,e)},mouseover:function(e){!function(e,t){if((t=m.getEvent(t)).currentTarget===t.relatedTarget||x(t.currentTarget,t.relatedTarget))return;S(e,t)}(o,e)},mouseout:function(e){!function(e,t){if((t=m.getEvent(t)).currentTarget===t.relatedTarget||x(t.currentTarget,t.relatedTarget))return;E(e,t)}(o,e)},mousedown:function(e){!function(e,t){var i;t=m.getEvent(t);i={id:m.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:g(t),currentTime:m.now()};if(V(e,t,[i],P(t.button))){m.stopEvent(t);u(e,"mouse")}(e.clickHandler||e.dblClickHandler||e.pressHandler||e.dragHandler||e.dragEndHandler)&&m.cancelEvent(t)}(o,e)},mouseup:function(e){R(o,e)},mouseupcaptured:function(e){!function(e,t){R(e,t);m.stopEvent(t)}(o,e)},mousemove:function(e){_(o,e)},mousemovecaptured:function(e){!function(e,t){_(e,t);m.stopEvent(t)}(o,e)},touchstart:function(e){!function(e,t){var i,n,o,r,s=t.changedTouches.length,a=[],l=e.getActivePointersListByType("touch");i=m.now();if(l.getLength()>t.touches.length-s){m.console.warn("Tracked touch contact count doesn't match event.touches.length. Removing all tracked touch pointers.");b(e,t,l)}for(n=0;n<s;n++)a.push({id:t.changedTouches[n].identifier,type:"touch",currentPos:g(t.changedTouches[n]),currentTime:i});A(e,t,a);for(n=0;n<h.length;n++)if(h[n]!==e&&h[n].isTracking()&&x(h[n].element,e.element)){r=[];for(o=0;o<s;o++)r.push({id:t.changedTouches[o].identifier,type:"touch",currentPos:g(t.changedTouches[o]),currentTime:i});A(h[n],t,r)}if(V(e,t,a,0)){m.stopEvent(t);u(e,"touch",s)}m.cancelEvent(t)}(o,e)},touchend:function(e){C(o,e)},touchendcaptured:function(e){!function(e,t){C(e,t);m.stopEvent(t)}(o,e)},touchmove:function(e){O(o,e)},touchmovecaptured:function(e){!function(e,t){O(e,t);m.stopEvent(t)}(o,e)},touchcancel:function(e){i=e,n=(t=o).getActivePointersListByType("touch"),b(t,i,n);var t,i,n},gesturestart:function(e){!function(e,t){t.stopPropagation();t.preventDefault()}(0,e)},gesturechange:function(e){!function(e,t){t.stopPropagation();t.preventDefault()}(0,e)},pointerover:function(e){I(o,e)},MSPointerOver:function(e){I(o,e)},pointerout:function(e){k(o,e)},MSPointerOut:function(e){k(o,e)},pointerdown:function(e){B(o,e)},MSPointerDown:function(e){B(o,e)},pointerup:function(e){D(o,e)},MSPointerUp:function(e){D(o,e)},pointermove:function(e){z(o,e)},MSPointerMove:function(e){z(o,e)},pointercancel:function(e){L(o,e)},MSPointerCancel:function(e){L(o,e)},pointerupcaptured:function(e){!function(e,t){e.getActivePointersListByType(p(t)).getById(t.pointerId)&&M(e,t);m.stopEvent(t)}(o,e)},pointermovecaptured:function(e){!function(e,t){e.getActivePointersListByType(p(t)).getById(t.pointerId)&&H(e,t);m.stopEvent(t)}(o,e)},tracking:!1,activePointersLists:[],lastClickPos:null,dblClickTimeOut:null,pinchGPoints:[],lastPinchDist:0,currentPinchDist:0,lastPinchCenter:null,currentPinchCenter:null};e.startDisabled||this.setTracking(!0)};m.MouseTracker.prototype={destroy:function(){var e;t(this);this.element=null;for(e=0;e<h.length;e++)if(h[e]===this){h.splice(e,1);break}v[this.hash]=null;delete v[this.hash]},isTracking:function(){return v[this.hash].tracking},setTracking:function(e){e?function(e){var t,i,n=v[e.hash];if(!n.tracking){for(i=0;i<m.MouseTracker.subscribeEvents.length;i++){t=m.MouseTracker.subscribeEvents[i];m.addEvent(e.element,t,n[t],!1)}o(e);n.tracking=!0}}(this):t(this);return this},getActivePointersListsExceptType:function(e){var t=v[this.hash];var i=[];for(var n=0;n<t.activePointersLists.length;++n)t.activePointersLists[n].type!==e&&i.push(t.activePointersLists[n]);return i},getActivePointersListByType:function(e){var t,i,n=v[this.hash],o=n.activePointersLists.length;for(t=0;t<o;t++)if(n.activePointersLists[t].type===e)return n.activePointersLists[t];i=new m.MouseTracker.GesturePointList(e);n.activePointersLists.push(i);return i},getActivePointerCount:function(){var e,t=v[this.hash],i=t.activePointersLists.length,n=0;for(e=0;e<i;e++)n+=t.activePointersLists[e].getLength();return n},enterHandler:function(){},exitHandler:function(){},pressHandler:function(){},nonPrimaryPressHandler:function(){},releaseHandler:function(){},nonPrimaryReleaseHandler:function(){},moveHandler:function(){},scrollHandler:function(){},clickHandler:function(){},dblClickHandler:function(){},dragHandler:function(){},dragEndHandler:function(){},pinchHandler:function(){},stopHandler:function(){},keyDownHandler:function(){},keyUpHandler:function(){},keyHandler:function(){},focusHandler:function(){},blurHandler:function(){}};m.MouseTracker.resetAllMouseTrackers=function(){for(var e=0;e<h.length;e++)if(h[e].isTracking()){h[e].setTracking(!1);h[e].setTracking(!0)}};m.MouseTracker.gesturePointVelocityTracker=(l=[],c=r=0,s=function(e,t){return e.hash.toString()+t.type+t.id.toString()},n=function(){var e,t,i,n,o,r,s=l.length,a=m.now();n=a-c;c=a;for(e=0;e<s;e++){(i=(t=l[e]).gPoint).direction=Math.atan2(i.currentPos.y-t.lastPos.y,i.currentPos.x-t.lastPos.x);o=t.lastPos.distanceTo(i.currentPos);t.lastPos=i.currentPos;r=1e3*o/(n+1);i.speed=.75*r+.25*i.speed}},{addPoint:function(e,t){var i=s(e,t);l.push({guid:i,gPoint:t,lastPos:t.currentPos});if(1===l.length){c=m.now();r=window.setInterval(n,50)}},removePoint:function(e,t){var i,n=s(e,t),o=l.length;for(i=0;i<o;i++)if(l[i].guid===n){l.splice(i,1);0==--o&&window.clearInterval(r);break}}});var l,r,c,s,n;m.MouseTracker.captureElement=document;m.MouseTracker.wheelEventName=m.Browser.vendor==m.BROWSERS.IE&&8<m.Browser.version||"onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";m.MouseTracker.supportsMouseCapture=(e=document.createElement("div"),m.isFunction(e.setCapture)&&m.isFunction(e.releaseCapture));var e;m.MouseTracker.subscribeEvents=["click","dblclick","keydown","keyup","keypress","focus","blur",m.MouseTracker.wheelEventName];"DOMMouseScroll"==m.MouseTracker.wheelEventName&&m.MouseTracker.subscribeEvents.push("MozMousePixelScroll");if(window.PointerEvent&&(window.navigator.pointerEnabled||m.Browser.vendor!==m.BROWSERS.IE)){m.MouseTracker.havePointerEvents=!0;m.MouseTracker.subscribeEvents.push("pointerover","pointerout","pointerdown","pointerup","pointermove","pointercancel");m.MouseTracker.unprefixedPointerEvents=!0;navigator.maxTouchPoints?m.MouseTracker.maxTouchPoints=navigator.maxTouchPoints:m.MouseTracker.maxTouchPoints=0;m.MouseTracker.haveMouseEnter=!1}else if(window.MSPointerEvent&&window.navigator.msPointerEnabled){m.MouseTracker.havePointerEvents=!0;m.MouseTracker.subscribeEvents.push("MSPointerOver","MSPointerOut","MSPointerDown","MSPointerUp","MSPointerMove","MSPointerCancel");m.MouseTracker.unprefixedPointerEvents=!1;navigator.msMaxTouchPoints?m.MouseTracker.maxTouchPoints=navigator.msMaxTouchPoints:m.MouseTracker.maxTouchPoints=0;m.MouseTracker.haveMouseEnter=!1}else{m.MouseTracker.havePointerEvents=!1;if(m.Browser.vendor===m.BROWSERS.IE&&m.Browser.version<9){m.MouseTracker.subscribeEvents.push("mouseenter","mouseleave");m.MouseTracker.haveMouseEnter=!0}else{m.MouseTracker.subscribeEvents.push("mouseover","mouseout");m.MouseTracker.haveMouseEnter=!1}m.MouseTracker.subscribeEvents.push("mousedown","mouseup","mousemove");"ontouchstart"in window&&m.MouseTracker.subscribeEvents.push("touchstart","touchend","touchmove","touchcancel");"ongesturestart"in window&&m.MouseTracker.subscribeEvents.push("gesturestart","gesturechange");m.MouseTracker.mousePointerId="legacy-mouse";m.MouseTracker.maxTouchPoints=10}m.MouseTracker.GesturePointList=function(e){this._gPoints=[];this.type=e;this.buttons=0;this.contacts=0;this.clicks=0;this.captureCount=0};m.MouseTracker.GesturePointList.prototype={getLength:function(){return this._gPoints.length},asArray:function(){return this._gPoints},add:function(e){return this._gPoints.push(e)},removeById:function(e){var t,i=this._gPoints.length;for(t=0;t<i;t++)if(this._gPoints[t].id===e){this._gPoints.splice(t,1);break}return this._gPoints.length},getByIndex:function(e){return e<this._gPoints.length?this._gPoints[e]:null},getById:function(e){var t,i=this._gPoints.length;for(t=0;t<i;t++)if(this._gPoints[t].id===e)return this._gPoints[t];return null},getPrimary:function(e){var t,i=this._gPoints.length;for(t=0;t<i;t++)if(this._gPoints[t].isPrimary)return this._gPoints[t];return null},addContact:function(){++this.contacts;1<this.contacts&&("mouse"===this.type||"pen"===this.type)&&(this.contacts=1)},removeContact:function(){--this.contacts;this.contacts<0&&(this.contacts=0)}};function o(e){var t,i=v[e.hash],n=i.activePointersLists.length;for(t=0;t<n;t++)if(0<i.activePointersLists[t].captureCount){m.removeEvent(m.MouseTracker.captureElement,"mousemove",i.mousemovecaptured,!0);m.removeEvent(m.MouseTracker.captureElement,"mouseup",i.mouseupcaptured,!0);m.removeEvent(m.MouseTracker.captureElement,m.MouseTracker.unprefixedPointerEvents?"pointermove":"MSPointerMove",i.pointermovecaptured,!0);m.removeEvent(m.MouseTracker.captureElement,m.MouseTracker.unprefixedPointerEvents?"pointerup":"MSPointerUp",i.pointerupcaptured,!0);m.removeEvent(m.MouseTracker.captureElement,"touchmove",i.touchmovecaptured,!0);m.removeEvent(m.MouseTracker.captureElement,"touchend",i.touchendcaptured,!0);i.activePointersLists[t].captureCount=0}for(t=0;t<n;t++)i.activePointersLists.pop()}function t(e){var t,i,n=v[e.hash];if(n.tracking){for(i=0;i<m.MouseTracker.subscribeEvents.length;i++){t=m.MouseTracker.subscribeEvents[i];m.removeEvent(e.element,t,n[t],!1)}o(e);n.tracking=!1}}function a(e,t){var i=v[e.hash];if("pointerevent"===t)return{upName:m.MouseTracker.unprefixedPointerEvents?"pointerup":"MSPointerUp",upHandler:i.pointerupcaptured,moveName:m.MouseTracker.unprefixedPointerEvents?"pointermove":"MSPointerMove",moveHandler:i.pointermovecaptured};if("mouse"===t)return{upName:"mouseup",upHandler:i.mouseupcaptured,moveName:"mousemove",moveHandler:i.mousemovecaptured};if("touch"===t)return{upName:"touchend",upHandler:i.touchendcaptured,moveName:"touchmove",moveHandler:i.touchmovecaptured};throw new Error("MouseTracker.getCaptureEventParams: Unknown pointer type.")}function u(e,t,i){var n,o=e.getActivePointersListByType(t);o.captureCount+=i||1;if(1===o.captureCount)if(m.Browser.vendor===m.BROWSERS.IE&&m.Browser.version<9)e.element.setCapture(!0);else{n=a(e,m.MouseTracker.havePointerEvents?"pointerevent":t);G&&$(window.top)&&m.addEvent(window.top,n.upName,n.upHandler,!0);m.addEvent(m.MouseTracker.captureElement,n.upName,n.upHandler,!0);m.addEvent(m.MouseTracker.captureElement,n.moveName,n.moveHandler,!0)}}function d(e,t,i){var n,o=e.getActivePointersListByType(t);o.captureCount-=i||1;if(0===o.captureCount)if(m.Browser.vendor===m.BROWSERS.IE&&m.Browser.version<9)e.element.releaseCapture();else{n=a(e,m.MouseTracker.havePointerEvents?"pointerevent":t);G&&$(window.top)&&m.removeEvent(window.top,n.upName,n.upHandler,!0);m.removeEvent(m.MouseTracker.captureElement,n.moveName,n.moveHandler,!0);m.removeEvent(m.MouseTracker.captureElement,n.upName,n.upHandler,!0)}}function p(e){var t;if(m.MouseTracker.unprefixedPointerEvents)t=e.pointerType;else switch(e.pointerType){case 2:t="touch";break;case 3:t="pen";break;case 4:t="mouse";break;default:t=""}return t}function g(e){return m.getMousePosition(e)}function f(e,t){return w(g(e),t)}function w(e,t){var i=m.getElementOffset(t);return e.minus(i)}function y(e,t){return new m.Point((e.x+t.x)/2,(e.y+t.y)/2)}function i(e,t){var i={target:(t=m.getEvent(t)).target||t.srcElement,type:"wheel",shiftKey:t.shiftKey||!1,clientX:t.clientX,clientY:t.clientY,pageX:t.pageX?t.pageX:t.clientX,pageY:t.pageY?t.pageY:t.clientY,deltaMode:"MozMousePixelScroll"==t.type?0:1,deltaX:0,deltaZ:0};"mousewheel"==m.MouseTracker.wheelEventName?i.deltaY=-t.wheelDelta/m.DEFAULT_SETTINGS.pixelsPerWheelLine:i.deltaY=t.detail;T(e,i,t)}function T(e,t,i){var n;n=t.deltaY<0?1:-1;e.scrollHandler&&!1===e.scrollHandler({eventSource:e,pointerType:"mouse",position:f(t,e.element),scroll:n,shift:t.shiftKey,isTouchEvent:!1,originalEvent:i,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(i)}function x(e,t){if(e===t)return!1;for(;t&&t!==e;)t=t.parentNode;return t===e}function S(e,t){A(e,t,[{id:m.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:g(t),currentTime:m.now()}])}function E(e,t){W(e,t,[{id:m.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:g(t),currentTime:m.now()}])}function P(e){return m.Browser.vendor===m.BROWSERS.IE&&m.Browser.version<9?1===e?0:2===e?2:4===e?1:-1:e}function R(e,t){U(e,t=m.getEvent(t),[{id:m.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:g(t),currentTime:m.now()}],P(t.button))&&d(e,"mouse")}function _(e,t){j(e,t=m.getEvent(t),[{id:m.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:g(t),currentTime:m.now()}])}function b(e,t,i){var n,o=i.getLength(),r=[];if("touch"===i.type||0<i.contacts){for(n=0;n<o;n++)r.push(i.getByIndex(n));if(0<r.length){U(e,t,r,0);i.captureCount=1;d(e,i.type);W(e,t,r)}}}function C(e,t){var i,n,o,r,s=t.changedTouches.length,a=[];i=m.now();for(n=0;n<s;n++)a.push({id:t.changedTouches[n].identifier,type:"touch",currentPos:g(t.changedTouches[n]),currentTime:i});U(e,t,a,0)&&d(e,"touch",s);W(e,t,a);for(n=0;n<h.length;n++)if(h[n]!==e&&h[n].isTracking()&&x(h[n].element,e.element)){r=[];for(o=0;o<s;o++)r.push({id:t.changedTouches[o].identifier,type:"touch",currentPos:g(t.changedTouches[o]),currentTime:i});W(h[n],t,r)}m.cancelEvent(t)}function O(e,t){var i,n=t.changedTouches.length,o=[];for(i=0;i<n;i++)o.push({id:t.changedTouches[i].identifier,type:"touch",currentPos:g(t.changedTouches[i]),currentTime:m.now()});j(e,t,o);m.cancelEvent(t)}function I(e,t){t.currentTarget===t.relatedTarget||x(t.currentTarget,t.relatedTarget)||A(e,t,[{id:t.pointerId,type:p(t),isPrimary:t.isPrimary,currentPos:g(t),currentTime:m.now()}])}function k(e,t){t.currentTarget===t.relatedTarget||x(t.currentTarget,t.relatedTarget)||W(e,t,[{id:t.pointerId,type:p(t),isPrimary:t.isPrimary,currentPos:g(t),currentTime:m.now()}])}function B(e,t){var i;if(V(e,t,[i={id:t.pointerId,type:p(t),isPrimary:t.isPrimary,currentPos:g(t),currentTime:m.now()}],t.button)){m.stopEvent(t);u(e,i.type)}(e.clickHandler||e.dblClickHandler||e.pressHandler||e.dragHandler||e.dragEndHandler||e.pinchHandler)&&m.cancelEvent(t)}function D(e,t){M(e,t)}function M(e,t){var i;U(e,t,[i={id:t.pointerId,type:p(t),isPrimary:t.isPrimary,currentPos:g(t),currentTime:m.now()}],t.button)&&d(e,i.type)}function z(e,t){H(e,t)}function H(e,t){j(e,t,[{id:t.pointerId,type:p(t),isPrimary:t.isPrimary,currentPos:g(t),currentTime:m.now()}])}function L(e,t){!function(e,t,i){U(e,t,i,0);W(e,t,i)}(e,t,[{id:t.pointerId,type:p(t)}])}function F(e,t){t.hasOwnProperty("isPrimary")||(0===e.getLength()?t.isPrimary=!0:t.isPrimary=!1);t.speed=0;t.direction=0;t.contactPos=t.currentPos;t.contactTime=t.currentTime;t.lastPos=t.currentPos;t.lastTime=t.currentTime;return e.add(t)}function N(e,t){var i,n;if(e.getById(t.id)){i=e.removeById(t.id);t.hasOwnProperty("isPrimary")||(n=e.getPrimary())||(n=e.getByIndex(0))&&(n.isPrimary=!0)}else i=e.getLength();return i}function A(e,t,i){var n,o,r,s=e.getActivePointersListByType(i[0].type),a=i.length;for(n=0;n<a;n++){o=i[n];if(r=s.getById(o.id)){r.insideElement=!0;r.lastPos=r.currentPos;r.lastTime=r.currentTime;r.currentPos=o.currentPos;r.currentTime=o.currentTime;o=r}else{o.captured=!1;o.insideElementPressed=!1;o.insideElement=!0;F(s,o)}e.enterHandler&&!1===e.enterHandler({eventSource:e,pointerType:o.type,position:w(o.currentPos,e.element),buttons:s.buttons,pointers:e.getActivePointerCount(),insideElementPressed:o.insideElementPressed,buttonDownAny:0!==s.buttons,isTouchEvent:"touch"===o.type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t)}}function W(e,t,i){var n,o,r,s=e.getActivePointersListByType(i[0].type),a=i.length;for(n=0;n<a;n++){o=i[n];if(r=s.getById(o.id)){if(r.captured){r.insideElement=!1;r.lastPos=r.currentPos;r.lastTime=r.currentTime;r.currentPos=o.currentPos;r.currentTime=o.currentTime}else N(s,r);o=r}e.exitHandler&&!1===e.exitHandler({eventSource:e,pointerType:o.type,position:w(o.currentPos,e.element),buttons:s.buttons,pointers:e.getActivePointerCount(),insideElementPressed:!!r&&r.insideElementPressed,buttonDownAny:0!==s.buttons,isTouchEvent:"touch"===o.type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t)}}function V(e,t,i,n){var o,r,s,a=v[e.hash],l=e.getActivePointersListByType(i[0].type),h=i.length;void 0!==t.buttons?l.buttons=t.buttons:m.Browser.vendor===m.BROWSERS.IE&&m.Browser.version<9?0===n?l.buttons+=1:1===n?l.buttons+=4:2===n?l.buttons+=2:3===n?l.buttons+=8:4===n?l.buttons+=16:5===n&&(l.buttons+=32):0===n?l.buttons|=1:1===n?l.buttons|=4:2===n?l.buttons|=2:3===n?l.buttons|=8:4===n?l.buttons|=16:5===n&&(l.buttons|=32);var c=e.getActivePointersListsExceptType(i[0].type);for(o=0;o<c.length;o++)b(e,t,c[o]);if(0!==n){e.nonPrimaryPressHandler&&!1===e.nonPrimaryPressHandler({eventSource:e,pointerType:i[0].type,position:w(i[0].currentPos,e.element),button:n,buttons:l.buttons,isTouchEvent:"touch"===i[0].type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t);return!1}for(o=0;o<h;o++){r=i[o];if(s=l.getById(r.id)){s.captured=!0;s.insideElementPressed=!0;s.insideElement=!0;s.contactPos=r.currentPos;s.contactTime=r.currentTime;s.lastPos=s.currentPos;s.lastTime=s.currentTime;s.currentPos=r.currentPos;s.currentTime=r.currentTime;r=s}else{r.captured=!0;r.insideElementPressed=!0;r.insideElement=!0;F(l,r)}l.addContact();(e.dragHandler||e.dragEndHandler||e.pinchHandler)&&m.MouseTracker.gesturePointVelocityTracker.addPoint(e,r);if(1===l.contacts)e.pressHandler&&!1===e.pressHandler({eventSource:e,pointerType:r.type,position:w(r.contactPos,e.element),buttons:l.buttons,isTouchEvent:"touch"===r.type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t);else if(2===l.contacts&&e.pinchHandler&&"touch"===r.type){a.pinchGPoints=l.asArray();a.lastPinchDist=a.currentPinchDist=a.pinchGPoints[0].currentPos.distanceTo(a.pinchGPoints[1].currentPos);a.lastPinchCenter=a.currentPinchCenter=y(a.pinchGPoints[0].currentPos,a.pinchGPoints[1].currentPos)}}return!0}function U(e,t,i,n){var o,r,s,a,l,h,c=v[e.hash],u=e.getActivePointersListByType(i[0].type),d=i.length,p=!1,g=!1;void 0!==t.buttons?u.buttons=t.buttons:m.Browser.vendor===m.BROWSERS.IE&&m.Browser.version<9?0===n?u.buttons-=1:1===n?u.buttons-=4:2===n?u.buttons-=2:3===n?u.buttons-=8:4===n?u.buttons-=16:5===n&&(u.buttons-=32):0===n?u.buttons^=-2:1===n?u.buttons^=-5:2===n?u.buttons^=-3:3===n?u.buttons^=-9:4===n?u.buttons^=-17:5===n&&(u.buttons^=-33);if(0!==n){e.nonPrimaryReleaseHandler&&!1===e.nonPrimaryReleaseHandler({eventSource:e,pointerType:i[0].type,position:w(i[0].currentPos,e.element),button:n,buttons:u.buttons,isTouchEvent:"touch"===i[0].type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t);b(e,t,e.getActivePointersListByType("mouse"));return!1}for(s=0;s<d;s++){a=i[s];if(l=u.getById(a.id)){l.captured&&(g=p=!(l.captured=!1));l.lastPos=l.currentPos;l.lastTime=l.currentTime;l.currentPos=a.currentPos;l.currentTime=a.currentTime;l.insideElement||N(u,l);o=l.currentPos;r=l.currentTime;if(g){u.removeContact();(e.dragHandler||e.dragEndHandler||e.pinchHandler)&&m.MouseTracker.gesturePointVelocityTracker.removePoint(e,l);if(0===u.contacts){e.releaseHandler&&!1===e.releaseHandler({eventSource:e,pointerType:l.type,position:w(o,e.element),buttons:u.buttons,insideElementPressed:l.insideElementPressed,insideElementReleased:l.insideElement,isTouchEvent:"touch"===l.type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t);e.dragEndHandler&&!l.currentPos.equals(l.contactPos)&&!1===e.dragEndHandler({eventSource:e,pointerType:l.type,position:w(l.currentPos,e.element),speed:l.speed,direction:l.direction,shift:t.shiftKey,isTouchEvent:"touch"===l.type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t);if((e.clickHandler||e.dblClickHandler)&&l.insideElement){h=r-l.contactTime<=e.clickTimeThreshold&&l.contactPos.distanceTo(o)<=e.clickDistThreshold;e.clickHandler&&!1===e.clickHandler({eventSource:e,pointerType:l.type,position:w(l.currentPos,e.element),quick:h,shift:t.shiftKey,isTouchEvent:"touch"===l.type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t);if(e.dblClickHandler&&h){u.clicks++;if(1===u.clicks){c.lastClickPos=o;c.dblClickTimeOut=setTimeout(function(){u.clicks=0},e.dblClickTimeThreshold)}else if(2===u.clicks){clearTimeout(c.dblClickTimeOut);u.clicks=0;c.lastClickPos.distanceTo(o)<=e.dblClickDistThreshold&&!1===e.dblClickHandler({eventSource:e,pointerType:l.type,position:w(l.currentPos,e.element),shift:t.shiftKey,isTouchEvent:"touch"===l.type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t);c.lastClickPos=null}}}}else if(2===u.contacts&&e.pinchHandler&&"touch"===l.type){c.pinchGPoints=u.asArray();c.lastPinchDist=c.currentPinchDist=c.pinchGPoints[0].currentPos.distanceTo(c.pinchGPoints[1].currentPos);c.lastPinchCenter=c.currentPinchCenter=y(c.pinchGPoints[0].currentPos,c.pinchGPoints[1].currentPos)}}else e.releaseHandler&&!1===e.releaseHandler({eventSource:e,pointerType:l.type,position:w(o,e.element),buttons:u.buttons,insideElementPressed:l.insideElementPressed,insideElementReleased:l.insideElement,isTouchEvent:"touch"===l.type,originalEvent:t,preventDefaultAction:!1,userData:e.userData})&&m.cancelEvent(t)}}return p}function j(n,o,r){var e,t,i,s,a,l=v[n.hash],h=n.getActivePointersListByType(r[0].type),c=r.length;void 0!==o.buttons&&(h.buttons=o.buttons);for(e=0;e<c;e++){t=r[e];if(i=h.getById(t.id)){t.hasOwnProperty("isPrimary")&&(i.isPrimary=t.isPrimary);i.lastPos=i.currentPos;i.lastTime=i.currentTime;i.currentPos=t.currentPos;i.currentTime=t.currentTime}else{t.captured=!1;t.insideElementPressed=!1;t.insideElement=!0;F(h,t)}}if(n.stopHandler&&"mouse"===r[0].type){clearTimeout(n.stopTimeOut);n.stopTimeOut=setTimeout(function(){e=n,t=o,i=r[0].type,e.stopHandler&&e.stopHandler({eventSource:e,pointerType:i,position:f(t,e.element),buttons:e.getActivePointersListByType(i).buttons,isTouchEvent:"touch"===i,originalEvent:t,preventDefaultAction:!1,userData:e.userData});var e,t,i},n.stopDelay)}if(0===h.contacts)n.moveHandler&&!1===n.moveHandler({eventSource:n,pointerType:r[0].type,position:w(r[0].currentPos,n.element),buttons:h.buttons,isTouchEvent:"touch"===r[0].type,originalEvent:o,preventDefaultAction:!1,userData:n.userData})&&m.cancelEvent(o);else if(1===h.contacts){if(n.moveHandler){i=h.asArray()[0];!1===n.moveHandler({eventSource:n,pointerType:i.type,position:w(i.currentPos,n.element),buttons:h.buttons,isTouchEvent:"touch"===i.type,originalEvent:o,preventDefaultAction:!1,userData:n.userData})&&m.cancelEvent(o)}if(n.dragHandler){a=(i=h.asArray()[0]).currentPos.minus(i.lastPos);!1===n.dragHandler({eventSource:n,pointerType:i.type,position:w(i.currentPos,n.element),buttons:h.buttons,delta:a,speed:i.speed,direction:i.direction,shift:o.shiftKey,isTouchEvent:"touch"===i.type,originalEvent:o,preventDefaultAction:!1,userData:n.userData})&&m.cancelEvent(o)}}else if(2===h.contacts){if(n.moveHandler){s=h.asArray();!1===n.moveHandler({eventSource:n,pointerType:s[0].type,position:w(y(s[0].currentPos,s[1].currentPos),n.element),buttons:h.buttons,isTouchEvent:"touch"===s[0].type,originalEvent:o,preventDefaultAction:!1,userData:n.userData})&&m.cancelEvent(o)}if(n.pinchHandler&&"touch"===r[0].type&&(a=l.pinchGPoints[0].currentPos.distanceTo(l.pinchGPoints[1].currentPos))!=l.currentPinchDist){l.lastPinchDist=l.currentPinchDist;l.currentPinchDist=a;l.lastPinchCenter=l.currentPinchCenter;l.currentPinchCenter=y(l.pinchGPoints[0].currentPos,l.pinchGPoints[1].currentPos);!1===n.pinchHandler({eventSource:n,pointerType:"touch",gesturePoints:l.pinchGPoints,lastCenter:w(l.lastPinchCenter,n.element),center:w(l.currentPinchCenter,n.element),lastDistance:l.lastPinchDist,distance:l.currentPinchDist,shift:o.shiftKey,originalEvent:o,preventDefaultAction:!1,userData:n.userData})&&m.cancelEvent(o)}}}var G=function(){try{return window.self!==window.top}catch(e){return!0}}();function $(e){try{return e.addEventListener&&e.removeEventListener}catch(e){return!1}}}(OpenSeadragon);!function(o){o.ControlAnchor={NONE:0,TOP_LEFT:1,TOP_RIGHT:2,BOTTOM_RIGHT:3,BOTTOM_LEFT:4,ABSOLUTE:5};o.Control=function(e,t,i){var n=e.parentNode;if("number"==typeof t){o.console.error("Passing an anchor directly into the OpenSeadragon.Control constructor is deprecated; please use an options object instead.  Support for this deprecated variant is scheduled for removal in December 2013");t={anchor:t}}t.attachToViewer=void 0===t.attachToViewer||t.attachToViewer;this.autoFade=void 0===t.autoFade||t.autoFade;this.element=e;this.anchor=t.anchor;this.container=i;if(this.anchor==o.ControlAnchor.ABSOLUTE){this.wrapper=o.makeNeutralElement("div");this.wrapper.style.position="absolute";this.wrapper.style.top="number"==typeof t.top?t.top+"px":t.top;this.wrapper.style.left="number"==typeof t.left?t.left+"px":t.left;this.wrapper.style.height="number"==typeof t.height?t.height+"px":t.height;this.wrapper.style.width="number"==typeof t.width?t.width+"px":t.width;this.wrapper.style.margin="0px";this.wrapper.style.padding="0px";this.element.style.position="relative";this.element.style.top="0px";this.element.style.left="0px";this.element.style.height="100%";this.element.style.width="100%"}else{this.wrapper=o.makeNeutralElement("div");this.wrapper.style.display="inline-block";this.anchor==o.ControlAnchor.NONE&&(this.wrapper.style.width=this.wrapper.style.height="100%")}this.wrapper.appendChild(this.element);t.attachToViewer?this.anchor==o.ControlAnchor.TOP_RIGHT||this.anchor==o.ControlAnchor.BOTTOM_RIGHT?this.container.insertBefore(this.wrapper,this.container.firstChild):this.container.appendChild(this.wrapper):n.appendChild(this.wrapper)};o.Control.prototype={destroy:function(){this.wrapper.removeChild(this.element);this.container.removeChild(this.wrapper)},isVisible:function(){return"none"!=this.wrapper.style.display},setVisible:function(e){this.wrapper.style.display=e?this.anchor==o.ControlAnchor.ABSOLUTE?"block":"inline-block":"none"},setOpacity:function(e){this.element[o.SIGNAL]&&o.Browser.vendor==o.BROWSERS.IE?o.setElementOpacity(this.element,e,!0):o.setElementOpacity(this.wrapper,e,!0)}}}(OpenSeadragon);!function(o){o.ControlDock=function(e){var t,i,n=["topleft","topright","bottomright","bottomleft"];o.extend(!0,this,{id:"controldock-"+o.now()+"-"+Math.floor(1e6*Math.random()),container:o.makeNeutralElement("div"),controls:[]},e);this.container.onsubmit=function(){return!1};if(this.element){this.element=o.getElement(this.element);this.element.appendChild(this.container);this.element.style.position="relative";this.container.style.width="100%";this.container.style.height="100%"}for(i=0;i<n.length;i++){t=n[i];this.controls[t]=o.makeNeutralElement("div");this.controls[t].style.position="absolute";t.match("left")&&(this.controls[t].style.left="0px");t.match("right")&&(this.controls[t].style.right="0px");t.match("top")&&(this.controls[t].style.top="0px");t.match("bottom")&&(this.controls[t].style.bottom="0px")}this.container.appendChild(this.controls.topleft);this.container.appendChild(this.controls.topright);this.container.appendChild(this.controls.bottomright);this.container.appendChild(this.controls.bottomleft)};o.ControlDock.prototype={addControl:function(e,t){var i=null;if(!(0<=n(this,e=o.getElement(e)))){switch(t.anchor){case o.ControlAnchor.TOP_RIGHT:i=this.controls.topright;e.style.position="relative";e.style.paddingRight="0px";e.style.paddingTop="0px";break;case o.ControlAnchor.BOTTOM_RIGHT:i=this.controls.bottomright;e.style.position="relative";e.style.paddingRight="0px";e.style.paddingBottom="0px";break;case o.ControlAnchor.BOTTOM_LEFT:i=this.controls.bottomleft;e.style.position="relative";e.style.paddingLeft="0px";e.style.paddingBottom="0px";break;case o.ControlAnchor.TOP_LEFT:i=this.controls.topleft;e.style.position="relative";e.style.paddingLeft="0px";e.style.paddingTop="0px";break;case o.ControlAnchor.ABSOLUTE:i=this.container;e.style.margin="0px";e.style.padding="0px";break;default:case o.ControlAnchor.NONE:i=this.container;e.style.margin="0px";e.style.padding="0px"}this.controls.push(new o.Control(e,t,i));e.style.display="inline-block"}},removeControl:function(e){var t=n(this,e=o.getElement(e));if(0<=t){this.controls[t].destroy();this.controls.splice(t,1)}return this},clearControls:function(){for(;0<this.controls.length;)this.controls.pop().destroy();return this},areControlsEnabled:function(){var e;for(e=this.controls.length-1;0<=e;e--)if(this.controls[e].isVisible())return!0;return!1},setControlsEnabled:function(e){var t;for(t=this.controls.length-1;0<=t;t--)this.controls[t].setVisible(e);return this}};function n(e,t){var i,n=e.controls;for(i=n.length-1;0<=i;i--)if(n[i].element==t)return i;return-1}}(OpenSeadragon);!function(e){e.Placement=e.freezeObject({CENTER:0,TOP_LEFT:1,TOP:2,TOP_RIGHT:3,RIGHT:4,BOTTOM_RIGHT:5,BOTTOM:6,BOTTOM_LEFT:7,LEFT:8,properties:{0:{isLeft:!1,isHorizontallyCentered:!0,isRight:!1,isTop:!1,isVerticallyCentered:!0,isBottom:!1},1:{isLeft:!0,isHorizontallyCentered:!1,isRight:!1,isTop:!0,isVerticallyCentered:!1,isBottom:!1},2:{isLeft:!1,isHorizontallyCentered:!0,isRight:!1,isTop:!0,isVerticallyCentered:!1,isBottom:!1},3:{isLeft:!1,isHorizontallyCentered:!1,isRight:!0,isTop:!0,isVerticallyCentered:!1,isBottom:!1},4:{isLeft:!1,isHorizontallyCentered:!1,isRight:!0,isTop:!1,isVerticallyCentered:!0,isBottom:!1},5:{isLeft:!1,isHorizontallyCentered:!1,isRight:!0,isTop:!1,isVerticallyCentered:!1,isBottom:!0},6:{isLeft:!1,isHorizontallyCentered:!0,isRight:!1,isTop:!1,isVerticallyCentered:!1,isBottom:!0},7:{isLeft:!0,isHorizontallyCentered:!1,isRight:!1,isTop:!1,isVerticallyCentered:!1,isBottom:!0},8:{isLeft:!0,isHorizontallyCentered:!1,isRight:!1,isTop:!1,isVerticallyCentered:!0,isBottom:!1}}})}(OpenSeadragon);!function(m){var c={};var o=1;m.Viewer=function(e){var t,i=arguments,n=this;m.isPlainObject(e)||(e={id:i[0],xmlPath:1<i.length?i[1]:void 0,prefixUrl:2<i.length?i[2]:void 0,controls:3<i.length?i[3]:void 0,overlays:4<i.length?i[4]:void 0});if(e.config){m.extend(!0,e,e.config);delete e.config}m.extend(!0,this,{id:e.id,hash:e.hash||o++,initialPage:0,element:null,container:null,canvas:null,overlays:[],overlaysContainer:null,previousBody:[],customControls:[],source:null,drawer:null,world:null,viewport:null,navigator:null,collectionViewport:null,collectionDrawer:null,navImages:null,buttons:null,profiler:null},m.DEFAULT_SETTINGS,e);if(void 0===this.hash)throw new Error("A hash must be defined, either by specifying options.id or options.hash.");void 0!==c[this.hash]&&m.console.warn("Hash "+this.hash+" has already been used.");c[this.hash]={fsBoundsDelta:new m.Point(1,1),prevContainerSize:null,animating:!1,forceRedraw:!1,mouseInside:!1,group:null,zooming:!1,zoomFactor:null,lastZoomTime:null,fullPage:!1,onfullscreenchange:null};this._sequenceIndex=0;this._firstOpen=!0;this._updateRequestId=null;this._loadQueue=[];this.currentOverlays=[];this._lastScrollTime=m.now();m.EventSource.call(this);this.addHandler("open-failed",function(e){var t=m.getString("Errors.OpenFailed",e.eventSource,e.message);n._showMessage(t)});m.ControlDock.call(this,e);this.xmlPath&&(this.tileSources=[this.xmlPath]);this.element=this.element||document.getElementById(this.id);this.canvas=m.makeNeutralElement("div");this.canvas.className="openseadragon-canvas";!function(e){e.width="100%";e.height="100%";e.overflow="hidden";e.position="absolute";e.top="0px";e.left="0px"}(this.canvas.style);m.setElementTouchActionNone(this.canvas);""!==e.tabIndex&&(this.canvas.tabIndex=void 0===e.tabIndex?0:e.tabIndex);this.container.className="openseadragon-container";!function(e){e.width="100%";e.height="100%";e.position="relative";e.overflow="hidden";e.left="0px";e.top="0px";e.textAlign="left"}(this.container.style);this.container.insertBefore(this.canvas,this.container.firstChild);this.element.appendChild(this.container);this.bodyWidth=document.body.style.width;this.bodyHeight=document.body.style.height;this.bodyOverflow=document.body.style.overflow;this.docOverflow=document.documentElement.style.overflow;this.innerTracker=new m.MouseTracker({element:this.canvas,startDisabled:!this.mouseNavEnabled,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,dblClickTimeThreshold:this.dblClickTimeThreshold,dblClickDistThreshold:this.dblClickDistThreshold,keyDownHandler:m.delegate(this,l),keyHandler:m.delegate(this,h),clickHandler:m.delegate(this,w),dblClickHandler:m.delegate(this,y),dragHandler:m.delegate(this,T),dragEndHandler:m.delegate(this,x),enterHandler:m.delegate(this,S),exitHandler:m.delegate(this,E),pressHandler:m.delegate(this,P),releaseHandler:m.delegate(this,R),nonPrimaryPressHandler:m.delegate(this,_),nonPrimaryReleaseHandler:m.delegate(this,b),scrollHandler:m.delegate(this,O),pinchHandler:m.delegate(this,C)});this.outerTracker=new m.MouseTracker({element:this.container,startDisabled:!this.mouseNavEnabled,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,dblClickTimeThreshold:this.dblClickTimeThreshold,dblClickDistThreshold:this.dblClickDistThreshold,enterHandler:m.delegate(this,I),exitHandler:m.delegate(this,k)});this.toolbar&&(this.toolbar=new m.ControlDock({element:this.toolbar}));this.bindStandardControls();c[this.hash].prevContainerSize=u(this.container);this.world=new m.World({viewer:this});this.world.addHandler("add-item",function(e){n.source=n.world.getItemAt(0).source;c[n.hash].forceRedraw=!0;n._updateRequestId||(n._updateRequestId=r(n,B))});this.world.addHandler("remove-item",function(e){n.world.getItemCount()?n.source=n.world.getItemAt(0).source:n.source=null;c[n.hash].forceRedraw=!0});this.world.addHandler("metrics-change",function(e){n.viewport&&n.viewport._setContentBounds(n.world.getHomeBounds(),n.world.getContentFactor())});this.world.addHandler("item-index-change",function(e){n.source=n.world.getItemAt(0).source});this.viewport=new m.Viewport({containerSize:c[this.hash].prevContainerSize,springStiffness:this.springStiffness,animationTime:this.animationTime,minZoomImageRatio:this.minZoomImageRatio,maxZoomPixelRatio:this.maxZoomPixelRatio,visibilityRatio:this.visibilityRatio,wrapHorizontal:this.wrapHorizontal,wrapVertical:this.wrapVertical,defaultZoomLevel:this.defaultZoomLevel,minZoomLevel:this.minZoomLevel,maxZoomLevel:this.maxZoomLevel,viewer:this,degrees:this.degrees,flipped:this.flipped,navigatorRotate:this.navigatorRotate,homeFillsViewer:this.homeFillsViewer,margins:this.viewportMargins});this.viewport._setContentBounds(this.world.getHomeBounds(),this.world.getContentFactor());this.imageLoader=new m.ImageLoader({jobLimit:this.imageLoaderLimit,timeout:e.timeout});this.tileCache=new m.TileCache({maxImageCacheCount:this.maxImageCacheCount});this.drawer=new m.Drawer({viewer:this,viewport:this.viewport,element:this.canvas,debugGridColor:this.debugGridColor});this.overlaysContainer=m.makeNeutralElement("div");this.canvas.appendChild(this.overlaysContainer);if(!this.drawer.canRotate()){if(this.rotateLeft){t=this.buttons.buttons.indexOf(this.rotateLeft);this.buttons.buttons.splice(t,1);this.buttons.element.removeChild(this.rotateLeft.element)}if(this.rotateRight){t=this.buttons.buttons.indexOf(this.rotateRight);this.buttons.buttons.splice(t,1);this.buttons.element.removeChild(this.rotateRight.element)}}this.showNavigator&&(this.navigator=new m.Navigator({id:this.navigatorId,position:this.navigatorPosition,sizeRatio:this.navigatorSizeRatio,maintainSizeRatio:this.navigatorMaintainSizeRatio,top:this.navigatorTop,left:this.navigatorLeft,width:this.navigatorWidth,height:this.navigatorHeight,autoResize:this.navigatorAutoResize,autoFade:this.navigatorAutoFade,prefixUrl:this.prefixUrl,viewer:this,navigatorRotate:this.navigatorRotate,background:this.navigatorBackground,opacity:this.navigatorOpacity,borderColor:this.navigatorBorderColor,displayRegionColor:this.navigatorDisplayRegionColor,crossOriginPolicy:this.crossOriginPolicy}));this.sequenceMode&&this.bindSequenceControls();this.tileSources&&this.open(this.tileSources);for(t=0;t<this.customControls.length;t++)this.addControl(this.customControls[t].id,{anchor:this.customControls[t].anchor});m.requestAnimationFrame(function(){p(n)});void 0===this.imageSmoothingEnabled||this.imageSmoothingEnabled||this.drawer.setImageSmoothingEnabled(this.imageSmoothingEnabled)};m.extend(m.Viewer.prototype,m.EventSource.prototype,m.ControlDock.prototype,{isOpen:function(){return!!this.world.getItemCount()},openDzi:function(e){m.console.error("[Viewer.openDzi] this function is deprecated; use Viewer.open() instead.");return this.open(e)},openTileSource:function(e){m.console.error("[Viewer.openTileSource] this function is deprecated; use Viewer.open() instead.");return this.open(e)},open:function(i,e){var o=this;this.close();if(i)if(this.sequenceMode&&m.isArray(i)){if(this.referenceStrip){this.referenceStrip.destroy();this.referenceStrip=null}void 0===e||isNaN(e)||(this.initialPage=e);this.tileSources=i;this._sequenceIndex=Math.max(0,Math.min(this.tileSources.length-1,this.initialPage));if(this.tileSources.length){this.open(this.tileSources[this._sequenceIndex]);this.showReferenceStrip&&this.addReferenceStrip()}this._updateSequenceButtons(this._sequenceIndex)}else{m.isArray(i)||(i=[i]);if(i.length){this._opening=!0;var n=i.length;var r=0;var s=0;var a;var l=function(){if(r+s===n)if(r){if(o._firstOpen||!o.preserveViewport){o.viewport.goHome(!0);o.viewport.update()}o._firstOpen=!1;var e=i[0];e.tileSource&&(e=e.tileSource);if(o.overlays&&!o.preserveOverlays)for(var t=0;t<o.overlays.length;t++)o.currentOverlays[t]=d(o,o.overlays[t]);o._drawOverlays();o._opening=!1;o.raiseEvent("open",{source:e})}else{o._opening=!1;o.raiseEvent("open-failed",a)}};var t=function(i){m.isPlainObject(i)&&i.tileSource||(i={tileSource:i});if(void 0!==i.index){m.console.error("[Viewer.open] setting indexes here is not supported; use addTiledImage instead");delete i.index}void 0===i.collectionImmediately&&(i.collectionImmediately=!0);var n=i.success;i.success=function(e){r++;if(i.tileSource.overlays)for(var t=0;t<i.tileSource.overlays.length;t++)o.addOverlay(i.tileSource.overlays[t]);n&&n(e);l()};var t=i.error;i.error=function(e){s++;a||(a=e);t&&t(e);l()};o.addTiledImage(i)};for(var h=0;h<i.length;h++)t(i[h]);return this}}},close:function(){if(!c[this.hash])return this;this._opening=!1;this.navigator&&this.navigator.close();if(!this.preserveOverlays){this.clearOverlays();this.overlaysContainer.innerHTML=""}c[this.hash].animating=!1;this.world.removeAll();this.imageLoader.clear();this.raiseEvent("close");return this},destroy:function(){if(c[this.hash]){this.close();this.clearOverlays();this.overlaysContainer.innerHTML="";if(this.referenceStrip){this.referenceStrip.destroy();this.referenceStrip=null}if(null!==this._updateRequestId){m.cancelAnimationFrame(this._updateRequestId);this._updateRequestId=null}this.drawer&&this.drawer.destroy();this.removeAllHandlers();if(this.element)for(;this.element.firstChild;)this.element.removeChild(this.element.firstChild);this.innerTracker&&this.innerTracker.destroy();this.outerTracker&&this.outerTracker.destroy();c[this.hash]=null;delete c[this.hash];this.canvas=null;this.container=null;this.element=null}},isMouseNavEnabled:function(){return this.innerTracker.isTracking()},setMouseNavEnabled:function(e){this.innerTracker.setTracking(e);this.outerTracker.setTracking(e);this.raiseEvent("mouse-enabled",{enabled:e});return this},areControlsEnabled:function(){var e,t=this.controls.length;for(e=0;e<this.controls.length;e++)t=t&&this.controls[e].isVisible();return t},setControlsEnabled:function(e){e?g(this):p(this);this.raiseEvent("controls-enabled",{enabled:e});return this},setDebugMode:function(e){for(var t=0;t<this.world.getItemCount();t++)this.world.getItemAt(t).debugMode=e;this.debugMode=e;this.forceRedraw()},isFullPage:function(){return c[this.hash].fullPage},setFullPage:function(e){var t,i,n=document.body,o=n.style,r=document.documentElement.style,s=this;if(e==this.isFullPage())return this;var a={fullPage:e,preventDefaultAction:!1};this.raiseEvent("pre-full-page",a);if(a.preventDefaultAction)return this;if(e){this.elementSize=m.getElementSize(this.element);this.pageScroll=m.getPageScroll();this.elementMargin=this.element.style.margin;this.element.style.margin="0";this.elementPadding=this.element.style.padding;this.element.style.padding="0";this.bodyMargin=o.margin;this.docMargin=r.margin;o.margin="0";r.margin="0";this.bodyPadding=o.padding;this.docPadding=r.padding;o.padding="0";r.padding="0";this.bodyWidth=o.width;this.docWidth=r.width;o.width="100%";r.width="100%";this.bodyHeight=o.height;this.docHeight=r.height;o.height="100%";r.height="100%";this.previousBody=[];c[this.hash].prevElementParent=this.element.parentNode;c[this.hash].prevNextSibling=this.element.nextSibling;c[this.hash].prevElementWidth=this.element.style.width;c[this.hash].prevElementHeight=this.element.style.height;t=n.childNodes.length;for(i=0;i<t;i++){this.previousBody.push(n.childNodes[0]);n.removeChild(n.childNodes[0])}if(this.toolbar&&this.toolbar.element){this.toolbar.parentNode=this.toolbar.element.parentNode;this.toolbar.nextSibling=this.toolbar.element.nextSibling;n.appendChild(this.toolbar.element);m.addClass(this.toolbar.element,"fullpage")}m.addClass(this.element,"fullpage");n.appendChild(this.element);this.element.style.height=m.getWindowSize().y+"px";this.element.style.width=m.getWindowSize().x+"px";this.toolbar&&this.toolbar.element&&(this.element.style.height=m.getElementSize(this.element).y-m.getElementSize(this.toolbar.element).y+"px");c[this.hash].fullPage=!0;m.delegate(this,I)({})}else{this.element.style.margin=this.elementMargin;this.element.style.padding=this.elementPadding;o.margin=this.bodyMargin;r.margin=this.docMargin;o.padding=this.bodyPadding;r.padding=this.docPadding;o.width=this.bodyWidth;r.width=this.docWidth;o.height=this.bodyHeight;r.height=this.docHeight;n.removeChild(this.element);t=this.previousBody.length;for(i=0;i<t;i++)n.appendChild(this.previousBody.shift());m.removeClass(this.element,"fullpage");c[this.hash].prevElementParent.insertBefore(this.element,c[this.hash].prevNextSibling);if(this.toolbar&&this.toolbar.element){n.removeChild(this.toolbar.element);m.removeClass(this.toolbar.element,"fullpage");this.toolbar.parentNode.insertBefore(this.toolbar.element,this.toolbar.nextSibling);delete this.toolbar.parentNode;delete this.toolbar.nextSibling}this.element.style.width=c[this.hash].prevElementWidth;this.element.style.height=c[this.hash].prevElementHeight;var l=0;var h=function(){m.setPageScroll(s.pageScroll);var e=m.getPageScroll();++l<10&&(e.x!==s.pageScroll.x||e.y!==s.pageScroll.y)&&m.requestAnimationFrame(h)};m.requestAnimationFrame(h);c[this.hash].fullPage=!1;m.delegate(this,k)({})}this.navigator&&this.viewport&&this.navigator.update(this.viewport);this.raiseEvent("full-page",{fullPage:e});return this},setFullScreen:function(e){var t=this;if(!m.supportsFullScreen)return this.setFullPage(e);if(m.isFullScreen()===e)return this;var i={fullScreen:e,preventDefaultAction:!1};this.raiseEvent("pre-full-screen",i);if(i.preventDefaultAction)return this;if(e){this.setFullPage(!0);if(!this.isFullPage())return this;this.fullPageStyleWidth=this.element.style.width;this.fullPageStyleHeight=this.element.style.height;this.element.style.width="100%";this.element.style.height="100%";var n=function(){var e=m.isFullScreen();if(!e){m.removeEvent(document,m.fullScreenEventName,n);m.removeEvent(document,m.fullScreenErrorEventName,n);t.setFullPage(!1);if(t.isFullPage()){t.element.style.width=t.fullPageStyleWidth;t.element.style.height=t.fullPageStyleHeight}}t.navigator&&t.viewport&&setTimeout(function(){t.navigator.update(t.viewport)});t.raiseEvent("full-screen",{fullScreen:e})};m.addEvent(document,m.fullScreenEventName,n);m.addEvent(document,m.fullScreenErrorEventName,n);m.requestFullScreen(document.body)}else m.exitFullScreen();return this},isVisible:function(){return"hidden"!=this.container.style.visibility},setVisible:function(e){this.container.style.visibility=e?"":"hidden";this.raiseEvent("visible",{visible:e});return this},addTiledImage:function(i){m.console.assert(i,"[Viewer.addTiledImage] options is required");m.console.assert(i.tileSource,"[Viewer.addTiledImage] options.tileSource is required");m.console.assert(!i.replace||-1<i.index&&i.index<this.world.getItemCount(),"[Viewer.addTiledImage] if options.replace is used, options.index must be a valid index in Viewer.world");var o=this;i.replace&&(i.replaceItem=o.world.getItemAt(i.index));this._hideMessage();void 0===i.placeholderFillStyle&&(i.placeholderFillStyle=this.placeholderFillStyle);void 0===i.opacity&&(i.opacity=this.opacity);void 0===i.preload&&(i.preload=this.preload);void 0===i.compositeOperation&&(i.compositeOperation=this.compositeOperation);void 0===i.crossOriginPolicy&&(i.crossOriginPolicy=void 0!==i.tileSource.crossOriginPolicy?i.tileSource.crossOriginPolicy:this.crossOriginPolicy);void 0===i.ajaxWithCredentials&&(i.ajaxWithCredentials=this.ajaxWithCredentials);void 0===i.loadTilesWithAjax&&(i.loadTilesWithAjax=this.loadTilesWithAjax);void 0===i.ajaxHeaders||null===i.ajaxHeaders?i.ajaxHeaders=this.ajaxHeaders:m.isPlainObject(i.ajaxHeaders)&&m.isPlainObject(this.ajaxHeaders)&&(i.ajaxHeaders=m.extend({},this.ajaxHeaders,i.ajaxHeaders));var n={options:i};function t(e){for(var t=0;t<o._loadQueue.length;t++)if(o._loadQueue[t]===n){o._loadQueue.splice(t,1);break}0===o._loadQueue.length&&r(n);o.raiseEvent("add-item-failed",e);i.error&&i.error(e)}function r(e){if(o.collectionMode){o.world.arrange({immediately:e.options.collectionImmediately,rows:o.collectionRows,columns:o.collectionColumns,layout:o.collectionLayout,tileSize:o.collectionTileSize,tileMargin:o.collectionTileMargin});o.world.setAutoRefigureSizes(!0)}}if(m.isArray(i.tileSource))setTimeout(function(){t({message:"[Viewer.addTiledImage] Sequences can not be added; add them one at a time instead.",source:i.tileSource,options:i})});else{this._loadQueue.push(n);!function(n,o,r,s,a){var l=n;if("string"==m.type(o))if(o.match(/^\s*<.*>\s*$/))o=m.parseXml(o);else if(o.match(/^\s*[\{\[].*[\}\]]\s*$/))try{var e=m.parseJSON(o);o=e}catch(e){}function h(e,t){if(e.ready)s(e);else{e.addHandler("ready",function(){s(e)});e.addHandler("open-failed",function(e){a({message:e.message,source:t})})}}setTimeout(function(){if("string"==m.type(o))(o=new m.TileSource({url:o,crossOriginPolicy:void 0!==r.crossOriginPolicy?r.crossOriginPolicy:n.crossOriginPolicy,ajaxWithCredentials:n.ajaxWithCredentials,ajaxHeaders:n.ajaxHeaders,useCanvas:n.useCanvas,success:function(e){s(e.tileSource)}})).addHandler("open-failed",function(e){a(e)});else if(m.isPlainObject(o)||o.nodeType){void 0!==o.crossOriginPolicy||void 0===r.crossOriginPolicy&&void 0===n.crossOriginPolicy||(o.crossOriginPolicy=void 0!==r.crossOriginPolicy?r.crossOriginPolicy:n.crossOriginPolicy);void 0===o.ajaxWithCredentials&&(o.ajaxWithCredentials=n.ajaxWithCredentials);void 0===o.useCanvas&&(o.useCanvas=n.useCanvas);if(m.isFunction(o.getTileUrl)){var e=new m.TileSource(o);e.getTileUrl=o.getTileUrl;s(e)}else{var t=m.TileSource.determineType(l,o);if(!t){a({message:"Unable to load TileSource",source:o});return}var i=t.prototype.configure.apply(l,[o]);h(new t(i),o)}}else h(o,o)})}(this,i.tileSource,i,function(e){n.tileSource=e;s()},function(e){e.options=i;t(e);s()})}function s(){var e,t,i;for(;o._loadQueue.length&&(e=o._loadQueue[0]).tileSource;){o._loadQueue.splice(0,1);if(e.options.replace){var n=o.world.getIndexOfItem(e.options.replaceItem);-1!=n&&(e.options.index=n);o.world.removeItem(e.options.replaceItem)}t=new m.TiledImage({viewer:o,source:e.tileSource,viewport:o.viewport,drawer:o.drawer,tileCache:o.tileCache,imageLoader:o.imageLoader,x:e.options.x,y:e.options.y,width:e.options.width,height:e.options.height,fitBounds:e.options.fitBounds,fitBoundsPlacement:e.options.fitBoundsPlacement,clip:e.options.clip,placeholderFillStyle:e.options.placeholderFillStyle,opacity:e.options.opacity,preload:e.options.preload,degrees:e.options.degrees,compositeOperation:e.options.compositeOperation,springStiffness:o.springStiffness,animationTime:o.animationTime,minZoomImageRatio:o.minZoomImageRatio,wrapHorizontal:o.wrapHorizontal,wrapVertical:o.wrapVertical,immediateRender:o.immediateRender,blendTime:o.blendTime,alwaysBlend:o.alwaysBlend,minPixelRatio:o.minPixelRatio,smoothTileEdgesMinZoom:o.smoothTileEdgesMinZoom,iOSDevice:o.iOSDevice,crossOriginPolicy:e.options.crossOriginPolicy,ajaxWithCredentials:e.options.ajaxWithCredentials,loadTilesWithAjax:e.options.loadTilesWithAjax,ajaxHeaders:e.options.ajaxHeaders,debugMode:o.debugMode});o.collectionMode&&o.world.setAutoRefigureSizes(!1);o.world.addItem(t,{index:e.options.index});0===o._loadQueue.length&&r(e);1!==o.world.getItemCount()||o.preserveViewport||o.viewport.goHome(!0);if(o.navigator){i=m.extend({},e.options,{replace:!1,originalTiledImage:t,tileSource:e.tileSource});o.navigator.addTiledImage(i)}e.options.success&&e.options.success({item:t})}}},addSimpleImage:function(e){m.console.assert(e,"[Viewer.addSimpleImage] options is required");m.console.assert(e.url,"[Viewer.addSimpleImage] options.url is required");var t=m.extend({},e,{tileSource:{type:"image",url:e.url}});delete t.url;this.addTiledImage(t)},addLayer:function(t){var i=this;m.console.error("[Viewer.addLayer] this function is deprecated; use Viewer.addTiledImage() instead.");var e=m.extend({},t,{success:function(e){i.raiseEvent("add-layer",{options:t,drawer:e.item})},error:function(e){i.raiseEvent("add-layer-failed",e)}});this.addTiledImage(e);return this},getLayerAtLevel:function(e){m.console.error("[Viewer.getLayerAtLevel] this function is deprecated; use World.getItemAt() instead.");return this.world.getItemAt(e)},getLevelOfLayer:function(e){m.console.error("[Viewer.getLevelOfLayer] this function is deprecated; use World.getIndexOfItem() instead.");return this.world.getIndexOfItem(e)},getLayersCount:function(){m.console.error("[Viewer.getLayersCount] this function is deprecated; use World.getItemCount() instead.");return this.world.getItemCount()},setLayerLevel:function(e,t){m.console.error("[Viewer.setLayerLevel] this function is deprecated; use World.setItemIndex() instead.");return this.world.setItemIndex(e,t)},removeLayer:function(e){m.console.error("[Viewer.removeLayer] this function is deprecated; use World.removeItem() instead.");return this.world.removeItem(e)},forceRedraw:function(){c[this.hash].forceRedraw=!0;return this},bindSequenceControls:function(){var e=m.delegate(this,v),t=m.delegate(this,f),i=m.delegate(this,$),n=m.delegate(this,G),o=this.navImages,r=!0;if(this.showSequenceControl){(this.previousButton||this.nextButton)&&(r=!1);this.previousButton=new m.Button({element:this.previousButton?m.getElement(this.previousButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.PreviousPage"),srcRest:D(this.prefixUrl,o.previous.REST),srcGroup:D(this.prefixUrl,o.previous.GROUP),srcHover:D(this.prefixUrl,o.previous.HOVER),srcDown:D(this.prefixUrl,o.previous.DOWN),onRelease:n,onFocus:e,onBlur:t});this.nextButton=new m.Button({element:this.nextButton?m.getElement(this.nextButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.NextPage"),srcRest:D(this.prefixUrl,o.next.REST),srcGroup:D(this.prefixUrl,o.next.GROUP),srcHover:D(this.prefixUrl,o.next.HOVER),srcDown:D(this.prefixUrl,o.next.DOWN),onRelease:i,onFocus:e,onBlur:t});this.navPrevNextWrap||this.previousButton.disable();this.tileSources&&this.tileSources.length||this.nextButton.disable();if(r){this.paging=new m.ButtonGroup({buttons:[this.previousButton,this.nextButton],clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold});this.pagingControl=this.paging.element;this.toolbar?this.toolbar.addControl(this.pagingControl,{anchor:m.ControlAnchor.BOTTOM_RIGHT}):this.addControl(this.pagingControl,{anchor:this.sequenceControlAnchor||m.ControlAnchor.TOP_LEFT})}}return this},bindStandardControls:function(){var e=m.delegate(this,M),t=m.delegate(this,H),i=m.delegate(this,L),n=m.delegate(this,z),o=m.delegate(this,F),r=m.delegate(this,A),s=m.delegate(this,W),a=m.delegate(this,V),l=m.delegate(this,U),h=m.delegate(this,j),c=m.delegate(this,v),u=m.delegate(this,f),d=this.navImages,p=[],g=!0;if(this.showNavigationControl){(this.zoomInButton||this.zoomOutButton||this.homeButton||this.fullPageButton||this.rotateLeftButton||this.rotateRightButton||this.flipButton)&&(g=!1);if(this.showZoomControl){p.push(this.zoomInButton=new m.Button({element:this.zoomInButton?m.getElement(this.zoomInButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.ZoomIn"),srcRest:D(this.prefixUrl,d.zoomIn.REST),srcGroup:D(this.prefixUrl,d.zoomIn.GROUP),srcHover:D(this.prefixUrl,d.zoomIn.HOVER),srcDown:D(this.prefixUrl,d.zoomIn.DOWN),onPress:e,onRelease:t,onClick:i,onEnter:e,onExit:t,onFocus:c,onBlur:u}));p.push(this.zoomOutButton=new m.Button({element:this.zoomOutButton?m.getElement(this.zoomOutButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.ZoomOut"),srcRest:D(this.prefixUrl,d.zoomOut.REST),srcGroup:D(this.prefixUrl,d.zoomOut.GROUP),srcHover:D(this.prefixUrl,d.zoomOut.HOVER),srcDown:D(this.prefixUrl,d.zoomOut.DOWN),onPress:n,onRelease:t,onClick:o,onEnter:n,onExit:t,onFocus:c,onBlur:u}))}this.showHomeControl&&p.push(this.homeButton=new m.Button({element:this.homeButton?m.getElement(this.homeButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.Home"),srcRest:D(this.prefixUrl,d.home.REST),srcGroup:D(this.prefixUrl,d.home.GROUP),srcHover:D(this.prefixUrl,d.home.HOVER),srcDown:D(this.prefixUrl,d.home.DOWN),onRelease:r,onFocus:c,onBlur:u}));this.showFullPageControl&&p.push(this.fullPageButton=new m.Button({element:this.fullPageButton?m.getElement(this.fullPageButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.FullPage"),srcRest:D(this.prefixUrl,d.fullpage.REST),srcGroup:D(this.prefixUrl,d.fullpage.GROUP),srcHover:D(this.prefixUrl,d.fullpage.HOVER),srcDown:D(this.prefixUrl,d.fullpage.DOWN),onRelease:s,onFocus:c,onBlur:u}));if(this.showRotationControl){p.push(this.rotateLeftButton=new m.Button({element:this.rotateLeftButton?m.getElement(this.rotateLeftButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.RotateLeft"),srcRest:D(this.prefixUrl,d.rotateleft.REST),srcGroup:D(this.prefixUrl,d.rotateleft.GROUP),srcHover:D(this.prefixUrl,d.rotateleft.HOVER),srcDown:D(this.prefixUrl,d.rotateleft.DOWN),onRelease:a,onFocus:c,onBlur:u}));p.push(this.rotateRightButton=new m.Button({element:this.rotateRightButton?m.getElement(this.rotateRightButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.RotateRight"),srcRest:D(this.prefixUrl,d.rotateright.REST),srcGroup:D(this.prefixUrl,d.rotateright.GROUP),srcHover:D(this.prefixUrl,d.rotateright.HOVER),srcDown:D(this.prefixUrl,d.rotateright.DOWN),onRelease:l,onFocus:c,onBlur:u}))}this.showFlipControl&&p.push(this.flipButton=new m.Button({element:this.flipButton?m.getElement(this.flipButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:m.getString("Tooltips.Flip"),srcRest:D(this.prefixUrl,d.flip.REST),srcGroup:D(this.prefixUrl,d.flip.GROUP),srcHover:D(this.prefixUrl,d.flip.HOVER),srcDown:D(this.prefixUrl,d.flip.DOWN),onRelease:h,onFocus:c,onBlur:u}));if(g){this.buttons=new m.ButtonGroup({buttons:p,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold});this.navControl=this.buttons.element;this.addHandler("open",m.delegate(this,N));this.toolbar?this.toolbar.addControl(this.navControl,{anchor:this.navigationControlAnchor||m.ControlAnchor.TOP_LEFT}):this.addControl(this.navControl,{anchor:this.navigationControlAnchor||m.ControlAnchor.TOP_LEFT})}}return this},currentPage:function(){return this._sequenceIndex},goToPage:function(e){if(this.tileSources&&0<=e&&e<this.tileSources.length){this._sequenceIndex=e;this._updateSequenceButtons(e);this.open(this.tileSources[e]);this.referenceStrip&&this.referenceStrip.setFocus(e);this.raiseEvent("page",{page:e})}return this},addOverlay:function(e,t,i,n){var o;o=m.isPlainObject(e)?e:{element:e,location:t,placement:i,onDraw:n};e=m.getElement(o.element);if(0<=s(this.currentOverlays,e))return this;var r=d(this,o);this.currentOverlays.push(r);r.drawHTML(this.overlaysContainer,this.viewport);this.raiseEvent("add-overlay",{element:e,location:o.location,placement:o.placement});return this},updateOverlay:function(e,t,i){var n;e=m.getElement(e);if(0<=(n=s(this.currentOverlays,e))){this.currentOverlays[n].update(t,i);c[this.hash].forceRedraw=!0;this.raiseEvent("update-overlay",{element:e,location:t,placement:i})}return this},removeOverlay:function(e){var t;e=m.getElement(e);if(0<=(t=s(this.currentOverlays,e))){this.currentOverlays[t].destroy();this.currentOverlays.splice(t,1);c[this.hash].forceRedraw=!0;this.raiseEvent("remove-overlay",{element:e})}return this},clearOverlays:function(){for(;0<this.currentOverlays.length;)this.currentOverlays.pop().destroy();c[this.hash].forceRedraw=!0;this.raiseEvent("clear-overlay",{});return this},getOverlayById:function(e){var t;e=m.getElement(e);return 0<=(t=s(this.currentOverlays,e))?this.currentOverlays[t]:null},_updateSequenceButtons:function(e){this.nextButton&&(this.tileSources&&this.tileSources.length-1!==e?this.nextButton.enable():this.navPrevNextWrap||this.nextButton.disable());this.previousButton&&(0<e?this.previousButton.enable():this.navPrevNextWrap||this.previousButton.disable())},_showMessage:function(e){this._hideMessage();var t=m.makeNeutralElement("div");t.appendChild(document.createTextNode(e));this.messageDiv=m.makeCenteredNode(t);m.addClass(this.messageDiv,"openseadragon-message");this.container.appendChild(this.messageDiv)},_hideMessage:function(){var e=this.messageDiv;if(e){e.parentNode.removeChild(e);delete this.messageDiv}},gestureSettingsByDeviceType:function(e){switch(e){case"mouse":return this.gestureSettingsMouse;case"touch":return this.gestureSettingsTouch;case"pen":return this.gestureSettingsPen;default:return this.gestureSettingsUnknown}},_drawOverlays:function(){var e,t=this.currentOverlays.length;for(e=0;e<t;e++)this.currentOverlays[e].drawHTML(this.overlaysContainer,this.viewport)},_cancelPendingImages:function(){this._loadQueue=[]},removeReferenceStrip:function(){this.showReferenceStrip=!1;if(this.referenceStrip){this.referenceStrip.destroy();this.referenceStrip=null}},addReferenceStrip:function(){this.showReferenceStrip=!0;if(this.sequenceMode){if(this.referenceStrip)return;if(this.tileSources.length&&1<this.tileSources.length){this.referenceStrip=new m.ReferenceStrip({id:this.referenceStripElement,position:this.referenceStripPosition,sizeRatio:this.referenceStripSizeRatio,scroll:this.referenceStripScroll,height:this.referenceStripHeight,width:this.referenceStripWidth,tileSources:this.tileSources,prefixUrl:this.prefixUrl,viewer:this});this.referenceStrip.setFocus(this._sequenceIndex)}}else m.console.warn('Attempting to display a reference strip while "sequenceMode" is off.')}});function u(e){e=m.getElement(e);return new m.Point(0===e.clientWidth?1:e.clientWidth,0===e.clientHeight?1:e.clientHeight)}function d(e,t){if(t instanceof m.Overlay)return t;var i=null;if(t.element)i=m.getElement(t.element);else{var n=t.id?t.id:"openseadragon-overlay-"+Math.floor(1e7*Math.random());(i=m.getElement(t.id))||((i=document.createElement("a")).href="#/overlay/"+n);i.id=n;m.addClass(i,t.className?t.className:"openseadragon-overlay")}var o=t.location;var r=t.width;var s=t.height;if(!o){var a=t.x;var l=t.y;if(void 0!==t.px){var h=e.viewport.imageToViewportRectangle(new m.Rect(t.px,t.py,r||0,s||0));a=h.x;l=h.y;r=void 0!==r?h.width:void 0;s=void 0!==s?h.height:void 0}o=new m.Point(a,l)}var c=t.placement;c&&"string"===m.type(c)&&(c=m.Placement[t.placement.toUpperCase()]);return new m.Overlay({element:i,location:o,placement:c,onDraw:t.onDraw,checkResize:t.checkResize,width:r,height:s,rotationMode:t.rotationMode})}function s(e,t){var i;for(i=e.length-1;0<=i;i--)if(e[i].element===t)return i;return-1}function r(e,t){return m.requestAnimationFrame(function(){t(e)})}function a(e){m.requestAnimationFrame(function(){!function(e){var t,i,n,o;if(e.controlsShouldFade){t=m.now();i=t-e.controlsFadeBeginTime;n=1-i/e.controlsFadeLength;n=Math.min(1,n);n=Math.max(0,n);for(o=e.controls.length-1;0<=o;o--)e.controls[o].autoFade&&e.controls[o].setOpacity(n);0<n&&a(e)}}(e)})}function p(e){if(e.autoHideControls){e.controlsShouldFade=!0;e.controlsFadeBeginTime=m.now()+e.controlsFadeDelay;window.setTimeout(function(){a(e)},e.controlsFadeDelay)}}function g(e){var t;e.controlsShouldFade=!1;for(t=e.controls.length-1;0<=t;t--)e.controls[t].setOpacity(1)}function v(){g(this)}function f(){p(this)}function l(e){var t={originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction,preventVerticalPan:e.preventVerticalPan,preventHorizontalPan:e.preventHorizontalPan};this.raiseEvent("canvas-key",t);if(t.preventDefaultAction||e.ctrl||e.alt||e.meta)return!0;switch(e.keyCode){case 38:if(!t.preventVerticalPan){e.shift?this.viewport.zoomBy(1.1):this.viewport.panBy(this.viewport.deltaPointsFromPixels(new m.Point(0,-this.pixelsPerArrowPress)));this.viewport.applyConstraints()}return!1;case 40:if(!t.preventVerticalPan){e.shift?this.viewport.zoomBy(.9):this.viewport.panBy(this.viewport.deltaPointsFromPixels(new m.Point(0,this.pixelsPerArrowPress)));this.viewport.applyConstraints()}return!1;case 37:if(!t.preventHorizontalPan){this.viewport.panBy(this.viewport.deltaPointsFromPixels(new m.Point(-this.pixelsPerArrowPress,0)));this.viewport.applyConstraints()}return!1;case 39:if(!t.preventHorizontalPan){this.viewport.panBy(this.viewport.deltaPointsFromPixels(new m.Point(this.pixelsPerArrowPress,0)));this.viewport.applyConstraints()}return!1;default:return!0}}function h(e){var t={originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction,preventVerticalPan:e.preventVerticalPan,preventHorizontalPan:e.preventHorizontalPan};this.raiseEvent("canvas-key",t);if(t.preventDefaultAction||e.ctrl||e.alt||e.meta)return!0;switch(e.keyCode){case 43:case 61:this.viewport.zoomBy(1.1);this.viewport.applyConstraints();return!1;case 45:this.viewport.zoomBy(.9);this.viewport.applyConstraints();return!1;case 48:this.viewport.goHome();this.viewport.applyConstraints();return!1;case 119:case 87:if(!t.preventVerticalPan){e.shift?this.viewport.zoomBy(1.1):this.viewport.panBy(this.viewport.deltaPointsFromPixels(new m.Point(0,-40)));this.viewport.applyConstraints()}return!1;case 115:case 83:if(!t.preventVerticalPan){e.shift?this.viewport.zoomBy(.9):this.viewport.panBy(this.viewport.deltaPointsFromPixels(new m.Point(0,40)));this.viewport.applyConstraints()}return!1;case 97:if(!t.preventHorizontalPan){this.viewport.panBy(this.viewport.deltaPointsFromPixels(new m.Point(-40,0)));this.viewport.applyConstraints()}return!1;case 100:if(!t.preventHorizontalPan){this.viewport.panBy(this.viewport.deltaPointsFromPixels(new m.Point(40,0)));this.viewport.applyConstraints()}return!1;case 114:this.viewport.flipped?this.viewport.setRotation(m.positiveModulo(this.viewport.degrees-this.rotationIncrement,360)):this.viewport.setRotation(m.positiveModulo(this.viewport.degrees+this.rotationIncrement,360));this.viewport.applyConstraints();return!1;case 82:this.viewport.flipped?this.viewport.setRotation(m.positiveModulo(this.viewport.degrees+this.rotationIncrement,360)):this.viewport.setRotation(m.positiveModulo(this.viewport.degrees-this.rotationIncrement,360));this.viewport.applyConstraints();return!1;case 102:this.viewport.toggleFlip();return!1;default:return!0}}function w(e){var t;document.activeElement==this.canvas||this.canvas.focus();this.viewport.flipped&&(e.position.x=this.viewport.getContainerSize().x-e.position.x);var i={tracker:e.eventSource,position:e.position,quick:e.quick,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.raiseEvent("canvas-click",i);if(!i.preventDefaultAction&&this.viewport&&e.quick&&(t=this.gestureSettingsByDeviceType(e.pointerType)).clickToZoom){this.viewport.zoomBy(e.shift?1/this.zoomPerClick:this.zoomPerClick,t.zoomToRefPoint?this.viewport.pointFromPixel(e.position,!0):null);this.viewport.applyConstraints()}}function y(e){var t;var i={tracker:e.eventSource,position:e.position,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.raiseEvent("canvas-double-click",i);if(!i.preventDefaultAction&&this.viewport&&(t=this.gestureSettingsByDeviceType(e.pointerType)).dblClickToZoom){this.viewport.zoomBy(e.shift?1/this.zoomPerClick:this.zoomPerClick,t.zoomToRefPoint?this.viewport.pointFromPixel(e.position,!0):null);this.viewport.applyConstraints()}}function T(e){var t;var i={tracker:e.eventSource,position:e.position,delta:e.delta,speed:e.speed,direction:e.direction,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.raiseEvent("canvas-drag",i);if(!i.preventDefaultAction&&this.viewport){t=this.gestureSettingsByDeviceType(e.pointerType);this.panHorizontal||(e.delta.x=0);this.panVertical||(e.delta.y=0);this.viewport.flipped&&(e.delta.x=-e.delta.x);if(this.constrainDuringPan){var n=this.viewport.deltaPointsFromPixels(e.delta.negate());this.viewport.centerSpringX.target.value+=n.x;this.viewport.centerSpringY.target.value+=n.y;var o=this.viewport.getBounds();var r=this.viewport.getConstrainedBounds();this.viewport.centerSpringX.target.value-=n.x;this.viewport.centerSpringY.target.value-=n.y;o.x!=r.x&&(e.delta.x=0);o.y!=r.y&&(e.delta.y=0)}this.viewport.panBy(this.viewport.deltaPointsFromPixels(e.delta.negate()),t.flickEnabled&&!this.constrainDuringPan)}}function x(e){if(!e.preventDefaultAction&&this.viewport){var t=this.gestureSettingsByDeviceType(e.pointerType);if(t.flickEnabled&&e.speed>=t.flickMinSpeed){var i=0;this.panHorizontal&&(i=t.flickMomentum*e.speed*Math.cos(e.direction));var n=0;this.panVertical&&(n=t.flickMomentum*e.speed*Math.sin(e.direction));var o=this.viewport.pixelFromPoint(this.viewport.getCenter(!0));var r=this.viewport.pointFromPixel(new m.Point(o.x-i,o.y-n));this.viewport.panTo(r,!1)}this.viewport.applyConstraints()}this.raiseEvent("canvas-drag-end",{tracker:e.eventSource,position:e.position,speed:e.speed,direction:e.direction,shift:e.shift,originalEvent:e.originalEvent})}function S(e){this.raiseEvent("canvas-enter",{tracker:e.eventSource,pointerType:e.pointerType,position:e.position,buttons:e.buttons,pointers:e.pointers,insideElementPressed:e.insideElementPressed,buttonDownAny:e.buttonDownAny,originalEvent:e.originalEvent})}function E(e){window.location!=window.parent.location&&m.MouseTracker.resetAllMouseTrackers();this.raiseEvent("canvas-exit",{tracker:e.eventSource,pointerType:e.pointerType,position:e.position,buttons:e.buttons,pointers:e.pointers,insideElementPressed:e.insideElementPressed,buttonDownAny:e.buttonDownAny,originalEvent:e.originalEvent})}function P(e){this.raiseEvent("canvas-press",{tracker:e.eventSource,pointerType:e.pointerType,position:e.position,insideElementPressed:e.insideElementPressed,insideElementReleased:e.insideElementReleased,originalEvent:e.originalEvent})}function R(e){this.raiseEvent("canvas-release",{tracker:e.eventSource,pointerType:e.pointerType,position:e.position,insideElementPressed:e.insideElementPressed,insideElementReleased:e.insideElementReleased,originalEvent:e.originalEvent})}function _(e){this.raiseEvent("canvas-nonprimary-press",{tracker:e.eventSource,position:e.position,pointerType:e.pointerType,button:e.button,buttons:e.buttons,originalEvent:e.originalEvent})}function b(e){this.raiseEvent("canvas-nonprimary-release",{tracker:e.eventSource,position:e.position,pointerType:e.pointerType,button:e.button,buttons:e.buttons,originalEvent:e.originalEvent})}function C(e){var t,i,n;if(!e.preventDefaultAction&&this.viewport){if((t=this.gestureSettingsByDeviceType(e.pointerType)).pinchToZoom){i=this.viewport.pointFromPixel(e.center,!0);n=this.viewport.pointFromPixel(e.lastCenter,!0).minus(i);this.panHorizontal||(n.x=0);this.panVertical||(n.y=0);this.viewport.zoomBy(e.distance/e.lastDistance,i,!0);t.zoomToRefPoint&&this.viewport.panBy(n,!0);this.viewport.applyConstraints()}if(t.pinchRotate){var o=Math.atan2(e.gesturePoints[0].currentPos.y-e.gesturePoints[1].currentPos.y,e.gesturePoints[0].currentPos.x-e.gesturePoints[1].currentPos.x);var r=Math.atan2(e.gesturePoints[0].lastPos.y-e.gesturePoints[1].lastPos.y,e.gesturePoints[0].lastPos.x-e.gesturePoints[1].lastPos.x);this.viewport.setRotation(this.viewport.getRotation()+(o-r)*(180/Math.PI))}}this.raiseEvent("canvas-pinch",{tracker:e.eventSource,gesturePoints:e.gesturePoints,lastCenter:e.lastCenter,center:e.center,lastDistance:e.lastDistance,distance:e.distance,shift:e.shift,originalEvent:e.originalEvent});return!1}function O(e){var t,i,n;if((n=m.now())-this._lastScrollTime>this.minScrollDeltaTime){this._lastScrollTime=n;this.viewport.flipped&&(e.position.x=this.viewport.getContainerSize().x-e.position.x);if(!e.preventDefaultAction&&this.viewport&&(t=this.gestureSettingsByDeviceType(e.pointerType)).scrollToZoom){i=Math.pow(this.zoomPerScroll,e.scroll);this.viewport.zoomBy(i,t.zoomToRefPoint?this.viewport.pointFromPixel(e.position,!0):null);this.viewport.applyConstraints()}this.raiseEvent("canvas-scroll",{tracker:e.eventSource,position:e.position,scroll:e.scroll,shift:e.shift,originalEvent:e.originalEvent});if(t&&t.scrollToZoom)return!1}else if((t=this.gestureSettingsByDeviceType(e.pointerType))&&t.scrollToZoom)return!1}function I(e){c[this.hash].mouseInside=!0;g(this);this.raiseEvent("container-enter",{tracker:e.eventSource,position:e.position,buttons:e.buttons,pointers:e.pointers,insideElementPressed:e.insideElementPressed,buttonDownAny:e.buttonDownAny,originalEvent:e.originalEvent})}function k(e){if(e.pointers<1){c[this.hash].mouseInside=!1;c[this.hash].animating||p(this)}this.raiseEvent("container-exit",{tracker:e.eventSource,position:e.position,buttons:e.buttons,pointers:e.pointers,insideElementPressed:e.insideElementPressed,buttonDownAny:e.buttonDownAny,originalEvent:e.originalEvent})}function B(e){!function(e){if(e._opening)return;if(e.autoResize){var t=u(e.container);var i=c[e.hash].prevContainerSize;if(!t.equals(i)){var n=e.viewport;if(e.preserveImageSizeOnResize){var o=i.x/t.x;var r=n.getZoom()*o;var s=n.getCenter();n.resize(t,!1);n.zoomTo(r,null,!0);n.panTo(s,!0)}else{var a=n.getBounds();n.resize(t,!0);n.fitBoundsWithConstraints(a,!0)}c[e.hash].prevContainerSize=t;c[e.hash].forceRedraw=!0}}var l=e.viewport.update();var h=e.world.update()||l;l&&e.raiseEvent("viewport-change");e.referenceStrip&&(h=e.referenceStrip.update(e.viewport)||h);if(!c[e.hash].animating&&h){e.raiseEvent("animation-start");g(e)}if(h||c[e.hash].forceRedraw||e.world.needsDraw()){!function(e){e.imageLoader.clear();e.drawer.clear();e.world.draw();e.raiseEvent("update-viewport",{})}(e);e._drawOverlays();e.navigator&&e.navigator.update(e.viewport);c[e.hash].forceRedraw=!1;h&&e.raiseEvent("animation")}if(c[e.hash].animating&&!h){e.raiseEvent("animation-finish");c[e.hash].mouseInside||p(e)}c[e.hash].animating=h}(e);e.isOpen()?e._updateRequestId=r(e,B):e._updateRequestId=!1}function D(e,t){return e?e+t:t}function M(){c[this.hash].lastZoomTime=m.now();c[this.hash].zoomFactor=this.zoomPerSecond;c[this.hash].zooming=!0;n(this)}function z(){c[this.hash].lastZoomTime=m.now();c[this.hash].zoomFactor=1/this.zoomPerSecond;c[this.hash].zooming=!0;n(this)}function H(){c[this.hash].zooming=!1}function n(e){m.requestAnimationFrame(m.delegate(e,t))}function t(){var e,t,i;if(c[this.hash].zooming&&this.viewport){t=(e=m.now())-c[this.hash].lastZoomTime;i=Math.pow(c[this.hash].zoomFactor,t/1e3);this.viewport.zoomBy(i);this.viewport.applyConstraints();c[this.hash].lastZoomTime=e;n(this)}}function L(){if(this.viewport){c[this.hash].zooming=!1;this.viewport.zoomBy(this.zoomPerClick/1);this.viewport.applyConstraints()}}function F(){if(this.viewport){c[this.hash].zooming=!1;this.viewport.zoomBy(1/this.zoomPerClick);this.viewport.applyConstraints()}}function N(){this.buttons.emulateEnter();this.buttons.emulateExit()}function A(){this.viewport&&this.viewport.goHome()}function W(){this.isFullPage()&&!m.isFullScreen()?this.setFullPage(!1):this.setFullScreen(!this.isFullPage());this.buttons&&this.buttons.emulateExit();this.fullPageButton.element.focus();this.viewport&&this.viewport.applyConstraints()}function V(){if(this.viewport){var e=this.viewport.getRotation();e=this.viewport.flipped?m.positiveModulo(e+this.rotationIncrement,360):m.positiveModulo(e-this.rotationIncrement,360);this.viewport.setRotation(e)}}function U(){if(this.viewport){var e=this.viewport.getRotation();e=this.viewport.flipped?m.positiveModulo(e-this.rotationIncrement,360):m.positiveModulo(e+this.rotationIncrement,360);this.viewport.setRotation(e)}}function j(){this.viewport.toggleFlip()}function G(){var e=this._sequenceIndex-1;this.navPrevNextWrap&&e<0&&(e+=this.tileSources.length);this.goToPage(e)}function $(){var e=this._sequenceIndex+1;this.navPrevNextWrap&&e>=this.tileSources.length&&(e=0);this.goToPage(e)}}(OpenSeadragon);!function(c){c.Navigator=function(i){var e,t,n=i.viewer,o=this;if(i.id){this.element=document.getElementById(i.id);i.controlOptions={anchor:c.ControlAnchor.NONE,attachToViewer:!1,autoFade:!1}}else{i.id="navigator-"+c.now();this.element=c.makeNeutralElement("div");i.controlOptions={anchor:c.ControlAnchor.TOP_RIGHT,attachToViewer:!0,autoFade:i.autoFade};if(i.position)if("BOTTOM_RIGHT"==i.position)i.controlOptions.anchor=c.ControlAnchor.BOTTOM_RIGHT;else if("BOTTOM_LEFT"==i.position)i.controlOptions.anchor=c.ControlAnchor.BOTTOM_LEFT;else if("TOP_RIGHT"==i.position)i.controlOptions.anchor=c.ControlAnchor.TOP_RIGHT;else if("TOP_LEFT"==i.position)i.controlOptions.anchor=c.ControlAnchor.TOP_LEFT;else if("ABSOLUTE"==i.position){i.controlOptions.anchor=c.ControlAnchor.ABSOLUTE;i.controlOptions.top=i.top;i.controlOptions.left=i.left;i.controlOptions.height=i.height;i.controlOptions.width=i.width}}this.element.id=i.id;this.element.className+=" navigator";(i=c.extend(!0,{sizeRatio:c.DEFAULT_SETTINGS.navigatorSizeRatio},i,{element:this.element,tabIndex:-1,showNavigator:!1,mouseNavEnabled:!1,showNavigationControl:!1,showSequenceControl:!1,immediateRender:!0,blendTime:0,animationTime:0,autoResize:i.autoResize,minZoomImageRatio:1,background:i.background,opacity:i.opacity,borderColor:i.borderColor,displayRegionColor:i.displayRegionColor})).minPixelRatio=this.minPixelRatio=n.minPixelRatio;c.setElementTouchActionNone(this.element);this.borderWidth=2;this.fudge=new c.Point(1,1);this.totalBorderWidths=new c.Point(2*this.borderWidth,2*this.borderWidth).minus(this.fudge);i.controlOptions.anchor!=c.ControlAnchor.NONE&&function(e,t){e.margin="0px";e.border=t+"px solid "+i.borderColor;e.padding="0px";e.background=i.background;e.opacity=i.opacity;e.overflow="hidden"}(this.element.style,this.borderWidth);this.displayRegion=c.makeNeutralElement("div");this.displayRegion.id=this.element.id+"-displayregion";this.displayRegion.className="displayregion";!function(e,t){e.position="relative";e.top="0px";e.left="0px";e.fontSize="0px";e.overflow="hidden";e.border=t+"px solid "+i.displayRegionColor;e.margin="0px";e.padding="0px";e.background="transparent";e.float="left";e.cssFloat="left";e.styleFloat="left";e.zIndex=999999999;e.cursor="default"}(this.displayRegion.style,this.borderWidth);this.displayRegionContainer=c.makeNeutralElement("div");this.displayRegionContainer.id=this.element.id+"-displayregioncontainer";this.displayRegionContainer.className="displayregioncontainer";this.displayRegionContainer.style.width="100%";this.displayRegionContainer.style.height="100%";n.addControl(this.element,i.controlOptions);this._resizeWithViewer=i.controlOptions.anchor!=c.ControlAnchor.ABSOLUTE&&i.controlOptions.anchor!=c.ControlAnchor.NONE;if(this._resizeWithViewer){if(i.width&&i.height){this.element.style.height="number"==typeof i.height?i.height+"px":i.height;this.element.style.width="number"==typeof i.width?i.width+"px":i.width}else{e=c.getElementSize(n.element);this.element.style.height=Math.round(e.y*i.sizeRatio)+"px";this.element.style.width=Math.round(e.x*i.sizeRatio)+"px";this.oldViewerSize=e}t=c.getElementSize(this.element);this.elementArea=t.x*t.y}this.oldContainerSize=new c.Point(0,0);c.Viewer.apply(this,[i]);this.displayRegionContainer.appendChild(this.displayRegion);this.element.getElementsByTagName("div")[0].appendChild(this.displayRegionContainer);function r(e){u(o.displayRegionContainer,e);u(o.displayRegion,-e);o.viewport.setRotation(e)}if(i.navigatorRotate){r(i.viewer.viewport?i.viewer.viewport.getRotation():i.viewer.degrees||0);i.viewer.addHandler("rotate",function(e){r(e.degrees)})}this.innerTracker.destroy();this.innerTracker=new c.MouseTracker({element:this.element,dragHandler:c.delegate(this,a),clickHandler:c.delegate(this,s),releaseHandler:c.delegate(this,l),scrollHandler:c.delegate(this,h)});this.addHandler("reset-size",function(){o.viewport&&o.viewport.goHome(!0)});n.world.addHandler("item-index-change",function(t){window.setTimeout(function(){var e=o.world.getItemAt(t.previousIndex);o.world.setItemIndex(e,t.newIndex)},1)});n.world.addHandler("remove-item",function(e){var t=e.item;var i=o._getMatchingItem(t);i&&o.world.removeItem(i)});this.update(n.viewport)};c.extend(c.Navigator.prototype,c.EventSource.prototype,c.Viewer.prototype,{updateSize:function(){if(this.viewport){var e=new c.Point(0===this.container.clientWidth?1:this.container.clientWidth,0===this.container.clientHeight?1:this.container.clientHeight);if(!e.equals(this.oldContainerSize)){this.viewport.resize(e,!0);this.viewport.goHome(!0);this.oldContainerSize=e;this.drawer.clear();this.world.draw()}}},setFlip:function(e){this.viewport.setFlip(e);this.setDisplayTransform(this.viewer.viewport.getFlip()?"scale(-1,1)":"scale(1,1)");return this},setDisplayTransform:function(e){i(this.displayRegion,e);i(this.canvas,e);i(this.element,e)},update:function(e){var t,i,n,o,r,s;t=c.getElementSize(this.viewer.element);if(this._resizeWithViewer&&t.x&&t.y&&!t.equals(this.oldViewerSize)){this.oldViewerSize=t;if(this.maintainSizeRatio||!this.elementArea){i=t.x*this.sizeRatio;n=t.y*this.sizeRatio}else{i=Math.sqrt(this.elementArea*(t.x/t.y));n=this.elementArea/i}this.element.style.width=Math.round(i)+"px";this.element.style.height=Math.round(n)+"px";this.elementArea||(this.elementArea=i*n);this.updateSize()}if(e&&this.viewport){o=e.getBoundsNoRotate(!0);r=this.viewport.pixelFromPointNoRotate(o.getTopLeft(),!1);s=this.viewport.pixelFromPointNoRotate(o.getBottomRight(),!1).minus(this.totalBorderWidths);var a=this.displayRegion.style;a.display=this.world.getItemCount()?"block":"none";a.top=Math.round(r.y)+"px";a.left=Math.round(r.x)+"px";var l=Math.abs(r.x-s.x);var h=Math.abs(r.y-s.y);a.width=Math.round(Math.max(l,0))+"px";a.height=Math.round(Math.max(h,0))+"px"}},addTiledImage:function(e){var n=this;var o=e.originalTiledImage;delete e.original;var t=c.extend({},e,{success:function(e){var t=e.item;t._originalForNavigator=o;n._matchBounds(t,o,!0);function i(){n._matchBounds(t,o)}o.addHandler("bounds-change",i);o.addHandler("clip-change",i);o.addHandler("opacity-change",function(){n._matchOpacity(t,o)});o.addHandler("composite-operation-change",function(){n._matchCompositeOperation(t,o)})}});return c.Viewer.prototype.addTiledImage.apply(this,[t])},_getMatchingItem:function(e){var t=this.world.getItemCount();var i;for(var n=0;n<t;n++)if((i=this.world.getItemAt(n))._originalForNavigator===e)return i;return null},_matchBounds:function(e,t,i){var n=t.getBoundsNoRotate();e.setPosition(n.getTopLeft(),i);e.setWidth(n.width,i);e.setRotation(t.getRotation(),i);e.setClip(t.getClip())},_matchOpacity:function(e,t){e.setOpacity(t.opacity)},_matchCompositeOperation:function(e,t){e.setCompositeOperation(t.compositeOperation)}});function s(e){var t={tracker:e.eventSource,position:e.position,quick:e.quick,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.viewer.raiseEvent("navigator-click",t);if(!t.preventDefaultAction&&e.quick&&this.viewer.viewport&&(this.panVertical||this.panHorizontal)){this.viewer.viewport.flipped&&(e.position.x=this.viewport.getContainerSize().x-e.position.x);var i=this.viewport.pointFromPixel(e.position);this.panVertical?this.panHorizontal||(i.x=this.viewer.viewport.getCenter(!0).x):i.y=this.viewer.viewport.getCenter(!0).y;this.viewer.viewport.panTo(i);this.viewer.viewport.applyConstraints()}}function a(e){var t={tracker:e.eventSource,position:e.position,delta:e.delta,speed:e.speed,direction:e.direction,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.viewer.raiseEvent("navigator-drag",t);if(!t.preventDefaultAction&&this.viewer.viewport){this.panHorizontal||(e.delta.x=0);this.panVertical||(e.delta.y=0);this.viewer.viewport.flipped&&(e.delta.x=-e.delta.x);this.viewer.viewport.panBy(this.viewport.deltaPointsFromPixels(e.delta));this.viewer.constrainDuringPan&&this.viewer.viewport.applyConstraints()}}function l(e){e.insideElementPressed&&this.viewer.viewport&&this.viewer.viewport.applyConstraints()}function h(e){this.viewer.raiseEvent("navigator-scroll",{tracker:e.eventSource,position:e.position,scroll:e.scroll,shift:e.shift,originalEvent:e.originalEvent});return!1}function u(e,t){i(e,"rotate("+t+"deg)")}function i(e,t){e.style.webkitTransform=t;e.style.mozTransform=t;e.style.msTransform=t;e.style.oTransform=t;e.style.transform=t}}(OpenSeadragon);!function(s){var a={Errors:{Dzc:"Sorry, we don't support Deep Zoom Collections!",Dzi:"Hmm, this doesn't appear to be a valid Deep Zoom Image.",Xml:"Hmm, this doesn't appear to be a valid Deep Zoom Image.",ImageFormat:"Sorry, we don't support {0}-based Deep Zoom Images.",Security:"It looks like a security restriction stopped us from loading this Deep Zoom Image.",Status:"This space unintentionally left blank ({0} {1}).",OpenFailed:"Unable to open {0}: {1}"},Tooltips:{FullPage:"Toggle full page",Home:"Go home",ZoomIn:"Zoom in",ZoomOut:"Zoom out",NextPage:"Next page",PreviousPage:"Previous page",RotateLeft:"Rotate left",RotateRight:"Rotate right",Flip:"Flip Horizontally"}};s.extend(s,{getString:function(e){var t,i=e.split("."),n=null,o=arguments,r=a;for(t=0;t<i.length-1;t++)r=r[i[t]]||{};if("string"!=typeof(n=r[i[t]])){s.console.log("Untranslated source string:",e);n=""}return n.replace(/\{\d+\}/g,function(e){var t=parseInt(e.match(/\d+/),10)+1;return t<o.length?o[t]:""})},setString:function(e,t){var i,n=e.split("."),o=a;for(i=0;i<n.length-1;i++){o[n[i]]||(o[n[i]]={});o=o[n[i]]}o[n[i]]=t}})}(OpenSeadragon);!function(a){a.Point=function(e,t){this.x="number"==typeof e?e:0;this.y="number"==typeof t?t:0};a.Point.prototype={clone:function(){return new a.Point(this.x,this.y)},plus:function(e){return new a.Point(this.x+e.x,this.y+e.y)},minus:function(e){return new a.Point(this.x-e.x,this.y-e.y)},times:function(e){return new a.Point(this.x*e,this.y*e)},divide:function(e){return new a.Point(this.x/e,this.y/e)},negate:function(){return new a.Point(-this.x,-this.y)},distanceTo:function(e){return Math.sqrt(Math.pow(this.x-e.x,2)+Math.pow(this.y-e.y,2))},squaredDistanceTo:function(e){return Math.pow(this.x-e.x,2)+Math.pow(this.y-e.y,2)},apply:function(e){return new a.Point(e(this.x),e(this.y))},equals:function(e){return e instanceof a.Point&&this.x===e.x&&this.y===e.y},rotate:function(e,t){t=t||new a.Point(0,0);var i;var n;if(e%90==0){switch(a.positiveModulo(e,360)){case 0:i=1;n=0;break;case 90:i=0;n=1;break;case 180:i=-1;n=0;break;case 270:i=0;n=-1}}else{var o=e*Math.PI/180;i=Math.cos(o);n=Math.sin(o)}var r=i*(this.x-t.x)-n*(this.y-t.y)+t.x;var s=n*(this.x-t.x)+i*(this.y-t.y)+t.y;return new a.Point(r,s)},toString:function(){return"("+Math.round(100*this.x)/100+","+Math.round(100*this.y)/100+")"}}}(OpenSeadragon);!function(d){d.TileSource=function(e,t,i,n,o,r){var s=this;var a,l,h=arguments;a=d.isPlainObject(e)?e:{width:h[0],height:h[1],tileSize:h[2],tileOverlap:h[3],minLevel:h[4],maxLevel:h[5]};d.EventSource.call(this);d.extend(!0,this,a);if(!this.success)for(l=0;l<arguments.length;l++)if(d.isFunction(arguments[l])){this.success=arguments[l];break}this.success&&this.addHandler("ready",function(e){s.success(e)});"string"==d.type(e)&&(this.url=e);if(this.url){this.aspectRatio=1;this.dimensions=new d.Point(10,10);this._tileWidth=0;this._tileHeight=0;this.tileOverlap=0;this.minLevel=0;this.maxLevel=0;this.ready=!1;this.getImageInfo(this.url)}else{this.ready=!0;this.aspectRatio=a.width&&a.height?a.width/a.height:1;this.dimensions=new d.Point(a.width,a.height);if(this.tileSize){this._tileWidth=this._tileHeight=this.tileSize;delete this.tileSize}else{if(this.tileWidth){this._tileWidth=this.tileWidth;delete this.tileWidth}else this._tileWidth=0;if(this.tileHeight){this._tileHeight=this.tileHeight;delete this.tileHeight}else this._tileHeight=0}this.tileOverlap=a.tileOverlap?a.tileOverlap:0;this.minLevel=a.minLevel?a.minLevel:0;this.maxLevel=void 0!==a.maxLevel&&null!==a.maxLevel?a.maxLevel:a.width&&a.height?Math.ceil(Math.log(Math.max(a.width,a.height))/Math.log(2)):0;this.success&&d.isFunction(this.success)&&this.success(this)}};d.TileSource.prototype={getTileSize:function(e){d.console.error("[TileSource.getTileSize] is deprecated. Use TileSource.getTileWidth() and TileSource.getTileHeight() instead");return this._tileWidth},getTileWidth:function(e){return this._tileWidth?this._tileWidth:this.getTileSize(e)},getTileHeight:function(e){return this._tileHeight?this._tileHeight:this.getTileSize(e)},getLevelScale:function(e){var t,i={};for(t=0;t<=this.maxLevel;t++)i[t]=1/Math.pow(2,this.maxLevel-t);this.getLevelScale=function(e){return i[e]};return this.getLevelScale(e)},getNumTiles:function(e){var t=this.getLevelScale(e),i=Math.ceil(t*this.dimensions.x/this.getTileWidth(e)),n=Math.ceil(t*this.dimensions.y/this.getTileHeight(e));return new d.Point(i,n)},getPixelRatio:function(e){var t=this.dimensions.times(this.getLevelScale(e)),i=1/t.x,n=1/t.y;return new d.Point(i,n)},getClosestLevel:function(){var e,t;for(e=this.minLevel+1;e<=this.maxLevel&&!(1<(t=this.getNumTiles(e)).x||1<t.y);e++);return e-1},getTileAtPoint:function(e,t){var i=0<=t.x&&t.x<=1&&0<=t.y&&t.y<=1/this.aspectRatio;d.console.assert(i,"[TileSource.getTileAtPoint] must be called with a valid point.");var n=this.dimensions.x*this.getLevelScale(e);var o=t.x*n;var r=t.y*n;var s=Math.floor(o/this.getTileWidth(e));var a=Math.floor(r/this.getTileHeight(e));1<=t.x&&(s=this.getNumTiles(e).x-1);t.y>=1/this.aspectRatio-1e-15&&(a=this.getNumTiles(e).y-1);return new d.Point(s,a)},getTileBounds:function(e,t,i,n){var o=this.dimensions.times(this.getLevelScale(e)),r=this.getTileWidth(e),s=this.getTileHeight(e),a=0===t?0:r*t-this.tileOverlap,l=0===i?0:s*i-this.tileOverlap,h=r+(0===t?1:2)*this.tileOverlap,c=s+(0===i?1:2)*this.tileOverlap,u=1/o.x;h=Math.min(h,o.x-a);c=Math.min(c,o.y-l);return n?new d.Rect(0,0,h,c):new d.Rect(a*u,l*u,h*u,c*u)},getImageInfo:function(n){var e,i,o,r,t,s,a,l=this;n&&-1<(a=(s=(t=n.split("/"))[t.length-1]).lastIndexOf("."))&&(t[t.length-1]=s.slice(0,a));i=function(e){"string"==typeof e&&(e=d.parseXml(e));var t=d.TileSource.determineType(l,e,n);if(t){void 0===(r=t.prototype.configure.apply(l,[e,n])).ajaxWithCredentials&&(r.ajaxWithCredentials=l.ajaxWithCredentials);o=new t(r);l.ready=!0;l.raiseEvent("ready",{tileSource:o})}else l.raiseEvent("open-failed",{message:"Unable to load TileSource",source:n})};if(n.match(/\.js$/)){e=n.split("/").pop().replace(".js","");d.jsonp({url:n,async:!1,callbackName:e,callback:i})}else d.makeAjaxRequest({url:n,withCredentials:this.ajaxWithCredentials,headers:this.ajaxHeaders,success:function(e){var t=function(t){var e,i,n=t.responseText,o=t.status;{if(!t)throw new Error(d.getString("Errors.Security"));if(200!==t.status&&0!==t.status){o=t.status;e=404==o?"Not Found":t.statusText;throw new Error(d.getString("Errors.Status",o,e))}}if(n.match(/\s*<.*/))try{i=t.responseXML&&t.responseXML.documentElement?t.responseXML:d.parseXml(n)}catch(e){i=t.responseText}else if(n.match(/\s*[\{\[].*/))try{i=d.parseJSON(n)}catch(e){i=n}else i=n;return i}(e);i(t)},error:function(e,t){var i;try{i="HTTP "+e.status+" attempting to load TileSource"}catch(e){i=(void 0!==t&&t.toString?t.toString():"Unknown error")+" attempting to load TileSource"}l.raiseEvent("open-failed",{message:i,source:n})}})},supports:function(e,t){return!1},configure:function(e,t){throw new Error("Method not implemented.")},getTileUrl:function(e,t,i){throw new Error("Method not implemented.")},getTileAjaxHeaders:function(e,t,i){return{}},tileExists:function(e,t,i){var n=this.getNumTiles(e);return e>=this.minLevel&&e<=this.maxLevel&&0<=t&&0<=i&&t<n.x&&i<n.y}};d.extend(!0,d.TileSource.prototype,d.EventSource.prototype);d.TileSource.determineType=function(e,t,i){var n;for(n in OpenSeadragon)if(n.match(/.+TileSource$/)&&d.isFunction(OpenSeadragon[n])&&d.isFunction(OpenSeadragon[n].prototype.supports)&&OpenSeadragon[n].prototype.supports.call(e,t,i))return OpenSeadragon[n];d.console.error("No TileSource was able to open %s %s",i,t)}}(OpenSeadragon);!function(g){g.DziTileSource=function(e,t,i,n,o,r,s,a,l){var h,c,u,d;d=g.isPlainObject(e)?e:{width:e,height:t,tileSize:i,tileOverlap:n,tilesUrl:o,fileFormat:r,displayRects:s,minLevel:a,maxLevel:l};this._levelRects={};this.tilesUrl=d.tilesUrl;this.fileFormat=d.fileFormat;this.displayRects=d.displayRects;if(this.displayRects)for(h=this.displayRects.length-1;0<=h;h--)for(u=(c=this.displayRects[h]).minLevel;u<=c.maxLevel;u++){this._levelRects[u]||(this._levelRects[u]=[]);this._levelRects[u].push(c)}g.TileSource.apply(this,[d])};g.extend(g.DziTileSource.prototype,g.TileSource.prototype,{supports:function(e,t){var i;e.Image?i=e.Image.xmlns:e.documentElement&&("Image"!=e.documentElement.localName&&"Image"!=e.documentElement.tagName||(i=e.documentElement.namespaceURI));return-1!==(i=(i||"").toLowerCase()).indexOf("schemas.microsoft.com/deepzoom/2008")||-1!==i.indexOf("schemas.microsoft.com/deepzoom/2009")},configure:function(e,t){var i;i=g.isPlainObject(e)?m(this,e):function(e,t){if(!t||!t.documentElement)throw new Error(g.getString("Errors.Xml"));var i,n,o,r,s,a=t.documentElement,l=a.localName||a.tagName,h=t.documentElement.namespaceURI,c=null,u=[];if("Image"==l)try{void 0===(r=a.getElementsByTagName("Size")[0])&&(r=a.getElementsByTagNameNS(h,"Size")[0]);c={Image:{xmlns:"http://schemas.microsoft.com/deepzoom/2008",Url:a.getAttribute("Url"),Format:a.getAttribute("Format"),DisplayRect:null,Overlap:parseInt(a.getAttribute("Overlap"),10),TileSize:parseInt(a.getAttribute("TileSize"),10),Size:{Height:parseInt(r.getAttribute("Height"),10),Width:parseInt(r.getAttribute("Width"),10)}}};if(!g.imageFormatSupported(c.Image.Format))throw new Error(g.getString("Errors.ImageFormat",c.Image.Format.toUpperCase()));void 0===(i=a.getElementsByTagName("DisplayRect"))&&(i=a.getElementsByTagNameNS(h,"DisplayRect")[0]);for(s=0;s<i.length;s++){n=i[s];void 0===(o=n.getElementsByTagName("Rect")[0])&&(o=n.getElementsByTagNameNS(h,"Rect")[0]);u.push({Rect:{X:parseInt(o.getAttribute("X"),10),Y:parseInt(o.getAttribute("Y"),10),Width:parseInt(o.getAttribute("Width"),10),Height:parseInt(o.getAttribute("Height"),10),MinLevel:parseInt(n.getAttribute("MinLevel"),10),MaxLevel:parseInt(n.getAttribute("MaxLevel"),10)}})}u.length&&(c.Image.DisplayRect=u);return m(e,c)}catch(e){throw e instanceof Error?e:new Error(g.getString("Errors.Dzi"))}else{if("Collection"==l)throw new Error(g.getString("Errors.Dzc"));if("Error"==l){var d=a.getElementsByTagName("Message")[0];var p=d.firstChild.nodeValue;throw new Error(p)}}throw new Error(g.getString("Errors.Dzi"))}(this,e);if(t&&!i.tilesUrl){i.tilesUrl=t.replace(/([^\/]+?)(\.(dzi|xml|js)?(\?[^\/]*)?)?\/?$/,"$1_files/");-1!=t.search(/\.(dzi|xml|js)\?/)?i.queryParams=t.match(/\?.*/):i.queryParams=""}return i},getTileUrl:function(e,t,i){return[this.tilesUrl,e,"/",t,"_",i,".",this.fileFormat,this.queryParams].join("")},tileExists:function(e,t,i){var n,o,r,s,a,l,h,c=this._levelRects[e];if(this.minLevel&&e<this.minLevel||this.maxLevel&&e>this.maxLevel)return!1;if(!c||!c.length)return!0;for(h=c.length-1;0<=h;h--)if(!(e<(n=c[h]).minLevel||e>n.maxLevel)){o=this.getLevelScale(e);r=n.x*o;s=n.y*o;a=r+n.width*o;l=s+n.height*o;r=Math.floor(r/this._tileWidth);s=Math.floor(s/this._tileWidth);a=Math.ceil(a/this._tileWidth);l=Math.ceil(l/this._tileWidth);if(r<=t&&t<a&&s<=i&&i<l)return!0}return!1}});function m(e,t){var i,n,o=t.Image,r=o.Url,s=o.Format,a=o.Size,l=o.DisplayRect||[],h=parseInt(a.Width,10),c=parseInt(a.Height,10),u=parseInt(o.TileSize,10),d=parseInt(o.Overlap,10),p=[];for(n=0;n<l.length;n++){i=l[n].Rect;p.push(new g.DisplayRect(parseInt(i.X,10),parseInt(i.Y,10),parseInt(i.Width,10),parseInt(i.Height,10),parseInt(i.MinLevel,10),parseInt(i.MaxLevel,10)))}return g.extend(!0,{width:h,height:c,tileSize:u,tileOverlap:d,minLevel:null,maxLevel:null,tilesUrl:r,fileFormat:s,displayRects:p},t)}}(OpenSeadragon);!function(h){h.IIIFTileSource=function(e){h.extend(!0,this,e);if(!(this.height&&this.width&&this["@id"]))throw new Error("IIIF required parameters not provided.");e.tileSizePerScaleFactor={};this.tileFormat=this.tileFormat||"jpg";if(this.tile_width&&this.tile_height){e.tileWidth=this.tile_width;e.tileHeight=this.tile_height}else if(this.tile_width)e.tileSize=this.tile_width;else if(this.tile_height)e.tileSize=this.tile_height;else if(this.tiles)if(1==this.tiles.length){e.tileWidth=this.tiles[0].width;e.tileHeight=this.tiles[0].height||this.tiles[0].width;this.scale_factors=this.tiles[0].scaleFactors}else{this.scale_factors=[];for(var t=0;t<this.tiles.length;t++)for(var i=0;i<this.tiles[t].scaleFactors.length;i++){var n=this.tiles[t].scaleFactors[i];this.scale_factors.push(n);e.tileSizePerScaleFactor[n]={width:this.tiles[t].width,height:this.tiles[t].height||this.tiles[t].width}}}else if(function(e){var t=-1!==["http://library.stanford.edu/iiif/image-api/compliance.html#level0","http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0","http://iiif.io/api/image/2/level0.json"].indexOf(e[0]);var i=!1;1<e.length&&e[1].supports&&(i=-1!==e[1].supports.indexOf("sizeByW"));return!t||i}(e.profile)){var o=Math.min(this.height,this.width),r=[256,512,1024],s=[];for(var a=0;a<r.length;a++)r[a]<=o&&s.push(r[a]);0<s.length?e.tileSize=Math.max.apply(null,s):e.tileSize=o}else if(this.sizes&&0<this.sizes.length){this.emulateLegacyImagePyramid=!0;e.levels=function(e){var t=[];for(var i=0;i<e.sizes.length;i++)t.push({url:e["@id"]+"/full/"+e.sizes[i].width+",/0/default."+e.tileFormat,width:e.sizes[i].width,height:e.sizes[i].height});return t.sort(function(e,t){return e.width-t.width})}(this);h.extend(!0,e,{width:e.levels[e.levels.length-1].width,height:e.levels[e.levels.length-1].height,tileSize:Math.max(e.height,e.width),tileOverlap:0,minLevel:0,maxLevel:e.levels.length-1});this.levels=e.levels}else h.console.error("Nothing in the info.json to construct image pyramids from");if(!e.maxLevel&&!this.emulateLegacyImagePyramid)if(this.scale_factors){var l=Math.max.apply(null,this.scale_factors);e.maxLevel=Math.round(Math.log(l)*Math.LOG2E)}else e.maxLevel=Number(Math.ceil(Math.log(Math.max(this.width,this.height),2)));h.TileSource.apply(this,[e])};h.extend(h.IIIFTileSource.prototype,h.TileSource.prototype,{supports:function(e,t){return!(!e.protocol||"http://iiif.io/api/image"!=e.protocol)||(!(!e["@context"]||"http://library.stanford.edu/iiif/image-api/1.1/context.json"!=e["@context"]&&"http://iiif.io/api/image/1/context.json"!=e["@context"])||(!(!e.profile||0!==e.profile.indexOf("http://library.stanford.edu/iiif/image-api/compliance.html"))||(!!(e.identifier&&e.width&&e.height)||!(!e.documentElement||"info"!=e.documentElement.tagName||"http://library.stanford.edu/iiif/image-api/ns/"!=e.documentElement.namespaceURI))))},configure:function(e,t){if(h.isPlainObject(e)){if(!e["@context"]){e["@context"]="http://iiif.io/api/image/1.0/context.json";e["@id"]=t.replace("/info.json","")}if(e.preferredFormats)for(var i=0;i<e.preferredFormats.length;i++)if(OpenSeadragon.imageFormatSupported(e.preferredFormats[i])){e.tileFormat=e.preferredFormats[i];break}return e}var n=function(e){if(!e||!e.documentElement)throw new Error(h.getString("Errors.Xml"));var t=e.documentElement,i=t.tagName,n=null;if("info"==i)try{!function e(t,i,n){var o,r;if(3==t.nodeType&&n){(r=t.nodeValue.trim()).match(/^\d*$/)&&(r=Number(r));if(i[n]){h.isArray(i[n])||(i[n]=[i[n]]);i[n].push(r)}else i[n]=r}else if(1==t.nodeType)for(o=0;o<t.childNodes.length;o++)e(t.childNodes[o],i,t.nodeName)}(t,n={});return n}catch(e){throw e instanceof Error?e:new Error(h.getString("Errors.IIIF"))}throw new Error(h.getString("Errors.IIIF"))}(e);n["@context"]="http://iiif.io/api/image/1.0/context.json";n["@id"]=t.replace("/info.xml","");return n},getTileWidth:function(e){if(this.emulateLegacyImagePyramid)return h.TileSource.prototype.getTileWidth.call(this,e);var t=Math.pow(2,this.maxLevel-e);return this.tileSizePerScaleFactor&&this.tileSizePerScaleFactor[t]?this.tileSizePerScaleFactor[t].width:this._tileWidth},getTileHeight:function(e){if(this.emulateLegacyImagePyramid)return h.TileSource.prototype.getTileHeight.call(this,e);var t=Math.pow(2,this.maxLevel-e);return this.tileSizePerScaleFactor&&this.tileSizePerScaleFactor[t]?this.tileSizePerScaleFactor[t].height:this._tileHeight},getLevelScale:function(e){if(this.emulateLegacyImagePyramid){var t=NaN;0<this.levels.length&&e>=this.minLevel&&e<=this.maxLevel&&(t=this.levels[e].width/this.levels[this.maxLevel].width);return t}return h.TileSource.prototype.getLevelScale.call(this,e)},getNumTiles:function(e){if(this.emulateLegacyImagePyramid){return this.getLevelScale(e)?new h.Point(1,1):new h.Point(0,0)}return h.TileSource.prototype.getNumTiles.call(this,e)},getTileAtPoint:function(e,t){return this.emulateLegacyImagePyramid?new h.Point(0,0):h.TileSource.prototype.getTileAtPoint.call(this,e,t)},getTileUrl:function(e,t,i){if(this.emulateLegacyImagePyramid){var n=null;0<this.levels.length&&e>=this.minLevel&&e<=this.maxLevel&&(n=this.levels[e].url);return n}var o,r,s,a,l,h,c,u,d,p,g,m,v,f=Math.pow(.5,this.maxLevel-e),w=Math.ceil(this.width*f),y=Math.ceil(this.height*f);o=this.getTileWidth(e);r=this.getTileHeight(e);s=Math.ceil(o/f);a=Math.ceil(r/f);m=(v=-1<this["@context"].indexOf("/1.0/context.json")||-1<this["@context"].indexOf("/1.1/context.json")||-1<this["@context"].indexOf("/1/context.json"))?"native."+this.tileFormat:"default."+this.tileFormat;if(w<o&&y<r){p=v||w!==this.width?w+",":"max";l="full"}else{h=t*s;c=i*a;u=Math.min(s,this.width-h);d=Math.min(a,this.height-c);l=0===t&&0===i&&u===this.width&&d===this.height?"full":[h,c,u,d].join(",");g=Math.ceil(u*f);p=v||g!==this.width?g+",":"max"}return[this["@id"],l,p,"0",m].join("/")}})}(OpenSeadragon);!function(s){s.OsmTileSource=function(e,t,i,n,o){var r;if(!(r=s.isPlainObject(e)?e:{width:e,height:t,tileSize:i,tileOverlap:n,tilesUrl:o}).width||!r.height){r.width=65572864;r.height=65572864}if(!r.tileSize){r.tileSize=256;r.tileOverlap=0}r.tilesUrl||(r.tilesUrl="http://tile.openstreetmap.org/");r.minLevel=8;s.TileSource.apply(this,[r])};s.extend(s.OsmTileSource.prototype,s.TileSource.prototype,{supports:function(e,t){return e.type&&"openstreetmaps"==e.type},configure:function(e,t){return e},getTileUrl:function(e,t,i){return this.tilesUrl+(e-8)+"/"+t+"/"+i+".png"}})}(OpenSeadragon);!function(h){h.TmsTileSource=function(e,t,i,n,o){var r;r=h.isPlainObject(e)?e:{width:e,height:t,tileSize:i,tileOverlap:n,tilesUrl:o};var s,a=256*Math.ceil(r.width/256),l=256*Math.ceil(r.height/256);s=l<a?a/256:l/256;r.maxLevel=Math.ceil(Math.log(s)/Math.log(2))-1;r.tileSize=256;r.width=a;r.height=l;h.TileSource.apply(this,[r])};h.extend(h.TmsTileSource.prototype,h.TileSource.prototype,{supports:function(e,t){return e.type&&"tiledmapservice"==e.type},configure:function(e,t){return e},getTileUrl:function(e,t,i){var n=this.getNumTiles(e).y-1;return this.tilesUrl+e+"/"+t+"/"+(n-i)+".png"}})}(OpenSeadragon);!function(e){e.ZoomifyTileSource=function(e){e.tileSize=256;var t={x:e.width,y:e.height};e.imageSizes=[{x:e.width,y:e.height}];e.gridSize=[this._getGridSize(e.width,e.height,e.tileSize)];for(;parseInt(t.x,10)>e.tileSize||parseInt(t.y,10)>e.tileSize;){t.x=Math.floor(t.x/2);t.y=Math.floor(t.y/2);e.imageSizes.push({x:t.x,y:t.y});e.gridSize.push(this._getGridSize(t.x,t.y,e.tileSize))}e.imageSizes.reverse();e.gridSize.reverse();e.minLevel=0;e.maxLevel=e.gridSize.length-1;OpenSeadragon.TileSource.apply(this,[e])};e.extend(e.ZoomifyTileSource.prototype,e.TileSource.prototype,{_getGridSize:function(e,t,i){return{x:Math.ceil(e/i),y:Math.ceil(t/i)}},_calculateAbsoluteTileNumber:function(e,t,i){var n=0;var o={};for(var r=0;r<e;r++)n+=(o=this.gridSize[r]).x*o.y;return n+=(o=this.gridSize[e]).x*i+t},supports:function(e,t){return e.type&&"zoomifytileservice"==e.type},configure:function(e,t){return e},getTileUrl:function(e,t,i){var n;var o=this._calculateAbsoluteTileNumber(e,t,i);n=Math.floor(o/256);return this.tilesUrl+"TileGroup"+n+"/"+e+"-"+t+"-"+i+".jpg"}})}(OpenSeadragon);!function(l){l.LegacyTileSource=function(e){var t,i,n;l.isArray(e)&&(t={type:"legacy-image-pyramid",levels:e});t.levels=function(e){var t,i,n=[];for(i=0;i<e.length;i++)(t=e[i]).height&&t.width&&t.url?n.push({url:t.url,width:Number(t.width),height:Number(t.height)}):l.console.error("Unsupported image format: %s",t.url?t.url:"<no URL>");return n.sort(function(e,t){return e.height-t.height})}(t.levels);if(0<t.levels.length){i=t.levels[t.levels.length-1].width;n=t.levels[t.levels.length-1].height}else{n=i=0;l.console.error("No supported image formats found")}l.extend(!0,t,{width:i,height:n,tileSize:Math.max(n,i),tileOverlap:0,minLevel:0,maxLevel:0<t.levels.length?t.levels.length-1:0});l.TileSource.apply(this,[t]);this.levels=t.levels};l.extend(l.LegacyTileSource.prototype,l.TileSource.prototype,{supports:function(e,t){return e.type&&"legacy-image-pyramid"==e.type||e.documentElement&&"legacy-image-pyramid"==e.documentElement.getAttribute("type")},configure:function(e,t){return l.isPlainObject(e)?h(this,e):function(e,t){if(!t||!t.documentElement)throw new Error(l.getString("Errors.Xml"));var i,n,o=t.documentElement,r=o.tagName,s=null,a=[];if("image"==r)try{s={type:o.getAttribute("type"),levels:[]};a=o.getElementsByTagName("level");for(n=0;n<a.length;n++){i=a[n];s.levels.push({url:i.getAttribute("url"),width:parseInt(i.getAttribute("width"),10),height:parseInt(i.getAttribute("height"),10)})}return h(e,s)}catch(e){throw e instanceof Error?e:new Error("Unknown error parsing Legacy Image Pyramid XML.")}else{if("collection"==r)throw new Error("Legacy Image Pyramid Collections not yet supported.");if("error"==r)throw new Error("Error: "+t)}throw new Error("Unknown element "+r)}(this,e)},getLevelScale:function(e){var t=NaN;0<this.levels.length&&e>=this.minLevel&&e<=this.maxLevel&&(t=this.levels[e].width/this.levels[this.maxLevel].width);return t},getNumTiles:function(e){return this.getLevelScale(e)?new l.Point(1,1):new l.Point(0,0)},getTileUrl:function(e,t,i){var n=null;0<this.levels.length&&e>=this.minLevel&&e<=this.maxLevel&&(n=this.levels[e].url);return n}});function h(e,t){return t.levels}}(OpenSeadragon);!function(a){a.ImageTileSource=function(e){e=a.extend({buildPyramid:!0,crossOriginPolicy:!1,ajaxWithCredentials:!1,useCanvas:!0},e);a.TileSource.apply(this,[e])};a.extend(a.ImageTileSource.prototype,a.TileSource.prototype,{supports:function(e,t){return e.type&&"image"===e.type},configure:function(e,t){return e},getImageInfo:function(e){var t=this._image=new Image;var i=this;this.crossOriginPolicy&&(t.crossOrigin=this.crossOriginPolicy);this.ajaxWithCredentials&&(t.useCredentials=this.ajaxWithCredentials);a.addEvent(t,"load",function(){i.width=Object.prototype.hasOwnProperty.call(t,"naturalWidth")?t.naturalWidth:t.width;i.height=Object.prototype.hasOwnProperty.call(t,"naturalHeight")?t.naturalHeight:t.height;i.aspectRatio=i.width/i.height;i.dimensions=new a.Point(i.width,i.height);i._tileWidth=i.width;i._tileHeight=i.height;i.tileOverlap=0;i.minLevel=0;i.levels=i._buildLevels();i.maxLevel=i.levels.length-1;i.ready=!0;i.raiseEvent("ready",{tileSource:i})});a.addEvent(t,"error",function(){i.raiseEvent("open-failed",{message:"Error loading image at "+e,source:e})});t.src=e},getLevelScale:function(e){var t=NaN;e>=this.minLevel&&e<=this.maxLevel&&(t=this.levels[e].width/this.levels[this.maxLevel].width);return t},getNumTiles:function(e){return this.getLevelScale(e)?new a.Point(1,1):new a.Point(0,0)},getTileUrl:function(e,t,i){var n=null;e>=this.minLevel&&e<=this.maxLevel&&(n=this.levels[e].url);return n},getContext2D:function(e,t,i){var n=null;e>=this.minLevel&&e<=this.maxLevel&&(n=this.levels[e].context2D);return n},_buildLevels:function(){var e=[{url:this._image.src,width:Object.prototype.hasOwnProperty.call(this._image,"naturalWidth")?this._image.naturalWidth:this._image.width,height:Object.prototype.hasOwnProperty.call(this._image,"naturalHeight")?this._image.naturalHeight:this._image.height}];if(!this.buildPyramid||!a.supportsCanvas||!this.useCanvas){delete this._image;return e}var t=Object.prototype.hasOwnProperty.call(this._image,"naturalWidth")?this._image.naturalWidth:this._image.width;var i=Object.prototype.hasOwnProperty.call(this._image,"naturalHeight")?this._image.naturalHeight:this._image.height;var n=document.createElement("canvas");var o=n.getContext("2d");n.width=t;n.height=i;o.drawImage(this._image,0,0,t,i);e[0].context2D=o;delete this._image;if(a.isCanvasTainted(n))return e;for(;2<=t&&2<=i;){t=Math.floor(t/2);i=Math.floor(i/2);var r=document.createElement("canvas");var s=r.getContext("2d");r.width=t;r.height=i;s.drawImage(n,0,0,t,i);e.splice(0,0,{context2D:s,width:t,height:i});n=r;o=s}return e}})}(OpenSeadragon);!function(o){o.TileSourceCollection=function(e,t,i,n){o.console.error("TileSourceCollection is deprecated; use World instead")}}(OpenSeadragon);!function(o){o.ButtonState={REST:0,GROUP:1,HOVER:2,DOWN:3};o.Button=function(e){var t=this;o.EventSource.call(this);o.extend(!0,this,{tooltip:null,srcRest:null,srcGroup:null,srcHover:null,srcDown:null,clickTimeThreshold:o.DEFAULT_SETTINGS.clickTimeThreshold,clickDistThreshold:o.DEFAULT_SETTINGS.clickDistThreshold,fadeDelay:0,fadeLength:2e3,onPress:null,onRelease:null,onClick:null,onEnter:null,onExit:null,onFocus:null,onBlur:null},e);this.element=e.element||o.makeNeutralElement("div");if(!e.element){this.imgRest=o.makeTransparentImage(this.srcRest);this.imgGroup=o.makeTransparentImage(this.srcGroup);this.imgHover=o.makeTransparentImage(this.srcHover);this.imgDown=o.makeTransparentImage(this.srcDown);this.imgRest.alt=this.imgGroup.alt=this.imgHover.alt=this.imgDown.alt=this.tooltip;this.element.style.position="relative";o.setElementTouchActionNone(this.element);this.imgGroup.style.position=this.imgHover.style.position=this.imgDown.style.position="absolute";this.imgGroup.style.top=this.imgHover.style.top=this.imgDown.style.top="0px";this.imgGroup.style.left=this.imgHover.style.left=this.imgDown.style.left="0px";this.imgHover.style.visibility=this.imgDown.style.visibility="hidden";o.Browser.vendor==o.BROWSERS.FIREFOX&&o.Browser.version<3&&(this.imgGroup.style.top=this.imgHover.style.top=this.imgDown.style.top="");this.element.appendChild(this.imgRest);this.element.appendChild(this.imgGroup);this.element.appendChild(this.imgHover);this.element.appendChild(this.imgDown)}this.addHandler("press",this.onPress);this.addHandler("release",this.onRelease);this.addHandler("click",this.onClick);this.addHandler("enter",this.onEnter);this.addHandler("exit",this.onExit);this.addHandler("focus",this.onFocus);this.addHandler("blur",this.onBlur);this.currentState=o.ButtonState.GROUP;this.fadeBeginTime=null;this.shouldFade=!1;this.element.style.display="inline-block";this.element.style.position="relative";this.element.title=this.tooltip;this.tracker=new o.MouseTracker({element:this.element,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,enterHandler:function(e){if(e.insideElementPressed){i(t,o.ButtonState.DOWN);t.raiseEvent("enter",{originalEvent:e.originalEvent})}else e.buttonDownAny||i(t,o.ButtonState.HOVER)},focusHandler:function(e){this.enterHandler(e);t.raiseEvent("focus",{originalEvent:e.originalEvent})},exitHandler:function(e){n(t,o.ButtonState.GROUP);e.insideElementPressed&&t.raiseEvent("exit",{originalEvent:e.originalEvent})},blurHandler:function(e){this.exitHandler(e);t.raiseEvent("blur",{originalEvent:e.originalEvent})},pressHandler:function(e){i(t,o.ButtonState.DOWN);t.raiseEvent("press",{originalEvent:e.originalEvent})},releaseHandler:function(e){if(e.insideElementPressed&&e.insideElementReleased){n(t,o.ButtonState.HOVER);t.raiseEvent("release",{originalEvent:e.originalEvent})}else e.insideElementPressed?n(t,o.ButtonState.GROUP):i(t,o.ButtonState.HOVER)},clickHandler:function(e){e.quick&&t.raiseEvent("click",{originalEvent:e.originalEvent})},keyHandler:function(e){if(13!==e.keyCode)return!0;t.raiseEvent("click",{originalEvent:e.originalEvent});t.raiseEvent("release",{originalEvent:e.originalEvent});return!1}});n(this,o.ButtonState.REST)};o.extend(o.Button.prototype,o.EventSource.prototype,{notifyGroupEnter:function(){i(this,o.ButtonState.GROUP)},notifyGroupExit:function(){n(this,o.ButtonState.REST)},disable:function(){this.notifyGroupExit();this.element.disabled=!0;o.setElementOpacity(this.element,.2,!0)},enable:function(){this.element.disabled=!1;o.setElementOpacity(this.element,1,!0);this.notifyGroupEnter()}});function r(e){o.requestAnimationFrame(function(){!function(e){var t,i,n;if(e.shouldFade){t=o.now();i=t-e.fadeBeginTime;n=1-i/e.fadeLength;n=Math.min(1,n);n=Math.max(0,n);e.imgGroup&&o.setElementOpacity(e.imgGroup,n,!0);0<n&&r(e)}}(e)})}function i(e,t){if(!e.element.disabled){if(t>=o.ButtonState.GROUP&&e.currentState==o.ButtonState.REST){!function(e){e.shouldFade=!1;e.imgGroup&&o.setElementOpacity(e.imgGroup,1,!0)}(e);e.currentState=o.ButtonState.GROUP}if(t>=o.ButtonState.HOVER&&e.currentState==o.ButtonState.GROUP){e.imgHover&&(e.imgHover.style.visibility="");e.currentState=o.ButtonState.HOVER}if(t>=o.ButtonState.DOWN&&e.currentState==o.ButtonState.HOVER){e.imgDown&&(e.imgDown.style.visibility="");e.currentState=o.ButtonState.DOWN}}}function n(e,t){if(!e.element.disabled){if(t<=o.ButtonState.HOVER&&e.currentState==o.ButtonState.DOWN){e.imgDown&&(e.imgDown.style.visibility="hidden");e.currentState=o.ButtonState.HOVER}if(t<=o.ButtonState.GROUP&&e.currentState==o.ButtonState.HOVER){e.imgHover&&(e.imgHover.style.visibility="hidden");e.currentState=o.ButtonState.GROUP}if(t<=o.ButtonState.REST&&e.currentState==o.ButtonState.GROUP){!function(e){e.shouldFade=!0;e.fadeBeginTime=o.now()+e.fadeDelay;window.setTimeout(function(){r(e)},e.fadeDelay)}(e);e.currentState=o.ButtonState.REST}}}}(OpenSeadragon);!function(o){o.ButtonGroup=function(e){o.extend(!0,this,{buttons:[],clickTimeThreshold:o.DEFAULT_SETTINGS.clickTimeThreshold,clickDistThreshold:o.DEFAULT_SETTINGS.clickDistThreshold,labelText:""},e);var t,i=this.buttons.concat([]),n=this;this.element=e.element||o.makeNeutralElement("div");if(!e.group){this.element.style.display="inline-block";for(t=0;t<i.length;t++)this.element.appendChild(i[t].element)}o.setElementTouchActionNone(this.element);this.tracker=new o.MouseTracker({element:this.element,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,enterHandler:function(e){var t;for(t=0;t<n.buttons.length;t++)n.buttons[t].notifyGroupEnter()},exitHandler:function(e){var t;if(!e.insideElementPressed)for(t=0;t<n.buttons.length;t++)n.buttons[t].notifyGroupExit()}})};o.ButtonGroup.prototype={emulateEnter:function(){this.tracker.enterHandler({eventSource:this.tracker})},emulateExit:function(){this.tracker.exitHandler({eventSource:this.tracker})}}}(OpenSeadragon);!function(R){R.Rect=function(e,t,i,n,o){this.x="number"==typeof e?e:0;this.y="number"==typeof t?t:0;this.width="number"==typeof i?i:0;this.height="number"==typeof n?n:0;this.degrees="number"==typeof o?o:0;this.degrees=R.positiveModulo(this.degrees,360);var r,s;if(270<=this.degrees){r=this.getTopRight();this.x=r.x;this.y=r.y;s=this.height;this.height=this.width;this.width=s;this.degrees-=270}else if(180<=this.degrees){r=this.getBottomRight();this.x=r.x;this.y=r.y;this.degrees-=180}else if(90<=this.degrees){r=this.getBottomLeft();this.x=r.x;this.y=r.y;s=this.height;this.height=this.width;this.width=s;this.degrees-=90}};R.Rect.fromSummits=function(e,t,i){var n=e.distanceTo(t);var o=e.distanceTo(i);var r=t.minus(e);var s=Math.atan(r.y/r.x);r.x<0?s+=Math.PI:r.y<0&&(s+=2*Math.PI);return new R.Rect(e.x,e.y,n,o,s/Math.PI*180)};R.Rect.prototype={clone:function(){return new R.Rect(this.x,this.y,this.width,this.height,this.degrees)},getAspectRatio:function(){return this.width/this.height},getTopLeft:function(){return new R.Point(this.x,this.y)},getBottomRight:function(){return new R.Point(this.x+this.width,this.y+this.height).rotate(this.degrees,this.getTopLeft())},getTopRight:function(){return new R.Point(this.x+this.width,this.y).rotate(this.degrees,this.getTopLeft())},getBottomLeft:function(){return new R.Point(this.x,this.y+this.height).rotate(this.degrees,this.getTopLeft())},getCenter:function(){return new R.Point(this.x+this.width/2,this.y+this.height/2).rotate(this.degrees,this.getTopLeft())},getSize:function(){return new R.Point(this.width,this.height)},equals:function(e){return e instanceof R.Rect&&this.x===e.x&&this.y===e.y&&this.width===e.width&&this.height===e.height&&this.degrees===e.degrees},times:function(e){return new R.Rect(this.x*e,this.y*e,this.width*e,this.height*e,this.degrees)},translate:function(e){return new R.Rect(this.x+e.x,this.y+e.y,this.width,this.height,this.degrees)},union:function(e){var t=this.getBoundingBox();var i=e.getBoundingBox();var n=Math.min(t.x,i.x);var o=Math.min(t.y,i.y);var r=Math.max(t.x+t.width,i.x+i.width);var s=Math.max(t.y+t.height,i.y+i.height);return new R.Rect(n,o,r-n,s-o)},intersection:function(e){var h=1e-10;var t=[];var i=this.getTopLeft();e.containsPoint(i,h)&&t.push(i);var n=this.getTopRight();e.containsPoint(n,h)&&t.push(n);var o=this.getBottomLeft();e.containsPoint(o,h)&&t.push(o);var r=this.getBottomRight();e.containsPoint(r,h)&&t.push(r);var s=e.getTopLeft();this.containsPoint(s,h)&&t.push(s);var a=e.getTopRight();this.containsPoint(a,h)&&t.push(a);var l=e.getBottomLeft();this.containsPoint(l,h)&&t.push(l);var c=e.getBottomRight();this.containsPoint(c,h)&&t.push(c);var u=this._getSegments();var d=e._getSegments();for(var p=0;p<u.length;p++){var g=u[p];for(var m=0;m<d.length;m++){var v=d[m];var f=w(g[0],g[1],v[0],v[1]);f&&t.push(f)}}function w(e,t,i,n){var o=t.minus(e);var r=n.minus(i);var s=-r.x*o.y+o.x*r.y;if(0===s)return null;var a=(o.x*(e.y-i.y)-o.y*(e.x-i.x))/s;var l=(r.x*(e.y-i.y)-r.y*(e.x-i.x))/s;return-h<=a&&a<=1-h&&-h<=l&&l<=1-h?new R.Point(e.x+l*o.x,e.y+l*o.y):null}if(0===t.length)return null;var y=t[0].x;var T=t[0].x;var x=t[0].y;var S=t[0].y;for(var E=1;E<t.length;E++){var P=t[E];P.x<y&&(y=P.x);P.x>T&&(T=P.x);P.y<x&&(x=P.y);P.y>S&&(S=P.y)}return new R.Rect(y,x,T-y,S-x)},_getSegments:function(){var e=this.getTopLeft();var t=this.getTopRight();var i=this.getBottomLeft();var n=this.getBottomRight();return[[e,t],[t,n],[n,i],[i,e]]},rotate:function(e,t){if(0===(e=R.positiveModulo(e,360)))return this.clone();t=t||this.getCenter();var i=this.getTopLeft().rotate(e,t);var n=this.getTopRight().rotate(e,t).minus(i);n=n.apply(function(e){return Math.abs(e)<1e-15?0:e});var o=Math.atan(n.y/n.x);n.x<0?o+=Math.PI:n.y<0&&(o+=2*Math.PI);return new R.Rect(i.x,i.y,this.width,this.height,o/Math.PI*180)},getBoundingBox:function(){if(0===this.degrees)return this.clone();var e=this.getTopLeft();var t=this.getTopRight();var i=this.getBottomLeft();var n=this.getBottomRight();var o=Math.min(e.x,t.x,i.x,n.x);var r=Math.max(e.x,t.x,i.x,n.x);var s=Math.min(e.y,t.y,i.y,n.y);var a=Math.max(e.y,t.y,i.y,n.y);return new R.Rect(o,s,r-o,a-s)},getIntegerBoundingBox:function(){var e=this.getBoundingBox();var t=Math.floor(e.x);var i=Math.floor(e.y);var n=Math.ceil(e.width+e.x-t);var o=Math.ceil(e.height+e.y-i);return new R.Rect(t,i,n,o)},containsPoint:function(e,t){t=t||0;var i=this.getTopLeft();var n=this.getTopRight();var o=this.getBottomLeft();var r=n.minus(i);var s=o.minus(i);return(e.x-i.x)*r.x+(e.y-i.y)*r.y>=-t&&(e.x-n.x)*r.x+(e.y-n.y)*r.y<=t&&(e.x-i.x)*s.x+(e.y-i.y)*s.y>=-t&&(e.x-o.x)*s.x+(e.y-o.y)*s.y<=t},toString:function(){return"["+Math.round(100*this.x)/100+", "+Math.round(100*this.y)/100+", "+Math.round(100*this.width)/100+"x"+Math.round(100*this.height)/100+", "+Math.round(100*this.degrees)/100+"deg]"}}}(OpenSeadragon);!function(d){var s={};d.ReferenceStrip=function(e){var t,i,n,r=e.viewer,o=d.getElementSize(r.element);if(!e.id){e.id="referencestrip-"+d.now();this.element=d.makeNeutralElement("div");this.element.id=e.id;this.element.className="referencestrip"}e=d.extend(!0,{sizeRatio:d.DEFAULT_SETTINGS.referenceStripSizeRatio,position:d.DEFAULT_SETTINGS.referenceStripPosition,scroll:d.DEFAULT_SETTINGS.referenceStripScroll,clickTimeThreshold:d.DEFAULT_SETTINGS.clickTimeThreshold},e,{element:this.element,showNavigator:!1,mouseNavEnabled:!1,showNavigationControl:!1,showSequenceControl:!1});d.extend(this,e);s[this.id]={animating:!1};this.minPixelRatio=this.viewer.minPixelRatio;(i=this.element.style).marginTop="0px";i.marginRight="0px";i.marginBottom="0px";i.marginLeft="0px";i.left="0px";i.bottom="0px";i.border="0px";i.background="#000";i.position="relative";d.setElementTouchActionNone(this.element);d.setElementOpacity(this.element,.8);this.viewer=r;this.innerTracker=new d.MouseTracker({element:this.element,dragHandler:d.delegate(this,a),scrollHandler:d.delegate(this,l),enterHandler:d.delegate(this,c),exitHandler:d.delegate(this,u),keyDownHandler:d.delegate(this,p),keyHandler:d.delegate(this,g)});if(e.width&&e.height){this.element.style.width=e.width+"px";this.element.style.height=e.height+"px";r.addControl(this.element,{anchor:d.ControlAnchor.BOTTOM_LEFT})}else if("horizontal"==e.scroll){this.element.style.width=o.x*e.sizeRatio*r.tileSources.length+12*r.tileSources.length+"px";this.element.style.height=o.y*e.sizeRatio+"px";r.addControl(this.element,{anchor:d.ControlAnchor.BOTTOM_LEFT})}else{this.element.style.height=o.y*e.sizeRatio*r.tileSources.length+12*r.tileSources.length+"px";this.element.style.width=o.x*e.sizeRatio+"px";r.addControl(this.element,{anchor:d.ControlAnchor.TOP_LEFT})}this.panelWidth=o.x*this.sizeRatio+8;this.panelHeight=o.y*this.sizeRatio+8;this.panels=[];this.miniViewers={};for(n=0;n<r.tileSources.length;n++){(t=d.makeNeutralElement("div")).id=this.element.id+"-"+n;t.style.width=this.panelWidth+"px";t.style.height=this.panelHeight+"px";t.style.display="inline";t.style.float="left";t.style.cssFloat="left";t.style.styleFloat="left";t.style.padding="2px";d.setElementTouchActionNone(t);t.innerTracker=new d.MouseTracker({element:t,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,pressHandler:function(e){e.eventSource.dragging=d.now()},releaseHandler:function(e){var t=e.eventSource,i=t.element.id,n=Number(i.split("-")[2]),o=d.now();if(e.insideElementPressed&&e.insideElementReleased&&t.dragging&&o-t.dragging<t.clickTimeThreshold){t.dragging=null;r.goToPage(n)}}});this.element.appendChild(t);t.activePanel=!1;this.panels.push(t)}h(this,"vertical"==this.scroll?o.y:o.x,0);this.setFocus(0)};d.extend(d.ReferenceStrip.prototype,d.EventSource.prototype,d.Viewer.prototype,{setFocus:function(e){var t,i=d.getElement(this.element.id+"-"+e),n=d.getElementSize(this.viewer.canvas),o=Number(this.element.style.width.replace("px","")),r=Number(this.element.style.height.replace("px","")),s=-Number(this.element.style.marginLeft.replace("px","")),a=-Number(this.element.style.marginTop.replace("px",""));if(this.currentSelected!==i){this.currentSelected&&(this.currentSelected.style.background="#000");this.currentSelected=i;this.currentSelected.style.background="#999";if("horizontal"==this.scroll){if((t=Number(e)*(this.panelWidth+3))>s+n.x-this.panelWidth){t=Math.min(t,o-n.x);this.element.style.marginLeft=-t+"px";h(this,n.x,-t)}else if(t<s){t=Math.max(0,t-n.x/2);this.element.style.marginLeft=-t+"px";h(this,n.x,-t)}}else if((t=Number(e)*(this.panelHeight+3))>a+n.y-this.panelHeight){t=Math.min(t,r-n.y);this.element.style.marginTop=-t+"px";h(this,n.y,-t)}else if(t<a){t=Math.max(0,t-n.y/2);this.element.style.marginTop=-t+"px";h(this,n.y,-t)}this.currentPage=e;c.call(this,{eventSource:this.innerTracker})}},update:function(){if(s[this.id].animating){d.console.log("image reference strip update");return!0}return!1},destroy:function(){if(this.miniViewers)for(var e in this.miniViewers)this.miniViewers[e].destroy();this.element&&this.element.parentNode.removeChild(this.element)}});function a(e){var t=Number(this.element.style.marginLeft.replace("px","")),i=Number(this.element.style.marginTop.replace("px","")),n=Number(this.element.style.width.replace("px","")),o=Number(this.element.style.height.replace("px","")),r=d.getElementSize(this.viewer.canvas);this.dragging=!0;if(this.element)if("horizontal"==this.scroll){if(0<-e.delta.x){if(t>-(n-r.x)){this.element.style.marginLeft=t+2*e.delta.x+"px";h(this,r.x,t+2*e.delta.x)}}else if(-e.delta.x<0&&t<0){this.element.style.marginLeft=t+2*e.delta.x+"px";h(this,r.x,t+2*e.delta.x)}}else if(0<-e.delta.y){if(i>-(o-r.y)){this.element.style.marginTop=i+2*e.delta.y+"px";h(this,r.y,i+2*e.delta.y)}}else if(-e.delta.y<0&&i<0){this.element.style.marginTop=i+2*e.delta.y+"px";h(this,r.y,i+2*e.delta.y)}return!1}function l(e){var t=Number(this.element.style.marginLeft.replace("px","")),i=Number(this.element.style.marginTop.replace("px","")),n=Number(this.element.style.width.replace("px","")),o=Number(this.element.style.height.replace("px","")),r=d.getElementSize(this.viewer.canvas);if(this.element)if("horizontal"==this.scroll){if(0<e.scroll){if(t>-(n-r.x)){this.element.style.marginLeft=t-60*e.scroll+"px";h(this,r.x,t-60*e.scroll)}}else if(e.scroll<0&&t<0){this.element.style.marginLeft=t-60*e.scroll+"px";h(this,r.x,t-60*e.scroll)}}else if(e.scroll<0){if(i>r.y-o){this.element.style.marginTop=i+60*e.scroll+"px";h(this,r.y,i+60*e.scroll)}}else if(0<e.scroll&&i<0){this.element.style.marginTop=i+60*e.scroll+"px";h(this,r.y,i+60*e.scroll)}return!1}function h(e,t,i){var n,o,r,s,a,l,h;n="horizontal"==e.scroll?e.panelWidth:e.panelHeight;o=Math.ceil(t/n)+5;for(l=o=(o=(r=Math.ceil((Math.abs(i)+t)/n)+1)-o)<0?0:o;l<r&&l<e.panels.length;l++)if(!(h=e.panels[l]).activePanel){var c;var u=e.viewer.tileSources[l];c=u.referenceStripThumbnailUrl?{type:"image",url:u.referenceStripThumbnailUrl}:u;(s=new d.Viewer({id:h.id,tileSources:[c],element:h,navigatorSizeRatio:e.sizeRatio,showNavigator:!1,mouseNavEnabled:!1,showNavigationControl:!1,showSequenceControl:!1,immediateRender:!0,blendTime:0,animationTime:0})).displayRegion=d.makeNeutralElement("div");s.displayRegion.id=h.id+"-displayregion";s.displayRegion.className="displayregion";(a=s.displayRegion.style).position="relative";a.top="0px";a.left="0px";a.fontSize="0px";a.overflow="hidden";a.float="left";a.cssFloat="left";a.styleFloat="left";a.zIndex=999999999;a.cursor="default";a.width=e.panelWidth-4+"px";a.height=e.panelHeight-4+"px";s.displayRegion.innerTracker=new d.MouseTracker({element:s.displayRegion,startDisabled:!0});h.getElementsByTagName("div")[0].appendChild(s.displayRegion);e.miniViewers[h.id]=s;h.activePanel=!0}}function c(e){var t=e.eventSource.element;"horizontal"==this.scroll?t.style.marginBottom="0px":t.style.marginLeft="0px";return!1}function u(e){var t=e.eventSource.element;"horizontal"==this.scroll?t.style.marginBottom="-"+d.getElementSize(t).y/2+"px":t.style.marginLeft="-"+d.getElementSize(t).x/2+"px";return!1}function p(e){if(e.preventDefaultAction||e.ctrl||e.alt||e.meta)return!0;switch(e.keyCode){case 38:l.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;case 40:case 37:l.call(this,{eventSource:this.tracker,position:null,scroll:-1,shift:null});return!1;case 39:l.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;default:return!0}}function g(e){if(e.preventDefaultAction||e.ctrl||e.alt||e.meta)return!0;switch(e.keyCode){case 61:l.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;case 45:l.call(this,{eventSource:this.tracker,position:null,scroll:-1,shift:null});return!1;case 48:case 119:case 87:l.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;case 115:case 83:case 97:l.call(this,{eventSource:this.tracker,position:null,scroll:-1,shift:null});return!1;case 100:l.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;default:return!0}}}(OpenSeadragon);!function(s){s.DisplayRect=function(e,t,i,n,o,r){s.Rect.apply(this,[e,t,i,n]);this.minLevel=o;this.maxLevel=r};s.extend(s.DisplayRect.prototype,s.Rect.prototype)}(OpenSeadragon);!function(s){s.Spring=function(e){var t=arguments;"object"!=typeof e&&(e={initial:t.length&&"number"==typeof t[0]?t[0]:void 0,springStiffness:1<t.length?t[1].springStiffness:5,animationTime:1<t.length?t[1].animationTime:1.5});s.console.assert("number"==typeof e.springStiffness&&0!==e.springStiffness,"[OpenSeadragon.Spring] options.springStiffness must be a non-zero number");s.console.assert("number"==typeof e.animationTime&&0<=e.animationTime,"[OpenSeadragon.Spring] options.animationTime must be a number greater than or equal to 0");if(e.exponential){this._exponential=!0;delete e.exponential}s.extend(!0,this,e);this.current={value:"number"==typeof this.initial?this.initial:this._exponential?0:1,time:s.now()};s.console.assert(!this._exponential||0!==this.current.value,"[OpenSeadragon.Spring] value must be non-zero for exponential springs");this.start={value:this.current.value,time:this.current.time};this.target={value:this.current.value,time:this.current.time};if(this._exponential){this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value);this.current._logValue=Math.log(this.current.value)}};s.Spring.prototype={resetTo:function(e){s.console.assert(!this._exponential||0!==e,"[OpenSeadragon.Spring.resetTo] target must be non-zero for exponential springs");this.start.value=this.target.value=this.current.value=e;this.start.time=this.target.time=this.current.time=s.now();if(this._exponential){this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value);this.current._logValue=Math.log(this.current.value)}},springTo:function(e){s.console.assert(!this._exponential||0!==e,"[OpenSeadragon.Spring.springTo] target must be non-zero for exponential springs");this.start.value=this.current.value;this.start.time=this.current.time;this.target.value=e;this.target.time=this.start.time+1e3*this.animationTime;if(this._exponential){this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value)}},shiftBy:function(e){this.start.value+=e;this.target.value+=e;if(this._exponential){s.console.assert(0!==this.target.value&&0!==this.start.value,"[OpenSeadragon.Spring.shiftBy] spring value must be non-zero for exponential springs");this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value)}},setExponential:function(e){this._exponential=e;if(this._exponential){s.console.assert(0!==this.current.value&&0!==this.target.value&&0!==this.start.value,"[OpenSeadragon.Spring.setExponential] spring value must be non-zero for exponential springs");this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value);this.current._logValue=Math.log(this.current.value)}},update:function(){this.current.time=s.now();var e,t;if(this._exponential){e=this.start._logValue;t=this.target._logValue}else{e=this.start.value;t=this.target.value}var i=this.current.time>=this.target.time?t:e+(t-e)*(n=this.springStiffness,o=(this.current.time-this.start.time)/(this.target.time-this.start.time),(1-Math.exp(n*-o))/(1-Math.exp(-n)));var n,o;var r=this.current.value;this._exponential?this.current.value=Math.exp(i):this.current.value=i;return r!=this.current.value},isAtTargetValue:function(){return this.current.value===this.target.value}}}(OpenSeadragon);!function(t){function n(e){t.extend(!0,this,{timeout:t.DEFAULT_SETTINGS.timeout,jobId:null},e);this.image=null}n.prototype={errorMsg:null,start:function(){var r=this;var e=this.abort;this.image=new Image;this.image.onload=function(){r.finish(!0)};this.image.onabort=this.image.onerror=function(){r.errorMsg="Image load aborted";r.finish(!1)};this.jobId=window.setTimeout(function(){r.errorMsg="Image load exceeded timeout ("+r.timeout+" ms)";r.finish(!1)},this.timeout);if(this.loadWithAjax){this.request=t.makeAjaxRequest({url:this.src,withCredentials:this.ajaxWithCredentials,headers:this.ajaxHeaders,responseType:"arraybuffer",success:function(t){var i;try{i=new window.Blob([t.response])}catch(e){var n=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder;if("TypeError"===e.name&&n){var o=new n;o.append(t.response);i=o.getBlob()}}if(0===i.size){r.errorMsg="Empty image response.";r.finish(!1)}var e=(window.URL||window.webkitURL).createObjectURL(i);r.image.src=e},error:function(e){r.errorMsg="Image load aborted - XHR error";r.finish(!1)}});this.abort=function(){r.request.abort();"function"==typeof e&&e()}}else{!1!==this.crossOriginPolicy&&(this.image.crossOrigin=this.crossOriginPolicy);this.image.src=this.src}},finish:function(e){this.image.onload=this.image.onerror=this.image.onabort=null;e||(this.image=null);this.jobId&&window.clearTimeout(this.jobId);this.callback(this)}};t.ImageLoader=function(e){t.extend(!0,this,{jobLimit:t.DEFAULT_SETTINGS.imageLoaderLimit,timeout:t.DEFAULT_SETTINGS.timeout,jobQueue:[],jobsInProgress:0},e)};t.ImageLoader.prototype={addJob:function(t){var i=this,e=new n({src:t.src,loadWithAjax:t.loadWithAjax,ajaxHeaders:t.loadWithAjax?t.ajaxHeaders:null,crossOriginPolicy:t.crossOriginPolicy,ajaxWithCredentials:t.ajaxWithCredentials,callback:function(e){!function(e,t,i){e.jobsInProgress--;if((!e.jobLimit||e.jobsInProgress<e.jobLimit)&&0<e.jobQueue.length){e.jobQueue.shift().start();e.jobsInProgress++}i(t.image,t.errorMsg,t.request)}(i,e,t.callback)},abort:t.abort,timeout:this.timeout});if(!this.jobLimit||this.jobsInProgress<this.jobLimit){e.start();this.jobsInProgress++}else this.jobQueue.push(e)},clear:function(){for(var e=0;e<this.jobQueue.length;e++){var t=this.jobQueue[e];"function"==typeof t.abort&&t.abort()}this.jobQueue=[]}}}(OpenSeadragon);!function(h){h.Tile=function(e,t,i,n,o,r,s,a,l,h){this.level=e;this.x=t;this.y=i;this.bounds=n;this.sourceBounds=h;this.exists=o;this.url=r;this.context2D=s;this.loadWithAjax=a;this.ajaxHeaders=l;this.ajaxHeaders?this.cacheKey=this.url+"+"+JSON.stringify(this.ajaxHeaders):this.cacheKey=this.url;this.loaded=!1;this.loading=!1;this.element=null;this.imgElement=null;this.image=null;this.style=null;this.position=null;this.size=null;this.blendStart=null;this.opacity=null;this.squaredDistance=null;this.visibility=null;this.beingDrawn=!1;this.lastTouchTime=0;this.isRightMost=!1;this.isBottomMost=!1};h.Tile.prototype={toString:function(){return this.level+"/"+this.x+"_"+this.y},_hasTransparencyChannel:function(){return!!this.context2D||this.url.match(".png")},drawHTML:function(e){if(this.cacheImageRecord)if(this.loaded){if(!this.element){this.element=h.makeNeutralElement("div");this.imgElement=this.cacheImageRecord.getImage().cloneNode();this.imgElement.style.msInterpolationMode="nearest-neighbor";this.imgElement.style.width="100%";this.imgElement.style.height="100%";this.style=this.element.style;this.style.position="absolute"}this.element.parentNode!=e&&e.appendChild(this.element);this.imgElement.parentNode!=this.element&&this.element.appendChild(this.imgElement);this.style.top=this.position.y+"px";this.style.left=this.position.x+"px";this.style.height=this.size.y+"px";this.style.width=this.size.x+"px";h.setElementOpacity(this.element,this.opacity)}else h.console.warn("Attempting to draw tile %s when it's not yet loaded.",this.toString());else h.console.warn("[Tile.drawHTML] attempting to draw tile %s when it's not cached",this.toString())},drawCanvas:function(e,t,i,n){var o,r=this.position.times(h.pixelDensityRatio),s=this.size.times(h.pixelDensityRatio);if(this.context2D||this.cacheImageRecord){o=this.context2D||this.cacheImageRecord.getRenderedContext();if(this.loaded&&o){e.save();e.globalAlpha=this.opacity;if("number"==typeof i&&1!==i){r=r.times(i);s=s.times(i)}n instanceof h.Point&&(r=r.plus(n));1===e.globalAlpha&&this._hasTransparencyChannel()&&e.clearRect(r.x,r.y,s.x,s.y);t({context:e,tile:this,rendered:o});var a,l;if(this.sourceBounds){a=Math.min(this.sourceBounds.width,o.canvas.width);l=Math.min(this.sourceBounds.height,o.canvas.height)}else{a=o.canvas.width;l=o.canvas.height}e.drawImage(o.canvas,0,0,a,l,r.x,r.y,s.x,s.y);e.restore()}else h.console.warn("Attempting to draw tile %s when it's not yet loaded.",this.toString())}else h.console.warn("[Tile.drawCanvas] attempting to draw tile %s when it's not cached",this.toString())},getScaleForEdgeSmoothing:function(){var e;if(this.cacheImageRecord)e=this.cacheImageRecord.getRenderedContext();else{if(!this.context2D){h.console.warn("[Tile.drawCanvas] attempting to get tile scale %s when tile's not cached",this.toString());return 1}e=this.context2D}return e.canvas.width/(this.size.x*h.pixelDensityRatio)},getTranslationForEdgeSmoothing:function(e,t,i){var n=Math.max(1,Math.ceil((i.x-t.x)/2));var o=Math.max(1,Math.ceil((i.y-t.y)/2));return new h.Point(n,o).minus(this.position.times(h.pixelDensityRatio).times(e||1).apply(function(e){return e%1}))},unload:function(){this.imgElement&&this.imgElement.parentNode&&this.imgElement.parentNode.removeChild(this.imgElement);this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element);this.element=null;this.imgElement=null;this.loaded=!1;this.loading=!1}}}(OpenSeadragon);!function(c){c.OverlayPlacement=c.Placement;c.OverlayRotationMode=c.freezeObject({NO_ROTATION:1,EXACT:2,BOUNDING_BOX:3});c.Overlay=function(e,t,i){var n;n=c.isPlainObject(e)?e:{element:e,location:t,placement:i};this.element=n.element;this.style=n.element.style;this._init(n)};c.Overlay.prototype={_init:function(e){this.location=e.location;this.placement=void 0===e.placement?c.Placement.TOP_LEFT:e.placement;this.onDraw=e.onDraw;this.checkResize=void 0===e.checkResize||e.checkResize;this.width=void 0===e.width?null:e.width;this.height=void 0===e.height?null:e.height;this.rotationMode=e.rotationMode||c.OverlayRotationMode.EXACT;if(this.location instanceof c.Rect){this.width=this.location.width;this.height=this.location.height;this.location=this.location.getTopLeft();this.placement=c.Placement.TOP_LEFT}this.scales=null!==this.width&&null!==this.height;this.bounds=new c.Rect(this.location.x,this.location.y,this.width,this.height);this.position=this.location},adjust:function(e,t){var i=c.Placement.properties[this.placement];if(i){i.isHorizontallyCentered?e.x-=t.x/2:i.isRight&&(e.x-=t.x);i.isVerticallyCentered?e.y-=t.y/2:i.isBottom&&(e.y-=t.y)}},destroy:function(){var e=this.element;var t=this.style;if(e.parentNode){e.parentNode.removeChild(e);if(e.prevElementParent){t.display="none";document.body.appendChild(e)}}this.onDraw=null;t.top="";t.left="";t.position="";null!==this.width&&(t.width="");null!==this.height&&(t.height="");var i=c.getCssPropertyWithVendorPrefix("transformOrigin");var n=c.getCssPropertyWithVendorPrefix("transform");if(i&&n){t[i]="";t[n]=""}},drawHTML:function(e,t){var i=this.element;if(i.parentNode!==e){i.prevElementParent=i.parentNode;i.prevNextSibling=i.nextSibling;e.appendChild(i);this.style.position="absolute";this.size=c.getElementSize(i)}var n=this._getOverlayPositionAndSize(t);var o=n.position;var r=this.size=n.size;var s=n.rotate;if(this.onDraw)this.onDraw(o,r,this.element);else{var a=this.style;a.left=o.x+"px";a.top=o.y+"px";null!==this.width&&(a.width=r.x+"px");null!==this.height&&(a.height=r.y+"px");var l=c.getCssPropertyWithVendorPrefix("transformOrigin");var h=c.getCssPropertyWithVendorPrefix("transform");if(l&&h)if(s){a[l]=this._getTransformOrigin();a[h]="rotate("+s+"deg)"}else{a[l]="";a[h]=""}"none"!==a.display&&(a.display="block")}},_getOverlayPositionAndSize:function(e){var t=e.pixelFromPoint(this.location,!0);var i=this._getSizeInPixels(e);this.adjust(t,i);var n=0;if(e.degrees&&this.rotationMode!==c.OverlayRotationMode.NO_ROTATION)if(this.rotationMode===c.OverlayRotationMode.BOUNDING_BOX&&null!==this.width&&null!==this.height){var o=new c.Rect(t.x,t.y,i.x,i.y);var r=this._getBoundingBox(o,e.degrees);t=r.getTopLeft();i=r.getSize()}else n=e.degrees;return{position:t,size:i,rotate:n}},_getSizeInPixels:function(e){var t=this.size.x;var i=this.size.y;if(null!==this.width||null!==this.height){var n=e.deltaPixelsFromPointsNoRotate(new c.Point(this.width||0,this.height||0),!0);null!==this.width&&(t=n.x);null!==this.height&&(i=n.y)}if(this.checkResize&&(null===this.width||null===this.height)){var o=this.size=c.getElementSize(this.element);null===this.width&&(t=o.x);null===this.height&&(i=o.y)}return new c.Point(t,i)},_getBoundingBox:function(e,t){var i=this._getPlacementPoint(e);return e.rotate(t,i).getBoundingBox()},_getPlacementPoint:function(e){var t=new c.Point(e.x,e.y);var i=c.Placement.properties[this.placement];if(i){i.isHorizontallyCentered?t.x+=e.width/2:i.isRight&&(t.x+=e.width);i.isVerticallyCentered?t.y+=e.height/2:i.isBottom&&(t.y+=e.height)}return t},_getTransformOrigin:function(){var e="";var t=c.Placement.properties[this.placement];if(!t)return e;t.isLeft?e="left":t.isRight&&(e="right");t.isTop?e+=" top":t.isBottom&&(e+=" bottom");return e},update:function(e,t){var i=c.isPlainObject(e)?e:{location:e,placement:t};this._init({location:i.location||this.location,placement:void 0!==i.placement?i.placement:this.placement,onDraw:i.onDraw||this.onDraw,checkResize:i.checkResize||this.checkResize,width:void 0!==i.width?i.width:this.width,height:void 0!==i.height?i.height:this.height,rotationMode:i.rotationMode||this.rotationMode})},getBounds:function(e){c.console.assert(e,"A viewport must now be passed to Overlay.getBounds.");var t=this.width;var i=this.height;if(null===t||null===i){var n=e.deltaPointsFromPixelsNoRotate(this.size,!0);null===t&&(t=n.x);null===i&&(i=n.y)}var o=this.location.clone();this.adjust(o,new c.Point(t,i));return this._adjustBoundsForRotation(e,new c.Rect(o.x,o.y,t,i))},_adjustBoundsForRotation:function(e,t){if(!e||0===e.degrees||this.rotationMode===c.OverlayRotationMode.EXACT)return t;if(this.rotationMode!==c.OverlayRotationMode.BOUNDING_BOX)return t.rotate(-e.degrees,this._getPlacementPoint(t));if(null===this.width||null===this.height)return t;var i=this._getOverlayPositionAndSize(e);return e.viewerElementToViewportRectangle(new c.Rect(i.position.x,i.position.y,i.size.x,i.size.y))}}}(OpenSeadragon);!function(u){u.Drawer=function(e){u.console.assert(e.viewer,"[Drawer] options.viewer is required");var t=arguments;u.isPlainObject(e)||(e={source:t[0],viewport:t[1],element:t[2]});u.console.assert(e.viewport,"[Drawer] options.viewport is required");u.console.assert(e.element,"[Drawer] options.element is required");e.source&&u.console.error("[Drawer] options.source is no longer accepted; use TiledImage instead");this.viewer=e.viewer;this.viewport=e.viewport;this.debugGridColor="string"==typeof e.debugGridColor?[e.debugGridColor]:e.debugGridColor||u.DEFAULT_SETTINGS.debugGridColor;e.opacity&&u.console.error("[Drawer] options.opacity is no longer accepted; set the opacity on the TiledImage instead");this.useCanvas=u.supportsCanvas&&(!this.viewer||this.viewer.useCanvas);this.container=u.getElement(e.element);this.canvas=u.makeNeutralElement(this.useCanvas?"canvas":"div");this.context=this.useCanvas?this.canvas.getContext("2d"):null;this.sketchCanvas=null;this.sketchContext=null;this.element=this.container;this.container.dir="ltr";if(this.useCanvas){var i=this._calculateCanvasSize();this.canvas.width=i.x;this.canvas.height=i.y}this.canvas.style.width="100%";this.canvas.style.height="100%";this.canvas.style.position="absolute";u.setElementOpacity(this.canvas,this.opacity,!0);this.container.style.textAlign="left";this.container.appendChild(this.canvas);this._imageSmoothingEnabled=!0};u.Drawer.prototype={addOverlay:function(e,t,i,n){u.console.error("drawer.addOverlay is deprecated. Use viewer.addOverlay instead.");this.viewer.addOverlay(e,t,i,n);return this},updateOverlay:function(e,t,i){u.console.error("drawer.updateOverlay is deprecated. Use viewer.updateOverlay instead.");this.viewer.updateOverlay(e,t,i);return this},removeOverlay:function(e){u.console.error("drawer.removeOverlay is deprecated. Use viewer.removeOverlay instead.");this.viewer.removeOverlay(e);return this},clearOverlays:function(){u.console.error("drawer.clearOverlays is deprecated. Use viewer.clearOverlays instead.");this.viewer.clearOverlays();return this},setOpacity:function(e){u.console.error("drawer.setOpacity is deprecated. Use tiledImage.setOpacity instead.");var t=this.viewer.world;for(var i=0;i<t.getItemCount();i++)t.getItemAt(i).setOpacity(e);return this},getOpacity:function(){u.console.error("drawer.getOpacity is deprecated. Use tiledImage.getOpacity instead.");var e=this.viewer.world;var t=0;for(var i=0;i<e.getItemCount();i++){var n=e.getItemAt(i).getOpacity();t<n&&(t=n)}return t},needsUpdate:function(){u.console.error("[Drawer.needsUpdate] this function is deprecated. Use World.needsDraw instead.");return this.viewer.world.needsDraw()},numTilesLoaded:function(){u.console.error("[Drawer.numTilesLoaded] this function is deprecated. Use TileCache.numTilesLoaded instead.");return this.viewer.tileCache.numTilesLoaded()},reset:function(){u.console.error("[Drawer.reset] this function is deprecated. Use World.resetItems instead.");this.viewer.world.resetItems();return this},update:function(){u.console.error("[Drawer.update] this function is deprecated. Use Drawer.clear and World.draw instead.");this.clear();this.viewer.world.draw();return this},canRotate:function(){return this.useCanvas},destroy:function(){this.canvas.width=1;this.canvas.height=1;this.sketchCanvas=null;this.sketchContext=null},clear:function(){this.canvas.innerHTML="";if(this.useCanvas){var e=this._calculateCanvasSize();if(this.canvas.width!=e.x||this.canvas.height!=e.y){this.canvas.width=e.x;this.canvas.height=e.y;this._updateImageSmoothingEnabled(this.context);if(null!==this.sketchCanvas){var t=this._calculateSketchCanvasSize();this.sketchCanvas.width=t.x;this.sketchCanvas.height=t.y;this._updateImageSmoothingEnabled(this.sketchContext)}}this._clear()}},_clear:function(e,t){if(this.useCanvas){var i=this._getContext(e);if(t)i.clearRect(t.x,t.y,t.width,t.height);else{var n=i.canvas;i.clearRect(0,0,n.width,n.height)}}},viewportToDrawerRectangle:function(e){var t=this.viewport.pixelFromPointNoRotate(e.getTopLeft(),!0);var i=this.viewport.deltaPixelsFromPointsNoRotate(e.getSize(),!0);return new u.Rect(t.x*u.pixelDensityRatio,t.y*u.pixelDensityRatio,i.x*u.pixelDensityRatio,i.y*u.pixelDensityRatio)},drawTile:function(e,t,i,n,o){u.console.assert(e,"[Drawer.drawTile] tile is required");u.console.assert(t,"[Drawer.drawTile] drawingHandler is required");if(this.useCanvas){var r=this._getContext(i);n=n||1;e.drawCanvas(r,t,n,o)}else e.drawHTML(this.canvas)},_getContext:function(e){var t=this.context;if(e){if(null===this.sketchCanvas){this.sketchCanvas=document.createElement("canvas");var i=this._calculateSketchCanvasSize();this.sketchCanvas.width=i.x;this.sketchCanvas.height=i.y;this.sketchContext=this.sketchCanvas.getContext("2d");if(0===this.viewport.getRotation()){var n=this;this.viewer.addHandler("rotate",function e(){if(0!==n.viewport.getRotation()){n.viewer.removeHandler("rotate",e);var t=n._calculateSketchCanvasSize();n.sketchCanvas.width=t.x;n.sketchCanvas.height=t.y}})}this._updateImageSmoothingEnabled(this.sketchContext)}t=this.sketchContext}return t},saveContext:function(e){this.useCanvas&&this._getContext(e).save()},restoreContext:function(e){this.useCanvas&&this._getContext(e).restore()},setClip:function(e,t){if(this.useCanvas){var i=this._getContext(t);i.beginPath();i.rect(e.x,e.y,e.width,e.height);i.clip()}},drawRectangle:function(e,t,i){if(this.useCanvas){var n=this._getContext(i);n.save();n.fillStyle=t;n.fillRect(e.x,e.y,e.width,e.height);n.restore()}},blendSketch:function(e,t,i,n){var o=e;u.isPlainObject(o)||(o={opacity:e,scale:t,translate:i,compositeOperation:n});if(this.useCanvas&&this.sketchCanvas){e=o.opacity;n=o.compositeOperation;var r=o.bounds;this.context.save();this.context.globalAlpha=e;n&&(this.context.globalCompositeOperation=n);if(r){if(r.x<0){r.width+=r.x;r.x=0}r.x+r.width>this.canvas.width&&(r.width=this.canvas.width-r.x);if(r.y<0){r.height+=r.y;r.y=0}r.y+r.height>this.canvas.height&&(r.height=this.canvas.height-r.y);this.context.drawImage(this.sketchCanvas,r.x,r.y,r.width,r.height,r.x,r.y,r.width,r.height)}else{t=o.scale||1;var s=(i=o.translate)instanceof u.Point?i:new u.Point(0,0);var a=0;var l=0;if(i){var h=this.sketchCanvas.width-this.canvas.width;var c=this.sketchCanvas.height-this.canvas.height;a=Math.round(h/2);l=Math.round(c/2)}this.context.drawImage(this.sketchCanvas,s.x-a*t,s.y-l*t,(this.canvas.width+2*a)*t,(this.canvas.height+2*l)*t,-a,-l,this.canvas.width+2*a,this.canvas.height+2*l)}this.context.restore()}},drawDebugInfo:function(e,t,i,n){if(this.useCanvas){var o=this.viewer.world.getIndexOfItem(n)%this.debugGridColor.length;var r=this.context;r.save();r.lineWidth=2*u.pixelDensityRatio;r.font="small-caps bold "+13*u.pixelDensityRatio+"px arial";r.strokeStyle=this.debugGridColor[o];r.fillStyle=this.debugGridColor[o];0!==this.viewport.degrees&&this._offsetForRotation({degrees:this.viewport.degrees});n.getRotation(!0)%360!=0&&this._offsetForRotation({degrees:n.getRotation(!0),point:n.viewport.pixelFromPointNoRotate(n._getRotationPoint(!0),!0)});0===n.viewport.degrees&&n.getRotation(!0)%360==0&&n._drawer.viewer.viewport.getFlip()&&n._drawer._flip();r.strokeRect(e.position.x*u.pixelDensityRatio,e.position.y*u.pixelDensityRatio,e.size.x*u.pixelDensityRatio,e.size.y*u.pixelDensityRatio);var s=(e.position.x+e.size.x/2)*u.pixelDensityRatio;var a=(e.position.y+e.size.y/2)*u.pixelDensityRatio;r.translate(s,a);r.rotate(Math.PI/180*-this.viewport.degrees);r.translate(-s,-a);if(0===e.x&&0===e.y){r.fillText("Zoom: "+this.viewport.getZoom(),e.position.x*u.pixelDensityRatio,(e.position.y-30)*u.pixelDensityRatio);r.fillText("Pan: "+this.viewport.getBounds().toString(),e.position.x*u.pixelDensityRatio,(e.position.y-20)*u.pixelDensityRatio)}r.fillText("Level: "+e.level,(e.position.x+10)*u.pixelDensityRatio,(e.position.y+20)*u.pixelDensityRatio);r.fillText("Column: "+e.x,(e.position.x+10)*u.pixelDensityRatio,(e.position.y+30)*u.pixelDensityRatio);r.fillText("Row: "+e.y,(e.position.x+10)*u.pixelDensityRatio,(e.position.y+40)*u.pixelDensityRatio);r.fillText("Order: "+i+" of "+t,(e.position.x+10)*u.pixelDensityRatio,(e.position.y+50)*u.pixelDensityRatio);r.fillText("Size: "+e.size.toString(),(e.position.x+10)*u.pixelDensityRatio,(e.position.y+60)*u.pixelDensityRatio);r.fillText("Position: "+e.position.toString(),(e.position.x+10)*u.pixelDensityRatio,(e.position.y+70)*u.pixelDensityRatio);0!==this.viewport.degrees&&this._restoreRotationChanges();n.getRotation(!0)%360!=0&&this._restoreRotationChanges();0===n.viewport.degrees&&n.getRotation(!0)%360==0&&n._drawer.viewer.viewport.getFlip()&&n._drawer._flip();r.restore()}},debugRect:function(e){if(this.useCanvas){var t=this.context;t.save();t.lineWidth=2*u.pixelDensityRatio;t.strokeStyle=this.debugGridColor[0];t.fillStyle=this.debugGridColor[0];t.strokeRect(e.x*u.pixelDensityRatio,e.y*u.pixelDensityRatio,e.width*u.pixelDensityRatio,e.height*u.pixelDensityRatio);t.restore()}},setImageSmoothingEnabled:function(e){if(this.useCanvas){this._imageSmoothingEnabled=e;this._updateImageSmoothingEnabled(this.context);this.viewer.forceRedraw()}},_updateImageSmoothingEnabled:function(e){e.mozImageSmoothingEnabled=this._imageSmoothingEnabled;e.webkitImageSmoothingEnabled=this._imageSmoothingEnabled;e.msImageSmoothingEnabled=this._imageSmoothingEnabled;e.imageSmoothingEnabled=this._imageSmoothingEnabled},getCanvasSize:function(e){var t=this._getContext(e).canvas;return new u.Point(t.width,t.height)},getCanvasCenter:function(){return new u.Point(this.canvas.width/2,this.canvas.height/2)},_offsetForRotation:function(e){var t=e.point?e.point.times(u.pixelDensityRatio):this.getCanvasCenter();var i=this._getContext(e.useSketch);i.save();i.translate(t.x,t.y);if(this.viewer.viewport.flipped){i.rotate(Math.PI/180*-e.degrees);i.scale(-1,1)}else i.rotate(Math.PI/180*e.degrees);i.translate(-t.x,-t.y)},_flip:function(e){var t=(e=e||{}).point?e.point.times(u.pixelDensityRatio):this.getCanvasCenter();var i=this._getContext(e.useSketch);i.translate(t.x,0);i.scale(-1,1);i.translate(-t.x,0)},_restoreRotationChanges:function(e){this._getContext(e).restore()},_calculateCanvasSize:function(){var e=u.pixelDensityRatio;var t=this.viewport.getContainerSize();return{x:Math.round(t.x*e),y:Math.round(t.y*e)}},_calculateSketchCanvasSize:function(){var e=this._calculateCanvasSize();if(0===this.viewport.getRotation())return e;var t=Math.ceil(Math.sqrt(e.x*e.x+e.y*e.y));return{x:t,y:t}}}}(OpenSeadragon);!function(p){p.Viewport=function(e){var t=arguments;t.length&&t[0]instanceof p.Point&&(e={containerSize:t[0],contentSize:t[1],config:t[2]});if(e.config){p.extend(!0,e,e.config);delete e.config}this._margins=p.extend({left:0,top:0,right:0,bottom:0},e.margins||{});delete e.margins;p.extend(!0,this,{containerSize:null,contentSize:null,zoomPoint:null,viewer:null,springStiffness:p.DEFAULT_SETTINGS.springStiffness,animationTime:p.DEFAULT_SETTINGS.animationTime,minZoomImageRatio:p.DEFAULT_SETTINGS.minZoomImageRatio,maxZoomPixelRatio:p.DEFAULT_SETTINGS.maxZoomPixelRatio,visibilityRatio:p.DEFAULT_SETTINGS.visibilityRatio,wrapHorizontal:p.DEFAULT_SETTINGS.wrapHorizontal,wrapVertical:p.DEFAULT_SETTINGS.wrapVertical,defaultZoomLevel:p.DEFAULT_SETTINGS.defaultZoomLevel,minZoomLevel:p.DEFAULT_SETTINGS.minZoomLevel,maxZoomLevel:p.DEFAULT_SETTINGS.maxZoomLevel,degrees:p.DEFAULT_SETTINGS.degrees,flipped:p.DEFAULT_SETTINGS.flipped,homeFillsViewer:p.DEFAULT_SETTINGS.homeFillsViewer},e);this._updateContainerInnerSize();this.centerSpringX=new p.Spring({initial:0,springStiffness:this.springStiffness,animationTime:this.animationTime});this.centerSpringY=new p.Spring({initial:0,springStiffness:this.springStiffness,animationTime:this.animationTime});this.zoomSpring=new p.Spring({exponential:!0,initial:1,springStiffness:this.springStiffness,animationTime:this.animationTime});this._oldCenterX=this.centerSpringX.current.value;this._oldCenterY=this.centerSpringY.current.value;this._oldZoom=this.zoomSpring.current.value;this._setContentBounds(new p.Rect(0,0,1,1),1);this.goHome(!0);this.update()};p.Viewport.prototype={resetContentSize:function(e){p.console.assert(e,"[Viewport.resetContentSize] contentSize is required");p.console.assert(e instanceof p.Point,"[Viewport.resetContentSize] contentSize must be an OpenSeadragon.Point");p.console.assert(0<e.x,"[Viewport.resetContentSize] contentSize.x must be greater than 0");p.console.assert(0<e.y,"[Viewport.resetContentSize] contentSize.y must be greater than 0");this._setContentBounds(new p.Rect(0,0,1,e.y/e.x),e.x);return this},setHomeBounds:function(e,t){p.console.error("[Viewport.setHomeBounds] this function is deprecated; The content bounds should not be set manually.");this._setContentBounds(e,t)},_setContentBounds:function(e,t){p.console.assert(e,"[Viewport._setContentBounds] bounds is required");p.console.assert(e instanceof p.Rect,"[Viewport._setContentBounds] bounds must be an OpenSeadragon.Rect");p.console.assert(0<e.width,"[Viewport._setContentBounds] bounds.width must be greater than 0");p.console.assert(0<e.height,"[Viewport._setContentBounds] bounds.height must be greater than 0");this._contentBoundsNoRotate=e.clone();this._contentSizeNoRotate=this._contentBoundsNoRotate.getSize().times(t);this._contentBounds=e.rotate(this.degrees).getBoundingBox();this._contentSize=this._contentBounds.getSize().times(t);this._contentAspectRatio=this._contentSize.x/this._contentSize.y;this.viewer&&this.viewer.raiseEvent("reset-size",{contentSize:this._contentSizeNoRotate.clone(),contentFactor:t,homeBounds:this._contentBoundsNoRotate.clone(),contentBounds:this._contentBounds.clone()})},getHomeZoom:function(){if(this.defaultZoomLevel)return this.defaultZoomLevel;var e=this._contentAspectRatio/this.getAspectRatio();return(this.homeFillsViewer?1<=e?e:1:1<=e?1:e)/this._contentBounds.width},getHomeBounds:function(){return this.getHomeBoundsNoRotate().rotate(-this.getRotation())},getHomeBoundsNoRotate:function(){var e=this._contentBounds.getCenter();var t=1/this.getHomeZoom();var i=t/this.getAspectRatio();return new p.Rect(e.x-t/2,e.y-i/2,t,i)},goHome:function(e){this.viewer&&this.viewer.raiseEvent("home",{immediately:e});return this.fitBounds(this.getHomeBounds(),e)},getMinZoom:function(){var e=this.getHomeZoom();return this.minZoomLevel?this.minZoomLevel:this.minZoomImageRatio*e},getMaxZoom:function(){var e=this.maxZoomLevel;if(!e){e=this._contentSize.x*this.maxZoomPixelRatio/this._containerInnerSize.x;e/=this._contentBounds.width}return Math.max(e,this.getHomeZoom())},getAspectRatio:function(){return this._containerInnerSize.x/this._containerInnerSize.y},getContainerSize:function(){return new p.Point(this.containerSize.x,this.containerSize.y)},getMargins:function(){return p.extend({},this._margins)},setMargins:function(e){p.console.assert("object"===p.type(e),"[Viewport.setMargins] margins must be an object");this._margins=p.extend({left:0,top:0,right:0,bottom:0},e);this._updateContainerInnerSize();this.viewer&&this.viewer.forceRedraw()},getBounds:function(e){return this.getBoundsNoRotate(e).rotate(-this.getRotation())},getBoundsNoRotate:function(e){var t=this.getCenter(e);var i=1/this.getZoom(e);var n=i/this.getAspectRatio();return new p.Rect(t.x-i/2,t.y-n/2,i,n)},getBoundsWithMargins:function(e){return this.getBoundsNoRotateWithMargins(e).rotate(-this.getRotation(),this.getCenter(e))},getBoundsNoRotateWithMargins:function(e){var t=this.getBoundsNoRotate(e);var i=this._containerInnerSize.x*this.getZoom(e);t.x-=this._margins.left/i;t.y-=this._margins.top/i;t.width+=(this._margins.left+this._margins.right)/i;t.height+=(this._margins.top+this._margins.bottom)/i;return t},getCenter:function(e){var t,i,n,o,r,s,a=new p.Point(this.centerSpringX.current.value,this.centerSpringY.current.value),l=new p.Point(this.centerSpringX.target.value,this.centerSpringY.target.value);if(e)return a;if(!this.zoomPoint)return l;t=this.pixelFromPoint(this.zoomPoint,!0);o=(n=1/(i=this.getZoom()))/this.getAspectRatio();r=new p.Rect(a.x-n/2,a.y-o/2,n,o);s=this._pixelFromPoint(this.zoomPoint,r).minus(t).divide(this._containerInnerSize.x*i);return l.plus(s)},getZoom:function(e){return e?this.zoomSpring.current.value:this.zoomSpring.target.value},_applyZoomConstraints:function(e){return Math.max(Math.min(e,this.getMaxZoom()),this.getMinZoom())},_applyBoundaryConstraints:function(e){var t=new p.Rect(e.x,e.y,e.width,e.height);if(this.wrapHorizontal);else{var i=this.visibilityRatio*t.width;var n=t.x+t.width;var o=this._contentBoundsNoRotate.x+this._contentBoundsNoRotate.width;var r=this._contentBoundsNoRotate.x-n+i;var s=o-t.x-i;i>this._contentBoundsNoRotate.width?t.x+=(r+s)/2:s<0?t.x+=s:0<r&&(t.x+=r)}if(this.wrapVertical);else{var a=this.visibilityRatio*t.height;var l=t.y+t.height;var h=this._contentBoundsNoRotate.y+this._contentBoundsNoRotate.height;var c=this._contentBoundsNoRotate.y-l+a;var u=h-t.y-a;a>this._contentBoundsNoRotate.height?t.y+=(c+u)/2:u<0?t.y+=u:0<c&&(t.y+=c)}return t},_raiseConstraintsEvent:function(e){this.viewer&&this.viewer.raiseEvent("constrain",{immediately:e})},applyConstraints:function(e){var t=this.getZoom();var i=this._applyZoomConstraints(t);t!==i&&this.zoomTo(i,this.zoomPoint,e);var n=this.getBoundsNoRotate();var o=this._applyBoundaryConstraints(n);this._raiseConstraintsEvent(e);(n.x!==o.x||n.y!==o.y||e)&&this.fitBounds(o.rotate(-this.getRotation()),e);return this},ensureVisible:function(e){return this.applyConstraints(e)},_fitBounds:function(e,t){var i=(t=t||{}).immediately||!1;var n=t.constraints||!1;var o=this.getAspectRatio();var r=e.getCenter();var s=new p.Rect(e.x,e.y,e.width,e.height,e.degrees+this.getRotation()).getBoundingBox();s.getAspectRatio()>=o?s.height=s.width/o:s.width=s.height*o;s.x=r.x-s.width/2;s.y=r.y-s.height/2;var a=1/s.width;if(n){var l=s.getAspectRatio();var h=this._applyZoomConstraints(a);if(a!==h){a=h;s.width=1/a;s.x=r.x-s.width/2;s.height=s.width/l;s.y=r.y-s.height/2}r=(s=this._applyBoundaryConstraints(s)).getCenter();this._raiseConstraintsEvent(i)}if(i){this.panTo(r,!0);return this.zoomTo(a,null,!0)}this.panTo(this.getCenter(!0),!0);this.zoomTo(this.getZoom(!0),null,!0);var c=this.getBounds();var u=this.getZoom();if(0===u||Math.abs(a/u-1)<1e-8){this.zoomTo(a,!0);return this.panTo(r,i)}var d=(s=s.rotate(-this.getRotation())).getTopLeft().times(a).minus(c.getTopLeft().times(u)).divide(a-u);return this.zoomTo(a,d,i)},fitBounds:function(e,t){return this._fitBounds(e,{immediately:t,constraints:!1})},fitBoundsWithConstraints:function(e,t){return this._fitBounds(e,{immediately:t,constraints:!0})},fitVertically:function(e){var t=new p.Rect(this._contentBounds.x+this._contentBounds.width/2,this._contentBounds.y,0,this._contentBounds.height);return this.fitBounds(t,e)},fitHorizontally:function(e){var t=new p.Rect(this._contentBounds.x,this._contentBounds.y+this._contentBounds.height/2,this._contentBounds.width,0);return this.fitBounds(t,e)},getConstrainedBounds:function(e){var t;t=this.getBounds(e);return this._applyBoundaryConstraints(t)},panBy:function(e,t){var i=new p.Point(this.centerSpringX.target.value,this.centerSpringY.target.value);return this.panTo(i.plus(e),t)},panTo:function(e,t){if(t){this.centerSpringX.resetTo(e.x);this.centerSpringY.resetTo(e.y)}else{this.centerSpringX.springTo(e.x);this.centerSpringY.springTo(e.y)}this.viewer&&this.viewer.raiseEvent("pan",{center:e,immediately:t});return this},zoomBy:function(e,t,i){return this.zoomTo(this.zoomSpring.target.value*e,t,i)},zoomTo:function(e,t,i){var n=this;this.zoomPoint=t instanceof p.Point&&!isNaN(t.x)&&!isNaN(t.y)?t:null;i?this._adjustCenterSpringsForZoomPoint(function(){n.zoomSpring.resetTo(e)}):this.zoomSpring.springTo(e);this.viewer&&this.viewer.raiseEvent("zoom",{zoom:e,refPoint:t,immediately:i});return this},setRotation:function(e){if(!this.viewer||!this.viewer.drawer.canRotate())return this;this.degrees=p.positiveModulo(e,360);this._setContentBounds(this.viewer.world.getHomeBounds(),this.viewer.world.getContentFactor());this.viewer.forceRedraw();this.viewer.raiseEvent("rotate",{degrees:e});return this},getRotation:function(){return this.degrees},resize:function(e,t){var i,n=this.getBoundsNoRotate(),o=n;this.containerSize.x=e.x;this.containerSize.y=e.y;this._updateContainerInnerSize();if(t){i=e.x/this.containerSize.x;o.width=n.width*i;o.height=o.width/this.getAspectRatio()}this.viewer&&this.viewer.raiseEvent("resize",{newContainerSize:e,maintain:t});return this.fitBounds(o,!0)},_updateContainerInnerSize:function(){this._containerInnerSize=new p.Point(Math.max(1,this.containerSize.x-(this._margins.left+this._margins.right)),Math.max(1,this.containerSize.y-(this._margins.top+this._margins.bottom)))},update:function(){var e=this;this._adjustCenterSpringsForZoomPoint(function(){e.zoomSpring.update()});this.centerSpringX.update();this.centerSpringY.update();var t=this.centerSpringX.current.value!==this._oldCenterX||this.centerSpringY.current.value!==this._oldCenterY||this.zoomSpring.current.value!==this._oldZoom;this._oldCenterX=this.centerSpringX.current.value;this._oldCenterY=this.centerSpringY.current.value;this._oldZoom=this.zoomSpring.current.value;return t},_adjustCenterSpringsForZoomPoint:function(e){if(this.zoomPoint){var t=this.pixelFromPoint(this.zoomPoint,!0);e();var i=this.pixelFromPoint(this.zoomPoint,!0).minus(t);var n=this.deltaPointsFromPixels(i,!0);this.centerSpringX.shiftBy(n.x);this.centerSpringY.shiftBy(n.y);this.zoomSpring.isAtTargetValue()&&(this.zoomPoint=null)}else e()},deltaPixelsFromPointsNoRotate:function(e,t){return e.times(this._containerInnerSize.x*this.getZoom(t))},deltaPixelsFromPoints:function(e,t){return this.deltaPixelsFromPointsNoRotate(e.rotate(this.getRotation()),t)},deltaPointsFromPixelsNoRotate:function(e,t){return e.divide(this._containerInnerSize.x*this.getZoom(t))},deltaPointsFromPixels:function(e,t){return this.deltaPointsFromPixelsNoRotate(e,t).rotate(-this.getRotation())},pixelFromPointNoRotate:function(e,t){return this._pixelFromPointNoRotate(e,this.getBoundsNoRotate(t))},pixelFromPoint:function(e,t){return this._pixelFromPoint(e,this.getBoundsNoRotate(t))},_pixelFromPointNoRotate:function(e,t){return e.minus(t.getTopLeft()).times(this._containerInnerSize.x/t.width).plus(new p.Point(this._margins.left,this._margins.top))},_pixelFromPoint:function(e,t){return this._pixelFromPointNoRotate(e.rotate(this.getRotation(),this.getCenter(!0)),t)},pointFromPixelNoRotate:function(e,t){var i=this.getBoundsNoRotate(t);return e.minus(new p.Point(this._margins.left,this._margins.top)).divide(this._containerInnerSize.x/i.width).plus(i.getTopLeft())},pointFromPixel:function(e,t){return this.pointFromPixelNoRotate(e,t).rotate(-this.getRotation(),this.getCenter(!0))},_viewportToImageDelta:function(e,t){var i=this._contentBoundsNoRotate.width;return new p.Point(e*this._contentSizeNoRotate.x/i,t*this._contentSizeNoRotate.x/i)},viewportToImageCoordinates:function(e,t){if(e instanceof p.Point)return this.viewportToImageCoordinates(e.x,e.y);if(this.viewer){var i=this.viewer.world.getItemCount();if(1<i)p.console.error("[Viewport.viewportToImageCoordinates] is not accurate with multi-image; use TiledImage.viewportToImageCoordinates instead.");else if(1===i){return this.viewer.world.getItemAt(0).viewportToImageCoordinates(e,t,!0)}}return this._viewportToImageDelta(e-this._contentBoundsNoRotate.x,t-this._contentBoundsNoRotate.y)},_imageToViewportDelta:function(e,t){var i=this._contentBoundsNoRotate.width;return new p.Point(e/this._contentSizeNoRotate.x*i,t/this._contentSizeNoRotate.x*i)},imageToViewportCoordinates:function(e,t){if(e instanceof p.Point)return this.imageToViewportCoordinates(e.x,e.y);if(this.viewer){var i=this.viewer.world.getItemCount();if(1<i)p.console.error("[Viewport.imageToViewportCoordinates] is not accurate with multi-image; use TiledImage.imageToViewportCoordinates instead.");else if(1===i){return this.viewer.world.getItemAt(0).imageToViewportCoordinates(e,t,!0)}}var n=this._imageToViewportDelta(e,t);n.x+=this._contentBoundsNoRotate.x;n.y+=this._contentBoundsNoRotate.y;return n},imageToViewportRectangle:function(e,t,i,n){var o=e;o instanceof p.Rect||(o=new p.Rect(e,t,i,n));if(this.viewer){var r=this.viewer.world.getItemCount();if(1<r)p.console.error("[Viewport.imageToViewportRectangle] is not accurate with multi-image; use TiledImage.imageToViewportRectangle instead.");else if(1===r){return this.viewer.world.getItemAt(0).imageToViewportRectangle(e,t,i,n,!0)}}var s=this.imageToViewportCoordinates(o.x,o.y);var a=this._imageToViewportDelta(o.width,o.height);return new p.Rect(s.x,s.y,a.x,a.y,o.degrees)},viewportToImageRectangle:function(e,t,i,n){var o=e;o instanceof p.Rect||(o=new p.Rect(e,t,i,n));if(this.viewer){var r=this.viewer.world.getItemCount();if(1<r)p.console.error("[Viewport.viewportToImageRectangle] is not accurate with multi-image; use TiledImage.viewportToImageRectangle instead.");else if(1===r){return this.viewer.world.getItemAt(0).viewportToImageRectangle(e,t,i,n,!0)}}var s=this.viewportToImageCoordinates(o.x,o.y);var a=this._viewportToImageDelta(o.width,o.height);return new p.Rect(s.x,s.y,a.x,a.y,o.degrees)},viewerElementToImageCoordinates:function(e){var t=this.pointFromPixel(e,!0);return this.viewportToImageCoordinates(t)},imageToViewerElementCoordinates:function(e){var t=this.imageToViewportCoordinates(e);return this.pixelFromPoint(t,!0)},windowToImageCoordinates:function(e){p.console.assert(this.viewer,"[Viewport.windowToImageCoordinates] the viewport must have a viewer.");var t=e.minus(p.getElementPosition(this.viewer.element));return this.viewerElementToImageCoordinates(t)},imageToWindowCoordinates:function(e){p.console.assert(this.viewer,"[Viewport.imageToWindowCoordinates] the viewport must have a viewer.");return this.imageToViewerElementCoordinates(e).plus(p.getElementPosition(this.viewer.element))},viewerElementToViewportCoordinates:function(e){return this.pointFromPixel(e,!0)},viewportToViewerElementCoordinates:function(e){return this.pixelFromPoint(e,!0)},viewerElementToViewportRectangle:function(e){return p.Rect.fromSummits(this.pointFromPixel(e.getTopLeft(),!0),this.pointFromPixel(e.getTopRight(),!0),this.pointFromPixel(e.getBottomLeft(),!0))},viewportToViewerElementRectangle:function(e){return p.Rect.fromSummits(this.pixelFromPoint(e.getTopLeft(),!0),this.pixelFromPoint(e.getTopRight(),!0),this.pixelFromPoint(e.getBottomLeft(),!0))},windowToViewportCoordinates:function(e){p.console.assert(this.viewer,"[Viewport.windowToViewportCoordinates] the viewport must have a viewer.");var t=e.minus(p.getElementPosition(this.viewer.element));return this.viewerElementToViewportCoordinates(t)},viewportToWindowCoordinates:function(e){p.console.assert(this.viewer,"[Viewport.viewportToWindowCoordinates] the viewport must have a viewer.");return this.viewportToViewerElementCoordinates(e).plus(p.getElementPosition(this.viewer.element))},viewportToImageZoom:function(e){if(this.viewer){var t=this.viewer.world.getItemCount();if(1<t)p.console.error("[Viewport.viewportToImageZoom] is not accurate with multi-image.");else if(1===t){return this.viewer.world.getItemAt(0).viewportToImageZoom(e)}}var i=this._contentSizeNoRotate.x;return e*(this._containerInnerSize.x/i*this._contentBoundsNoRotate.width)},imageToViewportZoom:function(e){if(this.viewer){var t=this.viewer.world.getItemCount();if(1<t)p.console.error("[Viewport.imageToViewportZoom] is not accurate with multi-image.");else if(1===t){return this.viewer.world.getItemAt(0).imageToViewportZoom(e)}}return e*(this._contentSizeNoRotate.x/this._containerInnerSize.x/this._contentBoundsNoRotate.width)},toggleFlip:function(){this.setFlip(!this.getFlip());return this},getFlip:function(){return this.flipped},setFlip:function(e){if(this.flipped===e)return this;this.flipped=e;this.viewer.navigator&&this.viewer.navigator.setFlip(this.getFlip());this.viewer.forceRedraw();this.viewer.raiseEvent("flip",{flipped:e});return this}}}(OpenSeadragon);!function(y){y.TiledImage=function(e){var t=this;y.console.assert(e.tileCache,"[TiledImage] options.tileCache is required");y.console.assert(e.drawer,"[TiledImage] options.drawer is required");y.console.assert(e.viewer,"[TiledImage] options.viewer is required");y.console.assert(e.imageLoader,"[TiledImage] options.imageLoader is required");y.console.assert(e.source,"[TiledImage] options.source is required");y.console.assert(!e.clip||e.clip instanceof y.Rect,"[TiledImage] options.clip must be an OpenSeadragon.Rect if present");y.EventSource.call(this);this._tileCache=e.tileCache;delete e.tileCache;this._drawer=e.drawer;delete e.drawer;this._imageLoader=e.imageLoader;delete e.imageLoader;e.clip instanceof y.Rect&&(this._clip=e.clip.clone());delete e.clip;var i=e.x||0;delete e.x;var n=e.y||0;delete e.y;this.normHeight=e.source.dimensions.y/e.source.dimensions.x;this.contentAspectX=e.source.dimensions.x/e.source.dimensions.y;var o=1;if(e.width){o=e.width;delete e.width;if(e.height){y.console.error("specifying both width and height to a tiledImage is not supported");delete e.height}}else if(e.height){o=e.height/this.normHeight;delete e.height}var r=e.fitBounds;delete e.fitBounds;var s=e.fitBoundsPlacement||OpenSeadragon.Placement.CENTER;delete e.fitBoundsPlacement;var a=e.degrees||0;delete e.degrees;y.extend(!0,this,{viewer:null,tilesMatrix:{},coverage:{},loadingCoverage:{},lastDrawn:[],lastResetTime:0,_midDraw:!1,_needsDraw:!0,_hasOpaqueTile:!1,_tilesLoading:0,springStiffness:y.DEFAULT_SETTINGS.springStiffness,animationTime:y.DEFAULT_SETTINGS.animationTime,minZoomImageRatio:y.DEFAULT_SETTINGS.minZoomImageRatio,wrapHorizontal:y.DEFAULT_SETTINGS.wrapHorizontal,wrapVertical:y.DEFAULT_SETTINGS.wrapVertical,immediateRender:y.DEFAULT_SETTINGS.immediateRender,blendTime:y.DEFAULT_SETTINGS.blendTime,alwaysBlend:y.DEFAULT_SETTINGS.alwaysBlend,minPixelRatio:y.DEFAULT_SETTINGS.minPixelRatio,smoothTileEdgesMinZoom:y.DEFAULT_SETTINGS.smoothTileEdgesMinZoom,iOSDevice:y.DEFAULT_SETTINGS.iOSDevice,debugMode:y.DEFAULT_SETTINGS.debugMode,crossOriginPolicy:y.DEFAULT_SETTINGS.crossOriginPolicy,ajaxWithCredentials:y.DEFAULT_SETTINGS.ajaxWithCredentials,placeholderFillStyle:y.DEFAULT_SETTINGS.placeholderFillStyle,opacity:y.DEFAULT_SETTINGS.opacity,preload:y.DEFAULT_SETTINGS.preload,compositeOperation:y.DEFAULT_SETTINGS.compositeOperation},e);this._preload=this.preload;delete this.preload;this._fullyLoaded=!1;this._xSpring=new y.Spring({initial:i,springStiffness:this.springStiffness,animationTime:this.animationTime});this._ySpring=new y.Spring({initial:n,springStiffness:this.springStiffness,animationTime:this.animationTime});this._scaleSpring=new y.Spring({initial:o,springStiffness:this.springStiffness,animationTime:this.animationTime});this._degreesSpring=new y.Spring({initial:a,springStiffness:this.springStiffness,animationTime:this.animationTime});this._updateForScale();r&&this.fitBounds(r,s,!0);this._drawingHandler=function(e){t.viewer.raiseEvent("tile-drawing",y.extend({tiledImage:t},e))}};y.extend(y.TiledImage.prototype,y.EventSource.prototype,{needsDraw:function(){return this._needsDraw},getFullyLoaded:function(){return this._fullyLoaded},_setFullyLoaded:function(e){if(e!==this._fullyLoaded){this._fullyLoaded=e;this.raiseEvent("fully-loaded-change",{fullyLoaded:this._fullyLoaded})}},reset:function(){this._tileCache.clearTilesFor(this);this.lastResetTime=y.now();this._needsDraw=!0},update:function(){var e=this._xSpring.update();var t=this._ySpring.update();var i=this._scaleSpring.update();var n=this._degreesSpring.update();if(e||t||i||n){this._updateForScale();return this._needsDraw=!0}return!1},draw:function(){if(0!==this.opacity||this._preload){this._midDraw=!0;this._updateViewport();this._midDraw=!1}else this._needsDraw=!1},destroy:function(){this.reset()},getBounds:function(e){return this.getBoundsNoRotate(e).rotate(this.getRotation(e),this._getRotationPoint(e))},getBoundsNoRotate:function(e){return e?new y.Rect(this._xSpring.current.value,this._ySpring.current.value,this._worldWidthCurrent,this._worldHeightCurrent):new y.Rect(this._xSpring.target.value,this._ySpring.target.value,this._worldWidthTarget,this._worldHeightTarget)},getWorldBounds:function(){y.console.error("[TiledImage.getWorldBounds] is deprecated; use TiledImage.getBounds instead");return this.getBounds()},getClippedBounds:function(e){var t=this.getBoundsNoRotate(e);if(this._clip){var i=(e?this._worldWidthCurrent:this._worldWidthTarget)/this.source.dimensions.x;var n=this._clip.times(i);t=new y.Rect(t.x+n.x,t.y+n.y,n.width,n.height)}return t.rotate(this.getRotation(e),this._getRotationPoint(e))},getContentSize:function(){return new y.Point(this.source.dimensions.x,this.source.dimensions.y)},_viewportToImageDelta:function(e,t,i){var n=i?this._scaleSpring.current.value:this._scaleSpring.target.value;return new y.Point(e*(this.source.dimensions.x/n),t*(this.source.dimensions.y*this.contentAspectX/n))},viewportToImageCoordinates:function(e,t,i){var n;if(e instanceof y.Point){i=t;n=e}else n=new y.Point(e,t);n=n.rotate(-this.getRotation(i),this._getRotationPoint(i));return i?this._viewportToImageDelta(n.x-this._xSpring.current.value,n.y-this._ySpring.current.value):this._viewportToImageDelta(n.x-this._xSpring.target.value,n.y-this._ySpring.target.value)},_imageToViewportDelta:function(e,t,i){var n=i?this._scaleSpring.current.value:this._scaleSpring.target.value;return new y.Point(e/this.source.dimensions.x*n,t/this.source.dimensions.y/this.contentAspectX*n)},imageToViewportCoordinates:function(e,t,i){if(e instanceof y.Point){i=t;t=e.y;e=e.x}var n=this._imageToViewportDelta(e,t);if(i){n.x+=this._xSpring.current.value;n.y+=this._ySpring.current.value}else{n.x+=this._xSpring.target.value;n.y+=this._ySpring.target.value}return n.rotate(this.getRotation(i),this._getRotationPoint(i))},imageToViewportRectangle:function(e,t,i,n,o){var r=e;r instanceof y.Rect?o=t:r=new y.Rect(e,t,i,n);var s=this.imageToViewportCoordinates(r.getTopLeft(),o);var a=this._imageToViewportDelta(r.width,r.height,o);return new y.Rect(s.x,s.y,a.x,a.y,r.degrees+this.getRotation(o))},viewportToImageRectangle:function(e,t,i,n,o){var r=e;e instanceof y.Rect?o=t:r=new y.Rect(e,t,i,n);var s=this.viewportToImageCoordinates(r.getTopLeft(),o);var a=this._viewportToImageDelta(r.width,r.height,o);return new y.Rect(s.x,s.y,a.x,a.y,r.degrees-this.getRotation(o))},viewerElementToImageCoordinates:function(e){var t=this.viewport.pointFromPixel(e,!0);return this.viewportToImageCoordinates(t)},imageToViewerElementCoordinates:function(e){var t=this.imageToViewportCoordinates(e);return this.viewport.pixelFromPoint(t,!0)},windowToImageCoordinates:function(e){var t=e.minus(OpenSeadragon.getElementPosition(this.viewer.element));return this.viewerElementToImageCoordinates(t)},imageToWindowCoordinates:function(e){return this.imageToViewerElementCoordinates(e).plus(OpenSeadragon.getElementPosition(this.viewer.element))},_viewportToTiledImageRectangle:function(e){var t=this._scaleSpring.current.value;e=e.rotate(-this.getRotation(!0),this._getRotationPoint(!0));return new y.Rect((e.x-this._xSpring.current.value)/t,(e.y-this._ySpring.current.value)/t,e.width/t,e.height/t,e.degrees)},viewportToImageZoom:function(e){return this._scaleSpring.current.value*this.viewport._containerInnerSize.x/this.source.dimensions.x*e},imageToViewportZoom:function(e){return e/(this._scaleSpring.current.value*this.viewport._containerInnerSize.x/this.source.dimensions.x)},setPosition:function(e,t){var i=this._xSpring.target.value===e.x&&this._ySpring.target.value===e.y;if(t){if(i&&this._xSpring.current.value===e.x&&this._ySpring.current.value===e.y)return;this._xSpring.resetTo(e.x);this._ySpring.resetTo(e.y);this._needsDraw=!0}else{if(i)return;this._xSpring.springTo(e.x);this._ySpring.springTo(e.y);this._needsDraw=!0}i||this._raiseBoundsChange()},setWidth:function(e,t){this._setScale(e,t)},setHeight:function(e,t){this._setScale(e/this.normHeight,t)},fitBounds:function(e,t,i){t=t||y.Placement.CENTER;var n=y.Placement.properties[t];var o=this.contentAspectX;var r=0;var s=0;var a=1;var l=1;if(this._clip){o=this._clip.getAspectRatio();a=this._clip.width/this.source.dimensions.x;l=this._clip.height/this.source.dimensions.y;if(e.getAspectRatio()>o){r=this._clip.x/this._clip.height*e.height;s=this._clip.y/this._clip.height*e.height}else{r=this._clip.x/this._clip.width*e.width;s=this._clip.y/this._clip.width*e.width}}if(e.getAspectRatio()>o){var h=e.height/l;var c=0;n.isHorizontallyCentered?c=(e.width-e.height*o)/2:n.isRight&&(c=e.width-e.height*o);this.setPosition(new y.Point(e.x-r+c,e.y-s),i);this.setHeight(h,i)}else{var u=e.width/a;var d=0;n.isVerticallyCentered?d=(e.height-e.width/o)/2:n.isBottom&&(d=e.height-e.width/o);this.setPosition(new y.Point(e.x-r,e.y-s+d),i);this.setWidth(u,i)}},getClip:function(){return this._clip?this._clip.clone():null},setClip:function(e){y.console.assert(!e||e instanceof y.Rect,"[TiledImage.setClip] newClip must be an OpenSeadragon.Rect or null");e instanceof y.Rect?this._clip=e.clone():this._clip=null;this._needsDraw=!0;this.raiseEvent("clip-change")},getOpacity:function(){return this.opacity},setOpacity:function(e){if(e!==this.opacity){this.opacity=e;this._needsDraw=!0;this.raiseEvent("opacity-change",{opacity:this.opacity})}},getPreload:function(){return this._preload},setPreload:function(e){this._preload=!!e;this._needsDraw=!0},getRotation:function(e){return e?this._degreesSpring.current.value:this._degreesSpring.target.value},setRotation:function(e,t){if(this._degreesSpring.target.value!==e||!this._degreesSpring.isAtTargetValue()){t?this._degreesSpring.resetTo(e):this._degreesSpring.springTo(e);this._needsDraw=!0;this._raiseBoundsChange()}},_getRotationPoint:function(e){return this.getBoundsNoRotate(e).getCenter()},getCompositeOperation:function(){return this.compositeOperation},setCompositeOperation:function(e){if(e!==this.compositeOperation){this.compositeOperation=e;this._needsDraw=!0;this.raiseEvent("composite-operation-change",{compositeOperation:this.compositeOperation})}},_setScale:function(e,t){var i=this._scaleSpring.target.value===e;if(t){if(i&&this._scaleSpring.current.value===e)return;this._scaleSpring.resetTo(e);this._updateForScale();this._needsDraw=!0}else{if(i)return;this._scaleSpring.springTo(e);this._updateForScale();this._needsDraw=!0}i||this._raiseBoundsChange()},_updateForScale:function(){this._worldWidthTarget=this._scaleSpring.target.value;this._worldHeightTarget=this.normHeight*this._scaleSpring.target.value;this._worldWidthCurrent=this._scaleSpring.current.value;this._worldHeightCurrent=this.normHeight*this._scaleSpring.current.value},_raiseBoundsChange:function(){this.raiseEvent("bounds-change")},_isBottomItem:function(){return this.viewer.world.getItemAt(0)===this},_getLevelsInterval:function(){var e=Math.max(this.source.minLevel,Math.floor(Math.log(this.minZoomImageRatio)/Math.log(2)));var t=this.viewport.deltaPixelsFromPointsNoRotate(this.source.getPixelRatio(0),!0).x*this._scaleSpring.current.value;var i=Math.min(Math.abs(this.source.maxLevel),Math.abs(Math.floor(Math.log(t/this.minPixelRatio)/Math.log(2))));i=Math.max(i,this.source.minLevel||0);return{lowestLevel:e=Math.min(e,i),highestLevel:i}},_updateViewport:function(){this._needsDraw=!1;this._tilesLoading=0;this.loadingCoverage={};for(;0<this.lastDrawn.length;){this.lastDrawn.pop().beingDrawn=!1}var e=this.viewport;var t=this._viewportToTiledImageRectangle(e.getBoundsWithMargins(!0));if(!this.wrapHorizontal&&!this.wrapVertical){var i=this._viewportToTiledImageRectangle(this.getClippedBounds(!0));if(null===(t=t.intersection(i)))return}var n=this._getLevelsInterval();var o=n.lowestLevel;var r=n.highestLevel;var s=null;var a=!1;var l=y.now();for(var h=r;o<=h;h--){var c=!1;var u=e.deltaPixelsFromPointsNoRotate(this.source.getPixelRatio(h),!0).x*this._scaleSpring.current.value;if(h===o||!a&&u>=this.minPixelRatio)a=c=!0;else if(!a)continue;var d=e.deltaPixelsFromPointsNoRotate(this.source.getPixelRatio(h),!1).x*this._scaleSpring.current.value;var p=e.deltaPixelsFromPointsNoRotate(this.source.getPixelRatio(Math.max(this.source.getClosestLevel(),0)),!1).x*this._scaleSpring.current.value;var g=this.immediateRender?1:p;s=m(this,a,c,h,Math.min(1,(u-.5)/.5),g/Math.abs(g-d),t,l,s);if(f(this.coverage,h))break}!function(e,t){if(0===e.opacity||0===t.length&&!e.placeholderFillStyle)return;var i=t[0];var n;i&&(n=e.opacity<1||e.compositeOperation&&"source-over"!==e.compositeOperation||!e._isBottomItem()&&i._hasTransparencyChannel());var o;var r;var s=e.viewport.getZoom(!0);var a=e.viewportToImageZoom(s);if(1<t.length&&a>e.smoothTileEdgesMinZoom&&!e.iOSDevice&&e.getRotation(!0)%360==0&&y.supportsCanvas){n=!0;o=i.getScaleForEdgeSmoothing();r=i.getTranslationForEdgeSmoothing(o,e._drawer.getCanvasSize(!1),e._drawer.getCanvasSize(!0))}var l;if(n){if(!o){l=e.viewport.viewportToViewerElementRectangle(e.getClippedBounds(!0)).getIntegerBoundingBox().times(y.pixelDensityRatio);e._drawer.viewer.viewport.getFlip()&&(0===e.viewport.degrees&&e.getRotation(!0)%360==0||(l.x=e._drawer.viewer.container.clientWidth-(l.x+l.width)))}e._drawer._clear(!0,l)}if(!o){0!==e.viewport.degrees&&e._drawer._offsetForRotation({degrees:e.viewport.degrees,useSketch:n});e.getRotation(!0)%360!=0&&e._drawer._offsetForRotation({degrees:e.getRotation(!0),point:e.viewport.pixelFromPointNoRotate(e._getRotationPoint(!0),!0),useSketch:n});0===e.viewport.degrees&&e.getRotation(!0)%360==0&&e._drawer.viewer.viewport.getFlip()&&e._drawer._flip()}var h=!1;if(e._clip){e._drawer.saveContext(n);var c=e.imageToViewportRectangle(e._clip,!0);c=c.rotate(-e.getRotation(!0),e._getRotationPoint(!0));var u=e._drawer.viewportToDrawerRectangle(c);o&&(u=u.times(o));r&&(u=u.translate(r));e._drawer.setClip(u,n);h=!0}if(e.placeholderFillStyle&&!1===e._hasOpaqueTile){var d=e._drawer.viewportToDrawerRectangle(e.getBounds(!0));o&&(d=d.times(o));r&&(d=d.translate(r));var p=null;p="function"==typeof e.placeholderFillStyle?e.placeholderFillStyle(e,e._drawer.context):e.placeholderFillStyle;e._drawer.drawRectangle(d,p,n)}for(var g=t.length-1;0<=g;g--){i=t[g];e._drawer.drawTile(i,e._drawingHandler,n,o,r);i.beingDrawn=!0;e.viewer&&e.viewer.raiseEvent("tile-drawn",{tiledImage:e,tile:i})}h&&e._drawer.restoreContext(n);if(!o){e.getRotation(!0)%360!=0&&e._drawer._restoreRotationChanges(n);0!==e.viewport.degrees&&e._drawer._restoreRotationChanges(n)}if(n){if(o){0!==e.viewport.degrees&&e._drawer._offsetForRotation({degrees:e.viewport.degrees,useSketch:!1});e.getRotation(!0)%360!=0&&e._drawer._offsetForRotation({degrees:e.getRotation(!0),point:e.viewport.pixelFromPointNoRotate(e._getRotationPoint(!0),!0),useSketch:!1})}e._drawer.blendSketch({opacity:e.opacity,scale:o,translate:r,compositeOperation:e.compositeOperation,bounds:l});if(o){e.getRotation(!0)%360!=0&&e._drawer._restoreRotationChanges(!1);0!==e.viewport.degrees&&e._drawer._restoreRotationChanges(!1)}}o||0===e.viewport.degrees&&e.getRotation(!0)%360==0&&e._drawer.viewer.viewport.getFlip()&&e._drawer._flip();!function(e,t){if(e.debugMode)for(var i=t.length-1;0<=i;i--){var n=t[i];try{e._drawer.drawDebugInfo(n,t.length,i,e)}catch(e){y.console.error(e)}}}(e,t)}(this,this.lastDrawn);if(s&&!s.context2D){!function(n,o,r){o.loading=!0;n._imageLoader.addJob({src:o.url,loadWithAjax:o.loadWithAjax,ajaxHeaders:o.ajaxHeaders,crossOriginPolicy:n.crossOriginPolicy,ajaxWithCredentials:n.ajaxWithCredentials,callback:function(e,t,i){!function(t,i,e,n,o,r){if(!n){y.console.log("Tile %s failed to load: %s - error: %s",i,i.url,o);t.viewer.raiseEvent("tile-load-failed",{tile:i,tiledImage:t,time:e,message:o,tileRequest:r});i.loading=!1;i.exists=!1;return}if(e<t.lastResetTime){y.console.log("Ignoring tile %s loaded before reset: %s",i,i.url);i.loading=!1;return}var s=function(){var e=t.source.getClosestLevel();v(t,i,n,e,r)};t._midDraw?window.setTimeout(s,1):s()}(n,o,r,e,t,i)},abort:function(){o.loading=!1}})}(this,s,l);this._needsDraw=!0;this._setFullyLoaded(!1)}else this._setFullyLoaded(0===this._tilesLoading)},_getCornerTiles:function(e,t,i){var n;var o;if(this.wrapHorizontal){n=y.positiveModulo(t.x,1);o=y.positiveModulo(i.x,1)}else{n=Math.max(0,t.x);o=Math.min(1,i.x)}var r;var s;var a=1/this.source.aspectRatio;if(this.wrapVertical){r=y.positiveModulo(t.y,a);s=y.positiveModulo(i.y,a)}else{r=Math.max(0,t.y);s=Math.min(a,i.y)}var l=this.source.getTileAtPoint(e,new y.Point(n,r));var h=this.source.getTileAtPoint(e,new y.Point(o,s));var c=this.source.getNumTiles(e);if(this.wrapHorizontal){l.x+=c.x*Math.floor(t.x);h.x+=c.x*Math.floor(i.x)}if(this.wrapVertical){l.y+=c.y*Math.floor(t.y/a);h.y+=c.y*Math.floor(i.y/a)}return{topLeft:l,bottomRight:h}}});function m(e,t,i,n,o,r,s,a,l){var h=s.getBoundingBox().getTopLeft();var c=s.getBoundingBox().getBottomRight();e.viewer&&e.viewer.raiseEvent("update-level",{tiledImage:e,havedrawn:t,level:n,opacity:o,visibility:r,drawArea:s,topleft:h,bottomright:c,currenttime:a,best:l});S(e.coverage,n);S(e.loadingCoverage,n);var u=e._getCornerTiles(n,h,c);var d=u.topLeft;var p=u.bottomRight;var g=e.source.getNumTiles(n);var m=e.viewport.pixelFromPoint(e.viewport.getCenter());for(var v=d.x;v<=p.x;v++)for(var f=d.y;f<=p.y;f++){if(!e.wrapHorizontal&&!e.wrapVertical){var w=e.source.getTileBounds(n,v,f);if(null===s.intersection(w))continue}l=T(e,i,t,v,f,n,o,r,m,g,a,l)}return l}function T(e,t,i,n,o,r,s,a,l,h,c,u){var d=function(e,t,i,n,o,r,s,a,l,h){var c,u,d,p,g,m,v,f,w;r[i]||(r[i]={});r[i][e]||(r[i][e]={});if(!r[i][e][t]){c=(a.x+e%a.x)%a.x;u=(a.y+t%a.y)%a.y;d=o.getTileBounds(i,c,u);p=o.getTileBounds(i,c,u,!0);g=o.tileExists(i,c,u);m=o.getTileUrl(i,c,u);if(n.loadTilesWithAjax){v=o.getTileAjaxHeaders(i,c,u);y.isPlainObject(n.ajaxHeaders)&&(v=y.extend({},n.ajaxHeaders,v))}else v=null;f=o.getContext2D?o.getContext2D(i,c,u):void 0;d.x+=(e-c)/a.x;d.y+=h/l*((t-u)/a.y);w=new y.Tile(i,e,t,d,g,m,f,n.loadTilesWithAjax,v,p);c===a.x-1&&(w.isRightMost=!0);u===a.y-1&&(w.isBottomMost=!0);r[i][e][t]=w}(w=r[i][e][t]).lastTouchTime=s;return w}(n,o,r,e,e.source,e.tilesMatrix,c,h,e._worldWidthCurrent,e._worldHeightCurrent),p=i;e.viewer&&e.viewer.raiseEvent("update-tile",{tiledImage:e,tile:d});x(e.coverage,r,n,o,!1);var g=d.loaded||d.loading||w(e.loadingCoverage,r,n,o);x(e.loadingCoverage,r,n,o,g);if(!d.exists)return u;t&&!p&&(w(e.coverage,r,n,o)?x(e.coverage,r,n,o,!0):p=!0);if(!p)return u;!function(e,t,i,n,o,r){var s=e.bounds.getTopLeft();s.x*=r._scaleSpring.current.value;s.y*=r._scaleSpring.current.value;s.x+=r._xSpring.current.value;s.y+=r._ySpring.current.value;var a=e.bounds.getSize();a.x*=r._scaleSpring.current.value;a.y*=r._scaleSpring.current.value;var l=i.pixelFromPointNoRotate(s,!0),h=i.pixelFromPointNoRotate(s,!1),c=i.deltaPixelsFromPointsNoRotate(a,!0),u=i.deltaPixelsFromPointsNoRotate(a,!1),d=h.plus(u.divide(2)),p=n.squaredDistanceTo(d);t||(c=c.plus(new y.Point(1,1)));e.isRightMost&&r.wrapHorizontal&&(c.x+=.75);e.isBottomMost&&r.wrapVertical&&(c.y+=.75);e.position=l;e.size=c;e.squaredDistance=p;e.visibility=o}(d,e.source.tileOverlap,e.viewport,l,a,e);if(!d.loaded)if(d.context2D)v(e,d);else{var m=e._tileCache.getImageRecord(d.cacheKey);if(m){v(e,d,m.getImage())}}if(d.loaded){(function(e,t,i,n,o,r,s){var a,l,h=1e3*e.blendTime;t.blendStart||(t.blendStart=s);a=s-t.blendStart;l=h?Math.min(1,a/h):1;e.alwaysBlend&&(l*=r);t.opacity=l;e.lastDrawn.push(t);if(1===l){x(e.coverage,o,i,n,!0);e._hasOpaqueTile=!0}else if(a<h)return!0;return!1})(e,d,n,o,r,s,c)&&(e._needsDraw=!0)}else d.loading?e._tilesLoading++:g||(u=function(e,t){if(!e)return t;{if(t.visibility>e.visibility)return t;if(t.visibility==e.visibility&&t.squaredDistance<e.squaredDistance)return t}return e}(u,d));return u}function v(e,t,i,n,o){var r=0;function s(){r++;return a}function a(){if(0===--r){t.loading=!1;t.loaded=!0;t.context2D||e._tileCache.cacheTile({image:i,tile:t,cutoff:n,tiledImage:e});e._needsDraw=!0}}e.viewer.raiseEvent("tile-loaded",{tile:t,tiledImage:e,tileRequest:o,image:i,getCompletionCallback:s});s()()}function f(e,t,i,n){var o,r,s,a;if(!e[t])return!1;if(void 0!==i&&void 0!==n)return void 0===e[t][i]||void 0===e[t][i][n]||!0===e[t][i][n];o=e[t];for(s in o)if(o.hasOwnProperty(s)){r=o[s];for(a in r)if(r.hasOwnProperty(a)&&!r[a])return!1}return!0}function w(e,t,i,n){return void 0===i||void 0===n?f(e,t+1):f(e,t+1,2*i,2*n)&&f(e,t+1,2*i,2*n+1)&&f(e,t+1,2*i+1,2*n)&&f(e,t+1,2*i+1,2*n+1)}function x(e,t,i,n,o){if(e[t]){e[t][i]||(e[t][i]={});e[t][i][n]=o}else y.console.warn("Setting coverage for a tile before its level's coverage has been reset: %s",t)}function S(e,t){e[t]={}}}(OpenSeadragon);!function(g){var m=function(e){g.console.assert(e,"[TileCache.cacheTile] options is required");g.console.assert(e.tile,"[TileCache.cacheTile] options.tile is required");g.console.assert(e.tiledImage,"[TileCache.cacheTile] options.tiledImage is required");this.tile=e.tile;this.tiledImage=e.tiledImage};var v=function(e){g.console.assert(e,"[ImageRecord] options is required");g.console.assert(e.image,"[ImageRecord] options.image is required");this._image=e.image;this._tiles=[]};v.prototype={destroy:function(){this._image=null;this._renderedContext=null;this._tiles=null},getImage:function(){return this._image},getRenderedContext:function(){if(!this._renderedContext){var e=document.createElement("canvas");e.width=this._image.width;e.height=this._image.height;this._renderedContext=e.getContext("2d");this._renderedContext.drawImage(this._image,0,0);this._image=null}return this._renderedContext},setRenderedContext:function(e){g.console.error("ImageRecord.setRenderedContext is deprecated. The rendered context should be created by the ImageRecord itself when calling ImageRecord.getRenderedContext.");this._renderedContext=e},addTile:function(e){g.console.assert(e,"[ImageRecord.addTile] tile is required");this._tiles.push(e)},removeTile:function(e){for(var t=0;t<this._tiles.length;t++)if(this._tiles[t]===e){this._tiles.splice(t,1);return}g.console.warn("[ImageRecord.removeTile] trying to remove unknown tile",e)},getTileCount:function(){return this._tiles.length}};g.TileCache=function(e){e=e||{};this._maxImageCacheCount=e.maxImageCacheCount||g.DEFAULT_SETTINGS.maxImageCacheCount;this._tilesLoaded=[];this._imagesLoaded=[];this._imagesLoadedCount=0};g.TileCache.prototype={numTilesLoaded:function(){return this._tilesLoaded.length},cacheTile:function(e){g.console.assert(e,"[TileCache.cacheTile] options is required");g.console.assert(e.tile,"[TileCache.cacheTile] options.tile is required");g.console.assert(e.tile.cacheKey,"[TileCache.cacheTile] options.tile.cacheKey is required");g.console.assert(e.tiledImage,"[TileCache.cacheTile] options.tiledImage is required");var t=e.cutoff||0;var i=this._tilesLoaded.length;var n=this._imagesLoaded[e.tile.cacheKey];if(!n){g.console.assert(e.image,"[TileCache.cacheTile] options.image is required to create an ImageRecord");n=this._imagesLoaded[e.tile.cacheKey]=new v({image:e.image});this._imagesLoadedCount++}n.addTile(e.tile);e.tile.cacheImageRecord=n;if(this._imagesLoadedCount>this._maxImageCacheCount){var o=null;var r=-1;var s=null;var a,l,h,c,u,d;for(var p=this._tilesLoaded.length-1;0<=p;p--)if(!((a=(d=this._tilesLoaded[p]).tile).level<=t||a.beingDrawn))if(o){c=a.lastTouchTime;l=o.lastTouchTime;u=a.level;h=o.level;if(c<l||c==l&&h<u){o=a;r=p;s=d}}else{o=a;r=p;s=d}if(o&&0<=r){this._unloadTile(s);i=r}}this._tilesLoaded[i]=new m({tile:e.tile,tiledImage:e.tiledImage})},clearTilesFor:function(e){g.console.assert(e,"[TileCache.clearTilesFor] tiledImage is required");var t;for(var i=0;i<this._tilesLoaded.length;++i)if((t=this._tilesLoaded[i]).tiledImage===e){this._unloadTile(t);this._tilesLoaded.splice(i,1);i--}},getImageRecord:function(e){g.console.assert(e,"[TileCache.getImageRecord] cacheKey is required");return this._imagesLoaded[e]},_unloadTile:function(e){g.console.assert(e,"[TileCache._unloadTile] tileRecord is required");var t=e.tile;var i=e.tiledImage;t.unload();t.cacheImageRecord=null;var n=this._imagesLoaded[t.cacheKey];n.removeTile(t);if(!n.getTileCount()){n.destroy();delete this._imagesLoaded[t.cacheKey];this._imagesLoadedCount--}i.viewer.raiseEvent("tile-unloaded",{tile:t,tiledImage:i})}}}(OpenSeadragon);!function(v){v.World=function(e){var t=this;v.console.assert(e.viewer,"[World] options.viewer is required");v.EventSource.call(this);this.viewer=e.viewer;this._items=[];this._needsDraw=!1;this._autoRefigureSizes=!0;this._needsSizesFigured=!1;this._delegatedFigureSizes=function(e){t._autoRefigureSizes?t._figureSizes():t._needsSizesFigured=!0};this._figureSizes()};v.extend(v.World.prototype,v.EventSource.prototype,{addItem:function(e,t){v.console.assert(e,"[World.addItem] item is required");v.console.assert(e instanceof v.TiledImage,"[World.addItem] only TiledImages supported at this time");if(void 0!==(t=t||{}).index){var i=Math.max(0,Math.min(this._items.length,t.index));this._items.splice(i,0,e)}else this._items.push(e);this._autoRefigureSizes?this._figureSizes():this._needsSizesFigured=!0;this._needsDraw=!0;e.addHandler("bounds-change",this._delegatedFigureSizes);e.addHandler("clip-change",this._delegatedFigureSizes);this.raiseEvent("add-item",{item:e})},getItemAt:function(e){v.console.assert(void 0!==e,"[World.getItemAt] index is required");return this._items[e]},getIndexOfItem:function(e){v.console.assert(e,"[World.getIndexOfItem] item is required");return v.indexOf(this._items,e)},getItemCount:function(){return this._items.length},setItemIndex:function(e,t){v.console.assert(e,"[World.setItemIndex] item is required");v.console.assert(void 0!==t,"[World.setItemIndex] index is required");var i=this.getIndexOfItem(e);if(t>=this._items.length)throw new Error("Index bigger than number of layers.");if(t!==i&&-1!==i){this._items.splice(i,1);this._items.splice(t,0,e);this._needsDraw=!0;this.raiseEvent("item-index-change",{item:e,previousIndex:i,newIndex:t})}},removeItem:function(e){v.console.assert(e,"[World.removeItem] item is required");var t=v.indexOf(this._items,e);if(-1!==t){e.removeHandler("bounds-change",this._delegatedFigureSizes);e.removeHandler("clip-change",this._delegatedFigureSizes);e.destroy();this._items.splice(t,1);this._figureSizes();this._needsDraw=!0;this._raiseRemoveItem(e)}},removeAll:function(){this.viewer._cancelPendingImages();var e;var t;for(t=0;t<this._items.length;t++){(e=this._items[t]).removeHandler("bounds-change",this._delegatedFigureSizes);e.removeHandler("clip-change",this._delegatedFigureSizes);e.destroy()}var i=this._items;this._items=[];this._figureSizes();this._needsDraw=!0;for(t=0;t<i.length;t++){e=i[t];this._raiseRemoveItem(e)}},resetItems:function(){for(var e=0;e<this._items.length;e++)this._items[e].reset()},update:function(){var e=!1;for(var t=0;t<this._items.length;t++)e=this._items[t].update()||e;return e},draw:function(){for(var e=0;e<this._items.length;e++)this._items[e].draw();this._needsDraw=!1},needsDraw:function(){for(var e=0;e<this._items.length;e++)if(this._items[e].needsDraw())return!0;return this._needsDraw},getHomeBounds:function(){return this._homeBounds.clone()},getContentFactor:function(){return this._contentFactor},setAutoRefigureSizes:function(e){if((this._autoRefigureSizes=e)&this._needsSizesFigured){this._figureSizes();this._needsSizesFigured=!1}},arrange:function(e){var t=(e=e||{}).immediately||!1;var i=e.layout||v.DEFAULT_SETTINGS.collectionLayout;var n=e.rows||v.DEFAULT_SETTINGS.collectionRows;var o=e.columns||v.DEFAULT_SETTINGS.collectionColumns;var r=e.tileSize||v.DEFAULT_SETTINGS.collectionTileSize;var s=r+(e.tileMargin||v.DEFAULT_SETTINGS.collectionTileMargin);var a;a=!e.rows&&o?o:Math.ceil(this._items.length/n);var l=0;var h=0;var c,u,d,p,g;this.setAutoRefigureSizes(!1);for(var m=0;m<this._items.length;m++){if(m&&m%a==0)if("horizontal"===i){h+=s;l=0}else{l+=s;h=0}p=(d=(u=(c=this._items[m]).getBounds()).width>u.height?r:r*(u.width/u.height))*(u.height/u.width);g=new v.Point(l+(r-d)/2,h+(r-p)/2);c.setPosition(g,t);c.setWidth(d,t);"horizontal"===i?l+=s:h+=s}this.setAutoRefigureSizes(!0)},_figureSizes:function(){var e=this._homeBounds?this._homeBounds.clone():null;var t=this._contentSize?this._contentSize.clone():null;var i=this._contentFactor||0;if(this._items.length){var n=this._items[0];var o=n.getBounds();this._contentFactor=n.getContentSize().x/o.width;var r=n.getClippedBounds().getBoundingBox();var s=r.x;var a=r.y;var l=r.x+r.width;var h=r.y+r.height;for(var c=1;c<this._items.length;c++){o=(n=this._items[c]).getBounds();this._contentFactor=Math.max(this._contentFactor,n.getContentSize().x/o.width);r=n.getClippedBounds().getBoundingBox();s=Math.min(s,r.x);a=Math.min(a,r.y);l=Math.max(l,r.x+r.width);h=Math.max(h,r.y+r.height)}this._homeBounds=new v.Rect(s,a,l-s,h-a);this._contentSize=new v.Point(this._homeBounds.width*this._contentFactor,this._homeBounds.height*this._contentFactor)}else{this._homeBounds=new v.Rect(0,0,1,1);this._contentSize=new v.Point(1,1);this._contentFactor=1}this._contentFactor===i&&this._homeBounds.equals(e)&&this._contentSize.equals(t)||this.raiseEvent("metrics-change",{})},_raiseRemoveItem:function(e){this.raiseEvent("remove-item",{item:e})}})}(OpenSeadragon);
//# sourceMappingURL=openseadragon.min.js.map
;// OpenSeadragon SVG Overlay plugin 0.0.5

(function() {

    var $ = window.OpenSeadragon;
    
    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }

    var svgNS = 'http://www.w3.org/2000/svg';

    // ----------
    $.Viewer.prototype.svgOverlay = function() {
        if (this._svgOverlayInfo) {
            return this._svgOverlayInfo;
        }

        this._svgOverlayInfo = new Overlay(this);
        return this._svgOverlayInfo;
    };

    // ----------
    var Overlay = function(viewer) {
        var self = this;

        this._viewer = viewer;
        this._containerWidth = 0;
        this._containerHeight = 0;

        this._svg = document.createElementNS(svgNS, 'svg');
        this._svg.style.position = 'absolute';
        this._svg.style.left = 0;
        this._svg.style.top = 0;
        this._svg.style.width = '100%';
        this._svg.style.height = '100%';
        this._viewer.canvas.appendChild(this._svg);

        this._node = document.createElementNS(svgNS, 'g');
        this._svg.appendChild(this._node);

        this._viewer.addHandler('animation', function() {
            self.resize();
        });

        this._viewer.addHandler('open', function() {
            self.resize();
        });

        this._viewer.addHandler('rotate', function(evt) {
            self.resize();
        });

        this._viewer.addHandler('resize', function() {
            self.resize();
        });

        this.resize();
    };

    // ----------
    Overlay.prototype = {
        // ----------
        node: function() {
            return this._node;
        },

        // ----------
        resize: function() {
            if (this._containerWidth !== this._viewer.container.clientWidth) {
                this._containerWidth = this._viewer.container.clientWidth;
                this._svg.setAttribute('width', this._containerWidth);
            }

            if (this._containerHeight !== this._viewer.container.clientHeight) {
                this._containerHeight = this._viewer.container.clientHeight;
                this._svg.setAttribute('height', this._containerHeight);
            }

            var p = this._viewer.viewport.pixelFromPoint(new $.Point(0, 0), true);
            var zoom = this._viewer.viewport.getZoom(true);
            var rotation = this._viewer.viewport.getRotation();
            // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
            var scale = this._viewer.viewport._containerInnerSize.x * zoom;
            this._node.setAttribute('transform',
                'translate(' + p.x + ',' + p.y + ') scale(' + scale + ') rotate(' + rotation + ')');
        },

        // ----------
        onClick: function(node, handler) {
            // TODO: Fast click for mobile browsers

            new $.MouseTracker({
                element: node,
                clickHandler: handler
            }).setTracking(true);
        }
    };

})();

;
//# sourceMappingURL=scripts.js.map