/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
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
  fences: noop,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
  nptable: noop,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
    + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  table: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
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

block.paragraph = edit(block.paragraph)
  .replace('hr', block.hr)
  .replace('heading', block.heading)
  .replace('lheading', block.lheading)
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
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = edit(block.paragraph)
  .replace('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  .getRegex();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
});

/**
 * Pedantic grammar
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
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/
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
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
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
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? rtrim(cap, '\n')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
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
    if (top && (cap = this.rules.nptable.exec(src))) {
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
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

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
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
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
        text: cap[0]
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
    if (top && (cap = this.rules.table.exec(src))) {
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/(?: *\| *)?\n$/, '').split('\n') : []
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
        depth: cap[2] === '=' ? 1 : 2,
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
  link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
};

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

inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;
inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f\\]*\)|[^\s\x00-\x1f()\\])*?)/;
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
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)
    .replace('email', inline._email)
    .getRegex(),
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: edit(inline.text)
    .replace(']|', '~]|')
    .replace('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|')
    .getRegex()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
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
      out += cap[1];
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
      do {
        prevCapZero = cap[0];
        cap[0] = this.rules._backpedal.exec(cap[0])[0];
      } while (prevCapZero !== cap[0]);
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(cap[0]);
        href = 'mailto:' + text;
      } else {
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + text;
        } else {
          href = text;
        }
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
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

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
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
}

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

Renderer.prototype.code = function(code, lang, escaped) {
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

Renderer.prototype.heading = function(text, level, raw) {
  if (this.options.headerIds) {
    return '<h'
      + level
      + ' id="'
      + this.options.headerPrefix
      + raw.toLowerCase().replace(/[^\w]+/g, '-')
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
}

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
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return text;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return text;
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
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
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
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
TextRenderer.prototype.text = function (text) {
  return text;
}

TextRenderer.prototype.link =
TextRenderer.prototype.image = function(href, title, text) {
  return '' + text;
}

TextRenderer.prototype.br = function() {
  return '';
}

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
    merge({}, this.options, {renderer: new TextRenderer()})
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
  return this.token = this.tokens.pop();
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
        unescape(this.inlineText.output(this.token.text)));
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

      if (this.token.task) {
        body += this.renderer.checkbox(this.token.checked);
      }

      while (this.next().type !== 'list_item_end') {
        body += !loose && this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
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
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
  var row = tableRow.replace(/\|/g, function (match, offset, str) {
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

    var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

    try {
      tokens = Lexer.lex(src, opt)
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

marked.getDefaults = function () {
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
    tables: true,
    xhtml: false
  };
}

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

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o, visited) {
			var type = _.util.type(o);
			visited = visited || {};

			switch (type) {
				case 'Object':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = {};
					visited[_.util.objId(o)] = clone;

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key], visited);
						}
					}

					return clone;

				case 'Array':
					if (visited[_.util.objId(o)]) {
						return visited[_.util.objId(o)];
					}
					var clone = [];
					visited[_.util.objId(o)] = clone;

					o.forEach(function (v, i) {
						clone[i] = _.util.clone(v, visited);
					});

					return clone;
			}

			return o;
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
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

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

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
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

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || container.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
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

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				_.hooks.run('before-highlight', env);
				env.element.textContent = env.code;
				_.hooks.run('after-highlight', env);
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
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
		var Token = _.Token;

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

	tokenize: function(text, grammar, language) {
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
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
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
		return _self.Prism;
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

	return _self.Prism;
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

return _self.Prism;

})();

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
		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
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
				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /(^|[^\\])["']/,
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

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\s\S]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css',
			greedy: true
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

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
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	},
	'constant': /\b[A-Z][A-Z\d_]*\b/
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\${[^}]+}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\${|}$/,
						alias: 'punctuation'
					},
					rest: null // See below
				}
			},
			'string': /[\s\S]+/
		}
	}
});
Prism.languages.javascript['template-string'].inside['interpolation'].inside.rest = Prism.languages.javascript;

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript',
			greedy: true
		}
	});
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

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

		Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
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

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();
;/* PrismJS 1.15.0
https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+css+clike+javascript+markup-templating+handlebars+scss+typescript&plugins=toolbar */
var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(){var e=/\blang(?:uage)?-([\w-]+)\b/i,t=0,n=_self.Prism={manual:_self.Prism&&_self.Prism.manual,disableWorkerMessageHandler:_self.Prism&&_self.Prism.disableWorkerMessageHandler,util:{encode:function(e){return e instanceof a?new a(e.type,n.util.encode(e.content),e.alias):"Array"===n.util.type(e)?e.map(n.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++t}),e.__id},clone:function(e,t){var a=n.util.type(e);switch(t=t||{},a){case"Object":if(t[n.util.objId(e)])return t[n.util.objId(e)];var r={};t[n.util.objId(e)]=r;for(var l in e)e.hasOwnProperty(l)&&(r[l]=n.util.clone(e[l],t));return r;case"Array":if(t[n.util.objId(e)])return t[n.util.objId(e)];var r=[];return t[n.util.objId(e)]=r,e.forEach(function(e,a){r[a]=n.util.clone(e,t)}),r}return e}},languages:{extend:function(e,t){var a=n.util.clone(n.languages[e]);for(var r in t)a[r]=t[r];return a},insertBefore:function(e,t,a,r){r=r||n.languages;var l=r[e],i={};for(var o in l)if(l.hasOwnProperty(o)){if(o==t)for(var s in a)a.hasOwnProperty(s)&&(i[s]=a[s]);a.hasOwnProperty(o)||(i[o]=l[o])}var u=r[e];return r[e]=i,n.languages.DFS(n.languages,function(t,n){n===u&&t!=e&&(this[t]=i)}),i},DFS:function(e,t,a,r){r=r||{};for(var l in e)e.hasOwnProperty(l)&&(t.call(e,l,e[l],a||l),"Object"!==n.util.type(e[l])||r[n.util.objId(e[l])]?"Array"!==n.util.type(e[l])||r[n.util.objId(e[l])]||(r[n.util.objId(e[l])]=!0,n.languages.DFS(e[l],t,l,r)):(r[n.util.objId(e[l])]=!0,n.languages.DFS(e[l],t,null,r)))}},plugins:{},highlightAll:function(e,t){n.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,a){var r={callback:a,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};n.hooks.run("before-highlightall",r);for(var l,i=r.elements||e.querySelectorAll(r.selector),o=0;l=i[o++];)n.highlightElement(l,t===!0,r.callback)},highlightElement:function(t,a,r){for(var l,i,o=t;o&&!e.test(o.className);)o=o.parentNode;o&&(l=(o.className.match(e)||[,""])[1].toLowerCase(),i=n.languages[l]),t.className=t.className.replace(e,"").replace(/\s+/g," ")+" language-"+l,t.parentNode&&(o=t.parentNode,/pre/i.test(o.nodeName)&&(o.className=o.className.replace(e,"").replace(/\s+/g," ")+" language-"+l));var s=t.textContent,u={element:t,language:l,grammar:i,code:s};if(n.hooks.run("before-sanity-check",u),!u.code||!u.grammar)return u.code&&(n.hooks.run("before-highlight",u),u.element.textContent=u.code,n.hooks.run("after-highlight",u)),n.hooks.run("complete",u),void 0;if(n.hooks.run("before-highlight",u),a&&_self.Worker){var g=new Worker(n.filename);g.onmessage=function(e){u.highlightedCode=e.data,n.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,n.hooks.run("after-highlight",u),n.hooks.run("complete",u),r&&r.call(u.element)},g.postMessage(JSON.stringify({language:u.language,code:u.code,immediateClose:!0}))}else u.highlightedCode=n.highlight(u.code,u.grammar,u.language),n.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,n.hooks.run("after-highlight",u),n.hooks.run("complete",u),r&&r.call(t)},highlight:function(e,t,r){var l={code:e,grammar:t,language:r};return n.hooks.run("before-tokenize",l),l.tokens=n.tokenize(l.code,l.grammar),n.hooks.run("after-tokenize",l),a.stringify(n.util.encode(l.tokens),l.language)},matchGrammar:function(e,t,a,r,l,i,o){var s=n.Token;for(var u in a)if(a.hasOwnProperty(u)&&a[u]){if(u==o)return;var g=a[u];g="Array"===n.util.type(g)?g:[g];for(var c=0;c<g.length;++c){var h=g[c],f=h.inside,d=!!h.lookbehind,m=!!h.greedy,p=0,y=h.alias;if(m&&!h.pattern.global){var v=h.pattern.toString().match(/[imuy]*$/)[0];h.pattern=RegExp(h.pattern.source,v+"g")}h=h.pattern||h;for(var b=r,k=l;b<t.length;k+=t[b].length,++b){var w=t[b];if(t.length>e.length)return;if(!(w instanceof s)){if(m&&b!=t.length-1){h.lastIndex=k;var _=h.exec(e);if(!_)break;for(var j=_.index+(d?_[1].length:0),P=_.index+_[0].length,A=b,x=k,O=t.length;O>A&&(P>x||!t[A].type&&!t[A-1].greedy);++A)x+=t[A].length,j>=x&&(++b,k=x);if(t[b]instanceof s)continue;I=A-b,w=e.slice(k,x),_.index-=k}else{h.lastIndex=0;var _=h.exec(w),I=1}if(_){d&&(p=_[1]?_[1].length:0);var j=_.index+p,_=_[0].slice(p),P=j+_.length,N=w.slice(0,j),S=w.slice(P),C=[b,I];N&&(++b,k+=N.length,C.push(N));var E=new s(u,f?n.tokenize(_,f):_,y,_,m);if(C.push(E),S&&C.push(S),Array.prototype.splice.apply(t,C),1!=I&&n.matchGrammar(e,t,a,b,k,!0,u),i)break}else if(i)break}}}}},tokenize:function(e,t){var a=[e],r=t.rest;if(r){for(var l in r)t[l]=r[l];delete t.rest}return n.matchGrammar(e,a,t,0,0,!1),a},hooks:{all:{},add:function(e,t){var a=n.hooks.all;a[e]=a[e]||[],a[e].push(t)},run:function(e,t){var a=n.hooks.all[e];if(a&&a.length)for(var r,l=0;r=a[l++];)r(t)}}},a=n.Token=function(e,t,n,a,r){this.type=e,this.content=t,this.alias=n,this.length=0|(a||"").length,this.greedy=!!r};if(a.stringify=function(e,t,r){if("string"==typeof e)return e;if("Array"===n.util.type(e))return e.map(function(n){return a.stringify(n,t,e)}).join("");var l={type:e.type,content:a.stringify(e.content,t,r),tag:"span",classes:["token",e.type],attributes:{},language:t,parent:r};if(e.alias){var i="Array"===n.util.type(e.alias)?e.alias:[e.alias];Array.prototype.push.apply(l.classes,i)}n.hooks.run("wrap",l);var o=Object.keys(l.attributes).map(function(e){return e+'="'+(l.attributes[e]||"").replace(/"/g,"&quot;")+'"'}).join(" ");return"<"+l.tag+' class="'+l.classes.join(" ")+'"'+(o?" "+o:"")+">"+l.content+"</"+l.tag+">"},!_self.document)return _self.addEventListener?(n.disableWorkerMessageHandler||_self.addEventListener("message",function(e){var t=JSON.parse(e.data),a=t.language,r=t.code,l=t.immediateClose;_self.postMessage(n.highlight(r,n.languages[a],a)),l&&_self.close()},!1),_self.Prism):_self.Prism;var r=document.currentScript||[].slice.call(document.getElementsByTagName("script")).pop();return r&&(n.filename=r.src,n.manual||r.hasAttribute("data-manual")||("loading"!==document.readyState?window.requestAnimationFrame?window.requestAnimationFrame(n.highlightAll):window.setTimeout(n.highlightAll,16):document.addEventListener("DOMContentLoaded",n.highlightAll))),_self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism),"undefined"!=typeof global&&(global.Prism=Prism);
Prism.languages.markup={comment:/<!--[\s\S]*?-->/,prolog:/<\?[\s\S]+?\?>/,doctype:/<!DOCTYPE[\s\S]+?>/i,cdata:/<!\[CDATA\[[\s\S]*?]]>/i,tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/i,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"attr-value":{pattern:/=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,inside:{punctuation:[/^=/,{pattern:/(^|[^\\])["']/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:/&#?[\da-z]{1,8};/i},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.hooks.add("wrap",function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))}),Prism.languages.xml=Prism.languages.markup,Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup;
Prism.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:/@[\w-]+?.*?(?:;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:/url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,selector:/[^{}\s][^{};]*?(?=\s*\{)/,string:{pattern:/("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},property:/[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,important:/!important\b/i,"function":/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:,]/},Prism.languages.css.atrule.inside.rest=Prism.languages.css,Prism.languages.markup&&(Prism.languages.insertBefore("markup","tag",{style:{pattern:/(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,lookbehind:!0,inside:Prism.languages.css,alias:"language-css",greedy:!0}}),Prism.languages.insertBefore("inside","attr-value",{"style-attr":{pattern:/\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:Prism.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:Prism.languages.css}},alias:"language-css"}},Prism.languages.markup.tag));
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,"boolean":/\b(?:true|false)\b/,"function":/\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/};
Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,lookbehind:!0}],keyword:[{pattern:/((?:^|})\s*)(?:catch|finally)\b/,lookbehind:!0},/\b(?:as|async|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/],number:/\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,"function":/[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\(|\.(?:apply|bind|call)\()/,operator:/-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/}),Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/,Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,lookbehind:!0,greedy:!0},"function-variable":{pattern:/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,alias:"function"},parameter:[{pattern:/(function(?:\s+[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)[^\s()][^()]*?(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/,inside:Prism.languages.javascript},{pattern:/(\(\s*)[^\s()][^()]*?(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)[^\s()][^()]*?(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z][A-Z\d_]*\b/}),Prism.languages.insertBefore("javascript","string",{"template-string":{pattern:/`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,greedy:!0,inside:{interpolation:{pattern:/\${[^}]+}/,inside:{"interpolation-punctuation":{pattern:/^\${|}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}}}),Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,lookbehind:!0,inside:Prism.languages.javascript,alias:"language-javascript",greedy:!0}}),Prism.languages.js=Prism.languages.javascript;
Prism.languages["markup-templating"]={},Object.defineProperties(Prism.languages["markup-templating"],{buildPlaceholders:{value:function(e,t,n,a){e.language===t&&(e.tokenStack=[],e.code=e.code.replace(n,function(n){if("function"==typeof a&&!a(n))return n;for(var r=e.tokenStack.length;-1!==e.code.indexOf("___"+t.toUpperCase()+r+"___");)++r;return e.tokenStack[r]=n,"___"+t.toUpperCase()+r+"___"}),e.grammar=Prism.languages.markup)}},tokenizePlaceholders:{value:function(e,t){if(e.language===t&&e.tokenStack){e.grammar=Prism.languages[t];var n=0,a=Object.keys(e.tokenStack),r=function(o){if(!(n>=a.length))for(var i=0;i<o.length;i++){var g=o[i];if("string"==typeof g||g.content&&"string"==typeof g.content){var c=a[n],s=e.tokenStack[c],l="string"==typeof g?g:g.content,p=l.indexOf("___"+t.toUpperCase()+c+"___");if(p>-1){++n;var f,u=l.substring(0,p),_=new Prism.Token(t,Prism.tokenize(s,e.grammar,t),"language-"+t,s),k=l.substring(p+("___"+t.toUpperCase()+c+"___").length);if(u||k?(f=[u,_,k].filter(function(e){return!!e}),r(f)):f=_,"string"==typeof g?Array.prototype.splice.apply(o,[i,1].concat(f)):g.content=f,n>=a.length)break}}else g.content&&"string"!=typeof g.content&&r(g.content)}};r(e.tokens)}}}});
!function(a){a.languages.handlebars={comment:/\{\{![\s\S]*?\}\}/,delimiter:{pattern:/^\{\{\{?|\}\}\}?$/i,alias:"punctuation"},string:/(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,number:/\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,"boolean":/\b(?:true|false)\b/,block:{pattern:/^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,lookbehind:!0,alias:"keyword"},brackets:{pattern:/\[[^\]]+\]/,inside:{punctuation:/\[|\]/,variable:/[\s\S]+/}},punctuation:/[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,variable:/[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~\s]+/},a.hooks.add("before-tokenize",function(e){var n=/\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g;a.languages["markup-templating"].buildPlaceholders(e,"handlebars",n)}),a.hooks.add("after-tokenize",function(e){a.languages["markup-templating"].tokenizePlaceholders(e,"handlebars")})}(Prism);
Prism.languages.scss=Prism.languages.extend("css",{comment:{pattern:/(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,lookbehind:!0},atrule:{pattern:/@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,inside:{rule:/@[\w-]+/}},url:/(?:[-a-z]+-)*url(?=\()/i,selector:{pattern:/(?=\S)[^@;{}()]?(?:[^@;{}()]|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,inside:{parent:{pattern:/&/,alias:"important"},placeholder:/%[-\w]+/,variable:/\$[-\w]+|#\{\$[-\w]+\}/}},property:{pattern:/(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/,inside:{variable:/\$[-\w]+|#\{\$[-\w]+\}/}}}),Prism.languages.insertBefore("scss","atrule",{keyword:[/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,{pattern:/( +)(?:from|through)(?= )/,lookbehind:!0}]}),Prism.languages.insertBefore("scss","important",{variable:/\$[-\w]+|#\{\$[-\w]+\}/}),Prism.languages.insertBefore("scss","function",{placeholder:{pattern:/%[-\w]+/,alias:"selector"},statement:{pattern:/\B!(?:default|optional)\b/i,alias:"keyword"},"boolean":/\b(?:true|false)\b/,"null":/\bnull\b/,operator:{pattern:/(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,lookbehind:!0}}),Prism.languages.scss.atrule.inside.rest=Prism.languages.scss;
Prism.languages.typescript=Prism.languages.extend("javascript",{keyword:/\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,builtin:/\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/}),Prism.languages.ts=Prism.languages.typescript;
!function(){if("undefined"!=typeof self&&self.Prism&&self.document){var t=[],e={},n=function(){};Prism.plugins.toolbar={};var a=Prism.plugins.toolbar.registerButton=function(n,a){var o;o="function"==typeof a?a:function(t){var e;return"function"==typeof a.onClick?(e=document.createElement("button"),e.type="button",e.addEventListener("click",function(){a.onClick.call(this,t)})):"string"==typeof a.url?(e=document.createElement("a"),e.href=a.url):e=document.createElement("span"),e.textContent=a.text,e},t.push(e[n]=o)},o=Prism.plugins.toolbar.hook=function(a){var o=a.element.parentNode;if(o&&/pre/i.test(o.nodeName)&&!o.parentNode.classList.contains("code-toolbar")){var r=document.createElement("div");r.classList.add("code-toolbar"),o.parentNode.insertBefore(r,o),r.appendChild(o);var i=document.createElement("div");i.classList.add("toolbar"),document.body.hasAttribute("data-toolbar-order")&&(t=document.body.getAttribute("data-toolbar-order").split(",").map(function(t){return e[t]||n})),t.forEach(function(t){var e=t(a);if(e){var n=document.createElement("div");n.classList.add("toolbar-item"),n.appendChild(e),i.appendChild(n)}}),r.appendChild(i)}};a("label",function(t){var e=t.element.parentNode;if(e&&/pre/i.test(e.nodeName)&&e.hasAttribute("data-label")){var n,a,o=e.getAttribute("data-label");try{a=document.querySelector("template#"+o)}catch(r){}return a?n=a.content:(e.hasAttribute("data-url")?(n=document.createElement("a"),n.href=e.getAttribute("data-url")):n=document.createElement("span"),n.textContent=o),n}}),Prism.hooks.add("complete",o)}}();

;//! openseadragon 2.4.0
//! Built on 2018-07-20
//! Git commit: v2.4.0-0-446af4d
//! http://openseadragon.github.io
//! License: http://openseadragon.github.io/license/


function OpenSeadragon(e){return new OpenSeadragon.Viewer(e)}!function(e){e.version={versionStr:"2.4.0",major:parseInt("2",10),minor:parseInt("4",10),revision:parseInt("0",10)};var t={"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regexp","[object Object]":"object"},i=Object.prototype.toString,n=Object.prototype.hasOwnProperty;e.isFunction=function(t){return"function"===e.type(t)};e.isArray=Array.isArray||function(t){return"array"===e.type(t)};e.isWindow=function(e){return e&&"object"==typeof e&&"setInterval"in e};e.type=function(e){return null===e||void 0===e?String(e):t[i.call(e)]||"object"};e.isPlainObject=function(t){if(!t||"object"!==OpenSeadragon.type(t)||t.nodeType||e.isWindow(t))return!1;if(t.constructor&&!n.call(t,"constructor")&&!n.call(t.constructor.prototype,"isPrototypeOf"))return!1;var i;for(var o in t)i=o;return void 0===i||n.call(t,i)};e.isEmptyObject=function(e){for(var t in e)return!1;return!0};e.freezeObject=function(t){Object.freeze?e.freezeObject=Object.freeze:e.freezeObject=function(e){return e};return e.freezeObject(t)};e.supportsCanvas=function(){var t=document.createElement("canvas");return!(!e.isFunction(t.getContext)||!t.getContext("2d"))}();e.isCanvasTainted=function(e){var t=!1;try{e.getContext("2d").getImageData(0,0,1,1)}catch(e){t=!0}return t};e.pixelDensityRatio=function(){if(e.supportsCanvas){var t=document.createElement("canvas").getContext("2d");var i=window.devicePixelRatio||1;var n=t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1;return Math.max(i,1)/n}return 1}()}(OpenSeadragon);!function($){$.extend=function(){var e,t,i,n,o,r,s=arguments[0]||{},a=arguments.length,l=!1,h=1;if("boolean"==typeof s){l=s;s=arguments[1]||{};h=2}"object"==typeof s||OpenSeadragon.isFunction(s)||(s={});if(a===h){s=this;--h}for(;h<a;h++)if(null!==(e=arguments[h])||void 0!==e)for(t in e){i=s[t];if(s!==(n=e[t]))if(l&&n&&(OpenSeadragon.isPlainObject(n)||(o=OpenSeadragon.isArray(n)))){if(o){o=!1;r=i&&OpenSeadragon.isArray(i)?i:[]}else r=i&&OpenSeadragon.isPlainObject(i)?i:{};s[t]=OpenSeadragon.extend(l,r,n)}else void 0!==n&&(s[t]=n)}return s};var isIOSDevice=function(){if("object"!=typeof navigator)return!1;var e=navigator.userAgent;return"string"==typeof e&&(-1!==e.indexOf("iPhone")||-1!==e.indexOf("iPad")||-1!==e.indexOf("iPod"))};$.extend($,{DEFAULT_SETTINGS:{xmlPath:null,tileSources:null,tileHost:null,initialPage:0,crossOriginPolicy:!1,ajaxWithCredentials:!1,loadTilesWithAjax:!1,ajaxHeaders:{},panHorizontal:!0,panVertical:!0,constrainDuringPan:!1,wrapHorizontal:!1,wrapVertical:!1,visibilityRatio:.5,minPixelRatio:.5,defaultZoomLevel:0,minZoomLevel:null,maxZoomLevel:null,homeFillsViewer:!1,clickTimeThreshold:300,clickDistThreshold:5,dblClickTimeThreshold:300,dblClickDistThreshold:20,springStiffness:6.5,animationTime:1.2,gestureSettingsMouse:{scrollToZoom:!0,clickToZoom:!0,dblClickToZoom:!1,pinchToZoom:!1,zoomToRefPoint:!0,flickEnabled:!1,flickMinSpeed:120,flickMomentum:.25,pinchRotate:!1},gestureSettingsTouch:{scrollToZoom:!1,clickToZoom:!1,dblClickToZoom:!0,pinchToZoom:!0,zoomToRefPoint:!0,flickEnabled:!0,flickMinSpeed:120,flickMomentum:.25,pinchRotate:!1},gestureSettingsPen:{scrollToZoom:!1,clickToZoom:!0,dblClickToZoom:!1,pinchToZoom:!1,zoomToRefPoint:!0,flickEnabled:!1,flickMinSpeed:120,flickMomentum:.25,pinchRotate:!1},gestureSettingsUnknown:{scrollToZoom:!1,clickToZoom:!1,dblClickToZoom:!0,pinchToZoom:!0,zoomToRefPoint:!0,flickEnabled:!0,flickMinSpeed:120,flickMomentum:.25,pinchRotate:!1},zoomPerClick:2,zoomPerScroll:1.2,zoomPerSecond:1,blendTime:0,alwaysBlend:!1,autoHideControls:!0,immediateRender:!1,minZoomImageRatio:.9,maxZoomPixelRatio:1.1,smoothTileEdgesMinZoom:1.1,iOSDevice:isIOSDevice(),pixelsPerWheelLine:40,pixelsPerArrowPress:40,autoResize:!0,preserveImageSizeOnResize:!1,minScrollDeltaTime:50,showSequenceControl:!0,sequenceControlAnchor:null,preserveViewport:!1,preserveOverlays:!1,navPrevNextWrap:!1,showNavigationControl:!0,navigationControlAnchor:null,showZoomControl:!0,showHomeControl:!0,showFullPageControl:!0,showRotationControl:!1,showFlipControl:!1,controlsFadeDelay:2e3,controlsFadeLength:1500,mouseNavEnabled:!0,showNavigator:!1,navigatorId:null,navigatorPosition:null,navigatorSizeRatio:.2,navigatorMaintainSizeRatio:!1,navigatorTop:null,navigatorLeft:null,navigatorHeight:null,navigatorWidth:null,navigatorAutoResize:!0,navigatorAutoFade:!0,navigatorRotate:!0,navigatorBackground:"#000",navigatorOpacity:.8,navigatorBorderColor:"#555",navigatorDisplayRegionColor:"#900",degrees:0,flipped:!1,opacity:1,preload:!1,compositeOperation:null,placeholderFillStyle:null,showReferenceStrip:!1,referenceStripScroll:"horizontal",referenceStripElement:null,referenceStripHeight:null,referenceStripWidth:null,referenceStripPosition:"BOTTOM_LEFT",referenceStripSizeRatio:.2,collectionRows:3,collectionColumns:0,collectionLayout:"horizontal",collectionMode:!1,collectionTileSize:800,collectionTileMargin:80,imageLoaderLimit:0,maxImageCacheCount:200,timeout:3e4,useCanvas:!0,prefixUrl:"/images/",navImages:{zoomIn:{REST:"zoomin_rest.png",GROUP:"zoomin_grouphover.png",HOVER:"zoomin_hover.png",DOWN:"zoomin_pressed.png"},zoomOut:{REST:"zoomout_rest.png",GROUP:"zoomout_grouphover.png",HOVER:"zoomout_hover.png",DOWN:"zoomout_pressed.png"},home:{REST:"home_rest.png",GROUP:"home_grouphover.png",HOVER:"home_hover.png",DOWN:"home_pressed.png"},fullpage:{REST:"fullpage_rest.png",GROUP:"fullpage_grouphover.png",HOVER:"fullpage_hover.png",DOWN:"fullpage_pressed.png"},rotateleft:{REST:"rotateleft_rest.png",GROUP:"rotateleft_grouphover.png",HOVER:"rotateleft_hover.png",DOWN:"rotateleft_pressed.png"},rotateright:{REST:"rotateright_rest.png",GROUP:"rotateright_grouphover.png",HOVER:"rotateright_hover.png",DOWN:"rotateright_pressed.png"},flip:{REST:"flip_rest.png",GROUP:"flip_grouphover.png",HOVER:"flip_hover.png",DOWN:"flip_pressed.png"},previous:{REST:"previous_rest.png",GROUP:"previous_grouphover.png",HOVER:"previous_hover.png",DOWN:"previous_pressed.png"},next:{REST:"next_rest.png",GROUP:"next_grouphover.png",HOVER:"next_hover.png",DOWN:"next_pressed.png"}},debugMode:!1,debugGridColor:["#437AB2","#1B9E77","#D95F02","#7570B3","#E7298A","#66A61E","#E6AB02","#A6761D","#666666"]},SIGNAL:"----seadragon----",delegate:function(e,t){return function(){var i=arguments;void 0===i&&(i=[]);return t.apply(e,i)}},BROWSERS:{UNKNOWN:0,IE:1,FIREFOX:2,SAFARI:3,CHROME:4,OPERA:5},getElement:function(e){"string"==typeof e&&(e=document.getElementById(e));return e},getElementPosition:function(e){var t,i,n=new $.Point;i=getOffsetParent(e=$.getElement(e),t="fixed"==$.getElementStyle(e).position);for(;i;){n.x+=e.offsetLeft;n.y+=e.offsetTop;t&&(n=n.plus($.getPageScroll()));i=getOffsetParent(e=i,t="fixed"==$.getElementStyle(e).position)}return n},getElementOffset:function(e){var t,i,n=(e=$.getElement(e))&&e.ownerDocument,o={top:0,left:0};if(!n)return new $.Point;t=n.documentElement;void 0!==e.getBoundingClientRect&&(o=e.getBoundingClientRect());i=n==n.window?n:9===n.nodeType&&(n.defaultView||n.parentWindow);return new $.Point(o.left+(i.pageXOffset||t.scrollLeft)-(t.clientLeft||0),o.top+(i.pageYOffset||t.scrollTop)-(t.clientTop||0))},getElementSize:function(e){e=$.getElement(e);return new $.Point(e.clientWidth,e.clientHeight)},getElementStyle:document.documentElement.currentStyle?function(e){return(e=$.getElement(e)).currentStyle}:function(e){e=$.getElement(e);return window.getComputedStyle(e,"")},getCssPropertyWithVendorPrefix:function(e){var t={};$.getCssPropertyWithVendorPrefix=function(e){if(void 0!==t[e])return t[e];var i=document.createElement("div").style;var n=null;if(void 0!==i[e])n=e;else{var o=["Webkit","Moz","MS","O","webkit","moz","ms","o"];var r=$.capitalizeFirstLetter(e);for(var s=0;s<o.length;s++){var a=o[s]+r;if(void 0!==i[a]){n=a;break}}}t[e]=n;return n};return $.getCssPropertyWithVendorPrefix(e)},capitalizeFirstLetter:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},positiveModulo:function(e,t){var i=e%t;i<0&&(i+=t);return i},pointInElement:function(e,t){e=$.getElement(e);var i=$.getElementOffset(e),n=$.getElementSize(e);return t.x>=i.x&&t.x<i.x+n.x&&t.y<i.y+n.y&&t.y>=i.y},getEvent:function(e){$.getEvent=e?function(e){return e}:function(){return window.event};return $.getEvent(e)},getMousePosition:function(e){if("number"==typeof e.pageX)$.getMousePosition=function(e){var t=new $.Point;e=$.getEvent(e);t.x=e.pageX;t.y=e.pageY;return t};else{if("number"!=typeof e.clientX)throw new Error("Unknown event mouse position, no known technique.");$.getMousePosition=function(e){var t=new $.Point;e=$.getEvent(e);t.x=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;t.y=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;return t}}return $.getMousePosition(e)},getPageScroll:function(){var e=document.documentElement||{},t=document.body||{};if("number"==typeof window.pageXOffset)$.getPageScroll=function(){return new $.Point(window.pageXOffset,window.pageYOffset)};else if(t.scrollLeft||t.scrollTop)$.getPageScroll=function(){return new $.Point(document.body.scrollLeft,document.body.scrollTop)};else{if(!e.scrollLeft&&!e.scrollTop)return new $.Point(0,0);$.getPageScroll=function(){return new $.Point(document.documentElement.scrollLeft,document.documentElement.scrollTop)}}return $.getPageScroll()},setPageScroll:function(e){if(void 0!==window.scrollTo)$.setPageScroll=function(e){window.scrollTo(e.x,e.y)};else{var t=$.getPageScroll();if(t.x===e.x&&t.y===e.y)return;document.body.scrollLeft=e.x;document.body.scrollTop=e.y;var i=$.getPageScroll();if(i.x!==t.x&&i.y!==t.y){$.setPageScroll=function(e){document.body.scrollLeft=e.x;document.body.scrollTop=e.y};return}document.documentElement.scrollLeft=e.x;document.documentElement.scrollTop=e.y;if((i=$.getPageScroll()).x!==t.x&&i.y!==t.y){$.setPageScroll=function(e){document.documentElement.scrollLeft=e.x;document.documentElement.scrollTop=e.y};return}$.setPageScroll=function(e){}}return $.setPageScroll(e)},getWindowSize:function(){var e=document.documentElement||{},t=document.body||{};if("number"==typeof window.innerWidth)$.getWindowSize=function(){return new $.Point(window.innerWidth,window.innerHeight)};else if(e.clientWidth||e.clientHeight)$.getWindowSize=function(){return new $.Point(document.documentElement.clientWidth,document.documentElement.clientHeight)};else{if(!t.clientWidth&&!t.clientHeight)throw new Error("Unknown window size, no known technique.");$.getWindowSize=function(){return new $.Point(document.body.clientWidth,document.body.clientHeight)}}return $.getWindowSize()},makeCenteredNode:function(e){e=$.getElement(e);var t=[$.makeNeutralElement("div"),$.makeNeutralElement("div"),$.makeNeutralElement("div")];$.extend(t[0].style,{display:"table",height:"100%",width:"100%"});$.extend(t[1].style,{display:"table-row"});$.extend(t[2].style,{display:"table-cell",verticalAlign:"middle",textAlign:"center"});t[0].appendChild(t[1]);t[1].appendChild(t[2]);t[2].appendChild(e);return t[0]},makeNeutralElement:function(e){var t=document.createElement(e),i=t.style;i.background="transparent none";i.border="none";i.margin="0px";i.padding="0px";i.position="static";return t},now:function(){Date.now?$.now=Date.now:$.now=function(){return(new Date).getTime()};return $.now()},makeTransparentImage:function(e){$.makeTransparentImage=function(e){var t=$.makeNeutralElement("img");t.src=e;return t};$.Browser.vendor==$.BROWSERS.IE&&$.Browser.version<7&&($.makeTransparentImage=function(e){var t=$.makeNeutralElement("img"),i=null;(i=$.makeNeutralElement("span")).style.display="inline-block";t.onload=function(){i.style.width=i.style.width||t.width+"px";i.style.height=i.style.height||t.height+"px";t.onload=null;t=null};t.src=e;i.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+e+"', sizingMethod='scale')";return i});return $.makeTransparentImage(e)},setElementOpacity:function(e,t,i){var n;e=$.getElement(e);i&&!$.Browser.alpha&&(t=Math.round(t));if($.Browser.opacity)e.style.opacity=t<1?t:"";else if(t<1){n="alpha(opacity="+Math.round(100*t)+")";e.style.filter=n}else e.style.filter=""},setElementTouchActionNone:function(e){void 0!==(e=$.getElement(e)).style.touchAction?e.style.touchAction="none":void 0!==e.style.msTouchAction&&(e.style.msTouchAction="none")},addClass:function(e,t){(e=$.getElement(e)).className?-1===(" "+e.className+" ").indexOf(" "+t+" ")&&(e.className+=" "+t):e.className=t},indexOf:function(e,t,i){Array.prototype.indexOf?this.indexOf=function(e,t,i){return e.indexOf(t,i)}:this.indexOf=function(e,t,i){var n,o,r=i||0;if(!e)throw new TypeError;if(0===(o=e.length)||r>=o)return-1;r<0&&(r=o-Math.abs(r));for(n=r;n<o;n++)if(e[n]===t)return n;return-1};return this.indexOf(e,t,i)},removeClass:function(e,t){var i,n,o=[];i=(e=$.getElement(e)).className.split(/\s+/);for(n=0;n<i.length;n++)i[n]&&i[n]!==t&&o.push(i[n]);e.className=o.join(" ")},addEvent:function(){if(window.addEventListener)return function(e,t,i,n){(e=$.getElement(e)).addEventListener(t,i,n)};if(window.attachEvent)return function(e,t,i,n){(e=$.getElement(e)).attachEvent("on"+t,i)};throw new Error("No known event model.")}(),removeEvent:function(){if(window.removeEventListener)return function(e,t,i,n){(e=$.getElement(e)).removeEventListener(t,i,n)};if(window.detachEvent)return function(e,t,i,n){(e=$.getElement(e)).detachEvent("on"+t,i)};throw new Error("No known event model.")}(),cancelEvent:function(e){(e=$.getEvent(e)).preventDefault?$.cancelEvent=function(e){e.preventDefault()}:$.cancelEvent=function(e){(e=$.getEvent(e)).cancel=!0;e.returnValue=!1};$.cancelEvent(e)},stopEvent:function(e){(e=$.getEvent(e)).stopPropagation?$.stopEvent=function(e){e.stopPropagation()}:$.stopEvent=function(e){(e=$.getEvent(e)).cancelBubble=!0};$.stopEvent(e)},createCallback:function(e,t){var i,n=[];for(i=2;i<arguments.length;i++)n.push(arguments[i]);return function(){var i,o=n.concat([]);for(i=0;i<arguments.length;i++)o.push(arguments[i]);return t.apply(e,o)}},getUrlParameter:function(e){var t=URLPARAMS[e];return t||null},getUrlProtocol:function(e){var t=e.match(/^([a-z]+:)\/\//i);return null===t?window.location.protocol:t[1].toLowerCase()},createAjaxRequest:function(e){var t;try{t=!!new ActiveXObject("Microsoft.XMLHTTP")}catch(e){t=!1}if(t)window.XMLHttpRequest?$.createAjaxRequest=function(e){return e?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest}:$.createAjaxRequest=function(){return new ActiveXObject("Microsoft.XMLHTTP")};else{if(!window.XMLHttpRequest)throw new Error("Browser doesn't support XMLHttpRequest.");$.createAjaxRequest=function(){return new XMLHttpRequest}}return $.createAjaxRequest(e)},makeAjaxRequest:function(e,t,i){var n;var o;var r;if($.isPlainObject(e)){t=e.success;i=e.error;n=e.withCredentials;o=e.headers;r=e.responseType||null;e=e.url}var s=$.getUrlProtocol(e);var a=$.createAjaxRequest("file:"===s);if(!$.isFunction(t))throw new Error("makeAjaxRequest requires a success callback");a.onreadystatechange=function(){if(4==a.readyState){a.onreadystatechange=function(){};if(a.status>=200&&a.status<300||0===a.status&&"http:"!==s&&"https:"!==s)t(a);else{$.console.log("AJAX request returned %d: %s",a.status,e);$.isFunction(i)&&i(a)}}};try{a.open("GET",e,!0);r&&(a.responseType=r);if(o)for(var l in o)o.hasOwnProperty(l)&&o[l]&&a.setRequestHeader(l,o[l]);n&&(a.withCredentials=!0);a.send(null)}catch(n){var h=n.message;$.Browser.vendor==$.BROWSERS.IE&&$.Browser.version<10&&void 0!==n.number&&-2147024891==n.number&&(h+="\nSee http://msdn.microsoft.com/en-us/library/ms537505(v=vs.85).aspx#xdomain");$.console.log("%s while making AJAX request: %s",n.name,h);a.onreadystatechange=function(){};if(window.XDomainRequest){var c=new XDomainRequest;if(c){c.onload=function(e){$.isFunction(t)&&t({responseText:c.responseText,status:200,statusText:"OK"})};c.onerror=function(e){$.isFunction(i)&&i({responseText:c.responseText,status:444,statusText:"An error happened. Due to an XDomainRequest deficiency we can not extract any information about this error. Upgrade your browser."})};try{c.open("GET",e);c.send()}catch(e){$.isFunction(i)&&i(a,n)}}}else $.isFunction(i)&&i(a,n)}return a},jsonp:function(e){var t,i=e.url,n=document.head||document.getElementsByTagName("head")[0]||document.documentElement,o=e.callbackName||"openseadragon"+$.now(),r=window[o],s="$1"+o+"$2",a=e.param||"callback",l=e.callback;i=i.replace(/(\=)\?(&|$)|\?\?/i,s);i+=(/\?/.test(i)?"&":"?")+a+"="+o;window[o]=function(e){if(r)window[o]=r;else try{delete window[o]}catch(e){}l&&$.isFunction(l)&&l(e)};t=document.createElement("script");void 0===e.async&&!1===e.async||(t.async="async");e.scriptCharset&&(t.charset=e.scriptCharset);t.src=i;t.onload=t.onreadystatechange=function(e,i){if(i||!t.readyState||/loaded|complete/.test(t.readyState)){t.onload=t.onreadystatechange=null;n&&t.parentNode&&n.removeChild(t);t=void 0}};n.insertBefore(t,n.firstChild)},createFromDZI:function(){throw"OpenSeadragon.createFromDZI is deprecated, use Viewer.open."},parseXml:function(e){if(window.DOMParser)$.parseXml=function(e){return(new DOMParser).parseFromString(e,"text/xml")};else{if(!window.ActiveXObject)throw new Error("Browser doesn't support XML DOM.");$.parseXml=function(e){var t=null;(t=new ActiveXObject("Microsoft.XMLDOM")).async=!1;t.loadXML(e);return t}}return $.parseXml(e)},parseJSON:function(string){window.JSON&&window.JSON.parse?$.parseJSON=window.JSON.parse:$.parseJSON=function(string){return eval("("+string+")")};return $.parseJSON(string)},imageFormatSupported:function(e){return!!FILEFORMATS[(e=e||"").toLowerCase()]}});$.Browser={vendor:$.BROWSERS.UNKNOWN,version:0,alpha:!0};var FILEFORMATS={bmp:!1,jpeg:!0,jpg:!0,png:!0,tif:!1,wdp:!1},URLPARAMS={};!function(){var e=navigator.appVersion,t=navigator.userAgent;switch(navigator.appName){case"Microsoft Internet Explorer":if(window.attachEvent&&window.ActiveXObject){$.Browser.vendor=$.BROWSERS.IE;$.Browser.version=parseFloat(t.substring(t.indexOf("MSIE")+5,t.indexOf(";",t.indexOf("MSIE"))))}break;case"Netscape":if(window.addEventListener)if(t.indexOf("Firefox")>=0){$.Browser.vendor=$.BROWSERS.FIREFOX;$.Browser.version=parseFloat(t.substring(t.indexOf("Firefox")+8))}else if(t.indexOf("Safari")>=0){$.Browser.vendor=t.indexOf("Chrome")>=0?$.BROWSERS.CHROME:$.BROWSERS.SAFARI;$.Browser.version=parseFloat(t.substring(t.substring(0,t.indexOf("Safari")).lastIndexOf("/")+1,t.indexOf("Safari")))}else if(null!==new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})").exec(t)){$.Browser.vendor=$.BROWSERS.IE;$.Browser.version=parseFloat(RegExp.$1)}break;case"Opera":$.Browser.vendor=$.BROWSERS.OPERA;$.Browser.version=parseFloat(e)}var i,n,o,r=window.location.search.substring(1).split("&");for(o=0;o<r.length;o++)(n=(i=r[o]).indexOf("="))>0&&(URLPARAMS[i.substring(0,n)]=decodeURIComponent(i.substring(n+1)));$.Browser.alpha=!($.Browser.vendor==$.BROWSERS.IE&&$.Browser.version<9||$.Browser.vendor==$.BROWSERS.CHROME&&$.Browser.version<2);$.Browser.opacity=!($.Browser.vendor==$.BROWSERS.IE&&$.Browser.version<9)}();var nullfunction=function(e){};$.console=window.console||{log:nullfunction,debug:nullfunction,info:nullfunction,warn:nullfunction,error:nullfunction,assert:nullfunction};!function(e){var t=e.requestAnimationFrame||e.mozRequestAnimationFrame||e.webkitRequestAnimationFrame||e.msRequestAnimationFrame;var i=e.cancelAnimationFrame||e.mozCancelAnimationFrame||e.webkitCancelAnimationFrame||e.msCancelAnimationFrame;if(t&&i){$.requestAnimationFrame=function(){return t.apply(e,arguments)};$.cancelAnimationFrame=function(){return i.apply(e,arguments)}}else{var n,o=[],r=[],s=0;$.requestAnimationFrame=function(e){o.push([++s,e]);n||(n=setInterval(function(){if(o.length){var e=$.now();var t=r;r=o;o=t;for(;r.length;)r.shift()[1](e)}else{clearInterval(n);n=void 0}},20));return s};$.cancelAnimationFrame=function(e){var t,i;for(t=0,i=o.length;t<i;t+=1)if(o[t][0]===e){o.splice(t,1);return}for(t=0,i=r.length;t<i;t+=1)if(r[t][0]===e){r.splice(t,1);return}}}}(window);function getOffsetParent(e,t){return t&&e!=document.body?document.body:e.offsetParent}}(OpenSeadragon);!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&module.exports?module.exports=t():e.OpenSeadragon=t()}(this,function(){return OpenSeadragon});!function(e){var t={supportsFullScreen:!1,isFullScreen:function(){return!1},getFullScreenElement:function(){return null},requestFullScreen:function(){},exitFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",fullScreenErrorEventName:""};if(document.exitFullscreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.fullscreenElement};t.requestFullScreen=function(e){return e.requestFullscreen()};t.exitFullScreen=function(){document.exitFullscreen()};t.fullScreenEventName="fullscreenchange";t.fullScreenErrorEventName="fullscreenerror"}else if(document.msExitFullscreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.msFullscreenElement};t.requestFullScreen=function(e){return e.msRequestFullscreen()};t.exitFullScreen=function(){document.msExitFullscreen()};t.fullScreenEventName="MSFullscreenChange";t.fullScreenErrorEventName="MSFullscreenError"}else if(document.webkitExitFullscreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.webkitFullscreenElement};t.requestFullScreen=function(e){return e.webkitRequestFullscreen()};t.exitFullScreen=function(){document.webkitExitFullscreen()};t.fullScreenEventName="webkitfullscreenchange";t.fullScreenErrorEventName="webkitfullscreenerror"}else if(document.webkitCancelFullScreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.webkitCurrentFullScreenElement};t.requestFullScreen=function(e){return e.webkitRequestFullScreen()};t.exitFullScreen=function(){document.webkitCancelFullScreen()};t.fullScreenEventName="webkitfullscreenchange";t.fullScreenErrorEventName="webkitfullscreenerror"}else if(document.mozCancelFullScreen){t.supportsFullScreen=!0;t.getFullScreenElement=function(){return document.mozFullScreenElement};t.requestFullScreen=function(e){return e.mozRequestFullScreen()};t.exitFullScreen=function(){document.mozCancelFullScreen()};t.fullScreenEventName="mozfullscreenchange";t.fullScreenErrorEventName="mozfullscreenerror"}t.isFullScreen=function(){return null!==t.getFullScreenElement()};t.cancelFullScreen=function(){e.console.error("cancelFullScreen is deprecated. Use exitFullScreen instead.");t.exitFullScreen()};e.extend(e,t)}(OpenSeadragon);!function(e){e.EventSource=function(){this.events={}};e.EventSource.prototype={addOnceHandler:function(e,t,i,n){var o=this;n=n||1;var r=0;var s=function(i){++r===n&&o.removeHandler(e,s);t(i)};this.addHandler(e,s,i)},addHandler:function(t,i,n){var o=this.events[t];o||(this.events[t]=o=[]);i&&e.isFunction(i)&&(o[o.length]={handler:i,userData:n||null})},removeHandler:function(t,i){var n,o=this.events[t],r=[];if(o&&e.isArray(o)){for(n=0;n<o.length;n++)o[n].handler!==i&&r.push(o[n]);this.events[t]=r}},removeAllHandlers:function(e){if(e)this.events[e]=[];else for(var t in this.events)this.events[t]=[]},getHandler:function(e){var t=this.events[e];if(!t||!t.length)return null;t=1===t.length?[t[0]]:Array.apply(null,t);return function(e,i){var n,o=t.length;for(n=0;n<o;n++)if(t[n]){i.eventSource=e;i.userData=t[n].userData;t[n].handler(i)}}},raiseEvent:function(e,t){var i=this.getHandler(e);if(i){t||(t={});i(this,t)}}}}(OpenSeadragon);!function(e){var t=[];var i={};e.MouseTracker=function(n){t.push(this);var o=arguments;e.isPlainObject(n)||(n={element:o[0],clickTimeThreshold:o[1],clickDistThreshold:o[2]});this.hash=Math.random();this.element=e.getElement(n.element);this.clickTimeThreshold=n.clickTimeThreshold||e.DEFAULT_SETTINGS.clickTimeThreshold;this.clickDistThreshold=n.clickDistThreshold||e.DEFAULT_SETTINGS.clickDistThreshold;this.dblClickTimeThreshold=n.dblClickTimeThreshold||e.DEFAULT_SETTINGS.dblClickTimeThreshold;this.dblClickDistThreshold=n.dblClickDistThreshold||e.DEFAULT_SETTINGS.dblClickDistThreshold;this.userData=n.userData||null;this.stopDelay=n.stopDelay||50;this.enterHandler=n.enterHandler||null;this.exitHandler=n.exitHandler||null;this.pressHandler=n.pressHandler||null;this.nonPrimaryPressHandler=n.nonPrimaryPressHandler||null;this.releaseHandler=n.releaseHandler||null;this.nonPrimaryReleaseHandler=n.nonPrimaryReleaseHandler||null;this.moveHandler=n.moveHandler||null;this.scrollHandler=n.scrollHandler||null;this.clickHandler=n.clickHandler||null;this.dblClickHandler=n.dblClickHandler||null;this.dragHandler=n.dragHandler||null;this.dragEndHandler=n.dragEndHandler||null;this.pinchHandler=n.pinchHandler||null;this.stopHandler=n.stopHandler||null;this.keyDownHandler=n.keyDownHandler||null;this.keyUpHandler=n.keyUpHandler||null;this.keyHandler=n.keyHandler||null;this.focusHandler=n.focusHandler||null;this.blurHandler=n.blurHandler||null;var r=this;i[this.hash]={click:function(t){i=t,r.clickHandler&&e.cancelEvent(i);var i},dblclick:function(t){i=t,r.dblClickHandler&&e.cancelEvent(i);var i},keydown:function(t){!function(t,i){if(t.keyDownHandler){i=e.getEvent(i);t.keyDownHandler({eventSource:t,keyCode:i.keyCode?i.keyCode:i.charCode,ctrl:i.ctrlKey,shift:i.shiftKey,alt:i.altKey,meta:i.metaKey,originalEvent:i,preventDefaultAction:!1,userData:t.userData})||e.cancelEvent(i)}}(r,t)},keyup:function(t){!function(t,i){if(t.keyUpHandler){i=e.getEvent(i);t.keyUpHandler({eventSource:t,keyCode:i.keyCode?i.keyCode:i.charCode,ctrl:i.ctrlKey,shift:i.shiftKey,alt:i.altKey,meta:i.metaKey,originalEvent:i,preventDefaultAction:!1,userData:t.userData})||e.cancelEvent(i)}}(r,t)},keypress:function(t){!function(t,i){if(t.keyHandler){i=e.getEvent(i);t.keyHandler({eventSource:t,keyCode:i.keyCode?i.keyCode:i.charCode,ctrl:i.ctrlKey,shift:i.shiftKey,alt:i.altKey,meta:i.metaKey,originalEvent:i,preventDefaultAction:!1,userData:t.userData})||e.cancelEvent(i)}}(r,t)},focus:function(t){!function(t,i){if(t.focusHandler){i=e.getEvent(i);!1===t.focusHandler({eventSource:t,originalEvent:i,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(i)}}(r,t)},blur:function(t){!function(t,i){if(t.blurHandler){i=e.getEvent(i);!1===t.blurHandler({eventSource:t,originalEvent:i,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(i)}}(r,t)},wheel:function(e){g(r,t=e,t);var t},mousewheel:function(e){p(r,e)},DOMMouseScroll:function(e){p(r,e)},MozMousePixelScroll:function(e){p(r,e)},mouseenter:function(t){!function(t,i){i=e.getEvent(i);v(t,i)}(r,t)},mouseleave:function(t){!function(t,i){i=e.getEvent(i);f(t,i)}(r,t)},mouseover:function(t){!function(t,i){if((i=e.getEvent(i)).currentTarget===i.relatedTarget||m(i.currentTarget,i.relatedTarget))return;v(t,i)}(r,t)},mouseout:function(t){!function(t,i){if((i=e.getEvent(i)).currentTarget===i.relatedTarget||m(i.currentTarget,i.relatedTarget))return;f(t,i)}(r,t)},mousedown:function(t){!function(t,i){var n;i=e.getEvent(i);n={id:e.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:h(i),currentTime:e.now()};if(H(t,i,[n],w(i.button))){e.stopEvent(i);s(t,"mouse")}(t.clickHandler||t.dblClickHandler||t.pressHandler||t.dragHandler||t.dragEndHandler)&&e.cancelEvent(i)}(r,t)},mouseup:function(e){y(r,e)},mouseupcaptured:function(t){!function(t,i){y(t,i);e.stopEvent(i)}(r,t)},mousemove:function(e){T(r,e)},mousemovecaptured:function(t){!function(t,i){T(t,i);e.stopEvent(i)}(r,t)},touchstart:function(i){!function(i,n){var o,r,a,l,c=n.changedTouches.length,u=[],d=i.getActivePointersListByType("touch");o=e.now();if(d.getLength()>n.touches.length-c){e.console.warn("Tracked touch contact count doesn't match event.touches.length. Removing all tracked touch pointers.");x(i,n,d)}for(r=0;r<c;r++)u.push({id:n.changedTouches[r].identifier,type:"touch",currentPos:h(n.changedTouches[r]),currentTime:o});z(i,n,u);for(r=0;r<t.length;r++)if(t[r]!==i&&t[r].isTracking()&&m(t[r].element,i.element)){l=[];for(a=0;a<c;a++)l.push({id:n.changedTouches[a].identifier,type:"touch",currentPos:h(n.changedTouches[a]),currentTime:o});z(t[r],n,l)}if(H(i,n,u,0)){e.stopEvent(n);s(i,"touch",c)}e.cancelEvent(n)}(r,i)},touchend:function(e){S(r,e)},touchendcaptured:function(t){!function(t,i){S(t,i);e.stopEvent(i)}(r,t)},touchmove:function(e){E(r,e)},touchmovecaptured:function(t){!function(t,i){E(t,i);e.stopEvent(i)}(r,t)},touchcancel:function(e){!function(e,t){var i=e.getActivePointersListByType("touch");x(e,t,i)}(r,e)},gesturestart:function(e){!function(e,t){t.stopPropagation();t.preventDefault()}(0,e)},gesturechange:function(e){!function(e,t){t.stopPropagation();t.preventDefault()}(0,e)},pointerover:function(e){P(r,e)},MSPointerOver:function(e){P(r,e)},pointerout:function(e){R(r,e)},MSPointerOut:function(e){R(r,e)},pointerdown:function(e){_(r,e)},MSPointerDown:function(e){_(r,e)},pointerup:function(e){C(r,e)},MSPointerUp:function(e){C(r,e)},pointermove:function(e){O(r,e)},MSPointerMove:function(e){O(r,e)},pointercancel:function(e){k(r,e)},MSPointerCancel:function(e){k(r,e)},pointerupcaptured:function(t){!function(t,i){t.getActivePointersListByType(l(i)).getById(i.pointerId)&&b(t,i);e.stopEvent(i)}(r,t)},pointermovecaptured:function(t){!function(t,i){t.getActivePointersListByType(l(i)).getById(i.pointerId)&&I(t,i);e.stopEvent(i)}(r,t)},tracking:!1,activePointersLists:[],lastClickPos:null,dblClickTimeOut:null,pinchGPoints:[],lastPinchDist:0,currentPinchDist:0,lastPinchCenter:null,currentPinchCenter:null};n.startDisabled||this.setTracking(!0)};e.MouseTracker.prototype={destroy:function(){var e;o(this);this.element=null;for(e=0;e<t.length;e++)if(t[e]===this){t.splice(e,1);break}i[this.hash]=null;delete i[this.hash]},isTracking:function(){return i[this.hash].tracking},setTracking:function(t){t?function(t){var o,r,s=i[t.hash];if(!s.tracking){for(r=0;r<e.MouseTracker.subscribeEvents.length;r++){o=e.MouseTracker.subscribeEvents[r];e.addEvent(t.element,o,s[o],!1)}n(t);s.tracking=!0}}(this):o(this);return this},getActivePointersListsExceptType:function(e){var t=i[this.hash];var n=[];for(var o=0;o<t.activePointersLists.length;++o)t.activePointersLists[o].type!==e&&n.push(t.activePointersLists[o]);return n},getActivePointersListByType:function(t){var n,o,r=i[this.hash],s=r.activePointersLists.length;for(n=0;n<s;n++)if(r.activePointersLists[n].type===t)return r.activePointersLists[n];o=new e.MouseTracker.GesturePointList(t);r.activePointersLists.push(o);return o},getActivePointerCount:function(){var e,t=i[this.hash],n=t.activePointersLists.length,o=0;for(e=0;e<n;e++)o+=t.activePointersLists[e].getLength();return o},enterHandler:function(){},exitHandler:function(){},pressHandler:function(){},nonPrimaryPressHandler:function(){},releaseHandler:function(){},nonPrimaryReleaseHandler:function(){},moveHandler:function(){},scrollHandler:function(){},clickHandler:function(){},dblClickHandler:function(){},dragHandler:function(){},dragEndHandler:function(){},pinchHandler:function(){},stopHandler:function(){},keyDownHandler:function(){},keyUpHandler:function(){},keyHandler:function(){},focusHandler:function(){},blurHandler:function(){}};e.MouseTracker.resetAllMouseTrackers=function(){for(var e=0;e<t.length;e++)if(t[e].isTracking()){t[e].setTracking(!1);t[e].setTracking(!0)}};e.MouseTracker.gesturePointVelocityTracker=function(){var t=[],i=0,n=0;var o=function(e,t){return e.hash.toString()+t.type+t.id.toString()};var r=function(){var i,o,r,s,a,l,h=t.length,c=e.now();s=c-n;n=c;for(i=0;i<h;i++){(r=(o=t[i]).gPoint).direction=Math.atan2(r.currentPos.y-o.lastPos.y,r.currentPos.x-o.lastPos.x);a=o.lastPos.distanceTo(r.currentPos);o.lastPos=r.currentPos;l=1e3*a/(s+1);r.speed=.75*l+.25*r.speed}};return{addPoint:function(s,a){var l=o(s,a);t.push({guid:l,gPoint:a,lastPos:a.currentPos});if(1===t.length){n=e.now();i=window.setInterval(r,50)}},removePoint:function(e,n){var r,s=o(e,n),a=t.length;for(r=0;r<a;r++)if(t[r].guid===s){t.splice(r,1);0==--a&&window.clearInterval(i);break}}}}();e.MouseTracker.captureElement=document;e.MouseTracker.wheelEventName=e.Browser.vendor==e.BROWSERS.IE&&e.Browser.version>8||"onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";e.MouseTracker.supportsMouseCapture=function(){var t=document.createElement("div");return e.isFunction(t.setCapture)&&e.isFunction(t.releaseCapture)}();e.MouseTracker.subscribeEvents=["click","dblclick","keydown","keyup","keypress","focus","blur",e.MouseTracker.wheelEventName];"DOMMouseScroll"==e.MouseTracker.wheelEventName&&e.MouseTracker.subscribeEvents.push("MozMousePixelScroll");if(window.PointerEvent&&(window.navigator.pointerEnabled||e.Browser.vendor!==e.BROWSERS.IE)){e.MouseTracker.havePointerEvents=!0;e.MouseTracker.subscribeEvents.push("pointerover","pointerout","pointerdown","pointerup","pointermove","pointercancel");e.MouseTracker.unprefixedPointerEvents=!0;navigator.maxTouchPoints?e.MouseTracker.maxTouchPoints=navigator.maxTouchPoints:e.MouseTracker.maxTouchPoints=0;e.MouseTracker.haveMouseEnter=!1}else if(window.MSPointerEvent&&window.navigator.msPointerEnabled){e.MouseTracker.havePointerEvents=!0;e.MouseTracker.subscribeEvents.push("MSPointerOver","MSPointerOut","MSPointerDown","MSPointerUp","MSPointerMove","MSPointerCancel");e.MouseTracker.unprefixedPointerEvents=!1;navigator.msMaxTouchPoints?e.MouseTracker.maxTouchPoints=navigator.msMaxTouchPoints:e.MouseTracker.maxTouchPoints=0;e.MouseTracker.haveMouseEnter=!1}else{e.MouseTracker.havePointerEvents=!1;if(e.Browser.vendor===e.BROWSERS.IE&&e.Browser.version<9){e.MouseTracker.subscribeEvents.push("mouseenter","mouseleave");e.MouseTracker.haveMouseEnter=!0}else{e.MouseTracker.subscribeEvents.push("mouseover","mouseout");e.MouseTracker.haveMouseEnter=!1}e.MouseTracker.subscribeEvents.push("mousedown","mouseup","mousemove");"ontouchstart"in window&&e.MouseTracker.subscribeEvents.push("touchstart","touchend","touchmove","touchcancel");"ongesturestart"in window&&e.MouseTracker.subscribeEvents.push("gesturestart","gesturechange");e.MouseTracker.mousePointerId="legacy-mouse";e.MouseTracker.maxTouchPoints=10}e.MouseTracker.GesturePointList=function(e){this._gPoints=[];this.type=e;this.buttons=0;this.contacts=0;this.clicks=0;this.captureCount=0};e.MouseTracker.GesturePointList.prototype={getLength:function(){return this._gPoints.length},asArray:function(){return this._gPoints},add:function(e){return this._gPoints.push(e)},removeById:function(e){var t,i=this._gPoints.length;for(t=0;t<i;t++)if(this._gPoints[t].id===e){this._gPoints.splice(t,1);break}return this._gPoints.length},getByIndex:function(e){return e<this._gPoints.length?this._gPoints[e]:null},getById:function(e){var t,i=this._gPoints.length;for(t=0;t<i;t++)if(this._gPoints[t].id===e)return this._gPoints[t];return null},getPrimary:function(e){var t,i=this._gPoints.length;for(t=0;t<i;t++)if(this._gPoints[t].isPrimary)return this._gPoints[t];return null},addContact:function(){++this.contacts;this.contacts>1&&("mouse"===this.type||"pen"===this.type)&&(this.contacts=1)},removeContact:function(){--this.contacts;this.contacts<0&&(this.contacts=0)}};function n(t){var n,o=i[t.hash],r=o.activePointersLists.length;for(n=0;n<r;n++)if(o.activePointersLists[n].captureCount>0){e.removeEvent(e.MouseTracker.captureElement,"mousemove",o.mousemovecaptured,!0);e.removeEvent(e.MouseTracker.captureElement,"mouseup",o.mouseupcaptured,!0);e.removeEvent(e.MouseTracker.captureElement,e.MouseTracker.unprefixedPointerEvents?"pointermove":"MSPointerMove",o.pointermovecaptured,!0);e.removeEvent(e.MouseTracker.captureElement,e.MouseTracker.unprefixedPointerEvents?"pointerup":"MSPointerUp",o.pointerupcaptured,!0);e.removeEvent(e.MouseTracker.captureElement,"touchmove",o.touchmovecaptured,!0);e.removeEvent(e.MouseTracker.captureElement,"touchend",o.touchendcaptured,!0);o.activePointersLists[n].captureCount=0}for(n=0;n<r;n++)o.activePointersLists.pop()}function o(t){var o,r,s=i[t.hash];if(s.tracking){for(r=0;r<e.MouseTracker.subscribeEvents.length;r++){o=e.MouseTracker.subscribeEvents[r];e.removeEvent(t.element,o,s[o],!1)}n(t);s.tracking=!1}}function r(t,n){var o=i[t.hash];if("pointerevent"===n)return{upName:e.MouseTracker.unprefixedPointerEvents?"pointerup":"MSPointerUp",upHandler:o.pointerupcaptured,moveName:e.MouseTracker.unprefixedPointerEvents?"pointermove":"MSPointerMove",moveHandler:o.pointermovecaptured};if("mouse"===n)return{upName:"mouseup",upHandler:o.mouseupcaptured,moveName:"mousemove",moveHandler:o.mousemovecaptured};if("touch"===n)return{upName:"touchend",upHandler:o.touchendcaptured,moveName:"touchmove",moveHandler:o.touchmovecaptured};throw new Error("MouseTracker.getCaptureEventParams: Unknown pointer type.")}function s(t,i,n){var o,s=t.getActivePointersListByType(i);s.captureCount+=n||1;if(1===s.captureCount)if(e.Browser.vendor===e.BROWSERS.IE&&e.Browser.version<9)t.element.setCapture(!0);else{o=r(t,e.MouseTracker.havePointerEvents?"pointerevent":i);N&&A(window.top)&&e.addEvent(window.top,o.upName,o.upHandler,!0);e.addEvent(e.MouseTracker.captureElement,o.upName,o.upHandler,!0);e.addEvent(e.MouseTracker.captureElement,o.moveName,o.moveHandler,!0)}}function a(t,i,n){var o,s=t.getActivePointersListByType(i);s.captureCount-=n||1;if(0===s.captureCount)if(e.Browser.vendor===e.BROWSERS.IE&&e.Browser.version<9)t.element.releaseCapture();else{o=r(t,e.MouseTracker.havePointerEvents?"pointerevent":i);N&&A(window.top)&&e.removeEvent(window.top,o.upName,o.upHandler,!0);e.removeEvent(e.MouseTracker.captureElement,o.moveName,o.moveHandler,!0);e.removeEvent(e.MouseTracker.captureElement,o.upName,o.upHandler,!0)}}function l(t){var i;if(e.MouseTracker.unprefixedPointerEvents)i=t.pointerType;else switch(t.pointerType){case 2:i="touch";break;case 3:i="pen";break;case 4:i="mouse";break;default:i=""}return i}function h(t){return e.getMousePosition(t)}function c(e,t){return u(h(e),t)}function u(t,i){var n=e.getElementOffset(i);return t.minus(n)}function d(t,i){return new e.Point((t.x+i.x)/2,(t.y+i.y)/2)}function p(t,i){var n={target:(i=e.getEvent(i)).target||i.srcElement,type:"wheel",shiftKey:i.shiftKey||!1,clientX:i.clientX,clientY:i.clientY,pageX:i.pageX?i.pageX:i.clientX,pageY:i.pageY?i.pageY:i.clientY,deltaMode:"MozMousePixelScroll"==i.type?0:1,deltaX:0,deltaZ:0};"mousewheel"==e.MouseTracker.wheelEventName?n.deltaY=-i.wheelDelta/e.DEFAULT_SETTINGS.pixelsPerWheelLine:n.deltaY=i.detail;g(t,n,i)}function g(t,i,n){var o=0;o=i.deltaY<0?1:-1;t.scrollHandler&&!1===t.scrollHandler({eventSource:t,pointerType:"mouse",position:c(i,t.element),scroll:o,shift:i.shiftKey,isTouchEvent:!1,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n)}function m(e,t){if(e===t)return!1;for(;t&&t!==e;)t=t.parentNode;return t===e}function v(t,i){z(t,i,[{id:e.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:h(i),currentTime:e.now()}])}function f(t,i){M(t,i,[{id:e.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:h(i),currentTime:e.now()}])}function w(t){return e.Browser.vendor===e.BROWSERS.IE&&e.Browser.version<9?1===t?0:2===t?2:4===t?1:-1:t}function y(t,i){L(t,i=e.getEvent(i),[{id:e.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:h(i),currentTime:e.now()}],w(i.button))&&a(t,"mouse")}function T(t,i){F(t,i=e.getEvent(i),[{id:e.MouseTracker.mousePointerId,type:"mouse",isPrimary:!0,currentPos:h(i),currentTime:e.now()}])}function x(e,t,i){var n,o=i.getLength(),r=[];if("touch"===i.type||i.contacts>0){for(n=0;n<o;n++)r.push(i.getByIndex(n));if(r.length>0){L(e,t,r,0);i.captureCount=1;a(e,i.type);M(e,t,r)}}}function S(i,n){var o,r,s,l,c=n.changedTouches.length,u=[];o=e.now();for(r=0;r<c;r++)u.push({id:n.changedTouches[r].identifier,type:"touch",currentPos:h(n.changedTouches[r]),currentTime:o});L(i,n,u,0)&&a(i,"touch",c);M(i,n,u);for(r=0;r<t.length;r++)if(t[r]!==i&&t[r].isTracking()&&m(t[r].element,i.element)){l=[];for(s=0;s<c;s++)l.push({id:n.changedTouches[s].identifier,type:"touch",currentPos:h(n.changedTouches[s]),currentTime:o});M(t[r],n,l)}e.cancelEvent(n)}function E(t,i){var n,o=i.changedTouches.length,r=[];for(n=0;n<o;n++)r.push({id:i.changedTouches[n].identifier,type:"touch",currentPos:h(i.changedTouches[n]),currentTime:e.now()});F(t,i,r);e.cancelEvent(i)}function P(t,i){i.currentTarget===i.relatedTarget||m(i.currentTarget,i.relatedTarget)||z(t,i,[{id:i.pointerId,type:l(i),isPrimary:i.isPrimary,currentPos:h(i),currentTime:e.now()}])}function R(t,i){i.currentTarget===i.relatedTarget||m(i.currentTarget,i.relatedTarget)||M(t,i,[{id:i.pointerId,type:l(i),isPrimary:i.isPrimary,currentPos:h(i),currentTime:e.now()}])}function _(t,i){var n;if(H(t,i,[n={id:i.pointerId,type:l(i),isPrimary:i.isPrimary,currentPos:h(i),currentTime:e.now()}],i.button)){e.stopEvent(i);s(t,n.type)}(t.clickHandler||t.dblClickHandler||t.pressHandler||t.dragHandler||t.dragEndHandler||t.pinchHandler)&&e.cancelEvent(i)}function C(e,t){b(e,t)}function b(t,i){var n;L(t,i,[n={id:i.pointerId,type:l(i),isPrimary:i.isPrimary,currentPos:h(i),currentTime:e.now()}],i.button)&&a(t,n.type)}function O(e,t){I(e,t)}function I(t,i){F(t,i,[{id:i.pointerId,type:l(i),isPrimary:i.isPrimary,currentPos:h(i),currentTime:e.now()}])}function k(e,t){!function(e,t,i){L(e,t,i,0);M(e,t,i)}(e,t,[{id:t.pointerId,type:l(t)}])}function B(e,t){t.hasOwnProperty("isPrimary")||(0===e.getLength()?t.isPrimary=!0:t.isPrimary=!1);t.speed=0;t.direction=0;t.contactPos=t.currentPos;t.contactTime=t.currentTime;t.lastPos=t.currentPos;t.lastTime=t.currentTime;return e.add(t)}function D(e,t){var i,n;if(e.getById(t.id)){i=e.removeById(t.id);t.hasOwnProperty("isPrimary")||(n=e.getPrimary())||(n=e.getByIndex(0))&&(n.isPrimary=!0)}else i=e.getLength();return i}function z(t,i,n){var o,r,s,a=t.getActivePointersListByType(n[0].type),l=n.length;for(o=0;o<l;o++){r=n[o];if(s=a.getById(r.id)){s.insideElement=!0;s.lastPos=s.currentPos;s.lastTime=s.currentTime;s.currentPos=r.currentPos;s.currentTime=r.currentTime;r=s}else{r.captured=!1;r.insideElementPressed=!1;r.insideElement=!0;B(a,r)}t.enterHandler&&!1===t.enterHandler({eventSource:t,pointerType:r.type,position:u(r.currentPos,t.element),buttons:a.buttons,pointers:t.getActivePointerCount(),insideElementPressed:r.insideElementPressed,buttonDownAny:0!==a.buttons,isTouchEvent:"touch"===r.type,originalEvent:i,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(i)}}function M(t,i,n){var o,r,s,a=t.getActivePointersListByType(n[0].type),l=n.length;for(o=0;o<l;o++){r=n[o];if(s=a.getById(r.id)){if(s.captured){s.insideElement=!1;s.lastPos=s.currentPos;s.lastTime=s.currentTime;s.currentPos=r.currentPos;s.currentTime=r.currentTime}else D(a,s);r=s}t.exitHandler&&!1===t.exitHandler({eventSource:t,pointerType:r.type,position:u(r.currentPos,t.element),buttons:a.buttons,pointers:t.getActivePointerCount(),insideElementPressed:!!s&&s.insideElementPressed,buttonDownAny:0!==a.buttons,isTouchEvent:"touch"===r.type,originalEvent:i,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(i)}}function H(t,n,o,r){var s,a,l,h=i[t.hash],c=t.getActivePointersListByType(o[0].type),p=o.length;void 0!==n.buttons?c.buttons=n.buttons:e.Browser.vendor===e.BROWSERS.IE&&e.Browser.version<9?0===r?c.buttons+=1:1===r?c.buttons+=4:2===r?c.buttons+=2:3===r?c.buttons+=8:4===r?c.buttons+=16:5===r&&(c.buttons+=32):0===r?c.buttons|=1:1===r?c.buttons|=4:2===r?c.buttons|=2:3===r?c.buttons|=8:4===r?c.buttons|=16:5===r&&(c.buttons|=32);var g=t.getActivePointersListsExceptType(o[0].type);for(s=0;s<g.length;s++)x(t,n,g[s]);if(0!==r){t.nonPrimaryPressHandler&&!1===t.nonPrimaryPressHandler({eventSource:t,pointerType:o[0].type,position:u(o[0].currentPos,t.element),button:r,buttons:c.buttons,isTouchEvent:"touch"===o[0].type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n);return!1}for(s=0;s<p;s++){a=o[s];if(l=c.getById(a.id)){l.captured=!0;l.insideElementPressed=!0;l.insideElement=!0;l.contactPos=a.currentPos;l.contactTime=a.currentTime;l.lastPos=l.currentPos;l.lastTime=l.currentTime;l.currentPos=a.currentPos;l.currentTime=a.currentTime;a=l}else{a.captured=!0;a.insideElementPressed=!0;a.insideElement=!0;B(c,a)}c.addContact();(t.dragHandler||t.dragEndHandler||t.pinchHandler)&&e.MouseTracker.gesturePointVelocityTracker.addPoint(t,a);if(1===c.contacts)t.pressHandler&&!1===t.pressHandler({eventSource:t,pointerType:a.type,position:u(a.contactPos,t.element),buttons:c.buttons,isTouchEvent:"touch"===a.type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n);else if(2===c.contacts&&t.pinchHandler&&"touch"===a.type){h.pinchGPoints=c.asArray();h.lastPinchDist=h.currentPinchDist=h.pinchGPoints[0].currentPos.distanceTo(h.pinchGPoints[1].currentPos);h.lastPinchCenter=h.currentPinchCenter=d(h.pinchGPoints[0].currentPos,h.pinchGPoints[1].currentPos)}}return!0}function L(t,n,o,r){var s,a,l,h,c,p,g=i[t.hash],m=t.getActivePointersListByType(o[0].type),v=o.length,f=!1,w=!1;void 0!==n.buttons?m.buttons=n.buttons:e.Browser.vendor===e.BROWSERS.IE&&e.Browser.version<9?0===r?m.buttons-=1:1===r?m.buttons-=4:2===r?m.buttons-=2:3===r?m.buttons-=8:4===r?m.buttons-=16:5===r&&(m.buttons-=32):0===r?m.buttons^=-2:1===r?m.buttons^=-5:2===r?m.buttons^=-3:3===r?m.buttons^=-9:4===r?m.buttons^=-17:5===r&&(m.buttons^=-33);if(0!==r){t.nonPrimaryReleaseHandler&&!1===t.nonPrimaryReleaseHandler({eventSource:t,pointerType:o[0].type,position:u(o[0].currentPos,t.element),button:r,buttons:m.buttons,isTouchEvent:"touch"===o[0].type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n);x(t,n,t.getActivePointersListByType("mouse"));return!1}for(l=0;l<v;l++){h=o[l];if(c=m.getById(h.id)){if(c.captured){c.captured=!1;f=!0;w=!0}c.lastPos=c.currentPos;c.lastTime=c.currentTime;c.currentPos=h.currentPos;c.currentTime=h.currentTime;c.insideElement||D(m,c);s=c.currentPos;a=c.currentTime;if(w){m.removeContact();(t.dragHandler||t.dragEndHandler||t.pinchHandler)&&e.MouseTracker.gesturePointVelocityTracker.removePoint(t,c);if(0===m.contacts){t.releaseHandler&&!1===t.releaseHandler({eventSource:t,pointerType:c.type,position:u(s,t.element),buttons:m.buttons,insideElementPressed:c.insideElementPressed,insideElementReleased:c.insideElement,isTouchEvent:"touch"===c.type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n);t.dragEndHandler&&!c.currentPos.equals(c.contactPos)&&!1===t.dragEndHandler({eventSource:t,pointerType:c.type,position:u(c.currentPos,t.element),speed:c.speed,direction:c.direction,shift:n.shiftKey,isTouchEvent:"touch"===c.type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n);if((t.clickHandler||t.dblClickHandler)&&c.insideElement){p=a-c.contactTime<=t.clickTimeThreshold&&c.contactPos.distanceTo(s)<=t.clickDistThreshold;t.clickHandler&&!1===t.clickHandler({eventSource:t,pointerType:c.type,position:u(c.currentPos,t.element),quick:p,shift:n.shiftKey,isTouchEvent:"touch"===c.type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n);if(t.dblClickHandler&&p){m.clicks++;if(1===m.clicks){g.lastClickPos=s;g.dblClickTimeOut=setTimeout(function(){m.clicks=0},t.dblClickTimeThreshold)}else if(2===m.clicks){clearTimeout(g.dblClickTimeOut);m.clicks=0;g.lastClickPos.distanceTo(s)<=t.dblClickDistThreshold&&!1===t.dblClickHandler({eventSource:t,pointerType:c.type,position:u(c.currentPos,t.element),shift:n.shiftKey,isTouchEvent:"touch"===c.type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n);g.lastClickPos=null}}}}else if(2===m.contacts&&t.pinchHandler&&"touch"===c.type){g.pinchGPoints=m.asArray();g.lastPinchDist=g.currentPinchDist=g.pinchGPoints[0].currentPos.distanceTo(g.pinchGPoints[1].currentPos);g.lastPinchCenter=g.currentPinchCenter=d(g.pinchGPoints[0].currentPos,g.pinchGPoints[1].currentPos)}}else t.releaseHandler&&!1===t.releaseHandler({eventSource:t,pointerType:c.type,position:u(s,t.element),buttons:m.buttons,insideElementPressed:c.insideElementPressed,insideElementReleased:c.insideElement,isTouchEvent:"touch"===c.type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n)}}return f}function F(t,n,o){var r,s,a,l,h,p=i[t.hash],g=t.getActivePointersListByType(o[0].type),m=o.length;void 0!==n.buttons&&(g.buttons=n.buttons);for(r=0;r<m;r++){s=o[r];if(a=g.getById(s.id)){s.hasOwnProperty("isPrimary")&&(a.isPrimary=s.isPrimary);a.lastPos=a.currentPos;a.lastTime=a.currentTime;a.currentPos=s.currentPos;a.currentTime=s.currentTime}else{s.captured=!1;s.insideElementPressed=!1;s.insideElement=!0;B(g,s)}}if(t.stopHandler&&"mouse"===o[0].type){clearTimeout(t.stopTimeOut);t.stopTimeOut=setTimeout(function(){e=t,i=n,r=o[0].type,e.stopHandler&&e.stopHandler({eventSource:e,pointerType:r,position:c(i,e.element),buttons:e.getActivePointersListByType(r).buttons,isTouchEvent:"touch"===r,originalEvent:i,preventDefaultAction:!1,userData:e.userData});var e,i,r},t.stopDelay)}if(0===g.contacts)t.moveHandler&&!1===t.moveHandler({eventSource:t,pointerType:o[0].type,position:u(o[0].currentPos,t.element),buttons:g.buttons,isTouchEvent:"touch"===o[0].type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n);else if(1===g.contacts){if(t.moveHandler){a=g.asArray()[0];!1===t.moveHandler({eventSource:t,pointerType:a.type,position:u(a.currentPos,t.element),buttons:g.buttons,isTouchEvent:"touch"===a.type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n)}if(t.dragHandler){h=(a=g.asArray()[0]).currentPos.minus(a.lastPos);!1===t.dragHandler({eventSource:t,pointerType:a.type,position:u(a.currentPos,t.element),buttons:g.buttons,delta:h,speed:a.speed,direction:a.direction,shift:n.shiftKey,isTouchEvent:"touch"===a.type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n)}}else if(2===g.contacts){if(t.moveHandler){l=g.asArray();!1===t.moveHandler({eventSource:t,pointerType:l[0].type,position:u(d(l[0].currentPos,l[1].currentPos),t.element),buttons:g.buttons,isTouchEvent:"touch"===l[0].type,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n)}if(t.pinchHandler&&"touch"===o[0].type&&(h=p.pinchGPoints[0].currentPos.distanceTo(p.pinchGPoints[1].currentPos))!=p.currentPinchDist){p.lastPinchDist=p.currentPinchDist;p.currentPinchDist=h;p.lastPinchCenter=p.currentPinchCenter;p.currentPinchCenter=d(p.pinchGPoints[0].currentPos,p.pinchGPoints[1].currentPos);!1===t.pinchHandler({eventSource:t,pointerType:"touch",gesturePoints:p.pinchGPoints,lastCenter:u(p.lastPinchCenter,t.element),center:u(p.currentPinchCenter,t.element),lastDistance:p.lastPinchDist,distance:p.currentPinchDist,shift:n.shiftKey,originalEvent:n,preventDefaultAction:!1,userData:t.userData})&&e.cancelEvent(n)}}}var N=function(){try{return window.self!==window.top}catch(e){return!0}}();function A(e){try{return e.addEventListener&&e.removeEventListener}catch(e){return!1}}}(OpenSeadragon);!function(e){e.ControlAnchor={NONE:0,TOP_LEFT:1,TOP_RIGHT:2,BOTTOM_RIGHT:3,BOTTOM_LEFT:4,ABSOLUTE:5};e.Control=function(t,i,n){var o=t.parentNode;if("number"==typeof i){e.console.error("Passing an anchor directly into the OpenSeadragon.Control constructor is deprecated; please use an options object instead.  Support for this deprecated variant is scheduled for removal in December 2013");i={anchor:i}}i.attachToViewer=void 0===i.attachToViewer||i.attachToViewer;this.autoFade=void 0===i.autoFade||i.autoFade;this.element=t;this.anchor=i.anchor;this.container=n;if(this.anchor==e.ControlAnchor.ABSOLUTE){this.wrapper=e.makeNeutralElement("div");this.wrapper.style.position="absolute";this.wrapper.style.top="number"==typeof i.top?i.top+"px":i.top;this.wrapper.style.left="number"==typeof i.left?i.left+"px":i.left;this.wrapper.style.height="number"==typeof i.height?i.height+"px":i.height;this.wrapper.style.width="number"==typeof i.width?i.width+"px":i.width;this.wrapper.style.margin="0px";this.wrapper.style.padding="0px";this.element.style.position="relative";this.element.style.top="0px";this.element.style.left="0px";this.element.style.height="100%";this.element.style.width="100%"}else{this.wrapper=e.makeNeutralElement("div");this.wrapper.style.display="inline-block";this.anchor==e.ControlAnchor.NONE&&(this.wrapper.style.width=this.wrapper.style.height="100%")}this.wrapper.appendChild(this.element);i.attachToViewer?this.anchor==e.ControlAnchor.TOP_RIGHT||this.anchor==e.ControlAnchor.BOTTOM_RIGHT?this.container.insertBefore(this.wrapper,this.container.firstChild):this.container.appendChild(this.wrapper):o.appendChild(this.wrapper)};e.Control.prototype={destroy:function(){this.wrapper.removeChild(this.element);this.container.removeChild(this.wrapper)},isVisible:function(){return"none"!=this.wrapper.style.display},setVisible:function(t){this.wrapper.style.display=t?this.anchor==e.ControlAnchor.ABSOLUTE?"block":"inline-block":"none"},setOpacity:function(t){this.element[e.SIGNAL]&&e.Browser.vendor==e.BROWSERS.IE?e.setElementOpacity(this.element,t,!0):e.setElementOpacity(this.wrapper,t,!0)}}}(OpenSeadragon);!function(e){e.ControlDock=function(t){var i,n,o=["topleft","topright","bottomright","bottomleft"];e.extend(!0,this,{id:"controldock-"+e.now()+"-"+Math.floor(1e6*Math.random()),container:e.makeNeutralElement("div"),controls:[]},t);this.container.onsubmit=function(){return!1};if(this.element){this.element=e.getElement(this.element);this.element.appendChild(this.container);this.element.style.position="relative";this.container.style.width="100%";this.container.style.height="100%"}for(n=0;n<o.length;n++){i=o[n];this.controls[i]=e.makeNeutralElement("div");this.controls[i].style.position="absolute";i.match("left")&&(this.controls[i].style.left="0px");i.match("right")&&(this.controls[i].style.right="0px");i.match("top")&&(this.controls[i].style.top="0px");i.match("bottom")&&(this.controls[i].style.bottom="0px")}this.container.appendChild(this.controls.topleft);this.container.appendChild(this.controls.topright);this.container.appendChild(this.controls.bottomright);this.container.appendChild(this.controls.bottomleft)};e.ControlDock.prototype={addControl:function(i,n){var o=null;if(!(t(this,i=e.getElement(i))>=0)){switch(n.anchor){case e.ControlAnchor.TOP_RIGHT:o=this.controls.topright;i.style.position="relative";i.style.paddingRight="0px";i.style.paddingTop="0px";break;case e.ControlAnchor.BOTTOM_RIGHT:o=this.controls.bottomright;i.style.position="relative";i.style.paddingRight="0px";i.style.paddingBottom="0px";break;case e.ControlAnchor.BOTTOM_LEFT:o=this.controls.bottomleft;i.style.position="relative";i.style.paddingLeft="0px";i.style.paddingBottom="0px";break;case e.ControlAnchor.TOP_LEFT:o=this.controls.topleft;i.style.position="relative";i.style.paddingLeft="0px";i.style.paddingTop="0px";break;case e.ControlAnchor.ABSOLUTE:o=this.container;i.style.margin="0px";i.style.padding="0px";break;default:case e.ControlAnchor.NONE:o=this.container;i.style.margin="0px";i.style.padding="0px"}this.controls.push(new e.Control(i,n,o));i.style.display="inline-block"}},removeControl:function(i){var n=t(this,i=e.getElement(i));if(n>=0){this.controls[n].destroy();this.controls.splice(n,1)}return this},clearControls:function(){for(;this.controls.length>0;)this.controls.pop().destroy();return this},areControlsEnabled:function(){var e;for(e=this.controls.length-1;e>=0;e--)if(this.controls[e].isVisible())return!0;return!1},setControlsEnabled:function(e){var t;for(t=this.controls.length-1;t>=0;t--)this.controls[t].setVisible(e);return this}};function t(e,t){var i,n=e.controls;for(i=n.length-1;i>=0;i--)if(n[i].element==t)return i;return-1}}(OpenSeadragon);!function(e){e.Placement=e.freezeObject({CENTER:0,TOP_LEFT:1,TOP:2,TOP_RIGHT:3,RIGHT:4,BOTTOM_RIGHT:5,BOTTOM:6,BOTTOM_LEFT:7,LEFT:8,properties:{0:{isLeft:!1,isHorizontallyCentered:!0,isRight:!1,isTop:!1,isVerticallyCentered:!0,isBottom:!1},1:{isLeft:!0,isHorizontallyCentered:!1,isRight:!1,isTop:!0,isVerticallyCentered:!1,isBottom:!1},2:{isLeft:!1,isHorizontallyCentered:!0,isRight:!1,isTop:!0,isVerticallyCentered:!1,isBottom:!1},3:{isLeft:!1,isHorizontallyCentered:!1,isRight:!0,isTop:!0,isVerticallyCentered:!1,isBottom:!1},4:{isLeft:!1,isHorizontallyCentered:!1,isRight:!0,isTop:!1,isVerticallyCentered:!0,isBottom:!1},5:{isLeft:!1,isHorizontallyCentered:!1,isRight:!0,isTop:!1,isVerticallyCentered:!1,isBottom:!0},6:{isLeft:!1,isHorizontallyCentered:!0,isRight:!1,isTop:!1,isVerticallyCentered:!1,isBottom:!0},7:{isLeft:!0,isHorizontallyCentered:!1,isRight:!1,isTop:!1,isVerticallyCentered:!1,isBottom:!0},8:{isLeft:!0,isHorizontallyCentered:!1,isRight:!1,isTop:!1,isVerticallyCentered:!0,isBottom:!1}}})}(OpenSeadragon);!function(e){var t={};var i=1;e.Viewer=function(o){var r,a=arguments,h=this;e.isPlainObject(o)||(o={id:a[0],xmlPath:a.length>1?a[1]:void 0,prefixUrl:a.length>2?a[2]:void 0,controls:a.length>3?a[3]:void 0,overlays:a.length>4?a[4]:void 0});if(o.config){e.extend(!0,o,o.config);delete o.config}e.extend(!0,this,{id:o.id,hash:o.hash||i++,initialPage:0,element:null,container:null,canvas:null,overlays:[],overlaysContainer:null,previousBody:[],customControls:[],source:null,drawer:null,world:null,viewport:null,navigator:null,collectionViewport:null,collectionDrawer:null,navImages:null,buttons:null,profiler:null},e.DEFAULT_SETTINGS,o);if(void 0===this.hash)throw new Error("A hash must be defined, either by specifying options.id or options.hash.");void 0!==t[this.hash]&&e.console.warn("Hash "+this.hash+" has already been used.");t[this.hash]={fsBoundsDelta:new e.Point(1,1),prevContainerSize:null,animating:!1,forceRedraw:!1,mouseInside:!1,group:null,zooming:!1,zoomFactor:null,lastZoomTime:null,fullPage:!1,onfullscreenchange:null};this._sequenceIndex=0;this._firstOpen=!0;this._updateRequestId=null;this._loadQueue=[];this.currentOverlays=[];this._lastScrollTime=e.now();e.EventSource.call(this);this.addHandler("open-failed",function(t){var i=e.getString("Errors.OpenFailed",t.eventSource,t.message);h._showMessage(i)});e.ControlDock.call(this,o);this.xmlPath&&(this.tileSources=[this.xmlPath]);this.element=this.element||document.getElementById(this.id);this.canvas=e.makeNeutralElement("div");this.canvas.className="openseadragon-canvas";!function(e){e.width="100%";e.height="100%";e.overflow="hidden";e.position="absolute";e.top="0px";e.left="0px"}(this.canvas.style);e.setElementTouchActionNone(this.canvas);""!==o.tabIndex&&(this.canvas.tabIndex=void 0===o.tabIndex?0:o.tabIndex);this.container.className="openseadragon-container";!function(e){e.width="100%";e.height="100%";e.position="relative";e.overflow="hidden";e.left="0px";e.top="0px";e.textAlign="left"}(this.container.style);this.container.insertBefore(this.canvas,this.container.firstChild);this.element.appendChild(this.container);this.bodyWidth=document.body.style.width;this.bodyHeight=document.body.style.height;this.bodyOverflow=document.body.style.overflow;this.docOverflow=document.documentElement.style.overflow;this.innerTracker=new e.MouseTracker({element:this.canvas,startDisabled:!this.mouseNavEnabled,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,dblClickTimeThreshold:this.dblClickTimeThreshold,dblClickDistThreshold:this.dblClickDistThreshold,keyDownHandler:e.delegate(this,d),keyHandler:e.delegate(this,p),clickHandler:e.delegate(this,g),dblClickHandler:e.delegate(this,m),dragHandler:e.delegate(this,v),dragEndHandler:e.delegate(this,f),enterHandler:e.delegate(this,w),exitHandler:e.delegate(this,y),pressHandler:e.delegate(this,T),releaseHandler:e.delegate(this,x),nonPrimaryPressHandler:e.delegate(this,S),nonPrimaryReleaseHandler:e.delegate(this,E),scrollHandler:e.delegate(this,R),pinchHandler:e.delegate(this,P)});this.outerTracker=new e.MouseTracker({element:this.container,startDisabled:!this.mouseNavEnabled,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,dblClickTimeThreshold:this.dblClickTimeThreshold,dblClickDistThreshold:this.dblClickDistThreshold,enterHandler:e.delegate(this,_),exitHandler:e.delegate(this,C)});this.toolbar&&(this.toolbar=new e.ControlDock({element:this.toolbar}));this.bindStandardControls();t[this.hash].prevContainerSize=n(this.container);this.world=new e.World({viewer:this});this.world.addHandler("add-item",function(e){h.source=h.world.getItemAt(0).source;t[h.hash].forceRedraw=!0;h._updateRequestId||(h._updateRequestId=s(h,b))});this.world.addHandler("remove-item",function(e){h.world.getItemCount()?h.source=h.world.getItemAt(0).source:h.source=null;t[h.hash].forceRedraw=!0});this.world.addHandler("metrics-change",function(e){h.viewport&&h.viewport._setContentBounds(h.world.getHomeBounds(),h.world.getContentFactor())});this.world.addHandler("item-index-change",function(e){h.source=h.world.getItemAt(0).source});this.viewport=new e.Viewport({containerSize:t[this.hash].prevContainerSize,springStiffness:this.springStiffness,animationTime:this.animationTime,minZoomImageRatio:this.minZoomImageRatio,maxZoomPixelRatio:this.maxZoomPixelRatio,visibilityRatio:this.visibilityRatio,wrapHorizontal:this.wrapHorizontal,wrapVertical:this.wrapVertical,defaultZoomLevel:this.defaultZoomLevel,minZoomLevel:this.minZoomLevel,maxZoomLevel:this.maxZoomLevel,viewer:this,degrees:this.degrees,flipped:this.flipped,navigatorRotate:this.navigatorRotate,homeFillsViewer:this.homeFillsViewer,margins:this.viewportMargins});this.viewport._setContentBounds(this.world.getHomeBounds(),this.world.getContentFactor());this.imageLoader=new e.ImageLoader({jobLimit:this.imageLoaderLimit,timeout:o.timeout});this.tileCache=new e.TileCache({maxImageCacheCount:this.maxImageCacheCount});this.drawer=new e.Drawer({viewer:this,viewport:this.viewport,element:this.canvas,debugGridColor:this.debugGridColor});this.overlaysContainer=e.makeNeutralElement("div");this.canvas.appendChild(this.overlaysContainer);if(!this.drawer.canRotate()){if(this.rotateLeft){r=this.buttons.buttons.indexOf(this.rotateLeft);this.buttons.buttons.splice(r,1);this.buttons.element.removeChild(this.rotateLeft.element)}if(this.rotateRight){r=this.buttons.buttons.indexOf(this.rotateRight);this.buttons.buttons.splice(r,1);this.buttons.element.removeChild(this.rotateRight.element)}}this.showNavigator&&(this.navigator=new e.Navigator({id:this.navigatorId,position:this.navigatorPosition,sizeRatio:this.navigatorSizeRatio,maintainSizeRatio:this.navigatorMaintainSizeRatio,top:this.navigatorTop,left:this.navigatorLeft,width:this.navigatorWidth,height:this.navigatorHeight,autoResize:this.navigatorAutoResize,autoFade:this.navigatorAutoFade,prefixUrl:this.prefixUrl,viewer:this,navigatorRotate:this.navigatorRotate,background:this.navigatorBackground,opacity:this.navigatorOpacity,borderColor:this.navigatorBorderColor,displayRegionColor:this.navigatorDisplayRegionColor,crossOriginPolicy:this.crossOriginPolicy}));this.sequenceMode&&this.bindSequenceControls();this.tileSources&&this.open(this.tileSources);for(r=0;r<this.customControls.length;r++)this.addControl(this.customControls[r].id,{anchor:this.customControls[r].anchor});e.requestAnimationFrame(function(){l(h)})};e.extend(e.Viewer.prototype,e.EventSource.prototype,e.ControlDock.prototype,{isOpen:function(){return!!this.world.getItemCount()},openDzi:function(t){e.console.error("[Viewer.openDzi] this function is deprecated; use Viewer.open() instead.");return this.open(t)},openTileSource:function(t){e.console.error("[Viewer.openTileSource] this function is deprecated; use Viewer.open() instead.");return this.open(t)},open:function(t,i){var n=this;this.close();if(t)if(this.sequenceMode&&e.isArray(t)){if(this.referenceStrip){this.referenceStrip.destroy();this.referenceStrip=null}void 0===i||isNaN(i)||(this.initialPage=i);this.tileSources=t;this._sequenceIndex=Math.max(0,Math.min(this.tileSources.length-1,this.initialPage));if(this.tileSources.length){this.open(this.tileSources[this._sequenceIndex]);this.showReferenceStrip&&this.addReferenceStrip()}this._updateSequenceButtons(this._sequenceIndex)}else{e.isArray(t)||(t=[t]);if(t.length){this._opening=!0;var r=t.length;var s=0;var a=0;var l;var h=function(){if(s+a===r)if(s){if(n._firstOpen||!n.preserveViewport){n.viewport.goHome(!0);n.viewport.update()}n._firstOpen=!1;var e=t[0];e.tileSource&&(e=e.tileSource);if(n.overlays&&!n.preserveOverlays)for(var i=0;i<n.overlays.length;i++)n.currentOverlays[i]=o(n,n.overlays[i]);n._drawOverlays();n._opening=!1;n.raiseEvent("open",{source:e})}else{n._opening=!1;n.raiseEvent("open-failed",l)}};var c=function(t){e.isPlainObject(t)&&t.tileSource||(t={tileSource:t});if(void 0!==t.index){e.console.error("[Viewer.open] setting indexes here is not supported; use addTiledImage instead");delete t.index}void 0===t.collectionImmediately&&(t.collectionImmediately=!0);var i=t.success;t.success=function(e){s++;if(t.tileSource.overlays)for(var o=0;o<t.tileSource.overlays.length;o++)n.addOverlay(t.tileSource.overlays[o]);i&&i(e);h()};var o=t.error;t.error=function(e){a++;l||(l=e);o&&o(e);h()};n.addTiledImage(t)};for(var u=0;u<t.length;u++)c(t[u]);return this}}},close:function(){if(!t[this.hash])return this;this._opening=!1;this.navigator&&this.navigator.close();if(!this.preserveOverlays){this.clearOverlays();this.overlaysContainer.innerHTML=""}t[this.hash].animating=!1;this.world.removeAll();this.imageLoader.clear();this.raiseEvent("close");return this},destroy:function(){if(t[this.hash]){this.close();this.clearOverlays();this.overlaysContainer.innerHTML="";if(this.referenceStrip){this.referenceStrip.destroy();this.referenceStrip=null}if(null!==this._updateRequestId){e.cancelAnimationFrame(this._updateRequestId);this._updateRequestId=null}this.drawer&&this.drawer.destroy();this.removeAllHandlers();if(this.element)for(;this.element.firstChild;)this.element.removeChild(this.element.firstChild);this.innerTracker&&this.innerTracker.destroy();this.outerTracker&&this.outerTracker.destroy();t[this.hash]=null;delete t[this.hash];this.canvas=null;this.container=null;this.element=null}},isMouseNavEnabled:function(){return this.innerTracker.isTracking()},setMouseNavEnabled:function(e){this.innerTracker.setTracking(e);this.outerTracker.setTracking(e);this.raiseEvent("mouse-enabled",{enabled:e});return this},areControlsEnabled:function(){var e,t=this.controls.length;for(e=0;e<this.controls.length;e++)t=t&&this.controls[e].isVisibile();return t},setControlsEnabled:function(e){e?h(this):l(this);this.raiseEvent("controls-enabled",{enabled:e});return this},setDebugMode:function(e){for(var t=0;t<this.world.getItemCount();t++)this.world.getItemAt(t).debugMode=e;this.debugMode=e;this.forceRedraw()},isFullPage:function(){return t[this.hash].fullPage},setFullPage:function(i){var n,o,r=document.body,s=r.style,a=document.documentElement.style,l=this;if(i==this.isFullPage())return this;var h={fullPage:i,preventDefaultAction:!1};this.raiseEvent("pre-full-page",h);if(h.preventDefaultAction)return this;if(i){this.elementSize=e.getElementSize(this.element);this.pageScroll=e.getPageScroll();this.elementMargin=this.element.style.margin;this.element.style.margin="0";this.elementPadding=this.element.style.padding;this.element.style.padding="0";this.bodyMargin=s.margin;this.docMargin=a.margin;s.margin="0";a.margin="0";this.bodyPadding=s.padding;this.docPadding=a.padding;s.padding="0";a.padding="0";this.bodyWidth=s.width;this.docWidth=a.width;s.width="100%";a.width="100%";this.bodyHeight=s.height;this.docHeight=a.height;s.height="100%";a.height="100%";this.previousBody=[];t[this.hash].prevElementParent=this.element.parentNode;t[this.hash].prevNextSibling=this.element.nextSibling;t[this.hash].prevElementWidth=this.element.style.width;t[this.hash].prevElementHeight=this.element.style.height;n=r.childNodes.length;for(o=0;o<n;o++){this.previousBody.push(r.childNodes[0]);r.removeChild(r.childNodes[0])}if(this.toolbar&&this.toolbar.element){this.toolbar.parentNode=this.toolbar.element.parentNode;this.toolbar.nextSibling=this.toolbar.element.nextSibling;r.appendChild(this.toolbar.element);e.addClass(this.toolbar.element,"fullpage")}e.addClass(this.element,"fullpage");r.appendChild(this.element);this.element.style.height=e.getWindowSize().y+"px";this.element.style.width=e.getWindowSize().x+"px";this.toolbar&&this.toolbar.element&&(this.element.style.height=e.getElementSize(this.element).y-e.getElementSize(this.toolbar.element).y+"px");t[this.hash].fullPage=!0;e.delegate(this,_)({})}else{this.element.style.margin=this.elementMargin;this.element.style.padding=this.elementPadding;s.margin=this.bodyMargin;a.margin=this.docMargin;s.padding=this.bodyPadding;a.padding=this.docPadding;s.width=this.bodyWidth;a.width=this.docWidth;s.height=this.bodyHeight;a.height=this.docHeight;r.removeChild(this.element);n=this.previousBody.length;for(o=0;o<n;o++)r.appendChild(this.previousBody.shift());e.removeClass(this.element,"fullpage");t[this.hash].prevElementParent.insertBefore(this.element,t[this.hash].prevNextSibling);if(this.toolbar&&this.toolbar.element){r.removeChild(this.toolbar.element);e.removeClass(this.toolbar.element,"fullpage");this.toolbar.parentNode.insertBefore(this.toolbar.element,this.toolbar.nextSibling);delete this.toolbar.parentNode;delete this.toolbar.nextSibling}this.element.style.width=t[this.hash].prevElementWidth;this.element.style.height=t[this.hash].prevElementHeight;var c=0;var u=function(){e.setPageScroll(l.pageScroll);var t=e.getPageScroll();++c<10&&(t.x!==l.pageScroll.x||t.y!==l.pageScroll.y)&&e.requestAnimationFrame(u)};e.requestAnimationFrame(u);t[this.hash].fullPage=!1;e.delegate(this,C)({})}this.navigator&&this.viewport&&this.navigator.update(this.viewport);this.raiseEvent("full-page",{fullPage:i});return this},setFullScreen:function(t){var i=this;if(!e.supportsFullScreen)return this.setFullPage(t);if(e.isFullScreen()===t)return this;var n={fullScreen:t,preventDefaultAction:!1};this.raiseEvent("pre-full-screen",n);if(n.preventDefaultAction)return this;if(t){this.setFullPage(!0);if(!this.isFullPage())return this;this.fullPageStyleWidth=this.element.style.width;this.fullPageStyleHeight=this.element.style.height;this.element.style.width="100%";this.element.style.height="100%";var o=function(){var t=e.isFullScreen();if(!t){e.removeEvent(document,e.fullScreenEventName,o);e.removeEvent(document,e.fullScreenErrorEventName,o);i.setFullPage(!1);if(i.isFullPage()){i.element.style.width=i.fullPageStyleWidth;i.element.style.height=i.fullPageStyleHeight}}i.navigator&&i.viewport&&i.navigator.update(i.viewport);i.raiseEvent("full-screen",{fullScreen:t})};e.addEvent(document,e.fullScreenEventName,o);e.addEvent(document,e.fullScreenErrorEventName,o);e.requestFullScreen(document.body)}else e.exitFullScreen();return this},isVisible:function(){return"hidden"!=this.container.style.visibility},setVisible:function(e){this.container.style.visibility=e?"":"hidden";this.raiseEvent("visible",{visible:e});return this},addTiledImage:function(t){e.console.assert(t,"[Viewer.addTiledImage] options is required");e.console.assert(t.tileSource,"[Viewer.addTiledImage] options.tileSource is required");e.console.assert(!t.replace||t.index>-1&&t.index<this.world.getItemCount(),"[Viewer.addTiledImage] if options.replace is used, options.index must be a valid index in Viewer.world");var i=this;t.replace&&(t.replaceItem=i.world.getItemAt(t.index));this._hideMessage();void 0===t.placeholderFillStyle&&(t.placeholderFillStyle=this.placeholderFillStyle);void 0===t.opacity&&(t.opacity=this.opacity);void 0===t.preload&&(t.preload=this.preload);void 0===t.compositeOperation&&(t.compositeOperation=this.compositeOperation);void 0===t.crossOriginPolicy&&(t.crossOriginPolicy=void 0!==t.tileSource.crossOriginPolicy?t.tileSource.crossOriginPolicy:this.crossOriginPolicy);void 0===t.ajaxWithCredentials&&(t.ajaxWithCredentials=this.ajaxWithCredentials);void 0===t.loadTilesWithAjax&&(t.loadTilesWithAjax=this.loadTilesWithAjax);void 0===t.ajaxHeaders||null===t.ajaxHeaders?t.ajaxHeaders=this.ajaxHeaders:e.isPlainObject(t.ajaxHeaders)&&e.isPlainObject(this.ajaxHeaders)&&(t.ajaxHeaders=e.extend({},this.ajaxHeaders,t.ajaxHeaders));var n={options:t};function o(e){for(var o=0;o<i._loadQueue.length;o++)if(i._loadQueue[o]===n){i._loadQueue.splice(o,1);break}0===i._loadQueue.length&&r(n);i.raiseEvent("add-item-failed",e);t.error&&t.error(e)}function r(e){if(i.collectionMode){i.world.arrange({immediately:e.options.collectionImmediately,rows:i.collectionRows,columns:i.collectionColumns,layout:i.collectionLayout,tileSize:i.collectionTileSize,tileMargin:i.collectionTileMargin});i.world.setAutoRefigureSizes(!0)}}if(e.isArray(t.tileSource))setTimeout(function(){o({message:"[Viewer.addTiledImage] Sequences can not be added; add them one at a time instead.",source:t.tileSource,options:t})});else{this._loadQueue.push(n);!function(t,i,n,o,r){var s=t;if("string"==e.type(i))if(i.match(/^\s*<.*>\s*$/))i=e.parseXml(i);else if(i.match(/^\s*[\{\[].*[\}\]]\s*$/))try{var a=e.parseJSON(i);i=a}catch(e){}function l(e,t){if(e.ready)o(e);else{e.addHandler("ready",function(){o(e)});e.addHandler("open-failed",function(e){r({message:e.message,source:t})})}}setTimeout(function(){if("string"==e.type(i))(i=new e.TileSource({url:i,crossOriginPolicy:void 0!==n.crossOriginPolicy?n.crossOriginPolicy:t.crossOriginPolicy,ajaxWithCredentials:t.ajaxWithCredentials,ajaxHeaders:t.ajaxHeaders,useCanvas:t.useCanvas,success:function(e){o(e.tileSource)}})).addHandler("open-failed",function(e){r(e)});else if(e.isPlainObject(i)||i.nodeType){void 0!==i.crossOriginPolicy||void 0===n.crossOriginPolicy&&void 0===t.crossOriginPolicy||(i.crossOriginPolicy=void 0!==n.crossOriginPolicy?n.crossOriginPolicy:t.crossOriginPolicy);void 0===i.ajaxWithCredentials&&(i.ajaxWithCredentials=t.ajaxWithCredentials);void 0===i.useCanvas&&(i.useCanvas=t.useCanvas);if(e.isFunction(i.getTileUrl)){var a=new e.TileSource(i);a.getTileUrl=i.getTileUrl;o(a)}else{var h=e.TileSource.determineType(s,i);if(!h){r({message:"Unable to load TileSource",source:i});return}var c=h.prototype.configure.apply(s,[i]);l(new h(c),i)}}else l(i,i)})}(this,t.tileSource,t,function(e){n.tileSource=e;s()},function(e){e.options=t;o(e);s()})}function s(){var t,n,o;for(;i._loadQueue.length&&(t=i._loadQueue[0]).tileSource;){i._loadQueue.splice(0,1);if(t.options.replace){var s=i.world.getIndexOfItem(t.options.replaceItem);-1!=s&&(t.options.index=s);i.world.removeItem(t.options.replaceItem)}n=new e.TiledImage({viewer:i,source:t.tileSource,viewport:i.viewport,drawer:i.drawer,tileCache:i.tileCache,imageLoader:i.imageLoader,x:t.options.x,y:t.options.y,width:t.options.width,height:t.options.height,fitBounds:t.options.fitBounds,fitBoundsPlacement:t.options.fitBoundsPlacement,clip:t.options.clip,placeholderFillStyle:t.options.placeholderFillStyle,opacity:t.options.opacity,preload:t.options.preload,degrees:t.options.degrees,compositeOperation:t.options.compositeOperation,springStiffness:i.springStiffness,animationTime:i.animationTime,minZoomImageRatio:i.minZoomImageRatio,wrapHorizontal:i.wrapHorizontal,wrapVertical:i.wrapVertical,immediateRender:i.immediateRender,blendTime:i.blendTime,alwaysBlend:i.alwaysBlend,minPixelRatio:i.minPixelRatio,smoothTileEdgesMinZoom:i.smoothTileEdgesMinZoom,iOSDevice:i.iOSDevice,crossOriginPolicy:t.options.crossOriginPolicy,ajaxWithCredentials:t.options.ajaxWithCredentials,loadTilesWithAjax:t.options.loadTilesWithAjax,ajaxHeaders:t.options.ajaxHeaders,debugMode:i.debugMode});i.collectionMode&&i.world.setAutoRefigureSizes(!1);i.world.addItem(n,{index:t.options.index});0===i._loadQueue.length&&r(t);1!==i.world.getItemCount()||i.preserveViewport||i.viewport.goHome(!0);if(i.navigator){o=e.extend({},t.options,{replace:!1,originalTiledImage:n,tileSource:t.tileSource});i.navigator.addTiledImage(o)}t.options.success&&t.options.success({item:n})}}},addSimpleImage:function(t){e.console.assert(t,"[Viewer.addSimpleImage] options is required");e.console.assert(t.url,"[Viewer.addSimpleImage] options.url is required");var i=e.extend({},t,{tileSource:{type:"image",url:t.url}});delete i.url;this.addTiledImage(i)},addLayer:function(t){var i=this;e.console.error("[Viewer.addLayer] this function is deprecated; use Viewer.addTiledImage() instead.");var n=e.extend({},t,{success:function(e){i.raiseEvent("add-layer",{options:t,drawer:e.item})},error:function(e){i.raiseEvent("add-layer-failed",e)}});this.addTiledImage(n);return this},getLayerAtLevel:function(t){e.console.error("[Viewer.getLayerAtLevel] this function is deprecated; use World.getItemAt() instead.");return this.world.getItemAt(t)},getLevelOfLayer:function(t){e.console.error("[Viewer.getLevelOfLayer] this function is deprecated; use World.getIndexOfItem() instead.");return this.world.getIndexOfItem(t)},getLayersCount:function(){e.console.error("[Viewer.getLayersCount] this function is deprecated; use World.getItemCount() instead.");return this.world.getItemCount()},setLayerLevel:function(t,i){e.console.error("[Viewer.setLayerLevel] this function is deprecated; use World.setItemIndex() instead.");return this.world.setItemIndex(t,i)},removeLayer:function(t){e.console.error("[Viewer.removeLayer] this function is deprecated; use World.removeItem() instead.");return this.world.removeItem(t)},forceRedraw:function(){t[this.hash].forceRedraw=!0;return this},bindSequenceControls:function(){var t=e.delegate(this,c),i=e.delegate(this,u),n=e.delegate(this,j),o=e.delegate(this,U),r=this.navImages,s=!0;if(this.showSequenceControl){(this.previousButton||this.nextButton)&&(s=!1);this.previousButton=new e.Button({element:this.previousButton?e.getElement(this.previousButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.PreviousPage"),srcRest:O(this.prefixUrl,r.previous.REST),srcGroup:O(this.prefixUrl,r.previous.GROUP),srcHover:O(this.prefixUrl,r.previous.HOVER),srcDown:O(this.prefixUrl,r.previous.DOWN),onRelease:o,onFocus:t,onBlur:i});this.nextButton=new e.Button({element:this.nextButton?e.getElement(this.nextButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.NextPage"),srcRest:O(this.prefixUrl,r.next.REST),srcGroup:O(this.prefixUrl,r.next.GROUP),srcHover:O(this.prefixUrl,r.next.HOVER),srcDown:O(this.prefixUrl,r.next.DOWN),onRelease:n,onFocus:t,onBlur:i});this.navPrevNextWrap||this.previousButton.disable();this.tileSources&&this.tileSources.length||this.nextButton.disable();if(s){this.paging=new e.ButtonGroup({buttons:[this.previousButton,this.nextButton],clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold});this.pagingControl=this.paging.element;this.toolbar?this.toolbar.addControl(this.pagingControl,{anchor:e.ControlAnchor.BOTTOM_RIGHT}):this.addControl(this.pagingControl,{anchor:this.sequenceControlAnchor||e.ControlAnchor.TOP_LEFT})}}return this},bindStandardControls:function(){var t=e.delegate(this,I),i=e.delegate(this,B),n=e.delegate(this,M),o=e.delegate(this,k),r=e.delegate(this,H),s=e.delegate(this,F),a=e.delegate(this,N),l=e.delegate(this,A),h=e.delegate(this,W),d=e.delegate(this,V),p=e.delegate(this,c),g=e.delegate(this,u),m=this.navImages,v=[],f=!0;if(this.showNavigationControl){(this.zoomInButton||this.zoomOutButton||this.homeButton||this.fullPageButton||this.rotateLeftButton||this.rotateRightButton||this.flipButton)&&(f=!1);if(this.showZoomControl){v.push(this.zoomInButton=new e.Button({element:this.zoomInButton?e.getElement(this.zoomInButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.ZoomIn"),srcRest:O(this.prefixUrl,m.zoomIn.REST),srcGroup:O(this.prefixUrl,m.zoomIn.GROUP),srcHover:O(this.prefixUrl,m.zoomIn.HOVER),srcDown:O(this.prefixUrl,m.zoomIn.DOWN),onPress:t,onRelease:i,onClick:n,onEnter:t,onExit:i,onFocus:p,onBlur:g}));v.push(this.zoomOutButton=new e.Button({element:this.zoomOutButton?e.getElement(this.zoomOutButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.ZoomOut"),srcRest:O(this.prefixUrl,m.zoomOut.REST),srcGroup:O(this.prefixUrl,m.zoomOut.GROUP),srcHover:O(this.prefixUrl,m.zoomOut.HOVER),srcDown:O(this.prefixUrl,m.zoomOut.DOWN),onPress:o,onRelease:i,onClick:r,onEnter:o,onExit:i,onFocus:p,onBlur:g}))}this.showHomeControl&&v.push(this.homeButton=new e.Button({element:this.homeButton?e.getElement(this.homeButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.Home"),srcRest:O(this.prefixUrl,m.home.REST),srcGroup:O(this.prefixUrl,m.home.GROUP),srcHover:O(this.prefixUrl,m.home.HOVER),srcDown:O(this.prefixUrl,m.home.DOWN),onRelease:s,onFocus:p,onBlur:g}));this.showFullPageControl&&v.push(this.fullPageButton=new e.Button({element:this.fullPageButton?e.getElement(this.fullPageButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.FullPage"),srcRest:O(this.prefixUrl,m.fullpage.REST),srcGroup:O(this.prefixUrl,m.fullpage.GROUP),srcHover:O(this.prefixUrl,m.fullpage.HOVER),srcDown:O(this.prefixUrl,m.fullpage.DOWN),onRelease:a,onFocus:p,onBlur:g}));if(this.showRotationControl){v.push(this.rotateLeftButton=new e.Button({element:this.rotateLeftButton?e.getElement(this.rotateLeftButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.RotateLeft"),srcRest:O(this.prefixUrl,m.rotateleft.REST),srcGroup:O(this.prefixUrl,m.rotateleft.GROUP),srcHover:O(this.prefixUrl,m.rotateleft.HOVER),srcDown:O(this.prefixUrl,m.rotateleft.DOWN),onRelease:l,onFocus:p,onBlur:g}));v.push(this.rotateRightButton=new e.Button({element:this.rotateRightButton?e.getElement(this.rotateRightButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.RotateRight"),srcRest:O(this.prefixUrl,m.rotateright.REST),srcGroup:O(this.prefixUrl,m.rotateright.GROUP),srcHover:O(this.prefixUrl,m.rotateright.HOVER),srcDown:O(this.prefixUrl,m.rotateright.DOWN),onRelease:h,onFocus:p,onBlur:g}))}this.showFlipControl&&v.push(this.flipButton=new e.Button({element:this.flipButton?e.getElement(this.flipButton):null,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,tooltip:e.getString("Tooltips.Flip"),srcRest:O(this.prefixUrl,m.flip.REST),srcGroup:O(this.prefixUrl,m.flip.GROUP),srcHover:O(this.prefixUrl,m.flip.HOVER),srcDown:O(this.prefixUrl,m.flip.DOWN),onRelease:d,onFocus:p,onBlur:g}));if(f){this.buttons=new e.ButtonGroup({buttons:v,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold});this.navControl=this.buttons.element;this.addHandler("open",e.delegate(this,L));this.toolbar?this.toolbar.addControl(this.navControl,{anchor:this.navigationControlAnchor||e.ControlAnchor.TOP_LEFT}):this.addControl(this.navControl,{anchor:this.navigationControlAnchor||e.ControlAnchor.TOP_LEFT})}}return this},currentPage:function(){return this._sequenceIndex},goToPage:function(e){if(this.tileSources&&e>=0&&e<this.tileSources.length){this._sequenceIndex=e;this._updateSequenceButtons(e);this.open(this.tileSources[e]);this.referenceStrip&&this.referenceStrip.setFocus(e);this.raiseEvent("page",{page:e})}return this},addOverlay:function(t,i,n,s){var a;a=e.isPlainObject(t)?t:{element:t,location:i,placement:n,onDraw:s};t=e.getElement(a.element);if(r(this.currentOverlays,t)>=0)return this;var l=o(this,a);this.currentOverlays.push(l);l.drawHTML(this.overlaysContainer,this.viewport);this.raiseEvent("add-overlay",{element:t,location:a.location,placement:a.placement});return this},updateOverlay:function(i,n,o){var s;i=e.getElement(i);if((s=r(this.currentOverlays,i))>=0){this.currentOverlays[s].update(n,o);t[this.hash].forceRedraw=!0;this.raiseEvent("update-overlay",{element:i,location:n,placement:o})}return this},removeOverlay:function(i){var n;i=e.getElement(i);if((n=r(this.currentOverlays,i))>=0){this.currentOverlays[n].destroy();this.currentOverlays.splice(n,1);t[this.hash].forceRedraw=!0;this.raiseEvent("remove-overlay",{element:i})}return this},clearOverlays:function(){for(;this.currentOverlays.length>0;)this.currentOverlays.pop().destroy();t[this.hash].forceRedraw=!0;this.raiseEvent("clear-overlay",{});return this},getOverlayById:function(t){var i;t=e.getElement(t);return(i=r(this.currentOverlays,t))>=0?this.currentOverlays[i]:null},_updateSequenceButtons:function(e){this.nextButton&&(this.tileSources&&this.tileSources.length-1!==e?this.nextButton.enable():this.navPrevNextWrap||this.nextButton.disable());this.previousButton&&(e>0?this.previousButton.enable():this.navPrevNextWrap||this.previousButton.disable())},_showMessage:function(t){this._hideMessage();var i=e.makeNeutralElement("div");i.appendChild(document.createTextNode(t));this.messageDiv=e.makeCenteredNode(i);e.addClass(this.messageDiv,"openseadragon-message");this.container.appendChild(this.messageDiv)},_hideMessage:function(){var e=this.messageDiv;if(e){e.parentNode.removeChild(e);delete this.messageDiv}},gestureSettingsByDeviceType:function(e){switch(e){case"mouse":return this.gestureSettingsMouse;case"touch":return this.gestureSettingsTouch;case"pen":return this.gestureSettingsPen;default:return this.gestureSettingsUnknown}},_drawOverlays:function(){var e,t=this.currentOverlays.length;for(e=0;e<t;e++)this.currentOverlays[e].drawHTML(this.overlaysContainer,this.viewport)},_cancelPendingImages:function(){this._loadQueue=[]},removeReferenceStrip:function(){this.showReferenceStrip=!1;if(this.referenceStrip){this.referenceStrip.destroy();this.referenceStrip=null}},addReferenceStrip:function(){this.showReferenceStrip=!0;if(this.sequenceMode){if(this.referenceStrip)return;if(this.tileSources.length&&this.tileSources.length>1){this.referenceStrip=new e.ReferenceStrip({id:this.referenceStripElement,position:this.referenceStripPosition,sizeRatio:this.referenceStripSizeRatio,scroll:this.referenceStripScroll,height:this.referenceStripHeight,width:this.referenceStripWidth,tileSources:this.tileSources,prefixUrl:this.prefixUrl,viewer:this});this.referenceStrip.setFocus(this._sequenceIndex)}}else e.console.warn('Attempting to display a reference strip while "sequenceMode" is off.')}});function n(t){t=e.getElement(t);return new e.Point(0===t.clientWidth?1:t.clientWidth,0===t.clientHeight?1:t.clientHeight)}function o(t,i){if(i instanceof e.Overlay)return i;var n=null;if(i.element)n=e.getElement(i.element);else{var o=i.id?i.id:"openseadragon-overlay-"+Math.floor(1e7*Math.random());(n=e.getElement(i.id))||((n=document.createElement("a")).href="#/overlay/"+o);n.id=o;e.addClass(n,i.className?i.className:"openseadragon-overlay")}var r=i.location;var s=i.width;var a=i.height;if(!r){var l=i.x;var h=i.y;if(void 0!==i.px){var c=t.viewport.imageToViewportRectangle(new e.Rect(i.px,i.py,s||0,a||0));l=c.x;h=c.y;s=void 0!==s?c.width:void 0;a=void 0!==a?c.height:void 0}r=new e.Point(l,h)}var u=i.placement;u&&"string"===e.type(u)&&(u=e.Placement[i.placement.toUpperCase()]);return new e.Overlay({element:n,location:r,placement:u,onDraw:i.onDraw,checkResize:i.checkResize,width:s,height:a,rotationMode:i.rotationMode})}function r(e,t){var i;for(i=e.length-1;i>=0;i--)if(e[i].element===t)return i;return-1}function s(t,i){return e.requestAnimationFrame(function(){i(t)})}function a(t){e.requestAnimationFrame(function(){!function(t){var i,n,o,r;if(t.controlsShouldFade){i=e.now();n=i-t.controlsFadeBeginTime;o=1-n/t.controlsFadeLength;o=Math.min(1,o);o=Math.max(0,o);for(r=t.controls.length-1;r>=0;r--)t.controls[r].autoFade&&t.controls[r].setOpacity(o);o>0&&a(t)}}(t)})}function l(t){if(t.autoHideControls){t.controlsShouldFade=!0;t.controlsFadeBeginTime=e.now()+t.controlsFadeDelay;window.setTimeout(function(){a(t)},t.controlsFadeDelay)}}function h(e){var t;e.controlsShouldFade=!1;for(t=e.controls.length-1;t>=0;t--)e.controls[t].setOpacity(1)}function c(){h(this)}function u(){l(this)}function d(t){var i={originalEvent:t.originalEvent,preventDefaultAction:t.preventDefaultAction,preventVerticalPan:t.preventVerticalPan,preventHorizontalPan:t.preventHorizontalPan};this.raiseEvent("canvas-key",i);if(i.preventDefaultAction||t.ctrl||t.alt||t.meta)return!0;switch(t.keyCode){case 38:if(!i.preventVerticalPan){t.shift?this.viewport.zoomBy(1.1):this.viewport.panBy(this.viewport.deltaPointsFromPixels(new e.Point(0,-this.pixelsPerArrowPress)));this.viewport.applyConstraints()}return!1;case 40:if(!i.preventVerticalPan){t.shift?this.viewport.zoomBy(.9):this.viewport.panBy(this.viewport.deltaPointsFromPixels(new e.Point(0,this.pixelsPerArrowPress)));this.viewport.applyConstraints()}return!1;case 37:if(!i.preventHorizontalPan){this.viewport.panBy(this.viewport.deltaPointsFromPixels(new e.Point(-this.pixelsPerArrowPress,0)));this.viewport.applyConstraints()}return!1;case 39:if(!i.preventHorizontalPan){this.viewport.panBy(this.viewport.deltaPointsFromPixels(new e.Point(this.pixelsPerArrowPress,0)));this.viewport.applyConstraints()}return!1;default:return!0}}function p(t){var i={originalEvent:t.originalEvent,preventDefaultAction:t.preventDefaultAction,preventVerticalPan:t.preventVerticalPan,preventHorizontalPan:t.preventHorizontalPan};this.raiseEvent("canvas-key",i);if(i.preventDefaultAction||t.ctrl||t.alt||t.meta)return!0;switch(t.keyCode){case 43:case 61:this.viewport.zoomBy(1.1);this.viewport.applyConstraints();return!1;case 45:this.viewport.zoomBy(.9);this.viewport.applyConstraints();return!1;case 48:this.viewport.goHome();this.viewport.applyConstraints();return!1;case 119:case 87:if(!i.preventVerticalPan){t.shift?this.viewport.zoomBy(1.1):this.viewport.panBy(this.viewport.deltaPointsFromPixels(new e.Point(0,-40)));this.viewport.applyConstraints()}return!1;case 115:case 83:if(!i.preventVerticalPan){t.shift?this.viewport.zoomBy(.9):this.viewport.panBy(this.viewport.deltaPointsFromPixels(new e.Point(0,40)));this.viewport.applyConstraints()}return!1;case 97:if(!i.preventHorizontalPan){this.viewport.panBy(this.viewport.deltaPointsFromPixels(new e.Point(-40,0)));this.viewport.applyConstraints()}return!1;case 100:if(!i.preventHorizontalPan){this.viewport.panBy(this.viewport.deltaPointsFromPixels(new e.Point(40,0)));this.viewport.applyConstraints()}return!1;case 114:this.viewport.flipped?this.viewport.setRotation(this.viewport.degrees-90):this.viewport.setRotation(this.viewport.degrees+90);this.viewport.applyConstraints();return!1;case 82:this.viewport.flipped?this.viewport.setRotation(this.viewport.degrees+90):this.viewport.setRotation(this.viewport.degrees-90);this.viewport.applyConstraints();return!1;case 102:this.viewport.toggleFlip();return!1;default:return!0}}function g(e){var t;document.activeElement==this.canvas||this.canvas.focus();this.viewport.flipped&&(e.position.x=this.viewport.getContainerSize().x-e.position.x);var i={tracker:e.eventSource,position:e.position,quick:e.quick,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.raiseEvent("canvas-click",i);if(!i.preventDefaultAction&&this.viewport&&e.quick&&(t=this.gestureSettingsByDeviceType(e.pointerType)).clickToZoom){this.viewport.zoomBy(e.shift?1/this.zoomPerClick:this.zoomPerClick,t.zoomToRefPoint?this.viewport.pointFromPixel(e.position,!0):null);this.viewport.applyConstraints()}}function m(e){var t;var i={tracker:e.eventSource,position:e.position,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.raiseEvent("canvas-double-click",i);if(!i.preventDefaultAction&&this.viewport&&(t=this.gestureSettingsByDeviceType(e.pointerType)).dblClickToZoom){this.viewport.zoomBy(e.shift?1/this.zoomPerClick:this.zoomPerClick,t.zoomToRefPoint?this.viewport.pointFromPixel(e.position,!0):null);this.viewport.applyConstraints()}}function v(e){var t;var i={tracker:e.eventSource,position:e.position,delta:e.delta,speed:e.speed,direction:e.direction,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.raiseEvent("canvas-drag",i);if(!i.preventDefaultAction&&this.viewport){t=this.gestureSettingsByDeviceType(e.pointerType);this.panHorizontal||(e.delta.x=0);this.panVertical||(e.delta.y=0);this.viewport.flipped&&(e.delta.x=-e.delta.x);if(this.constrainDuringPan){var n=this.viewport.deltaPointsFromPixels(e.delta.negate());this.viewport.centerSpringX.target.value+=n.x;this.viewport.centerSpringY.target.value+=n.y;var o=this.viewport.getBounds();var r=this.viewport.getConstrainedBounds();this.viewport.centerSpringX.target.value-=n.x;this.viewport.centerSpringY.target.value-=n.y;o.x!=r.x&&(e.delta.x=0);o.y!=r.y&&(e.delta.y=0)}this.viewport.panBy(this.viewport.deltaPointsFromPixels(e.delta.negate()),t.flickEnabled&&!this.constrainDuringPan)}}function f(t){if(!t.preventDefaultAction&&this.viewport){var i=this.gestureSettingsByDeviceType(t.pointerType);if(i.flickEnabled&&t.speed>=i.flickMinSpeed){var n=0;this.panHorizontal&&(n=i.flickMomentum*t.speed*Math.cos(t.direction));var o=0;this.panVertical&&(o=i.flickMomentum*t.speed*Math.sin(t.direction));var r=this.viewport.pixelFromPoint(this.viewport.getCenter(!0));var s=this.viewport.pointFromPixel(new e.Point(r.x-n,r.y-o));this.viewport.panTo(s,!1)}this.viewport.applyConstraints()}this.raiseEvent("canvas-drag-end",{tracker:t.eventSource,position:t.position,speed:t.speed,direction:t.direction,shift:t.shift,originalEvent:t.originalEvent})}function w(e){this.raiseEvent("canvas-enter",{tracker:e.eventSource,pointerType:e.pointerType,position:e.position,buttons:e.buttons,pointers:e.pointers,insideElementPressed:e.insideElementPressed,buttonDownAny:e.buttonDownAny,originalEvent:e.originalEvent})}function y(t){window.location!=window.parent.location&&e.MouseTracker.resetAllMouseTrackers();this.raiseEvent("canvas-exit",{tracker:t.eventSource,pointerType:t.pointerType,position:t.position,buttons:t.buttons,pointers:t.pointers,insideElementPressed:t.insideElementPressed,buttonDownAny:t.buttonDownAny,originalEvent:t.originalEvent})}function T(e){this.raiseEvent("canvas-press",{tracker:e.eventSource,pointerType:e.pointerType,position:e.position,insideElementPressed:e.insideElementPressed,insideElementReleased:e.insideElementReleased,originalEvent:e.originalEvent})}function x(e){this.raiseEvent("canvas-release",{tracker:e.eventSource,pointerType:e.pointerType,position:e.position,insideElementPressed:e.insideElementPressed,insideElementReleased:e.insideElementReleased,originalEvent:e.originalEvent})}function S(e){this.raiseEvent("canvas-nonprimary-press",{tracker:e.eventSource,position:e.position,pointerType:e.pointerType,button:e.button,buttons:e.buttons,originalEvent:e.originalEvent})}function E(e){this.raiseEvent("canvas-nonprimary-release",{tracker:e.eventSource,position:e.position,pointerType:e.pointerType,button:e.button,buttons:e.buttons,originalEvent:e.originalEvent})}function P(e){var t,i,n;if(!e.preventDefaultAction&&this.viewport){if((t=this.gestureSettingsByDeviceType(e.pointerType)).pinchToZoom){i=this.viewport.pointFromPixel(e.center,!0);n=this.viewport.pointFromPixel(e.lastCenter,!0).minus(i);this.panHorizontal||(n.x=0);this.panVertical||(n.y=0);this.viewport.zoomBy(e.distance/e.lastDistance,i,!0);t.zoomToRefPoint&&this.viewport.panBy(n,!0);this.viewport.applyConstraints()}if(t.pinchRotate){var o=Math.atan2(e.gesturePoints[0].currentPos.y-e.gesturePoints[1].currentPos.y,e.gesturePoints[0].currentPos.x-e.gesturePoints[1].currentPos.x);var r=Math.atan2(e.gesturePoints[0].lastPos.y-e.gesturePoints[1].lastPos.y,e.gesturePoints[0].lastPos.x-e.gesturePoints[1].lastPos.x);this.viewport.setRotation(this.viewport.getRotation()+(o-r)*(180/Math.PI))}}this.raiseEvent("canvas-pinch",{tracker:e.eventSource,gesturePoints:e.gesturePoints,lastCenter:e.lastCenter,center:e.center,lastDistance:e.lastDistance,distance:e.distance,shift:e.shift,originalEvent:e.originalEvent});return!1}function R(t){var i,n,o;if((o=e.now())-this._lastScrollTime>this.minScrollDeltaTime){this._lastScrollTime=o;this.viewport.flipped&&(t.position.x=this.viewport.getContainerSize().x-t.position.x);if(!t.preventDefaultAction&&this.viewport&&(i=this.gestureSettingsByDeviceType(t.pointerType)).scrollToZoom){n=Math.pow(this.zoomPerScroll,t.scroll);this.viewport.zoomBy(n,i.zoomToRefPoint?this.viewport.pointFromPixel(t.position,!0):null);this.viewport.applyConstraints()}this.raiseEvent("canvas-scroll",{tracker:t.eventSource,position:t.position,scroll:t.scroll,shift:t.shift,originalEvent:t.originalEvent});if(i&&i.scrollToZoom)return!1}else if((i=this.gestureSettingsByDeviceType(t.pointerType))&&i.scrollToZoom)return!1}function _(e){t[this.hash].mouseInside=!0;h(this);this.raiseEvent("container-enter",{tracker:e.eventSource,position:e.position,buttons:e.buttons,pointers:e.pointers,insideElementPressed:e.insideElementPressed,buttonDownAny:e.buttonDownAny,originalEvent:e.originalEvent})}function C(e){if(e.pointers<1){t[this.hash].mouseInside=!1;t[this.hash].animating||l(this)}this.raiseEvent("container-exit",{tracker:e.eventSource,position:e.position,buttons:e.buttons,pointers:e.pointers,insideElementPressed:e.insideElementPressed,buttonDownAny:e.buttonDownAny,originalEvent:e.originalEvent})}function b(e){!function(e){if(e._opening)return;if(e.autoResize){var i=n(e.container);var o=t[e.hash].prevContainerSize;if(!i.equals(o)){var r=e.viewport;if(e.preserveImageSizeOnResize){var s=o.x/i.x;var a=r.getZoom()*s;var c=r.getCenter();r.resize(i,!1);r.zoomTo(a,null,!0);r.panTo(c,!0)}else{var u=r.getBounds();r.resize(i,!0);r.fitBoundsWithConstraints(u,!0)}t[e.hash].prevContainerSize=i;t[e.hash].forceRedraw=!0}}var d=e.viewport.update();var p=e.world.update()||d;d&&e.raiseEvent("viewport-change");e.referenceStrip&&(p=e.referenceStrip.update(e.viewport)||p);if(!t[e.hash].animating&&p){e.raiseEvent("animation-start");h(e)}if(p||t[e.hash].forceRedraw||e.world.needsDraw()){!function(e){e.imageLoader.clear();e.drawer.clear();e.world.draw();e.raiseEvent("update-viewport",{})}(e);e._drawOverlays();e.navigator&&e.navigator.update(e.viewport);t[e.hash].forceRedraw=!1;p&&e.raiseEvent("animation")}if(t[e.hash].animating&&!p){e.raiseEvent("animation-finish");t[e.hash].mouseInside||l(e)}t[e.hash].animating=p}(e);e.isOpen()?e._updateRequestId=s(e,b):e._updateRequestId=!1}function O(e,t){return e?e+t:t}function I(){t[this.hash].lastZoomTime=e.now();t[this.hash].zoomFactor=this.zoomPerSecond;t[this.hash].zooming=!0;D(this)}function k(){t[this.hash].lastZoomTime=e.now();t[this.hash].zoomFactor=1/this.zoomPerSecond;t[this.hash].zooming=!0;D(this)}function B(){t[this.hash].zooming=!1}function D(t){e.requestAnimationFrame(e.delegate(t,z))}function z(){var i,n,o;if(t[this.hash].zooming&&this.viewport){n=(i=e.now())-t[this.hash].lastZoomTime;o=Math.pow(t[this.hash].zoomFactor,n/1e3);this.viewport.zoomBy(o);this.viewport.applyConstraints();t[this.hash].lastZoomTime=i;D(this)}}function M(){if(this.viewport){t[this.hash].zooming=!1;this.viewport.zoomBy(this.zoomPerClick/1);this.viewport.applyConstraints()}}function H(){if(this.viewport){t[this.hash].zooming=!1;this.viewport.zoomBy(1/this.zoomPerClick);this.viewport.applyConstraints()}}function L(){this.buttons.emulateEnter();this.buttons.emulateExit()}function F(){this.viewport&&this.viewport.goHome()}function N(){this.isFullPage()&&!e.isFullScreen()?this.setFullPage(!1):this.setFullScreen(!this.isFullPage());this.buttons&&this.buttons.emulateExit();this.fullPageButton.element.focus();this.viewport&&this.viewport.applyConstraints()}function A(){if(this.viewport){var t=this.viewport.getRotation();t=this.viewport.flipped?e.positiveModulo(t+90,360):e.positiveModulo(t-90,360);this.viewport.setRotation(t)}}function W(){if(this.viewport){var t=this.viewport.getRotation();t=this.viewport.flipped?e.positiveModulo(t-90,360):e.positiveModulo(t+90,360);this.viewport.setRotation(t)}}function V(){this.viewport.toggleFlip()}function U(){var e=this._sequenceIndex-1;this.navPrevNextWrap&&e<0&&(e+=this.tileSources.length);this.goToPage(e)}function j(){var e=this._sequenceIndex+1;this.navPrevNextWrap&&e>=this.tileSources.length&&(e=0);this.goToPage(e)}}(OpenSeadragon);!function(e){e.Navigator=function(s){var a,l,h=s.viewer,c=this;if(s.id){this.element=document.getElementById(s.id);s.controlOptions={anchor:e.ControlAnchor.NONE,attachToViewer:!1,autoFade:!1}}else{s.id="navigator-"+e.now();this.element=e.makeNeutralElement("div");s.controlOptions={anchor:e.ControlAnchor.TOP_RIGHT,attachToViewer:!0,autoFade:s.autoFade};if(s.position)if("BOTTOM_RIGHT"==s.position)s.controlOptions.anchor=e.ControlAnchor.BOTTOM_RIGHT;else if("BOTTOM_LEFT"==s.position)s.controlOptions.anchor=e.ControlAnchor.BOTTOM_LEFT;else if("TOP_RIGHT"==s.position)s.controlOptions.anchor=e.ControlAnchor.TOP_RIGHT;else if("TOP_LEFT"==s.position)s.controlOptions.anchor=e.ControlAnchor.TOP_LEFT;else if("ABSOLUTE"==s.position){s.controlOptions.anchor=e.ControlAnchor.ABSOLUTE;s.controlOptions.top=s.top;s.controlOptions.left=s.left;s.controlOptions.height=s.height;s.controlOptions.width=s.width}}this.element.id=s.id;this.element.className+=" navigator";(s=e.extend(!0,{sizeRatio:e.DEFAULT_SETTINGS.navigatorSizeRatio},s,{element:this.element,tabIndex:-1,showNavigator:!1,mouseNavEnabled:!1,showNavigationControl:!1,showSequenceControl:!1,immediateRender:!0,blendTime:0,animationTime:0,autoResize:s.autoResize,minZoomImageRatio:1,background:s.background,opacity:s.opacity,borderColor:s.borderColor,displayRegionColor:s.displayRegionColor})).minPixelRatio=this.minPixelRatio=h.minPixelRatio;e.setElementTouchActionNone(this.element);this.borderWidth=2;this.fudge=new e.Point(1,1);this.totalBorderWidths=new e.Point(2*this.borderWidth,2*this.borderWidth).minus(this.fudge);s.controlOptions.anchor!=e.ControlAnchor.NONE&&function(e,t){e.margin="0px";e.border=t+"px solid "+s.borderColor;e.padding="0px";e.background=s.background;e.opacity=s.opacity;e.overflow="hidden"}(this.element.style,this.borderWidth);this.displayRegion=e.makeNeutralElement("div");this.displayRegion.id=this.element.id+"-displayregion";this.displayRegion.className="displayregion";!function(e,t){e.position="relative";e.top="0px";e.left="0px";e.fontSize="0px";e.overflow="hidden";e.border=t+"px solid "+s.displayRegionColor;e.margin="0px";e.padding="0px";e.background="transparent";e.float="left";e.cssFloat="left";e.styleFloat="left";e.zIndex=999999999;e.cursor="default"}(this.displayRegion.style,this.borderWidth);this.displayRegionContainer=e.makeNeutralElement("div");this.displayRegionContainer.id=this.element.id+"-displayregioncontainer";this.displayRegionContainer.className="displayregioncontainer";this.displayRegionContainer.style.width="100%";this.displayRegionContainer.style.height="100%";h.addControl(this.element,s.controlOptions);this._resizeWithViewer=s.controlOptions.anchor!=e.ControlAnchor.ABSOLUTE&&s.controlOptions.anchor!=e.ControlAnchor.NONE;if(this._resizeWithViewer){if(s.width&&s.height){this.element.style.height="number"==typeof s.height?s.height+"px":s.height;this.element.style.width="number"==typeof s.width?s.width+"px":s.width}else{a=e.getElementSize(h.element);this.element.style.height=Math.round(a.y*s.sizeRatio)+"px";this.element.style.width=Math.round(a.x*s.sizeRatio)+"px";this.oldViewerSize=a}l=e.getElementSize(this.element);this.elementArea=l.x*l.y}this.oldContainerSize=new e.Point(0,0);e.Viewer.apply(this,[s]);this.displayRegionContainer.appendChild(this.displayRegion);this.element.getElementsByTagName("div")[0].appendChild(this.displayRegionContainer);function u(e){r(c.displayRegionContainer,e);r(c.displayRegion,-e);c.viewport.setRotation(e)}if(s.navigatorRotate){u(s.viewer.viewport?s.viewer.viewport.getRotation():s.viewer.degrees||0);s.viewer.addHandler("rotate",function(e){u(e.degrees)})}this.innerTracker.destroy();this.innerTracker=new e.MouseTracker({element:this.element,dragHandler:e.delegate(this,i),clickHandler:e.delegate(this,t),releaseHandler:e.delegate(this,n),scrollHandler:e.delegate(this,o)});this.addHandler("reset-size",function(){c.viewport&&c.viewport.goHome(!0)});h.world.addHandler("item-index-change",function(e){window.setTimeout(function(){var t=c.world.getItemAt(e.previousIndex);c.world.setItemIndex(t,e.newIndex)},1)});h.world.addHandler("remove-item",function(e){var t=e.item;var i=c._getMatchingItem(t);i&&c.world.removeItem(i)});this.update(h.viewport)};e.extend(e.Navigator.prototype,e.EventSource.prototype,e.Viewer.prototype,{updateSize:function(){if(this.viewport){var t=new e.Point(0===this.container.clientWidth?1:this.container.clientWidth,0===this.container.clientHeight?1:this.container.clientHeight);if(!t.equals(this.oldContainerSize)){this.viewport.resize(t,!0);this.viewport.goHome(!0);this.oldContainerSize=t;this.drawer.clear();this.world.draw()}}},setFlip:function(e){this.viewport.setFlip(e);this.setDisplayTransform(this.viewer.viewport.getFlip()?"scale(-1,1)":"scale(1,1)");return this},setDisplayTransform:function(e){s(this.displayRegion,e);s(this.canvas,e);s(this.element,e)},update:function(t){var i,n,o,r,s,a;i=e.getElementSize(this.viewer.element);if(this._resizeWithViewer&&i.x&&i.y&&!i.equals(this.oldViewerSize)){this.oldViewerSize=i;if(this.maintainSizeRatio||!this.elementArea){n=i.x*this.sizeRatio;o=i.y*this.sizeRatio}else{n=Math.sqrt(this.elementArea*(i.x/i.y));o=this.elementArea/n}this.element.style.width=Math.round(n)+"px";this.element.style.height=Math.round(o)+"px";this.elementArea||(this.elementArea=n*o);this.updateSize()}if(t&&this.viewport){r=t.getBoundsNoRotate(!0);s=this.viewport.pixelFromPointNoRotate(r.getTopLeft(),!1);a=this.viewport.pixelFromPointNoRotate(r.getBottomRight(),!1).minus(this.totalBorderWidths);var l=this.displayRegion.style;l.display=this.world.getItemCount()?"block":"none";l.top=Math.round(s.y)+"px";l.left=Math.round(s.x)+"px";var h=Math.abs(s.x-a.x);var c=Math.abs(s.y-a.y);l.width=Math.round(Math.max(h,0))+"px";l.height=Math.round(Math.max(c,0))+"px"}},addTiledImage:function(t){var i=this;var n=t.originalTiledImage;delete t.original;var o=e.extend({},t,{success:function(e){var t=e.item;t._originalForNavigator=n;i._matchBounds(t,n,!0);function o(){i._matchBounds(t,n)}n.addHandler("bounds-change",o);n.addHandler("clip-change",o);n.addHandler("opacity-change",function(){i._matchOpacity(t,n)});n.addHandler("composite-operation-change",function(){i._matchCompositeOperation(t,n)})}});return e.Viewer.prototype.addTiledImage.apply(this,[o])},_getMatchingItem:function(e){var t=this.world.getItemCount();var i;for(var n=0;n<t;n++)if((i=this.world.getItemAt(n))._originalForNavigator===e)return i;return null},_matchBounds:function(e,t,i){var n=t.getBoundsNoRotate();e.setPosition(n.getTopLeft(),i);e.setWidth(n.width,i);e.setRotation(t.getRotation(),i);e.setClip(t.getClip())},_matchOpacity:function(e,t){e.setOpacity(t.opacity)},_matchCompositeOperation:function(e,t){e.setCompositeOperation(t.compositeOperation)}});function t(e){var t={tracker:e.eventSource,position:e.position,quick:e.quick,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.viewer.raiseEvent("navigator-click",t);if(!t.preventDefaultAction&&e.quick&&this.viewer.viewport&&(this.panVertical||this.panHorizontal)){this.viewer.viewport.flipped&&(e.position.x=this.viewport.getContainerSize().x-e.position.x);var i=this.viewport.pointFromPixel(e.position);this.panVertical?this.panHorizontal||(i.x=this.viewer.viewport.getCenter(!0).x):i.y=this.viewer.viewport.getCenter(!0).y;this.viewer.viewport.panTo(i);this.viewer.viewport.applyConstraints()}}function i(e){var t={tracker:e.eventSource,position:e.position,delta:e.delta,speed:e.speed,direction:e.direction,shift:e.shift,originalEvent:e.originalEvent,preventDefaultAction:e.preventDefaultAction};this.viewer.raiseEvent("navigator-drag",t);if(!t.preventDefaultAction&&this.viewer.viewport){this.panHorizontal||(e.delta.x=0);this.panVertical||(e.delta.y=0);this.viewer.viewport.flipped&&(e.delta.x=-e.delta.x);this.viewer.viewport.panBy(this.viewport.deltaPointsFromPixels(e.delta));this.viewer.constrainDuringPan&&this.viewer.viewport.applyConstraints()}}function n(e){e.insideElementPressed&&this.viewer.viewport&&this.viewer.viewport.applyConstraints()}function o(e){this.viewer.raiseEvent("navigator-scroll",{tracker:e.eventSource,position:e.position,scroll:e.scroll,shift:e.shift,originalEvent:e.originalEvent});return!1}function r(e,t){s(e,"rotate("+t+"deg)")}function s(e,t){e.style.webkitTransform=t;e.style.mozTransform=t;e.style.msTransform=t;e.style.oTransform=t;e.style.transform=t}}(OpenSeadragon);!function(e){var t={Errors:{Dzc:"Sorry, we don't support Deep Zoom Collections!",Dzi:"Hmm, this doesn't appear to be a valid Deep Zoom Image.",Xml:"Hmm, this doesn't appear to be a valid Deep Zoom Image.",ImageFormat:"Sorry, we don't support {0}-based Deep Zoom Images.",Security:"It looks like a security restriction stopped us from loading this Deep Zoom Image.",Status:"This space unintentionally left blank ({0} {1}).",OpenFailed:"Unable to open {0}: {1}"},Tooltips:{FullPage:"Toggle full page",Home:"Go home",ZoomIn:"Zoom in",ZoomOut:"Zoom out",NextPage:"Next page",PreviousPage:"Previous page",RotateLeft:"Rotate left",RotateRight:"Rotate right",Flip:"Flip Horizontally"}};e.extend(e,{getString:function(i){var n,o=i.split("."),r=null,s=arguments,a=t;for(n=0;n<o.length-1;n++)a=a[o[n]]||{};if("string"!=typeof(r=a[o[n]])){e.console.log("Untranslated source string:",i);r=""}return r.replace(/\{\d+\}/g,function(e){var t=parseInt(e.match(/\d+/),10)+1;return t<s.length?s[t]:""})},setString:function(e,i){var n,o=e.split("."),r=t;for(n=0;n<o.length-1;n++){r[o[n]]||(r[o[n]]={});r=r[o[n]]}r[o[n]]=i}})}(OpenSeadragon);!function(e){e.Point=function(e,t){this.x="number"==typeof e?e:0;this.y="number"==typeof t?t:0};e.Point.prototype={clone:function(){return new e.Point(this.x,this.y)},plus:function(t){return new e.Point(this.x+t.x,this.y+t.y)},minus:function(t){return new e.Point(this.x-t.x,this.y-t.y)},times:function(t){return new e.Point(this.x*t,this.y*t)},divide:function(t){return new e.Point(this.x/t,this.y/t)},negate:function(){return new e.Point(-this.x,-this.y)},distanceTo:function(e){return Math.sqrt(Math.pow(this.x-e.x,2)+Math.pow(this.y-e.y,2))},squaredDistanceTo:function(e){return Math.pow(this.x-e.x,2)+Math.pow(this.y-e.y,2)},apply:function(t){return new e.Point(t(this.x),t(this.y))},equals:function(t){return t instanceof e.Point&&this.x===t.x&&this.y===t.y},rotate:function(t,i){i=i||new e.Point(0,0);var n;var o;if(t%90==0){switch(e.positiveModulo(t,360)){case 0:n=1;o=0;break;case 90:n=0;o=1;break;case 180:n=-1;o=0;break;case 270:n=0;o=-1}}else{var r=t*Math.PI/180;n=Math.cos(r);o=Math.sin(r)}var s=n*(this.x-i.x)-o*(this.y-i.y)+i.x;var a=o*(this.x-i.x)+n*(this.y-i.y)+i.y;return new e.Point(s,a)},toString:function(){return"("+Math.round(100*this.x)/100+","+Math.round(100*this.y)/100+")"}}}(OpenSeadragon);!function(e){e.TileSource=function(t,i,n,o,r,s){var a=this;var l,h,c=arguments;l=e.isPlainObject(t)?t:{width:c[0],height:c[1],tileSize:c[2],tileOverlap:c[3],minLevel:c[4],maxLevel:c[5]};e.EventSource.call(this);e.extend(!0,this,l);if(!this.success)for(h=0;h<arguments.length;h++)if(e.isFunction(arguments[h])){this.success=arguments[h];break}this.success&&this.addHandler("ready",function(e){a.success(e)});"string"==e.type(arguments[0])&&(this.url=arguments[0]);if(this.url){this.aspectRatio=1;this.dimensions=new e.Point(10,10);this._tileWidth=0;this._tileHeight=0;this.tileOverlap=0;this.minLevel=0;this.maxLevel=0;this.ready=!1;this.getImageInfo(this.url)}else{this.ready=!0;this.aspectRatio=l.width&&l.height?l.width/l.height:1;this.dimensions=new e.Point(l.width,l.height);if(this.tileSize){this._tileWidth=this._tileHeight=this.tileSize;delete this.tileSize}else{if(this.tileWidth){this._tileWidth=this.tileWidth;delete this.tileWidth}else this._tileWidth=0;if(this.tileHeight){this._tileHeight=this.tileHeight;delete this.tileHeight}else this._tileHeight=0}this.tileOverlap=l.tileOverlap?l.tileOverlap:0;this.minLevel=l.minLevel?l.minLevel:0;this.maxLevel=void 0!==l.maxLevel&&null!==l.maxLevel?l.maxLevel:l.width&&l.height?Math.ceil(Math.log(Math.max(l.width,l.height))/Math.log(2)):0;this.success&&e.isFunction(this.success)&&this.success(this)}};e.TileSource.prototype={getTileSize:function(t){e.console.error("[TileSource.getTileSize] is deprecated.Use TileSource.getTileWidth() and TileSource.getTileHeight() instead");return this._tileWidth},getTileWidth:function(e){return this._tileWidth?this._tileWidth:this.getTileSize(e)},getTileHeight:function(e){return this._tileHeight?this._tileHeight:this.getTileSize(e)},getLevelScale:function(e){var t,i={};for(t=0;t<=this.maxLevel;t++)i[t]=1/Math.pow(2,this.maxLevel-t);this.getLevelScale=function(e){return i[e]};return this.getLevelScale(e)},getNumTiles:function(t){var i=this.getLevelScale(t),n=Math.ceil(i*this.dimensions.x/this.getTileWidth(t)),o=Math.ceil(i*this.dimensions.y/this.getTileHeight(t));return new e.Point(n,o)},getPixelRatio:function(t){var i=this.dimensions.times(this.getLevelScale(t)),n=1/i.x,o=1/i.y;return new e.Point(n,o)},getClosestLevel:function(){var e,t;for(e=this.minLevel+1;e<=this.maxLevel&&!((t=this.getNumTiles(e)).x>1||t.y>1);e++);return e-1},getTileAtPoint:function(t,i){var n=i.x>=0&&i.x<=1&&i.y>=0&&i.y<=1/this.aspectRatio;e.console.assert(n,"[TileSource.getTileAtPoint] must be called with a valid point.");var o=this.dimensions.x*this.getLevelScale(t);var r=i.x*o;var s=i.y*o;var a=Math.floor(r/this.getTileWidth(t));var l=Math.floor(s/this.getTileHeight(t));i.x>=1&&(a=this.getNumTiles(t).x-1);i.y>=1/this.aspectRatio-1e-15&&(l=this.getNumTiles(t).y-1);return new e.Point(a,l)},getTileBounds:function(t,i,n,o){var r=this.dimensions.times(this.getLevelScale(t)),s=this.getTileWidth(t),a=this.getTileHeight(t),l=0===i?0:s*i-this.tileOverlap,h=0===n?0:a*n-this.tileOverlap,c=s+(0===i?1:2)*this.tileOverlap,u=a+(0===n?1:2)*this.tileOverlap,d=1/r.x;c=Math.min(c,r.x-l);u=Math.min(u,r.y-h);return o?new e.Rect(0,0,c,u):new e.Rect(l*d,h*d,c*d,u*d)},getImageInfo:function(t){var i,n,o,r,s,a,l,h=this;t&&(l=(a=(s=t.split("/"))[s.length-1]).lastIndexOf("."))>-1&&(s[s.length-1]=a.slice(0,l));n=function(i){"string"==typeof i&&(i=e.parseXml(i));var n=e.TileSource.determineType(h,i,t);if(n){void 0===(r=n.prototype.configure.apply(h,[i,t])).ajaxWithCredentials&&(r.ajaxWithCredentials=h.ajaxWithCredentials);o=new n(r);h.ready=!0;h.raiseEvent("ready",{tileSource:o})}else h.raiseEvent("open-failed",{message:"Unable to load TileSource",source:t})};if(t.match(/\.js$/)){i=t.split("/").pop().replace(".js","");e.jsonp({url:t,async:!1,callbackName:i,callback:n})}else e.makeAjaxRequest({url:t,withCredentials:this.ajaxWithCredentials,headers:this.ajaxHeaders,success:function(t){var i=function(t){var i,n,o=t.responseText,r=t.status;{if(!t)throw new Error(e.getString("Errors.Security"));if(200!==t.status&&0!==t.status){r=t.status;i=404==r?"Not Found":t.statusText;throw new Error(e.getString("Errors.Status",r,i))}}if(o.match(/\s*<.*/))try{n=t.responseXML&&t.responseXML.documentElement?t.responseXML:e.parseXml(o)}catch(e){n=t.responseText}else if(o.match(/\s*[\{\[].*/))try{n=e.parseJSON(o)}catch(e){n=o}else n=o;return n}(t);n(i)},error:function(e,i){var n;try{n="HTTP "+e.status+" attempting to load TileSource"}catch(e){var o;o=void 0!==i&&i.toString?i.toString():"Unknown error";n=o+" attempting to load TileSource"}h.raiseEvent("open-failed",{message:n,source:t})}})},supports:function(e,t){return!1},configure:function(e,t){throw new Error("Method not implemented.")},getTileUrl:function(e,t,i){throw new Error("Method not implemented.")},getTileAjaxHeaders:function(e,t,i){return{}},tileExists:function(e,t,i){var n=this.getNumTiles(e);return e>=this.minLevel&&e<=this.maxLevel&&t>=0&&i>=0&&t<n.x&&i<n.y}};e.extend(!0,e.TileSource.prototype,e.EventSource.prototype);e.TileSource.determineType=function(t,i,n){var o;for(o in OpenSeadragon)if(o.match(/.+TileSource$/)&&e.isFunction(OpenSeadragon[o])&&e.isFunction(OpenSeadragon[o].prototype.supports)&&OpenSeadragon[o].prototype.supports.call(t,i,n))return OpenSeadragon[o];e.console.error("No TileSource was able to open %s %s",n,i)}}(OpenSeadragon);!function(e){e.DziTileSource=function(t,i,n,o,r,s,a,l,h){var c,u,d,p;p=e.isPlainObject(t)?t:{width:arguments[0],height:arguments[1],tileSize:arguments[2],tileOverlap:arguments[3],tilesUrl:arguments[4],fileFormat:arguments[5],displayRects:arguments[6],minLevel:arguments[7],maxLevel:arguments[8]};this._levelRects={};this.tilesUrl=p.tilesUrl;this.fileFormat=p.fileFormat;this.displayRects=p.displayRects;if(this.displayRects)for(c=this.displayRects.length-1;c>=0;c--)for(d=(u=this.displayRects[c]).minLevel;d<=u.maxLevel;d++){this._levelRects[d]||(this._levelRects[d]=[]);this._levelRects[d].push(u)}e.TileSource.apply(this,[p])};e.extend(e.DziTileSource.prototype,e.TileSource.prototype,{supports:function(e,t){var i;e.Image?i=e.Image.xmlns:e.documentElement&&("Image"!=e.documentElement.localName&&"Image"!=e.documentElement.tagName||(i=e.documentElement.namespaceURI));return-1!==(i=(i||"").toLowerCase()).indexOf("schemas.microsoft.com/deepzoom/2008")||-1!==i.indexOf("schemas.microsoft.com/deepzoom/2009")},configure:function(i,n){var o;o=e.isPlainObject(i)?t(this,i):function(i,n){if(!n||!n.documentElement)throw new Error(e.getString("Errors.Xml"));var o,r,s,a,l,h=n.documentElement,c=h.localName||h.tagName,u=n.documentElement.namespaceURI,d=null,p=[];if("Image"==c)try{void 0===(a=h.getElementsByTagName("Size")[0])&&(a=h.getElementsByTagNameNS(u,"Size")[0]);d={Image:{xmlns:"http://schemas.microsoft.com/deepzoom/2008",Url:h.getAttribute("Url"),Format:h.getAttribute("Format"),DisplayRect:null,Overlap:parseInt(h.getAttribute("Overlap"),10),TileSize:parseInt(h.getAttribute("TileSize"),10),Size:{Height:parseInt(a.getAttribute("Height"),10),Width:parseInt(a.getAttribute("Width"),10)}}};if(!e.imageFormatSupported(d.Image.Format))throw new Error(e.getString("Errors.ImageFormat",d.Image.Format.toUpperCase()));void 0===(o=h.getElementsByTagName("DisplayRect"))&&(o=h.getElementsByTagNameNS(u,"DisplayRect")[0]);for(l=0;l<o.length;l++){r=o[l];void 0===(s=r.getElementsByTagName("Rect")[0])&&(s=r.getElementsByTagNameNS(u,"Rect")[0]);p.push({Rect:{X:parseInt(s.getAttribute("X"),10),Y:parseInt(s.getAttribute("Y"),10),Width:parseInt(s.getAttribute("Width"),10),Height:parseInt(s.getAttribute("Height"),10),MinLevel:parseInt(r.getAttribute("MinLevel"),10),MaxLevel:parseInt(r.getAttribute("MaxLevel"),10)}})}p.length&&(d.Image.DisplayRect=p);return t(i,d)}catch(t){throw t instanceof Error?t:new Error(e.getString("Errors.Dzi"))}else{if("Collection"==c)throw new Error(e.getString("Errors.Dzc"));if("Error"==c){var g=h.getElementsByTagName("Message")[0];var m=g.firstChild.nodeValue;throw new Error(m)}}throw new Error(e.getString("Errors.Dzi"))}(this,i);if(n&&!o.tilesUrl){o.tilesUrl=n.replace(/([^\/]+?)(\.(dzi|xml|js)?(\?[^\/]*)?)?\/?$/,"$1_files/");-1!=n.search(/\.(dzi|xml|js)\?/)?o.queryParams=n.match(/\?.*/):o.queryParams=""}return o},getTileUrl:function(e,t,i){return[this.tilesUrl,e,"/",t,"_",i,".",this.fileFormat,this.queryParams].join("")},tileExists:function(e,t,i){var n,o,r,s,a,l,h,c=this._levelRects[e];if(this.minLevel&&e<this.minLevel||this.maxLevel&&e>this.maxLevel)return!1;if(!c||!c.length)return!0;for(h=c.length-1;h>=0;h--)if(!(e<(n=c[h]).minLevel||e>n.maxLevel)){o=this.getLevelScale(e);r=n.x*o;s=n.y*o;a=r+n.width*o;l=s+n.height*o;r=Math.floor(r/this._tileWidth);s=Math.floor(s/this._tileWidth);a=Math.ceil(a/this._tileWidth);l=Math.ceil(l/this._tileWidth);if(r<=t&&t<a&&s<=i&&i<l)return!0}return!1}});function t(t,i){var n,o,r=i.Image,s=r.Url,a=r.Format,l=r.Size,h=r.DisplayRect||[],c=parseInt(l.Width,10),u=parseInt(l.Height,10),d=parseInt(r.TileSize,10),p=parseInt(r.Overlap,10),g=[];for(o=0;o<h.length;o++){n=h[o].Rect;g.push(new e.DisplayRect(parseInt(n.X,10),parseInt(n.Y,10),parseInt(n.Width,10),parseInt(n.Height,10),parseInt(n.MinLevel,10),parseInt(n.MaxLevel,10)))}return e.extend(!0,{width:c,height:u,tileSize:d,tileOverlap:p,minLevel:null,maxLevel:null,tilesUrl:s,fileFormat:a,displayRects:g},i)}}(OpenSeadragon);!function(e){e.IIIFTileSource=function(t){e.extend(!0,this,t);if(!(this.height&&this.width&&this["@id"]))throw new Error("IIIF required parameters not provided.");t.tileSizePerScaleFactor={};if(this.tile_width&&this.tile_height){t.tileWidth=this.tile_width;t.tileHeight=this.tile_height}else if(this.tile_width)t.tileSize=this.tile_width;else if(this.tile_height)t.tileSize=this.tile_height;else if(this.tiles)if(1==this.tiles.length){t.tileWidth=this.tiles[0].width;t.tileHeight=this.tiles[0].height||this.tiles[0].width;this.scale_factors=this.tiles[0].scaleFactors}else{this.scale_factors=[];for(var i=0;i<this.tiles.length;i++)for(var n=0;n<this.tiles[i].scaleFactors.length;n++){var o=this.tiles[i].scaleFactors[n];this.scale_factors.push(o);t.tileSizePerScaleFactor[o]={width:this.tiles[i].width,height:this.tiles[i].height||this.tiles[i].width}}}else if(h=t.profile,-1==["http://library.stanford.edu/iiif/image-api/compliance.html#level0","http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0","http://iiif.io/api/image/2/level0.json"].indexOf(h[0])||-1!=h.indexOf("sizeByW")){var r=Math.min(this.height,this.width),s=[256,512,1024],a=[];for(var l=0;l<s.length;l++)s[l]<=r&&a.push(s[l]);a.length>0?t.tileSize=Math.max.apply(null,a):t.tileSize=r}else if(this.sizes&&this.sizes.length>0){this.emulateLegacyImagePyramid=!0;t.levels=function(e){var t=[];for(var i=0;i<e.sizes.length;i++)t.push({url:e["@id"]+"/full/"+e.sizes[i].width+",/0/default.jpg",width:e.sizes[i].width,height:e.sizes[i].height});return t.sort(function(e,t){return e.width-t.width})}(this);e.extend(!0,t,{width:t.levels[t.levels.length-1].width,height:t.levels[t.levels.length-1].height,tileSize:Math.max(t.height,t.width),tileOverlap:0,minLevel:0,maxLevel:t.levels.length-1});this.levels=t.levels}else e.console.error("Nothing in the info.json to construct image pyramids from");var h;if(!t.maxLevel&&!this.emulateLegacyImagePyramid)if(this.scale_factors){var c=Math.max.apply(null,this.scale_factors);t.maxLevel=Math.round(Math.log(c)*Math.LOG2E)}else t.maxLevel=Number(Math.ceil(Math.log(Math.max(this.width,this.height),2)));e.TileSource.apply(this,[t])};e.extend(e.IIIFTileSource.prototype,e.TileSource.prototype,{supports:function(e,t){return!(!e.protocol||"http://iiif.io/api/image"!=e.protocol)||(!(!e["@context"]||"http://library.stanford.edu/iiif/image-api/1.1/context.json"!=e["@context"]&&"http://iiif.io/api/image/1/context.json"!=e["@context"])||(!(!e.profile||0!==e.profile.indexOf("http://library.stanford.edu/iiif/image-api/compliance.html"))||(!!(e.identifier&&e.width&&e.height)||!(!e.documentElement||"info"!=e.documentElement.tagName||"http://library.stanford.edu/iiif/image-api/ns/"!=e.documentElement.namespaceURI))))},configure:function(t,i){if(e.isPlainObject(t)){if(t["@context"])return t;t["@context"]="http://iiif.io/api/image/1.0/context.json";t["@id"]=i.replace("/info.json","");return t}var n=function(t){if(!t||!t.documentElement)throw new Error(e.getString("Errors.Xml"));var i=t.documentElement,n=null;if("info"==i.tagName)try{!function t(i,n,o){var r,s;if(3==i.nodeType&&o){(s=i.nodeValue.trim()).match(/^\d*$/)&&(s=Number(s));if(n[o]){e.isArray(n[o])||(n[o]=[n[o]]);n[o].push(s)}else n[o]=s}else if(1==i.nodeType)for(r=0;r<i.childNodes.length;r++)t(i.childNodes[r],n,i.nodeName)}(i,n={});return n}catch(t){throw t instanceof Error?t:new Error(e.getString("Errors.IIIF"))}throw new Error(e.getString("Errors.IIIF"))}(t);n["@context"]="http://iiif.io/api/image/1.0/context.json";n["@id"]=i.replace("/info.xml","");return n},getTileWidth:function(t){if(this.emulateLegacyImagePyramid)return e.TileSource.prototype.getTileWidth.call(this,t);var i=Math.pow(2,this.maxLevel-t);return this.tileSizePerScaleFactor&&this.tileSizePerScaleFactor[i]?this.tileSizePerScaleFactor[i].width:this._tileWidth},getTileHeight:function(t){if(this.emulateLegacyImagePyramid)return e.TileSource.prototype.getTileHeight.call(this,t);var i=Math.pow(2,this.maxLevel-t);return this.tileSizePerScaleFactor&&this.tileSizePerScaleFactor[i]?this.tileSizePerScaleFactor[i].height:this._tileHeight},getLevelScale:function(t){if(this.emulateLegacyImagePyramid){var i=NaN;this.levels.length>0&&t>=this.minLevel&&t<=this.maxLevel&&(i=this.levels[t].width/this.levels[this.maxLevel].width);return i}return e.TileSource.prototype.getLevelScale.call(this,t)},getNumTiles:function(t){if(this.emulateLegacyImagePyramid){return this.getLevelScale(t)?new e.Point(1,1):new e.Point(0,0)}return e.TileSource.prototype.getNumTiles.call(this,t)},getTileAtPoint:function(t,i){return this.emulateLegacyImagePyramid?new e.Point(0,0):e.TileSource.prototype.getTileAtPoint.call(this,t,i)},getTileUrl:function(e,t,i){if(this.emulateLegacyImagePyramid){var n=null;this.levels.length>0&&e>=this.minLevel&&e<=this.maxLevel&&(n=this.levels[e].url);return n}var o,r,s,a,l,h,c,u,d,p,g,m=Math.pow(.5,this.maxLevel-e),v=Math.ceil(this.width*m),f=Math.ceil(this.height*m);o=this.getTileWidth(e);r=this.getTileHeight(e);s=Math.ceil(o/m);a=Math.ceil(r/m);g=this["@context"].indexOf("/1.0/context.json")>-1||this["@context"].indexOf("/1.1/context.json")>-1||this["@context"].indexOf("/1/context.json")>-1?"native.jpg":"default.jpg";if(v<o&&f<r){p=v+",";l="full"}else{h=t*s;c=i*a;u=Math.min(s,this.width-h);d=Math.min(a,this.height-c);p=Math.ceil(u*m)+",";l=[h,c,u,d].join(",")}return[this["@id"],l,p,"0",g].join("/")}})}(OpenSeadragon);!function(e){e.OsmTileSource=function(t,i,n,o,r){var s;if(!(s=e.isPlainObject(t)?t:{width:arguments[0],height:arguments[1],tileSize:arguments[2],tileOverlap:arguments[3],tilesUrl:arguments[4]}).width||!s.height){s.width=65572864;s.height=65572864}if(!s.tileSize){s.tileSize=256;s.tileOverlap=0}s.tilesUrl||(s.tilesUrl="http://tile.openstreetmap.org/");s.minLevel=8;e.TileSource.apply(this,[s])};e.extend(e.OsmTileSource.prototype,e.TileSource.prototype,{supports:function(e,t){return e.type&&"openstreetmaps"==e.type},configure:function(e,t){return e},getTileUrl:function(e,t,i){return this.tilesUrl+(e-8)+"/"+t+"/"+i+".png"}})}(OpenSeadragon);!function(e){e.TmsTileSource=function(t,i,n,o,r){var s;s=e.isPlainObject(t)?t:{width:arguments[0],height:arguments[1],tileSize:arguments[2],tileOverlap:arguments[3],tilesUrl:arguments[4]};var a,l=256*Math.ceil(s.width/256),h=256*Math.ceil(s.height/256);a=l>h?l/256:h/256;s.maxLevel=Math.ceil(Math.log(a)/Math.log(2))-1;s.tileSize=256;s.width=l;s.height=h;e.TileSource.apply(this,[s])};e.extend(e.TmsTileSource.prototype,e.TileSource.prototype,{supports:function(e,t){return e.type&&"tiledmapservice"==e.type},configure:function(e,t){return e},getTileUrl:function(e,t,i){var n=this.getNumTiles(e).y-1;return this.tilesUrl+e+"/"+t+"/"+(n-i)+".png"}})}(OpenSeadragon);!function(e){e.ZoomifyTileSource=function(e){e.tileSize=256;var t={x:e.width,y:e.height};e.imageSizes=[{x:e.width,y:e.height}];e.gridSize=[this._getGridSize(e.width,e.height,e.tileSize)];for(;parseInt(t.x,10)>e.tileSize||parseInt(t.y,10)>e.tileSize;){t.x=Math.floor(t.x/2);t.y=Math.floor(t.y/2);e.imageSizes.push({x:t.x,y:t.y});e.gridSize.push(this._getGridSize(t.x,t.y,e.tileSize))}e.imageSizes.reverse();e.gridSize.reverse();e.minLevel=0;e.maxLevel=e.gridSize.length-1;OpenSeadragon.TileSource.apply(this,[e])};e.extend(e.ZoomifyTileSource.prototype,e.TileSource.prototype,{_getGridSize:function(e,t,i){return{x:Math.ceil(e/i),y:Math.ceil(t/i)}},_calculateAbsoluteTileNumber:function(e,t,i){var n=0;var o={};for(var r=0;r<e;r++)n+=(o=this.gridSize[r]).x*o.y;return n+=(o=this.gridSize[e]).x*i+t},supports:function(e,t){return e.type&&"zoomifytileservice"==e.type},configure:function(e,t){return e},getTileUrl:function(e,t,i){var n=0;var o=this._calculateAbsoluteTileNumber(e,t,i);n=Math.floor(o/256);return this.tilesUrl+"TileGroup"+n+"/"+e+"-"+t+"-"+i+".jpg"}})}(OpenSeadragon);!function(e){e.LegacyTileSource=function(t){var i,n,o;e.isArray(t)&&(i={type:"legacy-image-pyramid",levels:t});i.levels=function(t){var i,n,o=[];for(n=0;n<t.length;n++)(i=t[n]).height&&i.width&&i.url?o.push({url:i.url,width:Number(i.width),height:Number(i.height)}):e.console.error("Unsupported image format: %s",i.url?i.url:"<no URL>");return o.sort(function(e,t){return e.height-t.height})}(i.levels);if(i.levels.length>0){n=i.levels[i.levels.length-1].width;o=i.levels[i.levels.length-1].height}else{n=0;o=0;e.console.error("No supported image formats found")}e.extend(!0,i,{width:n,height:o,tileSize:Math.max(o,n),tileOverlap:0,minLevel:0,maxLevel:i.levels.length>0?i.levels.length-1:0});e.TileSource.apply(this,[i]);this.levels=i.levels};e.extend(e.LegacyTileSource.prototype,e.TileSource.prototype,{supports:function(e,t){return e.type&&"legacy-image-pyramid"==e.type||e.documentElement&&"legacy-image-pyramid"==e.documentElement.getAttribute("type")},configure:function(i,n){return e.isPlainObject(i)?t(this,i):function(i,n){if(!n||!n.documentElement)throw new Error(e.getString("Errors.Xml"));var o,r,s=n.documentElement,a=s.tagName,l=null,h=[];if("image"==a)try{l={type:s.getAttribute("type"),levels:[]};h=s.getElementsByTagName("level");for(r=0;r<h.length;r++){o=h[r];l.levels.push({url:o.getAttribute("url"),width:parseInt(o.getAttribute("width"),10),height:parseInt(o.getAttribute("height"),10)})}return t(i,l)}catch(e){throw e instanceof Error?e:new Error("Unknown error parsing Legacy Image Pyramid XML.")}else{if("collection"==a)throw new Error("Legacy Image Pyramid Collections not yet supported.");if("error"==a)throw new Error("Error: "+n)}throw new Error("Unknown element "+a)}(this,i)},getLevelScale:function(e){var t=NaN;this.levels.length>0&&e>=this.minLevel&&e<=this.maxLevel&&(t=this.levels[e].width/this.levels[this.maxLevel].width);return t},getNumTiles:function(t){return this.getLevelScale(t)?new e.Point(1,1):new e.Point(0,0)},getTileUrl:function(e,t,i){var n=null;this.levels.length>0&&e>=this.minLevel&&e<=this.maxLevel&&(n=this.levels[e].url);return n}});function t(e,t){return t.levels}}(OpenSeadragon);!function(e){e.ImageTileSource=function(t){t=e.extend({buildPyramid:!0,crossOriginPolicy:!1,ajaxWithCredentials:!1,useCanvas:!0},t);e.TileSource.apply(this,[t])};e.extend(e.ImageTileSource.prototype,e.TileSource.prototype,{supports:function(e,t){return e.type&&"image"===e.type},configure:function(e,t){return e},getImageInfo:function(t){var i=this._image=new Image;var n=this;this.crossOriginPolicy&&(i.crossOrigin=this.crossOriginPolicy);this.ajaxWithCredentials&&(i.useCredentials=this.ajaxWithCredentials);e.addEvent(i,"load",function(){n.width=Object.prototype.hasOwnProperty.call(i,"naturalWidth")?i.naturalWidth:i.width;n.height=Object.prototype.hasOwnProperty.call(i,"naturalHeight")?i.naturalHeight:i.height;n.aspectRatio=n.width/n.height;n.dimensions=new e.Point(n.width,n.height);n._tileWidth=n.width;n._tileHeight=n.height;n.tileOverlap=0;n.minLevel=0;n.levels=n._buildLevels();n.maxLevel=n.levels.length-1;n.ready=!0;n.raiseEvent("ready",{tileSource:n})});e.addEvent(i,"error",function(){n.raiseEvent("open-failed",{message:"Error loading image at "+t,source:t})});i.src=t},getLevelScale:function(e){var t=NaN;e>=this.minLevel&&e<=this.maxLevel&&(t=this.levels[e].width/this.levels[this.maxLevel].width);return t},getNumTiles:function(t){return this.getLevelScale(t)?new e.Point(1,1):new e.Point(0,0)},getTileUrl:function(e,t,i){var n=null;e>=this.minLevel&&e<=this.maxLevel&&(n=this.levels[e].url);return n},getContext2D:function(e,t,i){var n=null;e>=this.minLevel&&e<=this.maxLevel&&(n=this.levels[e].context2D);return n},_buildLevels:function(){var t=[{url:this._image.src,width:Object.prototype.hasOwnProperty.call(this._image,"naturalWidth")?this._image.naturalWidth:this._image.width,height:Object.prototype.hasOwnProperty.call(this._image,"naturalHeight")?this._image.naturalHeight:this._image.height}];if(!this.buildPyramid||!e.supportsCanvas||!this.useCanvas){delete this._image;return t}var i=Object.prototype.hasOwnProperty.call(this._image,"naturalWidth")?this._image.naturalWidth:this._image.width;var n=Object.prototype.hasOwnProperty.call(this._image,"naturalHeight")?this._image.naturalHeight:this._image.height;var o=document.createElement("canvas");var r=o.getContext("2d");o.width=i;o.height=n;r.drawImage(this._image,0,0,i,n);t[0].context2D=r;delete this._image;if(e.isCanvasTainted(o))return t;for(;i>=2&&n>=2;){i=Math.floor(i/2);n=Math.floor(n/2);var s=document.createElement("canvas");var a=s.getContext("2d");s.width=i;s.height=n;a.drawImage(o,0,0,i,n);t.splice(0,0,{context2D:a,width:i,height:n});o=s;r=a}return t}})}(OpenSeadragon);!function(e){e.TileSourceCollection=function(t,i,n,o){e.console.error("TileSourceCollection is deprecated; use World instead")}}(OpenSeadragon);!function(e){e.ButtonState={REST:0,GROUP:1,HOVER:2,DOWN:3};e.Button=function(t){var o=this;e.EventSource.call(this);e.extend(!0,this,{tooltip:null,srcRest:null,srcGroup:null,srcHover:null,srcDown:null,clickTimeThreshold:e.DEFAULT_SETTINGS.clickTimeThreshold,clickDistThreshold:e.DEFAULT_SETTINGS.clickDistThreshold,fadeDelay:0,fadeLength:2e3,onPress:null,onRelease:null,onClick:null,onEnter:null,onExit:null,onFocus:null,onBlur:null},t);this.element=t.element||e.makeNeutralElement("div");if(!t.element){this.imgRest=e.makeTransparentImage(this.srcRest);this.imgGroup=e.makeTransparentImage(this.srcGroup);this.imgHover=e.makeTransparentImage(this.srcHover);this.imgDown=e.makeTransparentImage(this.srcDown);this.imgRest.alt=this.imgGroup.alt=this.imgHover.alt=this.imgDown.alt=this.tooltip;this.element.style.position="relative";e.setElementTouchActionNone(this.element);this.imgGroup.style.position=this.imgHover.style.position=this.imgDown.style.position="absolute";this.imgGroup.style.top=this.imgHover.style.top=this.imgDown.style.top="0px";this.imgGroup.style.left=this.imgHover.style.left=this.imgDown.style.left="0px";this.imgHover.style.visibility=this.imgDown.style.visibility="hidden";e.Browser.vendor==e.BROWSERS.FIREFOX&&e.Browser.version<3&&(this.imgGroup.style.top=this.imgHover.style.top=this.imgDown.style.top="");this.element.appendChild(this.imgRest);this.element.appendChild(this.imgGroup);this.element.appendChild(this.imgHover);this.element.appendChild(this.imgDown)}this.addHandler("press",this.onPress);this.addHandler("release",this.onRelease);this.addHandler("click",this.onClick);this.addHandler("enter",this.onEnter);this.addHandler("exit",this.onExit);this.addHandler("focus",this.onFocus);this.addHandler("blur",this.onBlur);this.currentState=e.ButtonState.GROUP;this.fadeBeginTime=null;this.shouldFade=!1;this.element.style.display="inline-block";this.element.style.position="relative";this.element.title=this.tooltip;this.tracker=new e.MouseTracker({element:this.element,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,enterHandler:function(t){if(t.insideElementPressed){i(o,e.ButtonState.DOWN);o.raiseEvent("enter",{originalEvent:t.originalEvent})}else t.buttonDownAny||i(o,e.ButtonState.HOVER)},focusHandler:function(e){this.enterHandler(e);o.raiseEvent("focus",{originalEvent:e.originalEvent})},exitHandler:function(t){n(o,e.ButtonState.GROUP);t.insideElementPressed&&o.raiseEvent("exit",{originalEvent:t.originalEvent})},blurHandler:function(e){this.exitHandler(e);o.raiseEvent("blur",{originalEvent:e.originalEvent})},pressHandler:function(t){i(o,e.ButtonState.DOWN);o.raiseEvent("press",{originalEvent:t.originalEvent})},releaseHandler:function(t){if(t.insideElementPressed&&t.insideElementReleased){n(o,e.ButtonState.HOVER);o.raiseEvent("release",{originalEvent:t.originalEvent})}else t.insideElementPressed?n(o,e.ButtonState.GROUP):i(o,e.ButtonState.HOVER)},clickHandler:function(e){e.quick&&o.raiseEvent("click",{originalEvent:e.originalEvent})},keyHandler:function(e){if(13===e.keyCode){o.raiseEvent("click",{originalEvent:e.originalEvent});o.raiseEvent("release",{originalEvent:e.originalEvent});return!1}return!0}});n(this,e.ButtonState.REST)};e.extend(e.Button.prototype,e.EventSource.prototype,{notifyGroupEnter:function(){i(this,e.ButtonState.GROUP)},notifyGroupExit:function(){n(this,e.ButtonState.REST)},disable:function(){this.notifyGroupExit();this.element.disabled=!0;e.setElementOpacity(this.element,.2,!0)},enable:function(){this.element.disabled=!1;e.setElementOpacity(this.element,1,!0);this.notifyGroupEnter()}});function t(i){e.requestAnimationFrame(function(){!function(i){var n,o,r;if(i.shouldFade){n=e.now();o=n-i.fadeBeginTime;r=1-o/i.fadeLength;r=Math.min(1,r);r=Math.max(0,r);i.imgGroup&&e.setElementOpacity(i.imgGroup,r,!0);r>0&&t(i)}}(i)})}function i(t,i){if(!t.element.disabled){if(i>=e.ButtonState.GROUP&&t.currentState==e.ButtonState.REST){!function(t){t.shouldFade=!1;t.imgGroup&&e.setElementOpacity(t.imgGroup,1,!0)}(t);t.currentState=e.ButtonState.GROUP}if(i>=e.ButtonState.HOVER&&t.currentState==e.ButtonState.GROUP){t.imgHover&&(t.imgHover.style.visibility="");t.currentState=e.ButtonState.HOVER}if(i>=e.ButtonState.DOWN&&t.currentState==e.ButtonState.HOVER){t.imgDown&&(t.imgDown.style.visibility="");t.currentState=e.ButtonState.DOWN}}}function n(i,n){if(!i.element.disabled){if(n<=e.ButtonState.HOVER&&i.currentState==e.ButtonState.DOWN){i.imgDown&&(i.imgDown.style.visibility="hidden");i.currentState=e.ButtonState.HOVER}if(n<=e.ButtonState.GROUP&&i.currentState==e.ButtonState.HOVER){i.imgHover&&(i.imgHover.style.visibility="hidden");i.currentState=e.ButtonState.GROUP}if(n<=e.ButtonState.REST&&i.currentState==e.ButtonState.GROUP){!function(i){i.shouldFade=!0;i.fadeBeginTime=e.now()+i.fadeDelay;window.setTimeout(function(){t(i)},i.fadeDelay)}(i);i.currentState=e.ButtonState.REST}}}}(OpenSeadragon);!function(e){e.ButtonGroup=function(t){e.extend(!0,this,{buttons:[],clickTimeThreshold:e.DEFAULT_SETTINGS.clickTimeThreshold,clickDistThreshold:e.DEFAULT_SETTINGS.clickDistThreshold,labelText:""},t);var i,n=this.buttons.concat([]),o=this;this.element=t.element||e.makeNeutralElement("div");if(!t.group){this.label=e.makeNeutralElement("label");this.element.style.display="inline-block";this.element.appendChild(this.label);for(i=0;i<n.length;i++)this.element.appendChild(n[i].element)}e.setElementTouchActionNone(this.element);this.tracker=new e.MouseTracker({element:this.element,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,enterHandler:function(e){var t;for(t=0;t<o.buttons.length;t++)o.buttons[t].notifyGroupEnter()},exitHandler:function(e){var t;if(!e.insideElementPressed)for(t=0;t<o.buttons.length;t++)o.buttons[t].notifyGroupExit()}})};e.ButtonGroup.prototype={emulateEnter:function(){this.tracker.enterHandler({eventSource:this.tracker})},emulateExit:function(){this.tracker.exitHandler({eventSource:this.tracker})}}}(OpenSeadragon);!function(e){e.Rect=function(t,i,n,o,r){this.x="number"==typeof t?t:0;this.y="number"==typeof i?i:0;this.width="number"==typeof n?n:0;this.height="number"==typeof o?o:0;this.degrees="number"==typeof r?r:0;this.degrees=e.positiveModulo(this.degrees,360);var s,a;if(this.degrees>=270){s=this.getTopRight();this.x=s.x;this.y=s.y;a=this.height;this.height=this.width;this.width=a;this.degrees-=270}else if(this.degrees>=180){s=this.getBottomRight();this.x=s.x;this.y=s.y;this.degrees-=180}else if(this.degrees>=90){s=this.getBottomLeft();this.x=s.x;this.y=s.y;a=this.height;this.height=this.width;this.width=a;this.degrees-=90}};e.Rect.fromSummits=function(t,i,n){var o=t.distanceTo(i);var r=t.distanceTo(n);var s=i.minus(t);var a=Math.atan(s.y/s.x);s.x<0?a+=Math.PI:s.y<0&&(a+=2*Math.PI);return new e.Rect(t.x,t.y,o,r,a/Math.PI*180)};e.Rect.prototype={clone:function(){return new e.Rect(this.x,this.y,this.width,this.height,this.degrees)},getAspectRatio:function(){return this.width/this.height},getTopLeft:function(){return new e.Point(this.x,this.y)},getBottomRight:function(){return new e.Point(this.x+this.width,this.y+this.height).rotate(this.degrees,this.getTopLeft())},getTopRight:function(){return new e.Point(this.x+this.width,this.y).rotate(this.degrees,this.getTopLeft())},getBottomLeft:function(){return new e.Point(this.x,this.y+this.height).rotate(this.degrees,this.getTopLeft())},getCenter:function(){return new e.Point(this.x+this.width/2,this.y+this.height/2).rotate(this.degrees,this.getTopLeft())},getSize:function(){return new e.Point(this.width,this.height)},equals:function(t){return t instanceof e.Rect&&this.x===t.x&&this.y===t.y&&this.width===t.width&&this.height===t.height&&this.degrees===t.degrees},times:function(t){return new e.Rect(this.x*t,this.y*t,this.width*t,this.height*t,this.degrees)},translate:function(t){return new e.Rect(this.x+t.x,this.y+t.y,this.width,this.height,this.degrees)},union:function(t){var i=this.getBoundingBox();var n=t.getBoundingBox();var o=Math.min(i.x,n.x);var r=Math.min(i.y,n.y);var s=Math.max(i.x+i.width,n.x+n.width);var a=Math.max(i.y+i.height,n.y+n.height);return new e.Rect(o,r,s-o,a-r)},intersection:function(t){var i=1e-10;var n=[];var o=this.getTopLeft();t.containsPoint(o,i)&&n.push(o);var r=this.getTopRight();t.containsPoint(r,i)&&n.push(r);var s=this.getBottomLeft();t.containsPoint(s,i)&&n.push(s);var a=this.getBottomRight();t.containsPoint(a,i)&&n.push(a);var l=t.getTopLeft();this.containsPoint(l,i)&&n.push(l);var h=t.getTopRight();this.containsPoint(h,i)&&n.push(h);var c=t.getBottomLeft();this.containsPoint(c,i)&&n.push(c);var u=t.getBottomRight();this.containsPoint(u,i)&&n.push(u);var d=this._getSegments();var p=t._getSegments();for(var g=0;g<d.length;g++){var m=d[g];for(var v=0;v<p.length;v++){var f=p[v];var w=y(m[0],m[1],f[0],f[1]);w&&n.push(w)}}function y(t,n,o,r){var s=n.minus(t);var a=r.minus(o);var l=-a.x*s.y+s.x*a.y;if(0===l)return null;var h=(s.x*(t.y-o.y)-s.y*(t.x-o.x))/l;var c=(a.x*(t.y-o.y)-a.y*(t.x-o.x))/l;return-i<=h&&h<=1-i&&-i<=c&&c<=1-i?new e.Point(t.x+c*s.x,t.y+c*s.y):null}if(0===n.length)return null;var T=n[0].x;var x=n[0].x;var S=n[0].y;var E=n[0].y;for(var P=1;P<n.length;P++){var R=n[P];R.x<T&&(T=R.x);R.x>x&&(x=R.x);R.y<S&&(S=R.y);R.y>E&&(E=R.y)}return new e.Rect(T,S,x-T,E-S)},_getSegments:function(){var e=this.getTopLeft();var t=this.getTopRight();var i=this.getBottomLeft();var n=this.getBottomRight();return[[e,t],[t,n],[n,i],[i,e]]},rotate:function(t,i){if(0===(t=e.positiveModulo(t,360)))return this.clone();i=i||this.getCenter();var n=this.getTopLeft().rotate(t,i);var o=this.getTopRight().rotate(t,i).minus(n);o=o.apply(function(e){return Math.abs(e)<1e-15?0:e});var r=Math.atan(o.y/o.x);o.x<0?r+=Math.PI:o.y<0&&(r+=2*Math.PI);return new e.Rect(n.x,n.y,this.width,this.height,r/Math.PI*180)},getBoundingBox:function(){if(0===this.degrees)return this.clone();var t=this.getTopLeft();var i=this.getTopRight();var n=this.getBottomLeft();var o=this.getBottomRight();var r=Math.min(t.x,i.x,n.x,o.x);var s=Math.max(t.x,i.x,n.x,o.x);var a=Math.min(t.y,i.y,n.y,o.y);var l=Math.max(t.y,i.y,n.y,o.y);return new e.Rect(r,a,s-r,l-a)},getIntegerBoundingBox:function(){var t=this.getBoundingBox();var i=Math.floor(t.x);var n=Math.floor(t.y);var o=Math.ceil(t.width+t.x-i);var r=Math.ceil(t.height+t.y-n);return new e.Rect(i,n,o,r)},containsPoint:function(e,t){t=t||0;var i=this.getTopLeft();var n=this.getTopRight();var o=this.getBottomLeft();var r=n.minus(i);var s=o.minus(i);return(e.x-i.x)*r.x+(e.y-i.y)*r.y>=-t&&(e.x-n.x)*r.x+(e.y-n.y)*r.y<=t&&(e.x-i.x)*s.x+(e.y-i.y)*s.y>=-t&&(e.x-o.x)*s.x+(e.y-o.y)*s.y<=t},toString:function(){return"["+Math.round(100*this.x)/100+", "+Math.round(100*this.y)/100+", "+Math.round(100*this.width)/100+"x"+Math.round(100*this.height)/100+", "+Math.round(100*this.degrees)/100+"deg]"}}}(OpenSeadragon);!function(e){var t={};e.ReferenceStrip=function(h){var c,u,d,p=h.viewer,g=e.getElementSize(p.element);if(!h.id){h.id="referencestrip-"+e.now();this.element=e.makeNeutralElement("div");this.element.id=h.id;this.element.className="referencestrip"}h=e.extend(!0,{sizeRatio:e.DEFAULT_SETTINGS.referenceStripSizeRatio,position:e.DEFAULT_SETTINGS.referenceStripPosition,scroll:e.DEFAULT_SETTINGS.referenceStripScroll,clickTimeThreshold:e.DEFAULT_SETTINGS.clickTimeThreshold},h,{element:this.element,showNavigator:!1,mouseNavEnabled:!1,showNavigationControl:!1,showSequenceControl:!1});e.extend(this,h);t[this.id]={animating:!1};this.minPixelRatio=this.viewer.minPixelRatio;(u=this.element.style).marginTop="0px";u.marginRight="0px";u.marginBottom="0px";u.marginLeft="0px";u.left="0px";u.bottom="0px";u.border="0px";u.background="#000";u.position="relative";e.setElementTouchActionNone(this.element);e.setElementOpacity(this.element,.8);this.viewer=p;this.innerTracker=new e.MouseTracker({element:this.element,dragHandler:e.delegate(this,i),scrollHandler:e.delegate(this,n),enterHandler:e.delegate(this,r),exitHandler:e.delegate(this,s),keyDownHandler:e.delegate(this,a),keyHandler:e.delegate(this,l)});if(h.width&&h.height){this.element.style.width=h.width+"px";this.element.style.height=h.height+"px";p.addControl(this.element,{anchor:e.ControlAnchor.BOTTOM_LEFT})}else if("horizontal"==h.scroll){this.element.style.width=g.x*h.sizeRatio*p.tileSources.length+12*p.tileSources.length+"px";this.element.style.height=g.y*h.sizeRatio+"px";p.addControl(this.element,{anchor:e.ControlAnchor.BOTTOM_LEFT})}else{this.element.style.height=g.y*h.sizeRatio*p.tileSources.length+12*p.tileSources.length+"px";this.element.style.width=g.x*h.sizeRatio+"px";p.addControl(this.element,{anchor:e.ControlAnchor.TOP_LEFT})}this.panelWidth=g.x*this.sizeRatio+8;this.panelHeight=g.y*this.sizeRatio+8;this.panels=[];this.miniViewers={};for(d=0;d<p.tileSources.length;d++){(c=e.makeNeutralElement("div")).id=this.element.id+"-"+d;c.style.width=this.panelWidth+"px";c.style.height=this.panelHeight+"px";c.style.display="inline";c.style.float="left";c.style.cssFloat="left";c.style.styleFloat="left";c.style.padding="2px";e.setElementTouchActionNone(c);c.innerTracker=new e.MouseTracker({element:c,clickTimeThreshold:this.clickTimeThreshold,clickDistThreshold:this.clickDistThreshold,pressHandler:function(t){t.eventSource.dragging=e.now()},releaseHandler:function(t){var i=t.eventSource,n=i.element.id,o=Number(n.split("-")[2]),r=e.now();if(t.insideElementPressed&&t.insideElementReleased&&i.dragging&&r-i.dragging<i.clickTimeThreshold){i.dragging=null;p.goToPage(o)}}});this.element.appendChild(c);c.activePanel=!1;this.panels.push(c)}o(this,"vertical"==this.scroll?g.y:g.x,0);this.setFocus(0)};e.extend(e.ReferenceStrip.prototype,e.EventSource.prototype,e.Viewer.prototype,{setFocus:function(t){var i,n=e.getElement(this.element.id+"-"+t),s=e.getElementSize(this.viewer.canvas),a=Number(this.element.style.width.replace("px","")),l=Number(this.element.style.height.replace("px","")),h=-Number(this.element.style.marginLeft.replace("px","")),c=-Number(this.element.style.marginTop.replace("px",""));if(this.currentSelected!==n){this.currentSelected&&(this.currentSelected.style.background="#000");this.currentSelected=n;this.currentSelected.style.background="#999";if("horizontal"==this.scroll){if((i=Number(t)*(this.panelWidth+3))>h+s.x-this.panelWidth){i=Math.min(i,a-s.x);this.element.style.marginLeft=-i+"px";o(this,s.x,-i)}else if(i<h){i=Math.max(0,i-s.x/2);this.element.style.marginLeft=-i+"px";o(this,s.x,-i)}}else if((i=Number(t)*(this.panelHeight+3))>c+s.y-this.panelHeight){i=Math.min(i,l-s.y);this.element.style.marginTop=-i+"px";o(this,s.y,-i)}else if(i<c){i=Math.max(0,i-s.y/2);this.element.style.marginTop=-i+"px";o(this,s.y,-i)}this.currentPage=t;r.call(this,{eventSource:this.innerTracker})}},update:function(){if(t[this.id].animating){e.console.log("image reference strip update");return!0}return!1},destroy:function(){if(this.miniViewers)for(var e in this.miniViewers)this.miniViewers[e].destroy();this.element&&this.element.parentNode.removeChild(this.element)}});function i(t){var i=Number(this.element.style.marginLeft.replace("px","")),n=Number(this.element.style.marginTop.replace("px","")),r=Number(this.element.style.width.replace("px","")),s=Number(this.element.style.height.replace("px","")),a=e.getElementSize(this.viewer.canvas);this.dragging=!0;if(this.element)if("horizontal"==this.scroll){if(-t.delta.x>0){if(i>-(r-a.x)){this.element.style.marginLeft=i+2*t.delta.x+"px";o(this,a.x,i+2*t.delta.x)}}else if(-t.delta.x<0&&i<0){this.element.style.marginLeft=i+2*t.delta.x+"px";o(this,a.x,i+2*t.delta.x)}}else if(-t.delta.y>0){if(n>-(s-a.y)){this.element.style.marginTop=n+2*t.delta.y+"px";o(this,a.y,n+2*t.delta.y)}}else if(-t.delta.y<0&&n<0){this.element.style.marginTop=n+2*t.delta.y+"px";o(this,a.y,n+2*t.delta.y)}return!1}function n(t){var i=Number(this.element.style.marginLeft.replace("px","")),n=Number(this.element.style.marginTop.replace("px","")),r=Number(this.element.style.width.replace("px","")),s=Number(this.element.style.height.replace("px","")),a=e.getElementSize(this.viewer.canvas);if(this.element)if("horizontal"==this.scroll){if(t.scroll>0){if(i>-(r-a.x)){this.element.style.marginLeft=i-60*t.scroll+"px";o(this,a.x,i-60*t.scroll)}}else if(t.scroll<0&&i<0){this.element.style.marginLeft=i-60*t.scroll+"px";o(this,a.x,i-60*t.scroll)}}else if(t.scroll<0){if(n>a.y-s){this.element.style.marginTop=n+60*t.scroll+"px";o(this,a.y,n+60*t.scroll)}}else if(t.scroll>0&&n<0){this.element.style.marginTop=n+60*t.scroll+"px";o(this,a.y,n+60*t.scroll)}return!1}function o(t,i,n){var o,r,s,a,l,h,c;o="horizontal"==t.scroll?t.panelWidth:t.panelHeight;r=Math.ceil(i/o)+5;for(h=r=(r=(s=Math.ceil((Math.abs(n)+i)/o)+1)-r)<0?0:r;h<s&&h<t.panels.length;h++)if(!(c=t.panels[h]).activePanel){var u;var d=t.viewer.tileSources[h];u=d.referenceStripThumbnailUrl?{type:"image",url:d.referenceStripThumbnailUrl}:d;(a=new e.Viewer({id:c.id,tileSources:[u],element:c,navigatorSizeRatio:t.sizeRatio,showNavigator:!1,mouseNavEnabled:!1,showNavigationControl:!1,showSequenceControl:!1,immediateRender:!0,blendTime:0,animationTime:0})).displayRegion=e.makeNeutralElement("div");a.displayRegion.id=c.id+"-displayregion";a.displayRegion.className="displayregion";(l=a.displayRegion.style).position="relative";l.top="0px";l.left="0px";l.fontSize="0px";l.overflow="hidden";l.float="left";l.cssFloat="left";l.styleFloat="left";l.zIndex=999999999;l.cursor="default";l.width=t.panelWidth-4+"px";l.height=t.panelHeight-4+"px";a.displayRegion.innerTracker=new e.MouseTracker({element:a.displayRegion,startDisabled:!0});c.getElementsByTagName("div")[0].appendChild(a.displayRegion);t.miniViewers[c.id]=a;c.activePanel=!0}}function r(e){var t=e.eventSource.element;"horizontal"==this.scroll?t.style.marginBottom="0px":t.style.marginLeft="0px";return!1}function s(t){var i=t.eventSource.element;"horizontal"==this.scroll?i.style.marginBottom="-"+e.getElementSize(i).y/2+"px":i.style.marginLeft="-"+e.getElementSize(i).x/2+"px";return!1}function a(e){if(e.preventDefaultAction||e.ctrl||e.alt||e.meta)return!0;switch(e.keyCode){case 38:n.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;case 40:case 37:n.call(this,{eventSource:this.tracker,position:null,scroll:-1,shift:null});return!1;case 39:n.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;default:return!0}}function l(e){if(e.preventDefaultAction||e.ctrl||e.alt||e.meta)return!0;switch(e.keyCode){case 61:n.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;case 45:n.call(this,{eventSource:this.tracker,position:null,scroll:-1,shift:null});return!1;case 48:case 119:case 87:n.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;case 115:case 83:case 97:n.call(this,{eventSource:this.tracker,position:null,scroll:-1,shift:null});return!1;case 100:n.call(this,{eventSource:this.tracker,position:null,scroll:1,shift:null});return!1;default:return!0}}}(OpenSeadragon);!function(e){e.DisplayRect=function(t,i,n,o,r,s){e.Rect.apply(this,[t,i,n,o]);this.minLevel=r;this.maxLevel=s};e.extend(e.DisplayRect.prototype,e.Rect.prototype)}(OpenSeadragon);!function(e){e.Spring=function(t){var i=arguments;"object"!=typeof t&&(t={initial:i.length&&"number"==typeof i[0]?i[0]:void 0,springStiffness:i.length>1?i[1].springStiffness:5,animationTime:i.length>1?i[1].animationTime:1.5});e.console.assert("number"==typeof t.springStiffness&&0!==t.springStiffness,"[OpenSeadragon.Spring] options.springStiffness must be a non-zero number");e.console.assert("number"==typeof t.animationTime&&t.animationTime>=0,"[OpenSeadragon.Spring] options.animationTime must be a number greater than or equal to 0");if(t.exponential){this._exponential=!0;delete t.exponential}e.extend(!0,this,t);this.current={value:"number"==typeof this.initial?this.initial:this._exponential?0:1,time:e.now()};e.console.assert(!this._exponential||0!==this.current.value,"[OpenSeadragon.Spring] value must be non-zero for exponential springs");this.start={value:this.current.value,time:this.current.time};this.target={value:this.current.value,time:this.current.time};if(this._exponential){this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value);this.current._logValue=Math.log(this.current.value)}};e.Spring.prototype={resetTo:function(t){e.console.assert(!this._exponential||0!==t,"[OpenSeadragon.Spring.resetTo] target must be non-zero for exponential springs");this.start.value=this.target.value=this.current.value=t;this.start.time=this.target.time=this.current.time=e.now();if(this._exponential){this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value);this.current._logValue=Math.log(this.current.value)}},springTo:function(t){e.console.assert(!this._exponential||0!==t,"[OpenSeadragon.Spring.springTo] target must be non-zero for exponential springs");this.start.value=this.current.value;this.start.time=this.current.time;this.target.value=t;this.target.time=this.start.time+1e3*this.animationTime;if(this._exponential){this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value)}},shiftBy:function(t){this.start.value+=t;this.target.value+=t;if(this._exponential){e.console.assert(0!==this.target.value&&0!==this.start.value,"[OpenSeadragon.Spring.shiftBy] spring value must be non-zero for exponential springs");this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value)}},setExponential:function(t){this._exponential=t;if(this._exponential){e.console.assert(0!==this.current.value&&0!==this.target.value&&0!==this.start.value,"[OpenSeadragon.Spring.setExponential] spring value must be non-zero for exponential springs");this.start._logValue=Math.log(this.start.value);this.target._logValue=Math.log(this.target.value);this.current._logValue=Math.log(this.current.value)}},update:function(){this.current.time=e.now();var t,i;if(this._exponential){t=this.start._logValue;i=this.target._logValue}else{t=this.start.value;i=this.target.value}var n=this.current.time>=this.target.time?i:t+(i-t)*(o=this.springStiffness,r=(this.current.time-this.start.time)/(this.target.time-this.start.time),(1-Math.exp(o*-r))/(1-Math.exp(-o)));var o,r;var s=this.current.value;this._exponential?this.current.value=Math.exp(n):this.current.value=n;return s!=this.current.value},isAtTargetValue:function(){return this.current.value===this.target.value}}}(OpenSeadragon);!function(e){function t(t){e.extend(!0,this,{timeout:e.DEFAULT_SETTINGS.timeout,jobId:null},t);this.image=null}t.prototype={errorMsg:null,start:function(){var t=this;var i=this.abort;this.image=new Image;this.image.onload=function(){t.finish(!0)};this.image.onabort=this.image.onerror=function(){t.errorMsg="Image load aborted";t.finish(!1)};this.jobId=window.setTimeout(function(){t.errorMsg="Image load exceeded timeout";t.finish(!1)},this.timeout);if(this.loadWithAjax){this.request=e.makeAjaxRequest({url:this.src,withCredentials:this.ajaxWithCredentials,headers:this.ajaxHeaders,responseType:"arraybuffer",success:function(e){var i;try{i=new window.Blob([e.response])}catch(t){var n=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder;if("TypeError"===t.name&&n){var o=new n;o.append(e.response);i=o.getBlob()}}if(0===i.size){t.errorMsg="Empty image response.";t.finish(!1)}var r=(window.URL||window.webkitURL).createObjectURL(i);t.image.src=r},error:function(e){t.errorMsg="Image load aborted - XHR error";t.finish(!1)}});this.abort=function(){t.request.abort();"function"==typeof i&&i()}}else{!1!==this.crossOriginPolicy&&(this.image.crossOrigin=this.crossOriginPolicy);this.image.src=this.src}},finish:function(e){this.image.onload=this.image.onerror=this.image.onabort=null;e||(this.image=null);this.jobId&&window.clearTimeout(this.jobId);this.callback(this)}};e.ImageLoader=function(t){e.extend(!0,this,{jobLimit:e.DEFAULT_SETTINGS.imageLoaderLimit,timeout:e.DEFAULT_SETTINGS.timeout,jobQueue:[],jobsInProgress:0},t)};e.ImageLoader.prototype={addJob:function(e){var i=this,n=new t({src:e.src,loadWithAjax:e.loadWithAjax,ajaxHeaders:e.loadWithAjax?e.ajaxHeaders:null,crossOriginPolicy:e.crossOriginPolicy,ajaxWithCredentials:e.ajaxWithCredentials,callback:function(t){!function(e,t,i){e.jobsInProgress--;if((!e.jobLimit||e.jobsInProgress<e.jobLimit)&&e.jobQueue.length>0){e.jobQueue.shift().start();e.jobsInProgress++}i(t.image,t.errorMsg,t.request)}(i,t,e.callback)},abort:e.abort,timeout:this.timeout});if(!this.jobLimit||this.jobsInProgress<this.jobLimit){n.start();this.jobsInProgress++}else this.jobQueue.push(n)},clear:function(){for(var e=0;e<this.jobQueue.length;e++){var t=this.jobQueue[e];"function"==typeof t.abort&&t.abort()}this.jobQueue=[]}}}(OpenSeadragon);!function(e){e.Tile=function(e,t,i,n,o,r,s,a,l,h){this.level=e;this.x=t;this.y=i;this.bounds=n;this.sourceBounds=h;this.exists=o;this.url=r;this.context2D=s;this.loadWithAjax=a;this.ajaxHeaders=l;this.ajaxHeaders?this.cacheKey=this.url+"+"+JSON.stringify(this.ajaxHeaders):this.cacheKey=this.url;this.loaded=!1;this.loading=!1;this.element=null;this.imgElement=null;this.image=null;this.style=null;this.position=null;this.size=null;this.blendStart=null;this.opacity=null;this.squaredDistance=null;this.visibility=null;this.beingDrawn=!1;this.lastTouchTime=0;this.isRightMost=!1;this.isBottomMost=!1};e.Tile.prototype={toString:function(){return this.level+"/"+this.x+"_"+this.y},_hasTransparencyChannel:function(){return!!this.context2D||this.url.match(".png")},drawHTML:function(t){if(this.cacheImageRecord)if(this.loaded){if(!this.element){this.element=e.makeNeutralElement("div");this.imgElement=this.cacheImageRecord.getImage().cloneNode();this.imgElement.style.msInterpolationMode="nearest-neighbor";this.imgElement.style.width="100%";this.imgElement.style.height="100%";this.style=this.element.style;this.style.position="absolute"}this.element.parentNode!=t&&t.appendChild(this.element);this.imgElement.parentNode!=this.element&&this.element.appendChild(this.imgElement);this.style.top=this.position.y+"px";this.style.left=this.position.x+"px";this.style.height=this.size.y+"px";this.style.width=this.size.x+"px";e.setElementOpacity(this.element,this.opacity)}else e.console.warn("Attempting to draw tile %s when it's not yet loaded.",this.toString());else e.console.warn("[Tile.drawHTML] attempting to draw tile %s when it's not cached",this.toString())},drawCanvas:function(t,i,n,o){var r,s=this.position.times(e.pixelDensityRatio),a=this.size.times(e.pixelDensityRatio);if(this.context2D||this.cacheImageRecord){r=this.context2D||this.cacheImageRecord.getRenderedContext();if(this.loaded&&r){t.save();t.globalAlpha=this.opacity;if("number"==typeof n&&1!==n){s=s.times(n);a=a.times(n)}o instanceof e.Point&&(s=s.plus(o));1===t.globalAlpha&&this._hasTransparencyChannel()&&t.clearRect(s.x,s.y,a.x,a.y);i({context:t,tile:this,rendered:r});var l,h;if(this.sourceBounds){l=Math.min(this.sourceBounds.width,r.canvas.width);h=Math.min(this.sourceBounds.height,r.canvas.height)}else{l=r.canvas.width;h=r.canvas.height}t.drawImage(r.canvas,0,0,l,h,s.x,s.y,a.x,a.y);t.restore()}else e.console.warn("Attempting to draw tile %s when it's not yet loaded.",this.toString())}else e.console.warn("[Tile.drawCanvas] attempting to draw tile %s when it's not cached",this.toString())},getScaleForEdgeSmoothing:function(){var t;if(this.cacheImageRecord)t=this.cacheImageRecord.getRenderedContext();else{if(!this.context2D){e.console.warn("[Tile.drawCanvas] attempting to get tile scale %s when tile's not cached",this.toString());return 1}t=this.context2D}return t.canvas.width/(this.size.x*e.pixelDensityRatio)},getTranslationForEdgeSmoothing:function(t,i,n){var o=Math.max(1,Math.ceil((n.x-i.x)/2));var r=Math.max(1,Math.ceil((n.y-i.y)/2));return new e.Point(o,r).minus(this.position.times(e.pixelDensityRatio).times(t||1).apply(function(e){return e%1}))},unload:function(){this.imgElement&&this.imgElement.parentNode&&this.imgElement.parentNode.removeChild(this.imgElement);this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element);this.element=null;this.imgElement=null;this.loaded=!1;this.loading=!1}}}(OpenSeadragon);!function(e){e.OverlayPlacement=e.Placement;e.OverlayRotationMode=e.freezeObject({NO_ROTATION:1,EXACT:2,BOUNDING_BOX:3});e.Overlay=function(t,i,n){var o;o=e.isPlainObject(t)?t:{element:t,location:i,placement:n};this.element=o.element;this.style=o.element.style;this._init(o)};e.Overlay.prototype={_init:function(t){this.location=t.location;this.placement=void 0===t.placement?e.Placement.TOP_LEFT:t.placement;this.onDraw=t.onDraw;this.checkResize=void 0===t.checkResize||t.checkResize;this.width=void 0===t.width?null:t.width;this.height=void 0===t.height?null:t.height;this.rotationMode=t.rotationMode||e.OverlayRotationMode.EXACT;if(this.location instanceof e.Rect){this.width=this.location.width;this.height=this.location.height;this.location=this.location.getTopLeft();this.placement=e.Placement.TOP_LEFT}this.scales=null!==this.width&&null!==this.height;this.bounds=new e.Rect(this.location.x,this.location.y,this.width,this.height);this.position=this.location},adjust:function(t,i){var n=e.Placement.properties[this.placement];if(n){n.isHorizontallyCentered?t.x-=i.x/2:n.isRight&&(t.x-=i.x);n.isVerticallyCentered?t.y-=i.y/2:n.isBottom&&(t.y-=i.y)}},destroy:function(){var t=this.element;var i=this.style;if(t.parentNode){t.parentNode.removeChild(t);if(t.prevElementParent){i.display="none";document.body.appendChild(t)}}this.onDraw=null;i.top="";i.left="";i.position="";null!==this.width&&(i.width="");null!==this.height&&(i.height="");var n=e.getCssPropertyWithVendorPrefix("transformOrigin");var o=e.getCssPropertyWithVendorPrefix("transform");if(n&&o){i[n]="";i[o]=""}},drawHTML:function(t,i){var n=this.element;if(n.parentNode!==t){n.prevElementParent=n.parentNode;n.prevNextSibling=n.nextSibling;t.appendChild(n);this.style.position="absolute";this.size=e.getElementSize(n)}var o=this._getOverlayPositionAndSize(i);var r=o.position;var s=this.size=o.size;var a=o.rotate;if(this.onDraw)this.onDraw(r,s,this.element);else{var l=this.style;l.left=r.x+"px";l.top=r.y+"px";null!==this.width&&(l.width=s.x+"px");null!==this.height&&(l.height=s.y+"px");var h=e.getCssPropertyWithVendorPrefix("transformOrigin");var c=e.getCssPropertyWithVendorPrefix("transform");if(h&&c)if(a){l[h]=this._getTransformOrigin();l[c]="rotate("+a+"deg)"}else{l[h]="";l[c]=""}"none"!==l.display&&(l.display="block")}},_getOverlayPositionAndSize:function(t){var i=t.pixelFromPoint(this.location,!0);var n=this._getSizeInPixels(t);this.adjust(i,n);var o=0;if(t.degrees&&this.rotationMode!==e.OverlayRotationMode.NO_ROTATION)if(this.rotationMode===e.OverlayRotationMode.BOUNDING_BOX&&null!==this.width&&null!==this.height){var r=new e.Rect(i.x,i.y,n.x,n.y);var s=this._getBoundingBox(r,t.degrees);i=s.getTopLeft();n=s.getSize()}else o=t.degrees;return{position:i,size:n,rotate:o}},_getSizeInPixels:function(t){var i=this.size.x;var n=this.size.y;if(null!==this.width||null!==this.height){var o=t.deltaPixelsFromPointsNoRotate(new e.Point(this.width||0,this.height||0),!0);null!==this.width&&(i=o.x);null!==this.height&&(n=o.y)}if(this.checkResize&&(null===this.width||null===this.height)){var r=this.size=e.getElementSize(this.element);null===this.width&&(i=r.x);null===this.height&&(n=r.y)}return new e.Point(i,n)},_getBoundingBox:function(e,t){var i=this._getPlacementPoint(e);return e.rotate(t,i).getBoundingBox()},_getPlacementPoint:function(t){var i=new e.Point(t.x,t.y);var n=e.Placement.properties[this.placement];if(n){n.isHorizontallyCentered?i.x+=t.width/2:n.isRight&&(i.x+=t.width);n.isVerticallyCentered?i.y+=t.height/2:n.isBottom&&(i.y+=t.height)}return i},_getTransformOrigin:function(){var t="";var i=e.Placement.properties[this.placement];if(!i)return t;i.isLeft?t="left":i.isRight&&(t="right");i.isTop?t+=" top":i.isBottom&&(t+=" bottom");return t},update:function(t,i){var n=e.isPlainObject(t)?t:{location:t,placement:i};this._init({location:n.location||this.location,placement:void 0!==n.placement?n.placement:this.placement,onDraw:n.onDraw||this.onDraw,checkResize:n.checkResize||this.checkResize,width:void 0!==n.width?n.width:this.width,height:void 0!==n.height?n.height:this.height,rotationMode:n.rotationMode||this.rotationMode})},getBounds:function(t){e.console.assert(t,"A viewport must now be passed to Overlay.getBounds.");var i=this.width;var n=this.height;if(null===i||null===n){var o=t.deltaPointsFromPixelsNoRotate(this.size,!0);null===i&&(i=o.x);null===n&&(n=o.y)}var r=this.location.clone();this.adjust(r,new e.Point(i,n));return this._adjustBoundsForRotation(t,new e.Rect(r.x,r.y,i,n))},_adjustBoundsForRotation:function(t,i){if(!t||0===t.degrees||this.rotationMode===e.OverlayRotationMode.EXACT)return i;if(this.rotationMode===e.OverlayRotationMode.BOUNDING_BOX){if(null===this.width||null===this.height)return i;var n=this._getOverlayPositionAndSize(t);return t.viewerElementToViewportRectangle(new e.Rect(n.position.x,n.position.y,n.size.x,n.size.y))}return i.rotate(-t.degrees,this._getPlacementPoint(i))}}}(OpenSeadragon);!function(e){e.Drawer=function(t){e.console.assert(t.viewer,"[Drawer] options.viewer is required");var i=arguments;e.isPlainObject(t)||(t={source:i[0],viewport:i[1],element:i[2]});e.console.assert(t.viewport,"[Drawer] options.viewport is required");e.console.assert(t.element,"[Drawer] options.element is required");t.source&&e.console.error("[Drawer] options.source is no longer accepted; use TiledImage instead");this.viewer=t.viewer;this.viewport=t.viewport;this.debugGridColor="string"==typeof t.debugGridColor?[t.debugGridColor]:t.debugGridColor||e.DEFAULT_SETTINGS.debugGridColor;t.opacity&&e.console.error("[Drawer] options.opacity is no longer accepted; set the opacity on the TiledImage instead");this.useCanvas=e.supportsCanvas&&(!this.viewer||this.viewer.useCanvas);this.container=e.getElement(t.element);this.canvas=e.makeNeutralElement(this.useCanvas?"canvas":"div");this.context=this.useCanvas?this.canvas.getContext("2d"):null;this.sketchCanvas=null;this.sketchContext=null;this.element=this.container;this.container.dir="ltr";if(this.useCanvas){var n=this._calculateCanvasSize();this.canvas.width=n.x;this.canvas.height=n.y}this.canvas.style.width="100%";this.canvas.style.height="100%";this.canvas.style.position="absolute";e.setElementOpacity(this.canvas,this.opacity,!0);this.container.style.textAlign="left";this.container.appendChild(this.canvas)};e.Drawer.prototype={addOverlay:function(t,i,n,o){e.console.error("drawer.addOverlay is deprecated. Use viewer.addOverlay instead.");this.viewer.addOverlay(t,i,n,o);return this},updateOverlay:function(t,i,n){e.console.error("drawer.updateOverlay is deprecated. Use viewer.updateOverlay instead.");this.viewer.updateOverlay(t,i,n);return this},removeOverlay:function(t){e.console.error("drawer.removeOverlay is deprecated. Use viewer.removeOverlay instead.");this.viewer.removeOverlay(t);return this},clearOverlays:function(){e.console.error("drawer.clearOverlays is deprecated. Use viewer.clearOverlays instead.");this.viewer.clearOverlays();return this},setOpacity:function(t){e.console.error("drawer.setOpacity is deprecated. Use tiledImage.setOpacity instead.");var i=this.viewer.world;for(var n=0;n<i.getItemCount();n++)i.getItemAt(n).setOpacity(t);return this},getOpacity:function(){e.console.error("drawer.getOpacity is deprecated. Use tiledImage.getOpacity instead.");var t=this.viewer.world;var i=0;for(var n=0;n<t.getItemCount();n++){var o=t.getItemAt(n).getOpacity();o>i&&(i=o)}return i},needsUpdate:function(){e.console.error("[Drawer.needsUpdate] this function is deprecated. Use World.needsDraw instead.");return this.viewer.world.needsDraw()},numTilesLoaded:function(){e.console.error("[Drawer.numTilesLoaded] this function is deprecated. Use TileCache.numTilesLoaded instead.");return this.viewer.tileCache.numTilesLoaded()},reset:function(){e.console.error("[Drawer.reset] this function is deprecated. Use World.resetItems instead.");this.viewer.world.resetItems();return this},update:function(){e.console.error("[Drawer.update] this function is deprecated. Use Drawer.clear and World.draw instead.");this.clear();this.viewer.world.draw();return this},canRotate:function(){return this.useCanvas},destroy:function(){this.canvas.width=1;this.canvas.height=1;this.sketchCanvas=null;this.sketchContext=null},clear:function(){this.canvas.innerHTML="";if(this.useCanvas){var e=this._calculateCanvasSize();if(this.canvas.width!=e.x||this.canvas.height!=e.y){this.canvas.width=e.x;this.canvas.height=e.y;if(null!==this.sketchCanvas){var t=this._calculateSketchCanvasSize();this.sketchCanvas.width=t.x;this.sketchCanvas.height=t.y}}this._clear()}},_clear:function(e,t){if(this.useCanvas){var i=this._getContext(e);if(t)i.clearRect(t.x,t.y,t.width,t.height);else{var n=i.canvas;i.clearRect(0,0,n.width,n.height)}}},viewportToDrawerRectangle:function(t){var i=this.viewport.pixelFromPointNoRotate(t.getTopLeft(),!0);var n=this.viewport.deltaPixelsFromPointsNoRotate(t.getSize(),!0);return new e.Rect(i.x*e.pixelDensityRatio,i.y*e.pixelDensityRatio,n.x*e.pixelDensityRatio,n.y*e.pixelDensityRatio)},drawTile:function(t,i,n,o,r){e.console.assert(t,"[Drawer.drawTile] tile is required");e.console.assert(i,"[Drawer.drawTile] drawingHandler is required");if(this.useCanvas){var s=this._getContext(n);o=o||1;t.drawCanvas(s,i,o,r)}else t.drawHTML(this.canvas)},_getContext:function(e){var t=this.context;if(e){if(null===this.sketchCanvas){this.sketchCanvas=document.createElement("canvas");var i=this._calculateSketchCanvasSize();this.sketchCanvas.width=i.x;this.sketchCanvas.height=i.y;this.sketchContext=this.sketchCanvas.getContext("2d");if(0===this.viewport.getRotation()){var n=this;this.viewer.addHandler("rotate",function e(){if(0!==n.viewport.getRotation()){n.viewer.removeHandler("rotate",e);var t=n._calculateSketchCanvasSize();n.sketchCanvas.width=t.x;n.sketchCanvas.height=t.y}})}}t=this.sketchContext}return t},saveContext:function(e){this.useCanvas&&this._getContext(e).save()},restoreContext:function(e){this.useCanvas&&this._getContext(e).restore()},setClip:function(e,t){if(this.useCanvas){var i=this._getContext(t);i.beginPath();i.rect(e.x,e.y,e.width,e.height);i.clip()}},drawRectangle:function(e,t,i){if(this.useCanvas){var n=this._getContext(i);n.save();n.fillStyle=t;n.fillRect(e.x,e.y,e.width,e.height);n.restore()}},blendSketch:function(t,i,n,o){var r=t;e.isPlainObject(r)||(r={opacity:t,scale:i,translate:n,compositeOperation:o});if(this.useCanvas&&this.sketchCanvas){t=r.opacity;o=r.compositeOperation;var s=r.bounds;this.context.save();this.context.globalAlpha=t;o&&(this.context.globalCompositeOperation=o);if(s){if(s.x<0){s.width+=s.x;s.x=0}s.x+s.width>this.canvas.width&&(s.width=this.canvas.width-s.x);if(s.y<0){s.height+=s.y;s.y=0}s.y+s.height>this.canvas.height&&(s.height=this.canvas.height-s.y);this.context.drawImage(this.sketchCanvas,s.x,s.y,s.width,s.height,s.x,s.y,s.width,s.height)}else{i=r.scale||1;var a=(n=r.translate)instanceof e.Point?n:new e.Point(0,0);var l=0;var h=0;if(n){var c=this.sketchCanvas.width-this.canvas.width;var u=this.sketchCanvas.height-this.canvas.height;l=Math.round(c/2);h=Math.round(u/2)}this.context.drawImage(this.sketchCanvas,a.x-l*i,a.y-h*i,(this.canvas.width+2*l)*i,(this.canvas.height+2*h)*i,-l,-h,this.canvas.width+2*l,this.canvas.height+2*h)}this.context.restore()}},drawDebugInfo:function(t,i,n,o){if(this.useCanvas){var r=this.viewer.world.getIndexOfItem(o)%this.debugGridColor.length;var s=this.context;s.save();s.lineWidth=2*e.pixelDensityRatio;s.font="small-caps bold "+13*e.pixelDensityRatio+"px arial";s.strokeStyle=this.debugGridColor[r];s.fillStyle=this.debugGridColor[r];0!==this.viewport.degrees?this._offsetForRotation({degrees:this.viewport.degrees}):this.viewer.viewport.flipped&&this._flip();o.getRotation(!0)%360!=0&&this._offsetForRotation({degrees:o.getRotation(!0),point:o.viewport.pixelFromPointNoRotate(o._getRotationPoint(!0),!0)});s.strokeRect(t.position.x*e.pixelDensityRatio,t.position.y*e.pixelDensityRatio,t.size.x*e.pixelDensityRatio,t.size.y*e.pixelDensityRatio);var a=(t.position.x+t.size.x/2)*e.pixelDensityRatio;var l=(t.position.y+t.size.y/2)*e.pixelDensityRatio;s.translate(a,l);s.rotate(Math.PI/180*-this.viewport.degrees);s.translate(-a,-l);if(0===t.x&&0===t.y){s.fillText("Zoom: "+this.viewport.getZoom(),t.position.x*e.pixelDensityRatio,(t.position.y-30)*e.pixelDensityRatio);s.fillText("Pan: "+this.viewport.getBounds().toString(),t.position.x*e.pixelDensityRatio,(t.position.y-20)*e.pixelDensityRatio)}s.fillText("Level: "+t.level,(t.position.x+10)*e.pixelDensityRatio,(t.position.y+20)*e.pixelDensityRatio);s.fillText("Column: "+t.x,(t.position.x+10)*e.pixelDensityRatio,(t.position.y+30)*e.pixelDensityRatio);s.fillText("Row: "+t.y,(t.position.x+10)*e.pixelDensityRatio,(t.position.y+40)*e.pixelDensityRatio);s.fillText("Order: "+n+" of "+i,(t.position.x+10)*e.pixelDensityRatio,(t.position.y+50)*e.pixelDensityRatio);s.fillText("Size: "+t.size.toString(),(t.position.x+10)*e.pixelDensityRatio,(t.position.y+60)*e.pixelDensityRatio);s.fillText("Position: "+t.position.toString(),(t.position.x+10)*e.pixelDensityRatio,(t.position.y+70)*e.pixelDensityRatio);0!==this.viewport.degrees&&this._restoreRotationChanges();o.getRotation(!0)%360!=0&&this._restoreRotationChanges();s.restore()}},debugRect:function(t){if(this.useCanvas){var i=this.context;i.save();i.lineWidth=2*e.pixelDensityRatio;i.strokeStyle=this.debugGridColor[0];i.fillStyle=this.debugGridColor[0];i.strokeRect(t.x*e.pixelDensityRatio,t.y*e.pixelDensityRatio,t.width*e.pixelDensityRatio,t.height*e.pixelDensityRatio);i.restore()}},getCanvasSize:function(t){var i=this._getContext(t).canvas;return new e.Point(i.width,i.height)},getCanvasCenter:function(){return new e.Point(this.canvas.width/2,this.canvas.height/2)},_offsetForRotation:function(t){var i=t.point?t.point.times(e.pixelDensityRatio):this.getCanvasCenter();var n=this._getContext(t.useSketch);n.save();n.translate(i.x,i.y);if(this.viewer.viewport.flipped){n.rotate(Math.PI/180*-t.degrees);n.scale(-1,1)}else n.rotate(Math.PI/180*t.degrees);n.translate(-i.x,-i.y)},_flip:function(t){var i=(t=t||{}).point?t.point.times(e.pixelDensityRatio):this.getCanvasCenter();var n=this._getContext(t.useSketch);n.translate(i.x,0);n.scale(-1,1);n.translate(-i.x,0)},_restoreRotationChanges:function(e){this._getContext(e).restore()},_calculateCanvasSize:function(){var t=e.pixelDensityRatio;var i=this.viewport.getContainerSize();return{x:i.x*t,y:i.y*t}},_calculateSketchCanvasSize:function(){var e=this._calculateCanvasSize();if(0===this.viewport.getRotation())return e;var t=Math.ceil(Math.sqrt(e.x*e.x+e.y*e.y));return{x:t,y:t}}}}(OpenSeadragon);!function(e){e.Viewport=function(t){var i=arguments;i.length&&i[0]instanceof e.Point&&(t={containerSize:i[0],contentSize:i[1],config:i[2]});if(t.config){e.extend(!0,t,t.config);delete t.config}this._margins=e.extend({left:0,top:0,right:0,bottom:0},t.margins||{});delete t.margins;e.extend(!0,this,{containerSize:null,contentSize:null,zoomPoint:null,viewer:null,springStiffness:e.DEFAULT_SETTINGS.springStiffness,animationTime:e.DEFAULT_SETTINGS.animationTime,minZoomImageRatio:e.DEFAULT_SETTINGS.minZoomImageRatio,maxZoomPixelRatio:e.DEFAULT_SETTINGS.maxZoomPixelRatio,visibilityRatio:e.DEFAULT_SETTINGS.visibilityRatio,wrapHorizontal:e.DEFAULT_SETTINGS.wrapHorizontal,wrapVertical:e.DEFAULT_SETTINGS.wrapVertical,defaultZoomLevel:e.DEFAULT_SETTINGS.defaultZoomLevel,minZoomLevel:e.DEFAULT_SETTINGS.minZoomLevel,maxZoomLevel:e.DEFAULT_SETTINGS.maxZoomLevel,degrees:e.DEFAULT_SETTINGS.degrees,flipped:e.DEFAULT_SETTINGS.flipped,homeFillsViewer:e.DEFAULT_SETTINGS.homeFillsViewer},t);this._updateContainerInnerSize();this.centerSpringX=new e.Spring({initial:0,springStiffness:this.springStiffness,animationTime:this.animationTime});this.centerSpringY=new e.Spring({initial:0,springStiffness:this.springStiffness,animationTime:this.animationTime});this.zoomSpring=new e.Spring({exponential:!0,initial:1,springStiffness:this.springStiffness,animationTime:this.animationTime});this._oldCenterX=this.centerSpringX.current.value;this._oldCenterY=this.centerSpringY.current.value;this._oldZoom=this.zoomSpring.current.value;this._setContentBounds(new e.Rect(0,0,1,1),1);this.goHome(!0);this.update()};e.Viewport.prototype={resetContentSize:function(t){e.console.assert(t,"[Viewport.resetContentSize] contentSize is required");e.console.assert(t instanceof e.Point,"[Viewport.resetContentSize] contentSize must be an OpenSeadragon.Point");e.console.assert(t.x>0,"[Viewport.resetContentSize] contentSize.x must be greater than 0");e.console.assert(t.y>0,"[Viewport.resetContentSize] contentSize.y must be greater than 0");this._setContentBounds(new e.Rect(0,0,1,t.y/t.x),t.x);return this},setHomeBounds:function(t,i){e.console.error("[Viewport.setHomeBounds] this function is deprecated; The content bounds should not be set manually.");this._setContentBounds(t,i)},_setContentBounds:function(t,i){e.console.assert(t,"[Viewport._setContentBounds] bounds is required");e.console.assert(t instanceof e.Rect,"[Viewport._setContentBounds] bounds must be an OpenSeadragon.Rect");e.console.assert(t.width>0,"[Viewport._setContentBounds] bounds.width must be greater than 0");e.console.assert(t.height>0,"[Viewport._setContentBounds] bounds.height must be greater than 0");this._contentBoundsNoRotate=t.clone();this._contentSizeNoRotate=this._contentBoundsNoRotate.getSize().times(i);this._contentBounds=t.rotate(this.degrees).getBoundingBox();this._contentSize=this._contentBounds.getSize().times(i);this._contentAspectRatio=this._contentSize.x/this._contentSize.y;this.viewer&&this.viewer.raiseEvent("reset-size",{contentSize:this._contentSizeNoRotate.clone(),contentFactor:i,homeBounds:this._contentBoundsNoRotate.clone(),contentBounds:this._contentBounds.clone()})},getHomeZoom:function(){if(this.defaultZoomLevel)return this.defaultZoomLevel;var e=this._contentAspectRatio/this.getAspectRatio();return(this.homeFillsViewer?e>=1?e:1:e>=1?1:e)/this._contentBounds.width},getHomeBounds:function(){return this.getHomeBoundsNoRotate().rotate(-this.getRotation())},getHomeBoundsNoRotate:function(){var t=this._contentBounds.getCenter();var i=1/this.getHomeZoom();var n=i/this.getAspectRatio();return new e.Rect(t.x-i/2,t.y-n/2,i,n)},goHome:function(e){this.viewer&&this.viewer.raiseEvent("home",{immediately:e});return this.fitBounds(this.getHomeBounds(),e)},getMinZoom:function(){var e=this.getHomeZoom();return this.minZoomLevel?this.minZoomLevel:this.minZoomImageRatio*e},getMaxZoom:function(){var e=this.maxZoomLevel;if(!e){e=this._contentSize.x*this.maxZoomPixelRatio/this._containerInnerSize.x;e/=this._contentBounds.width}return Math.max(e,this.getHomeZoom())},getAspectRatio:function(){return this._containerInnerSize.x/this._containerInnerSize.y},getContainerSize:function(){return new e.Point(this.containerSize.x,this.containerSize.y)},getMargins:function(){return e.extend({},this._margins)},setMargins:function(t){e.console.assert("object"===e.type(t),"[Viewport.setMargins] margins must be an object");this._margins=e.extend({left:0,top:0,right:0,bottom:0},t);this._updateContainerInnerSize();this.viewer&&this.viewer.forceRedraw()},getBounds:function(e){return this.getBoundsNoRotate(e).rotate(-this.getRotation())},getBoundsNoRotate:function(t){var i=this.getCenter(t);var n=1/this.getZoom(t);var o=n/this.getAspectRatio();return new e.Rect(i.x-n/2,i.y-o/2,n,o)},getBoundsWithMargins:function(e){return this.getBoundsNoRotateWithMargins(e).rotate(-this.getRotation(),this.getCenter(e))},getBoundsNoRotateWithMargins:function(e){var t=this.getBoundsNoRotate(e);var i=this._containerInnerSize.x*this.getZoom(e);t.x-=this._margins.left/i;t.y-=this._margins.top/i;t.width+=(this._margins.left+this._margins.right)/i;t.height+=(this._margins.top+this._margins.bottom)/i;return t},getCenter:function(t){var i,n,o,r,s,a,l=new e.Point(this.centerSpringX.current.value,this.centerSpringY.current.value),h=new e.Point(this.centerSpringX.target.value,this.centerSpringY.target.value);if(t)return l;if(!this.zoomPoint)return h;i=this.pixelFromPoint(this.zoomPoint,!0);r=(o=1/(n=this.getZoom()))/this.getAspectRatio();s=new e.Rect(l.x-o/2,l.y-r/2,o,r);a=this._pixelFromPoint(this.zoomPoint,s).minus(i).divide(this._containerInnerSize.x*n);return h.plus(a)},getZoom:function(e){return e?this.zoomSpring.current.value:this.zoomSpring.target.value},_applyZoomConstraints:function(e){return Math.max(Math.min(e,this.getMaxZoom()),this.getMinZoom())},_applyBoundaryConstraints:function(t){var i=new e.Rect(t.x,t.y,t.width,t.height);if(this.wrapHorizontal);else{var n=this.visibilityRatio*i.width;var o=i.x+i.width;var r=this._contentBoundsNoRotate.x+this._contentBoundsNoRotate.width;var s=this._contentBoundsNoRotate.x-o+n;var a=r-i.x-n;n>this._contentBoundsNoRotate.width?i.x+=(s+a)/2:a<0?i.x+=a:s>0&&(i.x+=s)}if(this.wrapVertical);else{var l=this.visibilityRatio*i.height;var h=i.y+i.height;var c=this._contentBoundsNoRotate.y+this._contentBoundsNoRotate.height;var u=this._contentBoundsNoRotate.y-h+l;var d=c-i.y-l;l>this._contentBoundsNoRotate.height?i.y+=(u+d)/2:d<0?i.y+=d:u>0&&(i.y+=u)}return i},_raiseConstraintsEvent:function(e){this.viewer&&this.viewer.raiseEvent("constrain",{immediately:e})},applyConstraints:function(e){var t=this.getZoom();var i=this._applyZoomConstraints(t);t!==i&&this.zoomTo(i,this.zoomPoint,e);var n=this.getBoundsNoRotate();var o=this._applyBoundaryConstraints(n);this._raiseConstraintsEvent(e);(n.x!==o.x||n.y!==o.y||e)&&this.fitBounds(o.rotate(-this.getRotation()),e);return this},ensureVisible:function(e){return this.applyConstraints(e)},_fitBounds:function(t,i){var n=(i=i||{}).immediately||!1;var o=i.constraints||!1;var r=this.getAspectRatio();var s=t.getCenter();var a=new e.Rect(t.x,t.y,t.width,t.height,t.degrees+this.getRotation()).getBoundingBox();a.getAspectRatio()>=r?a.height=a.width/r:a.width=a.height*r;a.x=s.x-a.width/2;a.y=s.y-a.height/2;var l=1/a.width;if(o){var h=a.getAspectRatio();var c=this._applyZoomConstraints(l);if(l!==c){l=c;a.width=1/l;a.x=s.x-a.width/2;a.height=a.width/h;a.y=s.y-a.height/2}s=(a=this._applyBoundaryConstraints(a)).getCenter();this._raiseConstraintsEvent(n)}if(n){this.panTo(s,!0);return this.zoomTo(l,null,!0)}this.panTo(this.getCenter(!0),!0);this.zoomTo(this.getZoom(!0),null,!0);var u=this.getBounds();var d=this.getZoom();if(0===d||Math.abs(l/d-1)<1e-8){this.zoomTo(l,!0);return this.panTo(s,n)}var p=(a=a.rotate(-this.getRotation())).getTopLeft().times(l).minus(u.getTopLeft().times(d)).divide(l-d);return this.zoomTo(l,p,n)},fitBounds:function(e,t){return this._fitBounds(e,{immediately:t,constraints:!1})},fitBoundsWithConstraints:function(e,t){return this._fitBounds(e,{immediately:t,constraints:!0})},fitVertically:function(t){var i=new e.Rect(this._contentBounds.x+this._contentBounds.width/2,this._contentBounds.y,0,this._contentBounds.height);return this.fitBounds(i,t)},fitHorizontally:function(t){var i=new e.Rect(this._contentBounds.x,this._contentBounds.y+this._contentBounds.height/2,this._contentBounds.width,0);return this.fitBounds(i,t)},getConstrainedBounds:function(e){var t;t=this.getBounds(e);return this._applyBoundaryConstraints(t)},panBy:function(t,i){var n=new e.Point(this.centerSpringX.target.value,this.centerSpringY.target.value);return this.panTo(n.plus(t),i)},panTo:function(e,t){if(t){this.centerSpringX.resetTo(e.x);this.centerSpringY.resetTo(e.y)}else{this.centerSpringX.springTo(e.x);this.centerSpringY.springTo(e.y)}this.viewer&&this.viewer.raiseEvent("pan",{center:e,immediately:t});return this},zoomBy:function(e,t,i){return this.zoomTo(this.zoomSpring.target.value*e,t,i)},zoomTo:function(t,i,n){var o=this;this.zoomPoint=i instanceof e.Point&&!isNaN(i.x)&&!isNaN(i.y)?i:null;n?this._adjustCenterSpringsForZoomPoint(function(){o.zoomSpring.resetTo(t)}):this.zoomSpring.springTo(t);this.viewer&&this.viewer.raiseEvent("zoom",{zoom:t,refPoint:i,immediately:n});return this},setRotation:function(t){if(!this.viewer||!this.viewer.drawer.canRotate())return this;this.degrees=e.positiveModulo(t,360);this._setContentBounds(this.viewer.world.getHomeBounds(),this.viewer.world.getContentFactor());this.viewer.forceRedraw();this.viewer.raiseEvent("rotate",{degrees:t});return this},getRotation:function(){return this.degrees},resize:function(e,t){var i,n=this.getBoundsNoRotate(),o=n;this.containerSize.x=e.x;this.containerSize.y=e.y;this._updateContainerInnerSize();if(t){i=e.x/this.containerSize.x;o.width=n.width*i;o.height=o.width/this.getAspectRatio()}this.viewer&&this.viewer.raiseEvent("resize",{newContainerSize:e,maintain:t});return this.fitBounds(o,!0)},_updateContainerInnerSize:function(){this._containerInnerSize=new e.Point(Math.max(1,this.containerSize.x-(this._margins.left+this._margins.right)),Math.max(1,this.containerSize.y-(this._margins.top+this._margins.bottom)))},update:function(){var e=this;this._adjustCenterSpringsForZoomPoint(function(){e.zoomSpring.update()});this.centerSpringX.update();this.centerSpringY.update();var t=this.centerSpringX.current.value!==this._oldCenterX||this.centerSpringY.current.value!==this._oldCenterY||this.zoomSpring.current.value!==this._oldZoom;this._oldCenterX=this.centerSpringX.current.value;this._oldCenterY=this.centerSpringY.current.value;this._oldZoom=this.zoomSpring.current.value;return t},_adjustCenterSpringsForZoomPoint:function(e){if(this.zoomPoint){var t=this.pixelFromPoint(this.zoomPoint,!0);e();var i=this.pixelFromPoint(this.zoomPoint,!0).minus(t);var n=this.deltaPointsFromPixels(i,!0);this.centerSpringX.shiftBy(n.x);this.centerSpringY.shiftBy(n.y);this.zoomSpring.isAtTargetValue()&&(this.zoomPoint=null)}else e()},deltaPixelsFromPointsNoRotate:function(e,t){return e.times(this._containerInnerSize.x*this.getZoom(t))},deltaPixelsFromPoints:function(e,t){return this.deltaPixelsFromPointsNoRotate(e.rotate(this.getRotation()),t)},deltaPointsFromPixelsNoRotate:function(e,t){return e.divide(this._containerInnerSize.x*this.getZoom(t))},deltaPointsFromPixels:function(e,t){return this.deltaPointsFromPixelsNoRotate(e,t).rotate(-this.getRotation())},pixelFromPointNoRotate:function(e,t){return this._pixelFromPointNoRotate(e,this.getBoundsNoRotate(t))},pixelFromPoint:function(e,t){return this._pixelFromPoint(e,this.getBoundsNoRotate(t))},_pixelFromPointNoRotate:function(t,i){return t.minus(i.getTopLeft()).times(this._containerInnerSize.x/i.width).plus(new e.Point(this._margins.left,this._margins.top))},_pixelFromPoint:function(e,t){return this._pixelFromPointNoRotate(e.rotate(this.getRotation(),this.getCenter(!0)),t)},pointFromPixelNoRotate:function(t,i){var n=this.getBoundsNoRotate(i);return t.minus(new e.Point(this._margins.left,this._margins.top)).divide(this._containerInnerSize.x/n.width).plus(n.getTopLeft())},pointFromPixel:function(e,t){return this.pointFromPixelNoRotate(e,t).rotate(-this.getRotation(),this.getCenter(!0))},_viewportToImageDelta:function(t,i){var n=this._contentBoundsNoRotate.width;return new e.Point(t*this._contentSizeNoRotate.x/n,i*this._contentSizeNoRotate.x/n)},viewportToImageCoordinates:function(t,i){if(t instanceof e.Point)return this.viewportToImageCoordinates(t.x,t.y);if(this.viewer){var n=this.viewer.world.getItemCount();if(n>1)e.console.error("[Viewport.viewportToImageCoordinates] is not accurate with multi-image; use TiledImage.viewportToImageCoordinates instead.");else if(1===n){return this.viewer.world.getItemAt(0).viewportToImageCoordinates(t,i,!0)}}return this._viewportToImageDelta(t-this._contentBoundsNoRotate.x,i-this._contentBoundsNoRotate.y)},_imageToViewportDelta:function(t,i){var n=this._contentBoundsNoRotate.width;return new e.Point(t/this._contentSizeNoRotate.x*n,i/this._contentSizeNoRotate.x*n)},imageToViewportCoordinates:function(t,i){if(t instanceof e.Point)return this.imageToViewportCoordinates(t.x,t.y);if(this.viewer){var n=this.viewer.world.getItemCount();if(n>1)e.console.error("[Viewport.imageToViewportCoordinates] is not accurate with multi-image; use TiledImage.imageToViewportCoordinates instead.");else if(1===n){return this.viewer.world.getItemAt(0).imageToViewportCoordinates(t,i,!0)}}var o=this._imageToViewportDelta(t,i);o.x+=this._contentBoundsNoRotate.x;o.y+=this._contentBoundsNoRotate.y;return o},imageToViewportRectangle:function(t,i,n,o){var r=t;r instanceof e.Rect||(r=new e.Rect(t,i,n,o));if(this.viewer){var s=this.viewer.world.getItemCount();if(s>1)e.console.error("[Viewport.imageToViewportRectangle] is not accurate with multi-image; use TiledImage.imageToViewportRectangle instead.");else if(1===s){return this.viewer.world.getItemAt(0).imageToViewportRectangle(t,i,n,o,!0)}}var a=this.imageToViewportCoordinates(r.x,r.y);var l=this._imageToViewportDelta(r.width,r.height);return new e.Rect(a.x,a.y,l.x,l.y,r.degrees)},viewportToImageRectangle:function(t,i,n,o){var r=t;r instanceof e.Rect||(r=new e.Rect(t,i,n,o));if(this.viewer){var s=this.viewer.world.getItemCount();if(s>1)e.console.error("[Viewport.viewportToImageRectangle] is not accurate with multi-image; use TiledImage.viewportToImageRectangle instead.");else if(1===s){return this.viewer.world.getItemAt(0).viewportToImageRectangle(t,i,n,o,!0)}}var a=this.viewportToImageCoordinates(r.x,r.y);var l=this._viewportToImageDelta(r.width,r.height);return new e.Rect(a.x,a.y,l.x,l.y,r.degrees)},viewerElementToImageCoordinates:function(e){var t=this.pointFromPixel(e,!0);return this.viewportToImageCoordinates(t)},imageToViewerElementCoordinates:function(e){var t=this.imageToViewportCoordinates(e);return this.pixelFromPoint(t,!0)},windowToImageCoordinates:function(t){e.console.assert(this.viewer,"[Viewport.windowToImageCoordinates] the viewport must have a viewer.");var i=t.minus(e.getElementPosition(this.viewer.element));return this.viewerElementToImageCoordinates(i)},imageToWindowCoordinates:function(t){e.console.assert(this.viewer,"[Viewport.imageToWindowCoordinates] the viewport must have a viewer.");return this.imageToViewerElementCoordinates(t).plus(e.getElementPosition(this.viewer.element))},viewerElementToViewportCoordinates:function(e){return this.pointFromPixel(e,!0)},viewportToViewerElementCoordinates:function(e){return this.pixelFromPoint(e,!0)},viewerElementToViewportRectangle:function(t){return e.Rect.fromSummits(this.pointFromPixel(t.getTopLeft(),!0),this.pointFromPixel(t.getTopRight(),!0),this.pointFromPixel(t.getBottomLeft(),!0))},viewportToViewerElementRectangle:function(t){return e.Rect.fromSummits(this.pixelFromPoint(t.getTopLeft(),!0),this.pixelFromPoint(t.getTopRight(),!0),this.pixelFromPoint(t.getBottomLeft(),!0))},windowToViewportCoordinates:function(t){e.console.assert(this.viewer,"[Viewport.windowToViewportCoordinates] the viewport must have a viewer.");var i=t.minus(e.getElementPosition(this.viewer.element));return this.viewerElementToViewportCoordinates(i)},viewportToWindowCoordinates:function(t){e.console.assert(this.viewer,"[Viewport.viewportToWindowCoordinates] the viewport must have a viewer.");return this.viewportToViewerElementCoordinates(t).plus(e.getElementPosition(this.viewer.element))},viewportToImageZoom:function(t){if(this.viewer){var i=this.viewer.world.getItemCount();if(i>1)e.console.error("[Viewport.viewportToImageZoom] is not accurate with multi-image.");else if(1===i){return this.viewer.world.getItemAt(0).viewportToImageZoom(t)}}var n=this._contentSizeNoRotate.x;return t*(this._containerInnerSize.x/n*this._contentBoundsNoRotate.width)},imageToViewportZoom:function(t){if(this.viewer){var i=this.viewer.world.getItemCount();if(i>1)e.console.error("[Viewport.imageToViewportZoom] is not accurate with multi-image.");else if(1===i){return this.viewer.world.getItemAt(0).imageToViewportZoom(t)}}return t*(this._contentSizeNoRotate.x/this._containerInnerSize.x/this._contentBoundsNoRotate.width)},toggleFlip:function(){this.setFlip(!this.getFlip());return this},getFlip:function(){return this.flipped},setFlip:function(e){if(this.flipped===e)return this;this.flipped=e;this.viewer.navigator&&this.viewer.navigator.setFlip(this.getFlip());this.viewer.forceRedraw();this.viewer.raiseEvent("flip",{flipped:e});return this}}}(OpenSeadragon);!function(e){e.TiledImage=function(t){var i=this;e.console.assert(t.tileCache,"[TiledImage] options.tileCache is required");e.console.assert(t.drawer,"[TiledImage] options.drawer is required");e.console.assert(t.viewer,"[TiledImage] options.viewer is required");e.console.assert(t.imageLoader,"[TiledImage] options.imageLoader is required");e.console.assert(t.source,"[TiledImage] options.source is required");e.console.assert(!t.clip||t.clip instanceof e.Rect,"[TiledImage] options.clip must be an OpenSeadragon.Rect if present");e.EventSource.call(this);this._tileCache=t.tileCache;delete t.tileCache;this._drawer=t.drawer;delete t.drawer;this._imageLoader=t.imageLoader;delete t.imageLoader;t.clip instanceof e.Rect&&(this._clip=t.clip.clone());delete t.clip;var n=t.x||0;delete t.x;var o=t.y||0;delete t.y;this.normHeight=t.source.dimensions.y/t.source.dimensions.x;this.contentAspectX=t.source.dimensions.x/t.source.dimensions.y;var r=1;if(t.width){r=t.width;delete t.width;if(t.height){e.console.error("specifying both width and height to a tiledImage is not supported");delete t.height}}else if(t.height){r=t.height/this.normHeight;delete t.height}var s=t.fitBounds;delete t.fitBounds;var a=t.fitBoundsPlacement||OpenSeadragon.Placement.CENTER;delete t.fitBoundsPlacement;var l=t.degrees||0;delete t.degrees;e.extend(!0,this,{viewer:null,tilesMatrix:{},coverage:{},loadingCoverage:{},lastDrawn:[],lastResetTime:0,_midDraw:!1,_needsDraw:!0,_hasOpaqueTile:!1,_tilesLoading:0,springStiffness:e.DEFAULT_SETTINGS.springStiffness,animationTime:e.DEFAULT_SETTINGS.animationTime,minZoomImageRatio:e.DEFAULT_SETTINGS.minZoomImageRatio,wrapHorizontal:e.DEFAULT_SETTINGS.wrapHorizontal,wrapVertical:e.DEFAULT_SETTINGS.wrapVertical,immediateRender:e.DEFAULT_SETTINGS.immediateRender,blendTime:e.DEFAULT_SETTINGS.blendTime,alwaysBlend:e.DEFAULT_SETTINGS.alwaysBlend,minPixelRatio:e.DEFAULT_SETTINGS.minPixelRatio,smoothTileEdgesMinZoom:e.DEFAULT_SETTINGS.smoothTileEdgesMinZoom,iOSDevice:e.DEFAULT_SETTINGS.iOSDevice,debugMode:e.DEFAULT_SETTINGS.debugMode,crossOriginPolicy:e.DEFAULT_SETTINGS.crossOriginPolicy,ajaxWithCredentials:e.DEFAULT_SETTINGS.ajaxWithCredentials,placeholderFillStyle:e.DEFAULT_SETTINGS.placeholderFillStyle,opacity:e.DEFAULT_SETTINGS.opacity,preload:e.DEFAULT_SETTINGS.preload,compositeOperation:e.DEFAULT_SETTINGS.compositeOperation},t);this._preload=this.preload;delete this.preload;this._fullyLoaded=!1;this._xSpring=new e.Spring({initial:n,springStiffness:this.springStiffness,animationTime:this.animationTime});this._ySpring=new e.Spring({initial:o,springStiffness:this.springStiffness,animationTime:this.animationTime});this._scaleSpring=new e.Spring({initial:r,springStiffness:this.springStiffness,animationTime:this.animationTime});this._degreesSpring=new e.Spring({initial:l,springStiffness:this.springStiffness,animationTime:this.animationTime});this._updateForScale();s&&this.fitBounds(s,a,!0);this._drawingHandler=function(t){i.viewer.raiseEvent("tile-drawing",e.extend({tiledImage:i},t))}};e.extend(e.TiledImage.prototype,e.EventSource.prototype,{needsDraw:function(){return this._needsDraw},getFullyLoaded:function(){return this._fullyLoaded},_setFullyLoaded:function(e){if(e!==this._fullyLoaded){this._fullyLoaded=e;this.raiseEvent("fully-loaded-change",{fullyLoaded:this._fullyLoaded})}},reset:function(){this._tileCache.clearTilesFor(this);this.lastResetTime=e.now();this._needsDraw=!0},update:function(){var e=this._xSpring.update();var t=this._ySpring.update();var i=this._scaleSpring.update();var n=this._degreesSpring.update();if(e||t||i||n){this._updateForScale();this._needsDraw=!0;return!0}return!1},draw:function(){if(0!==this.opacity||this._preload){this._midDraw=!0;this._updateViewport();this._midDraw=!1}else this._needsDraw=!1},destroy:function(){this.reset()},getBounds:function(e){return this.getBoundsNoRotate(e).rotate(this.getRotation(e),this._getRotationPoint(e))},getBoundsNoRotate:function(t){return t?new e.Rect(this._xSpring.current.value,this._ySpring.current.value,this._worldWidthCurrent,this._worldHeightCurrent):new e.Rect(this._xSpring.target.value,this._ySpring.target.value,this._worldWidthTarget,this._worldHeightTarget)},getWorldBounds:function(){e.console.error("[TiledImage.getWorldBounds] is deprecated; use TiledImage.getBounds instead");return this.getBounds()},getClippedBounds:function(t){var i=this.getBoundsNoRotate(t);if(this._clip){var n=(t?this._worldWidthCurrent:this._worldWidthTarget)/this.source.dimensions.x;var o=this._clip.times(n);i=new e.Rect(i.x+o.x,i.y+o.y,o.width,o.height)}return i.rotate(this.getRotation(t),this._getRotationPoint(t))},getContentSize:function(){return new e.Point(this.source.dimensions.x,this.source.dimensions.y)},_viewportToImageDelta:function(t,i,n){var o=n?this._scaleSpring.current.value:this._scaleSpring.target.value;return new e.Point(t*(this.source.dimensions.x/o),i*(this.source.dimensions.y*this.contentAspectX/o))},viewportToImageCoordinates:function(t,i,n){var o;if(t instanceof e.Point){n=i;o=t}else o=new e.Point(t,i);o=o.rotate(-this.getRotation(n),this._getRotationPoint(n));return n?this._viewportToImageDelta(o.x-this._xSpring.current.value,o.y-this._ySpring.current.value):this._viewportToImageDelta(o.x-this._xSpring.target.value,o.y-this._ySpring.target.value)},_imageToViewportDelta:function(t,i,n){var o=n?this._scaleSpring.current.value:this._scaleSpring.target.value;return new e.Point(t/this.source.dimensions.x*o,i/this.source.dimensions.y/this.contentAspectX*o)},imageToViewportCoordinates:function(t,i,n){if(t instanceof e.Point){n=i;i=t.y;t=t.x}var o=this._imageToViewportDelta(t,i);if(n){o.x+=this._xSpring.current.value;o.y+=this._ySpring.current.value}else{o.x+=this._xSpring.target.value;o.y+=this._ySpring.target.value}return o.rotate(this.getRotation(n),this._getRotationPoint(n))},imageToViewportRectangle:function(t,i,n,o,r){var s=t;s instanceof e.Rect?r=i:s=new e.Rect(t,i,n,o);var a=this.imageToViewportCoordinates(s.getTopLeft(),r);var l=this._imageToViewportDelta(s.width,s.height,r);return new e.Rect(a.x,a.y,l.x,l.y,s.degrees+this.getRotation(r))},viewportToImageRectangle:function(t,i,n,o,r){var s=t;t instanceof e.Rect?r=i:s=new e.Rect(t,i,n,o);var a=this.viewportToImageCoordinates(s.getTopLeft(),r);var l=this._viewportToImageDelta(s.width,s.height,r);return new e.Rect(a.x,a.y,l.x,l.y,s.degrees-this.getRotation(r))},viewerElementToImageCoordinates:function(e){var t=this.viewport.pointFromPixel(e,!0);return this.viewportToImageCoordinates(t)},imageToViewerElementCoordinates:function(e){var t=this.imageToViewportCoordinates(e);return this.viewport.pixelFromPoint(t,!0)},windowToImageCoordinates:function(e){var t=e.minus(OpenSeadragon.getElementPosition(this.viewer.element));return this.viewerElementToImageCoordinates(t)},imageToWindowCoordinates:function(e){return this.imageToViewerElementCoordinates(e).plus(OpenSeadragon.getElementPosition(this.viewer.element))},_viewportToTiledImageRectangle:function(t){var i=this._scaleSpring.current.value;t=t.rotate(-this.getRotation(!0),this._getRotationPoint(!0));return new e.Rect((t.x-this._xSpring.current.value)/i,(t.y-this._ySpring.current.value)/i,t.width/i,t.height/i,t.degrees)},viewportToImageZoom:function(e){return this._scaleSpring.current.value*this.viewport._containerInnerSize.x/this.source.dimensions.x*e},imageToViewportZoom:function(e){return e/(this._scaleSpring.current.value*this.viewport._containerInnerSize.x/this.source.dimensions.x)},setPosition:function(e,t){var i=this._xSpring.target.value===e.x&&this._ySpring.target.value===e.y;if(t){if(i&&this._xSpring.current.value===e.x&&this._ySpring.current.value===e.y)return;this._xSpring.resetTo(e.x);this._ySpring.resetTo(e.y);this._needsDraw=!0}else{if(i)return;this._xSpring.springTo(e.x);this._ySpring.springTo(e.y);this._needsDraw=!0}i||this._raiseBoundsChange()},setWidth:function(e,t){this._setScale(e,t)},setHeight:function(e,t){this._setScale(e/this.normHeight,t)},fitBounds:function(t,i,n){i=i||e.Placement.CENTER;var o=e.Placement.properties[i];var r=this.contentAspectX;var s=0;var a=0;var l=1;var h=1;if(this._clip){r=this._clip.getAspectRatio();l=this._clip.width/this.source.dimensions.x;h=this._clip.height/this.source.dimensions.y;if(t.getAspectRatio()>r){s=this._clip.x/this._clip.height*t.height;a=this._clip.y/this._clip.height*t.height}else{s=this._clip.x/this._clip.width*t.width;a=this._clip.y/this._clip.width*t.width}}if(t.getAspectRatio()>r){var c=t.height/h;var u=0;o.isHorizontallyCentered?u=(t.width-t.height*r)/2:o.isRight&&(u=t.width-t.height*r);this.setPosition(new e.Point(t.x-s+u,t.y-a),n);this.setHeight(c,n)}else{var d=t.width/l;var p=0;o.isVerticallyCentered?p=(t.height-t.width/r)/2:o.isBottom&&(p=t.height-t.width/r);this.setPosition(new e.Point(t.x-s,t.y-a+p),n);this.setWidth(d,n)}},getClip:function(){return this._clip?this._clip.clone():null},setClip:function(t){e.console.assert(!t||t instanceof e.Rect,"[TiledImage.setClip] newClip must be an OpenSeadragon.Rect or null");t instanceof e.Rect?this._clip=t.clone():this._clip=null;this._needsDraw=!0;this.raiseEvent("clip-change")},getOpacity:function(){return this.opacity},setOpacity:function(e){if(e!==this.opacity){this.opacity=e;this._needsDraw=!0;this.raiseEvent("opacity-change",{opacity:this.opacity})}},getPreload:function(){return this._preload},setPreload:function(e){this._preload=!!e;this._needsDraw=!0},getRotation:function(e){return e?this._degreesSpring.current.value:this._degreesSpring.target.value},setRotation:function(e,t){if(this._degreesSpring.target.value!==e||!this._degreesSpring.isAtTargetValue()){t?this._degreesSpring.resetTo(e):this._degreesSpring.springTo(e);this._needsDraw=!0;this._raiseBoundsChange()}},_getRotationPoint:function(e){return this.getBoundsNoRotate(e).getCenter()},getCompositeOperation:function(){return this.compositeOperation},setCompositeOperation:function(e){if(e!==this.compositeOperation){this.compositeOperation=e;this._needsDraw=!0;this.raiseEvent("composite-operation-change",{compositeOperation:this.compositeOperation})}},_setScale:function(e,t){var i=this._scaleSpring.target.value===e;if(t){if(i&&this._scaleSpring.current.value===e)return;this._scaleSpring.resetTo(e);this._updateForScale();this._needsDraw=!0}else{if(i)return;this._scaleSpring.springTo(e);this._updateForScale();this._needsDraw=!0}i||this._raiseBoundsChange()},_updateForScale:function(){this._worldWidthTarget=this._scaleSpring.target.value;this._worldHeightTarget=this.normHeight*this._scaleSpring.target.value;this._worldWidthCurrent=this._scaleSpring.current.value;this._worldHeightCurrent=this.normHeight*this._scaleSpring.current.value},_raiseBoundsChange:function(){this.raiseEvent("bounds-change")},_isBottomItem:function(){return this.viewer.world.getItemAt(0)===this},_getLevelsInterval:function(){var e=Math.max(this.source.minLevel,Math.floor(Math.log(this.minZoomImageRatio)/Math.log(2)));var t=this.viewport.deltaPixelsFromPointsNoRotate(this.source.getPixelRatio(0),!0).x*this._scaleSpring.current.value;var i=Math.min(Math.abs(this.source.maxLevel),Math.abs(Math.floor(Math.log(t/this.minPixelRatio)/Math.log(2))));i=Math.max(i,this.source.minLevel||0);return{lowestLevel:e=Math.min(e,i),highestLevel:i}},_updateViewport:function(){this._needsDraw=!1;this._tilesLoading=0;this.loadingCoverage={};for(;this.lastDrawn.length>0;){this.lastDrawn.pop().beingDrawn=!1}var i=this.viewport;var r=this._viewportToTiledImageRectangle(i.getBoundsWithMargins(!0));if(!this.wrapHorizontal&&!this.wrapVertical){var s=this._viewportToTiledImageRectangle(this.getClippedBounds(!0));if(null===(r=r.intersection(s)))return}var a=this._getLevelsInterval();var l=a.lowestLevel;var h=a.highestLevel;var c=null;var u=!1;var d=e.now();for(var p=h;p>=l;p--){var g=!1;var m=i.deltaPixelsFromPointsNoRotate(this.source.getPixelRatio(p),!0).x*this._scaleSpring.current.value;if(p===l||!u&&m>=this.minPixelRatio){g=!0;u=!0}else if(!u)continue;var v=i.deltaPixelsFromPointsNoRotate(this.source.getPixelRatio(p),!1).x*this._scaleSpring.current.value;var f=i.deltaPixelsFromPointsNoRotate(this.source.getPixelRatio(Math.max(this.source.getClosestLevel(),0)),!1).x*this._scaleSpring.current.value;var w=this.immediateRender?1:f;c=t(this,u,g,p,Math.min(1,(m-.5)/.5),w/Math.abs(w-v),r,d,c);if(o(this.coverage,p))break}!function(t,i){if(0===t.opacity||0===i.length&&!t.placeholderFillStyle)return;var n=i[0];var o;n&&(o=t.opacity<1||t.compositeOperation&&"source-over"!==t.compositeOperation||!t._isBottomItem()&&n._hasTransparencyChannel());var r;var s;var a=t.viewport.getZoom(!0);var l=t.viewportToImageZoom(a);if(i.length>1&&l>t.smoothTileEdgesMinZoom&&!t.iOSDevice&&t.getRotation(!0)%360==0&&e.supportsCanvas){o=!0;r=n.getScaleForEdgeSmoothing();s=n.getTranslationForEdgeSmoothing(r,t._drawer.getCanvasSize(!1),t._drawer.getCanvasSize(!0))}var h;if(o){r||(h=t.viewport.viewportToViewerElementRectangle(t.getClippedBounds(!0)).getIntegerBoundingBox().times(e.pixelDensityRatio));t._drawer._clear(!0,h)}if(!r){0!==t.viewport.degrees?t._drawer._offsetForRotation({degrees:t.viewport.degrees,useSketch:o}):t._drawer.viewer.viewport.flipped&&t._drawer._flip({});t.getRotation(!0)%360!=0&&t._drawer._offsetForRotation({degrees:t.getRotation(!0),point:t.viewport.pixelFromPointNoRotate(t._getRotationPoint(!0),!0),useSketch:o})}var c=!1;if(t._clip){t._drawer.saveContext(o);var u=t.imageToViewportRectangle(t._clip,!0);u=u.rotate(-t.getRotation(!0),t._getRotationPoint(!0));var d=t._drawer.viewportToDrawerRectangle(u);r&&(d=d.times(r));s&&(d=d.translate(s));t._drawer.setClip(d,o);c=!0}if(t.placeholderFillStyle&&!1===t._hasOpaqueTile){var p=t._drawer.viewportToDrawerRectangle(t.getBounds(!0));r&&(p=p.times(r));s&&(p=p.translate(s));var g=null;g="function"==typeof t.placeholderFillStyle?t.placeholderFillStyle(t,t._drawer.context):t.placeholderFillStyle;t._drawer.drawRectangle(p,g,o)}for(var m=i.length-1;m>=0;m--){n=i[m];t._drawer.drawTile(n,t._drawingHandler,o,r,s);n.beingDrawn=!0;t.viewer&&t.viewer.raiseEvent("tile-drawn",{tiledImage:t,tile:n})}c&&t._drawer.restoreContext(o);if(!r){t.getRotation(!0)%360!=0&&t._drawer._restoreRotationChanges(o);0!==t.viewport.degrees?t._drawer._restoreRotationChanges(o):t._drawer.viewer.viewport.flipped&&t._drawer._flip({})}if(o){if(r){0!==t.viewport.degrees&&t._drawer._offsetForRotation({degrees:t.viewport.degrees,useSketch:!1});t.getRotation(!0)%360!=0&&t._drawer._offsetForRotation({degrees:t.getRotation(!0),point:t.viewport.pixelFromPointNoRotate(t._getRotationPoint(!0),!0),useSketch:!1})}t._drawer.blendSketch({opacity:t.opacity,scale:r,translate:s,compositeOperation:t.compositeOperation,bounds:h});if(r){t.getRotation(!0)%360!=0&&t._drawer._restoreRotationChanges(!1);0!==t.viewport.degrees&&t._drawer._restoreRotationChanges(!1)}}!function(t,i){if(t.debugMode)for(var n=i.length-1;n>=0;n--){var o=i[n];try{t._drawer.drawDebugInfo(o,i.length,n,t)}catch(t){e.console.error(t)}}}(t,i)}(this,this.lastDrawn);if(c&&!c.context2D){!function(t,i,o){i.loading=!0;t._imageLoader.addJob({src:i.url,loadWithAjax:i.loadWithAjax,ajaxHeaders:i.ajaxHeaders,crossOriginPolicy:t.crossOriginPolicy,ajaxWithCredentials:t.ajaxWithCredentials,callback:function(r,s,a){!function(t,i,o,r,s,a){if(!r){e.console.log("Tile %s failed to load: %s - error: %s",i,i.url,s);t.viewer.raiseEvent("tile-load-failed",{tile:i,tiledImage:t,time:o,message:s,tileRequest:a});i.loading=!1;i.exists=!1;return}if(o<t.lastResetTime){e.console.log("Ignoring tile %s loaded before reset: %s",i,i.url);i.loading=!1;return}var l=function(){var e=t.source.getClosestLevel();n(t,i,r,e,a)};t._midDraw?window.setTimeout(l,1):l()}(t,i,o,r,s,a)},abort:function(){i.loading=!1}})}(this,c,d);this._needsDraw=!0;this._setFullyLoaded(!1)}else this._setFullyLoaded(0===this._tilesLoading)},_getCornerTiles:function(t,i,n){var o;var r;if(this.wrapHorizontal){o=e.positiveModulo(i.x,1);r=e.positiveModulo(n.x,1)}else{o=Math.max(0,i.x);r=Math.min(1,n.x)}var s;var a;var l=1/this.source.aspectRatio;if(this.wrapVertical){s=e.positiveModulo(i.y,l);a=e.positiveModulo(n.y,l)}else{s=Math.max(0,i.y);a=Math.min(l,n.y)}var h=this.source.getTileAtPoint(t,new e.Point(o,s));var c=this.source.getTileAtPoint(t,new e.Point(r,a));var u=this.source.getNumTiles(t);if(this.wrapHorizontal){h.x+=u.x*Math.floor(i.x);c.x+=u.x*Math.floor(n.x)}if(this.wrapVertical){h.y+=u.y*Math.floor(i.y/l);c.y+=u.y*Math.floor(n.y/l)}return{topLeft:h,bottomRight:c}}});function t(e,t,n,o,r,s,l,h,c){var u=l.getBoundingBox().getTopLeft();var d=l.getBoundingBox().getBottomRight();e.viewer&&e.viewer.raiseEvent("update-level",{tiledImage:e,havedrawn:t,level:o,opacity:r,visibility:s,drawArea:l,topleft:u,bottomright:d,currenttime:h,best:c});a(e.coverage,o);a(e.loadingCoverage,o);var p=e._getCornerTiles(o,u,d);var g=p.topLeft;var m=p.bottomRight;var v=e.source.getNumTiles(o);var f=e.viewport.pixelFromPoint(e.viewport.getCenter());for(var w=g.x;w<=m.x;w++)for(var y=g.y;y<=m.y;y++){if(!e.wrapHorizontal&&!e.wrapVertical){var T=e.source.getTileBounds(o,w,y);if(null===l.intersection(T))continue}c=i(e,n,t,w,y,o,r,s,f,v,h,c)}return c}function i(t,i,o,a,l,h,c,u,d,p,g,m){var v=function(t,i,n,o,r,s,a,l,h,c){var u,d,p,g,m,v,f,w,y;s[n]||(s[n]={});s[n][t]||(s[n][t]={});if(!s[n][t][i]){u=(l.x+t%l.x)%l.x;d=(l.y+i%l.y)%l.y;p=r.getTileBounds(n,u,d);g=r.getTileBounds(n,u,d,!0);m=r.tileExists(n,u,d);v=r.getTileUrl(n,u,d);if(o.loadTilesWithAjax){f=r.getTileAjaxHeaders(n,u,d);e.isPlainObject(o.ajaxHeaders)&&(f=e.extend({},o.ajaxHeaders,f))}else f=null;w=r.getContext2D?r.getContext2D(n,u,d):void 0;p.x+=(t-u)/l.x;p.y+=c/h*((i-d)/l.y);y=new e.Tile(n,t,i,p,m,v,w,o.loadTilesWithAjax,f,g);u===l.x-1&&(y.isRightMost=!0);d===l.y-1&&(y.isBottomMost=!0);s[n][t][i]=y}(y=s[n][t][i]).lastTouchTime=a;return y}(a,l,h,t,t.source,t.tilesMatrix,g,p,t._worldWidthCurrent,t._worldHeightCurrent),f=o;t.viewer&&t.viewer.raiseEvent("update-tile",{tiledImage:t,tile:v});s(t.coverage,h,a,l,!1);var w=v.loaded||v.loading||r(t.loadingCoverage,h,a,l);s(t.loadingCoverage,h,a,l,w);if(!v.exists)return m;i&&!f&&(r(t.coverage,h,a,l)?s(t.coverage,h,a,l,!0):f=!0);if(!f)return m;!function(t,i,n,o,r,s){var a=t.bounds.getTopLeft();a.x*=s._scaleSpring.current.value;a.y*=s._scaleSpring.current.value;a.x+=s._xSpring.current.value;a.y+=s._ySpring.current.value;var l=t.bounds.getSize();l.x*=s._scaleSpring.current.value;l.y*=s._scaleSpring.current.value;var h=n.pixelFromPointNoRotate(a,!0),c=n.pixelFromPointNoRotate(a,!1),u=n.deltaPixelsFromPointsNoRotate(l,!0),d=n.deltaPixelsFromPointsNoRotate(l,!1),p=c.plus(d.divide(2)),g=o.squaredDistanceTo(p);i||(u=u.plus(new e.Point(1,1)));t.isRightMost&&s.wrapHorizontal&&(u.x+=.75);t.isBottomMost&&s.wrapVertical&&(u.y+=.75);t.position=h;t.size=u;t.squaredDistance=g;t.visibility=r}(v,t.source.tileOverlap,t.viewport,d,u,t);if(!v.loaded)if(v.context2D)n(t,v);else{var y=t._tileCache.getImageRecord(v.cacheKey);if(y){n(t,v,y.getImage())}}if(v.loaded){(function(e,t,i,n,o,r,a){var l,h,c=1e3*e.blendTime;t.blendStart||(t.blendStart=a);l=a-t.blendStart;h=c?Math.min(1,l/c):1;e.alwaysBlend&&(h*=r);t.opacity=h;e.lastDrawn.push(t);if(1==h){s(e.coverage,o,i,n,!0);e._hasOpaqueTile=!0}else if(l<c)return!0;return!1})(t,v,a,l,h,c,g)&&(t._needsDraw=!0)}else v.loading?t._tilesLoading++:w||(m=function(e,t){if(!e)return t;{if(t.visibility>e.visibility)return t;if(t.visibility==e.visibility&&t.squaredDistance<e.squaredDistance)return t}return e}(m,v));return m}function n(e,t,i,n,o){var r=0;function s(){r++;return a}function a(){if(0===--r){t.loading=!1;t.loaded=!0;t.context2D||e._tileCache.cacheTile({image:i,tile:t,cutoff:n,tiledImage:e});e._needsDraw=!0}}e.viewer.raiseEvent("tile-loaded",{tile:t,tiledImage:e,tileRequest:o,image:i,getCompletionCallback:s});s()()}function o(e,t,i,n){var o,r,s,a;if(!e[t])return!1;if(void 0===i||void 0===n){o=e[t];for(s in o)if(o.hasOwnProperty(s)){r=o[s];for(a in r)if(r.hasOwnProperty(a)&&!r[a])return!1}return!0}return void 0===e[t][i]||void 0===e[t][i][n]||!0===e[t][i][n]}function r(e,t,i,n){return void 0===i||void 0===n?o(e,t+1):o(e,t+1,2*i,2*n)&&o(e,t+1,2*i,2*n+1)&&o(e,t+1,2*i+1,2*n)&&o(e,t+1,2*i+1,2*n+1)}function s(t,i,n,o,r){if(t[i]){t[i][n]||(t[i][n]={});t[i][n][o]=r}else e.console.warn("Setting coverage for a tile before its level's coverage has been reset: %s",i)}function a(e,t){e[t]={}}}(OpenSeadragon);!function(e){var t=function(t){e.console.assert(t,"[ImageRecord] options is required");e.console.assert(t.image,"[ImageRecord] options.image is required");this._image=t.image;this._tiles=[]};t.prototype={destroy:function(){this._image=null;this._renderedContext=null;this._tiles=null},getImage:function(){return this._image},getRenderedContext:function(){if(!this._renderedContext){var e=document.createElement("canvas");e.width=this._image.width;e.height=this._image.height;this._renderedContext=e.getContext("2d");this._renderedContext.drawImage(this._image,0,0);this._image=null}return this._renderedContext},setRenderedContext:function(t){e.console.error("ImageRecord.setRenderedContext is deprecated. The rendered context should be created by the ImageRecord itself when calling ImageRecord.getRenderedContext.");this._renderedContext=t},addTile:function(t){e.console.assert(t,"[ImageRecord.addTile] tile is required");this._tiles.push(t)},removeTile:function(t){for(var i=0;i<this._tiles.length;i++)if(this._tiles[i]===t){this._tiles.splice(i,1);return}e.console.warn("[ImageRecord.removeTile] trying to remove unknown tile",t)},getTileCount:function(){return this._tiles.length}};e.TileCache=function(t){t=t||{};this._maxImageCacheCount=t.maxImageCacheCount||e.DEFAULT_SETTINGS.maxImageCacheCount;this._tilesLoaded=[];this._imagesLoaded=[];this._imagesLoadedCount=0};e.TileCache.prototype={numTilesLoaded:function(){return this._tilesLoaded.length},cacheTile:function(i){e.console.assert(i,"[TileCache.cacheTile] options is required");e.console.assert(i.tile,"[TileCache.cacheTile] options.tile is required");e.console.assert(i.tile.cacheKey,"[TileCache.cacheTile] options.tile.cacheKey is required");e.console.assert(i.tiledImage,"[TileCache.cacheTile] options.tiledImage is required");var n=i.cutoff||0;var o=this._tilesLoaded.length;var r=this._imagesLoaded[i.tile.cacheKey];if(!r){e.console.assert(i.image,"[TileCache.cacheTile] options.image is required to create an ImageRecord");r=this._imagesLoaded[i.tile.cacheKey]=new t({image:i.image});this._imagesLoadedCount++}r.addTile(i.tile);i.tile.cacheImageRecord=r;if(this._imagesLoadedCount>this._maxImageCacheCount){var s=null;var a=-1;var l=null;var h,c,u,d,p,g;for(var m=this._tilesLoaded.length-1;m>=0;m--)if(!((h=(g=this._tilesLoaded[m]).tile).level<=n||h.beingDrawn))if(s){d=h.lastTouchTime;c=s.lastTouchTime;p=h.level;u=s.level;if(d<c||d==c&&p>u){s=h;a=m;l=g}}else{s=h;a=m;l=g}if(s&&a>=0){this._unloadTile(l);o=a}}this._tilesLoaded[o]=new function(t){e.console.assert(t,"[TileCache.cacheTile] options is required");e.console.assert(t.tile,"[TileCache.cacheTile] options.tile is required");e.console.assert(t.tiledImage,"[TileCache.cacheTile] options.tiledImage is required");this.tile=t.tile;this.tiledImage=t.tiledImage}({tile:i.tile,tiledImage:i.tiledImage})},clearTilesFor:function(t){e.console.assert(t,"[TileCache.clearTilesFor] tiledImage is required");var i;for(var n=0;n<this._tilesLoaded.length;++n)if((i=this._tilesLoaded[n]).tiledImage===t){this._unloadTile(i);this._tilesLoaded.splice(n,1);n--}},getImageRecord:function(t){e.console.assert(t,"[TileCache.getImageRecord] cacheKey is required");return this._imagesLoaded[t]},_unloadTile:function(t){e.console.assert(t,"[TileCache._unloadTile] tileRecord is required");var i=t.tile;var n=t.tiledImage;i.unload();i.cacheImageRecord=null;var o=this._imagesLoaded[i.cacheKey];o.removeTile(i);if(!o.getTileCount()){o.destroy();delete this._imagesLoaded[i.cacheKey];this._imagesLoadedCount--}n.viewer.raiseEvent("tile-unloaded",{tile:i,tiledImage:n})}}}(OpenSeadragon);!function(e){e.World=function(t){var i=this;e.console.assert(t.viewer,"[World] options.viewer is required");e.EventSource.call(this);this.viewer=t.viewer;this._items=[];this._needsDraw=!1;this._autoRefigureSizes=!0;this._needsSizesFigured=!1;this._delegatedFigureSizes=function(e){i._autoRefigureSizes?i._figureSizes():i._needsSizesFigured=!0};this._figureSizes()};e.extend(e.World.prototype,e.EventSource.prototype,{addItem:function(t,i){e.console.assert(t,"[World.addItem] item is required");e.console.assert(t instanceof e.TiledImage,"[World.addItem] only TiledImages supported at this time");if(void 0!==(i=i||{}).index){var n=Math.max(0,Math.min(this._items.length,i.index));this._items.splice(n,0,t)}else this._items.push(t);this._autoRefigureSizes?this._figureSizes():this._needsSizesFigured=!0;this._needsDraw=!0;t.addHandler("bounds-change",this._delegatedFigureSizes);t.addHandler("clip-change",this._delegatedFigureSizes);this.raiseEvent("add-item",{item:t})},getItemAt:function(t){e.console.assert(void 0!==t,"[World.getItemAt] index is required");return this._items[t]},getIndexOfItem:function(t){e.console.assert(t,"[World.getIndexOfItem] item is required");return e.indexOf(this._items,t)},getItemCount:function(){return this._items.length},setItemIndex:function(t,i){e.console.assert(t,"[World.setItemIndex] item is required");e.console.assert(void 0!==i,"[World.setItemIndex] index is required");var n=this.getIndexOfItem(t);if(i>=this._items.length)throw new Error("Index bigger than number of layers.");if(i!==n&&-1!==n){this._items.splice(n,1);this._items.splice(i,0,t);this._needsDraw=!0;this.raiseEvent("item-index-change",{item:t,previousIndex:n,newIndex:i})}},removeItem:function(t){e.console.assert(t,"[World.removeItem] item is required");var i=e.indexOf(this._items,t);if(-1!==i){t.removeHandler("bounds-change",this._delegatedFigureSizes);t.removeHandler("clip-change",this._delegatedFigureSizes);t.destroy();this._items.splice(i,1);this._figureSizes();this._needsDraw=!0;this._raiseRemoveItem(t)}},removeAll:function(){this.viewer._cancelPendingImages();var e;var t;for(t=0;t<this._items.length;t++){(e=this._items[t]).removeHandler("bounds-change",this._delegatedFigureSizes);e.removeHandler("clip-change",this._delegatedFigureSizes);e.destroy()}var i=this._items;this._items=[];this._figureSizes();this._needsDraw=!0;for(t=0;t<i.length;t++){e=i[t];this._raiseRemoveItem(e)}},resetItems:function(){for(var e=0;e<this._items.length;e++)this._items[e].reset()},update:function(){var e=!1;for(var t=0;t<this._items.length;t++)e=this._items[t].update()||e;return e},draw:function(){for(var e=0;e<this._items.length;e++)this._items[e].draw();this._needsDraw=!1},needsDraw:function(){for(var e=0;e<this._items.length;e++)if(this._items[e].needsDraw())return!0;return this._needsDraw},getHomeBounds:function(){return this._homeBounds.clone()},getContentFactor:function(){return this._contentFactor},setAutoRefigureSizes:function(e){this._autoRefigureSizes=e;if(e&this._needsSizesFigured){this._figureSizes();this._needsSizesFigured=!1}},arrange:function(t){var i=(t=t||{}).immediately||!1;var n=t.layout||e.DEFAULT_SETTINGS.collectionLayout;var o=t.rows||e.DEFAULT_SETTINGS.collectionRows;var r=t.columns||e.DEFAULT_SETTINGS.collectionColumns;var s=t.tileSize||e.DEFAULT_SETTINGS.collectionTileSize;var a=s+(t.tileMargin||e.DEFAULT_SETTINGS.collectionTileMargin);var l;l=!t.rows&&r?r:Math.ceil(this._items.length/o);var h=0;var c=0;var u,d,p,g,m;this.setAutoRefigureSizes(!1);for(var v=0;v<this._items.length;v++){if(v&&v%l==0)if("horizontal"===n){c+=a;h=0}else{h+=a;c=0}g=(p=(d=(u=this._items[v]).getBounds()).width>d.height?s:s*(d.width/d.height))*(d.height/d.width);m=new e.Point(h+(s-p)/2,c+(s-g)/2);u.setPosition(m,i);u.setWidth(p,i);"horizontal"===n?h+=a:c+=a}this.setAutoRefigureSizes(!0)},_figureSizes:function(){var t=this._homeBounds?this._homeBounds.clone():null;var i=this._contentSize?this._contentSize.clone():null;var n=this._contentFactor||0;if(this._items.length){var o=this._items[0];var r=o.getBounds();this._contentFactor=o.getContentSize().x/r.width;var s=o.getClippedBounds().getBoundingBox();var a=s.x;var l=s.y;var h=s.x+s.width;var c=s.y+s.height;for(var u=1;u<this._items.length;u++){r=(o=this._items[u]).getBounds();this._contentFactor=Math.max(this._contentFactor,o.getContentSize().x/r.width);s=o.getClippedBounds().getBoundingBox();a=Math.min(a,s.x);l=Math.min(l,s.y);h=Math.max(h,s.x+s.width);c=Math.max(c,s.y+s.height)}this._homeBounds=new e.Rect(a,l,h-a,c-l);this._contentSize=new e.Point(this._homeBounds.width*this._contentFactor,this._homeBounds.height*this._contentFactor)}else{this._homeBounds=new e.Rect(0,0,1,1);this._contentSize=new e.Point(1,1);this._contentFactor=1}this._contentFactor===n&&this._homeBounds.equals(t)&&this._contentSize.equals(i)||this.raiseEvent("metrics-change",{})},_raiseRemoveItem:function(e){this.raiseEvent("remove-item",{item:e})}})}(OpenSeadragon);
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