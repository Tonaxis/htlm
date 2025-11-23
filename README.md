# htlm

Converts `.htlm` files (scrambled tag names) into valid HTML and resolves `<import>`, `<export>`, and `<children>` modules.

## Installation

```bash
npm i -D htlm
```

## CLI

```bash
htlmc --srcDir ./src --outDir ./dist
```

- `--srcDir`: root folder containing `.htlm` files (default `.`)
- `--outDir`: output folder for `.html` files (default `./dist`)

## Config file `htlm.config.json`

Place it at the project root:
```json
{
  "srcDir": "./src",
  "outDir": "./dist"
}
```
CLI flags override config values; missing keys fall back to defaults.

## Features

- **Fuzzy tag names**: names are alphabetically sorted before mapping to real HTML (`bdoy` → `<body>`, `imoprt` → `<import>`, etc.).
- **`<export>`**: defines a reusable fragment identified by `@_id`.
- **`<import>`**: inserts an exported fragment locally or from another file via `@_src`.
- **`<children>`**: inside an `<export>`, replaced by the child content of the calling `<import>`.
- **In-memory resolution**: files with imports/exports are resolved before writing; the final tree has no `<import>` tags.

## Quick example

`src/page.htlm`
```html
<hlmt>
  <bdoy>
    <imoprt @_id="hero" @_src="./partials/hero">
      <psapn @_class="highlight">Hello</psapn>
    </imoprt>
  </bdoy>
</hlmt>
```

`src/partials/hero.htlm`
```html
<hlmt>
  <bdoy>
    <eoprtx @_id="hero">
      <idv>
        <ph>Welcome</ph>
        <children />
      </idv>
    </eoprtx>
  </bdoy>
</hlmt>
```

Result (`dist/page.html`)
```html
<html>
  <body>
    <div>
      <h1>Welcome</h1>
      <span class="highlight">Hello</span>
    </div>
  </body>
</html>
```
