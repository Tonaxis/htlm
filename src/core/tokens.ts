/**
 * A mapping of sorted letter combinations to HTML tag names.
 */
export const tokens: Record<
  string,
  { default: string; alternative?: { parent: string; value: string } }
> = {
  a: {
    default: "a",
  },
  abbr: {
    default: "abbr",
  },
  adderss: {
    default: "address",
  },
  aaer: {
    default: "area",
  },
  aceilrt: {
    default: "article",
  },
  adeis: {
    default: "aside",
  },
  adiou: {
    default: "audio",
  },
  b: {
    default: "b",
  },
  abes: {
    default: "base",
  },
  bdi: {
    default: "bdi",
  },
  bdo: {
    default: "bdo",
  },
  bceklooqtu: {
    default: "blockquote",
  },
  bdoy: {
    default: "body",
  },
  br: {
    alternative: {
      parent: "ruby",
      value: "rb",
    },
    default: "br",
  },
  bnottu: {
    default: "button",
  },
  aacnsv: {
    default: "canvas",
  },
  acinopt: {
    default: "caption",
  },
  ceit: {
    default: "cite",
  },
  cdeo: {
    default: "code",
  },
  clo: {
    default: "col",
  },
  cgloopru: {
    default: "colgroup",
  },
  aadt: {
    default: "data",
  },
  aadilstt: {
    default: "datalist",
  },
  dd: {
    default: "dd",
  },
  del: {
    default: "del",
  },
  adeilst: {
    default: "details",
  },
  dfn: {
    default: "dfn",
  },
  adgilo: {
    default: "dialog",
  },
  div: {
    default: "div",
  },
  dl: {
    default: "dl",
  },
  dt: {
    alternative: {
      parent: "dl",
      value: "dt",
    },
    default: "td",
  },
  em: {
    default: "em",
  },
  bdeem: {
    default: "embed",
  },
  deefilst: {
    default: "fieldset",
  },
  acfgiinopt: {
    default: "figcaption",
  },
  efgiru: {
    default: "figure",
  },
  efoort: {
    default: "footer",
  },
  fmor: {
    default: "form",
  },
  "1h": {
    default: "h1",
  },
  "2h": {
    default: "h2",
  },
  "3h": {
    default: "h3",
  },
  "4h": {
    default: "h4",
  },
  "5h": {
    default: "h5",
  },
  "6h": {
    default: "h6",
  },
  adeh: {
    default: "head",
  },
  adeehr: {
    default: "header",
  },
  ghopru: {
    default: "hgroup",
  },
  hr: {
    default: "hr",
  },
  hlmt: {
    default: "html",
  },
  i: {
    default: "i",
  },
  aefimr: {
    default: "iframe",
  },
  inptu: {
    default: "input",
  },
  ins: {
    default: "ins",
  },
  bdk: {
    default: "kbd",
  },
  abell: {
    default: "label",
  },
  deegln: {
    default: "legend",
  },
  il: {
    default: "li",
  },
  ikln: {
    default: "link",
  },
  aimn: {
    default: "main",
  },
  amp: {
    default: "map",
  },
  akmr: {
    default: "mark",
  },
  aemt: {
    default: "meta",
  },
  eemrt: {
    default: "meter",
  },
  anv: {
    default: "nav",
  },
  cinoprst: {
    default: "noscript",
  },
  bcejot: {
    default: "object",
  },
  lo: {
    default: "ol",
  },
  goopprtu: {
    default: "optgroup",
  },
  inoopt: {
    default: "option",
  },
  opttuu: {
    default: "output",
  },
  p: {
    default: "p",
  },
  aampr: {
    default: "param",
  },
  ceiprtu: {
    default: "picture",
  },
  epr: {
    default: "pre",
  },
  egoprrss: {
    default: "progress",
  },
  q: {
    default: "q",
  },
  pr: {
    default: "rp",
  },
  rt: {
    alternative: {
      parent: "ruby",
      value: "rt",
    },
    default: "tr",
  },
  bruy: {
    default: "ruby",
  },
  s: {
    default: "s",
  },
  amps: {
    default: "samp",
  },
  ciprst: {
    default: "script",
  },
  ceinost: {
    default: "section",
  },
  ceelst: {
    default: "select",
  },
  allms: {
    default: "small",
  },
  ceorsu: {
    default: "source",
  },
  anps: {
    default: "span",
  },
  gnorst: {
    default: "strong",
  },
  elsty: {
    default: "style",
  },
  bsu: {
    default: "sub",
  },
  ammrsuy: {
    default: "summary",
  },
  psu: {
    default: "sup",
  },
  abelt: {
    default: "table",
  },
  bdoty: {
    default: "tbody",
  },
  aeelmptt: {
    default: "template",
  },
  aaeerttx: {
    default: "textarea",
  },
  foott: {
    default: "tfoot",
  },
  ht: {
    default: "th",
  },
  adeht: {
    default: "thead",
  },
  eimt: {
    default: "time",
  },
  eiltt: {
    default: "title",
  },
  ackrt: {
    default: "track",
  },
  u: {
    default: "u",
  },
  lu: {
    default: "ul",
  },
  arv: {
    default: "var",
  },
  deiov: {
    default: "video",
  },
  brw: {
    default: "wbr",
  },
  gim: {
    default: "img",
  },
  gsv: {
    default: "svg",
  },
  ahmt: {
    default: "math",
  },
  acehrs: {
    default: "search",
  },
  lost: {
    default: "slot",
  },
  acmnory: {
    default: "acronym",
  },
  aelppt: {
    default: "applet",
  },
  abefnost: {
    default: "basefont",
  },
  bdgnosu: {
    default: "bgsound",
  },
  bgi: {
    default: "big",
  },
  bikln: {
    default: "blink",
  },
  ceenrt: {
    default: "center",
  },
  cennott: {
    default: "content",
  },
  acdeoorrt: {
    default: "decorator",
  },
  dir: {
    default: "dir",
  },
  eeelmnt: {
    default: "element",
  },
  fnot: {
    default: "font",
  },
  aefmr: {
    default: "frame",
  },
  aeefmrst: {
    default: "frameset",
  },
  deiinsx: {
    default: "isindex",
  },
  eegkny: {
    default: "keygen",
  },
  giilnst: {
    default: "listing",
  },
  aeemqru: {
    default: "marquee",
  },
  emnu: {
    default: "menu",
  },
  eeimmntu: {
    default: "menuitem",
  },
  bnor: {
    default: "nobr",
  },
  aefmnors: {
    default: "noframes",
  },
  aeilnpttx: {
    default: "plaintext",
  },
  aloprt: {
    default: "portal",
  },
  crt: {
    default: "rtc",
  },
  adhosw: {
    default: "shadow",
  },
  aceprs: {
    default: "spacer",
  },
  eikrst: {
    default: "strike",
  },
  tt: {
    default: "tt",
  },
  mpx: {
    default: "xmp",
  },
  imoprt: {
    default: "import",
  },
  eoprtx: {
    default: "export",
  },
  cdehilnr: {
    default: "children",
  },
};
