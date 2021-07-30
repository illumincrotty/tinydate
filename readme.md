# Tiny Date Formatter
<!-- PROJECT LOGO -->
<img src="https://i.imgur.com/na4lX3N.png" alt="logo" width="200"/>

<!-- Shields -->
![npm](https://img.shields.io/npm/l/tiny_date_formatter.svg)
![size-badge](https://img.badgesize.io/https:/unpkg.com/tiny_date_formatter/dist/index.modern.js?compression=brotli)
![Types](https://badgen.net/npm/types/tiny_date_formatter)

</div>

---

<p align="center"> A tiny (358B) reusable date formatter. Extremely fast!
</p>

## 📝 Table of Contents

- [Tiny Date Formatter](#tiny-date-formatter)
  - [📝 Table of Contents](#-table-of-contents)
  - [🧐 About](#-about)
  - [Install](#install)
    - [Package Manager](#package-manager)
    - [CDN](#cdn)
  - [🔧 Running the tests](#-running-the-tests)
  - [🎈 Usage](#-usage)
    - [Example](#example)
    - [API](#api)
      - [formatter(pattern, dict?)(date?)](#formatterpattern-dictdate)
        - [pattern](#pattern)
        - [dict](#dict)
    - [Patterns](#patterns)
  - [📃 License](#-license)
  - [✍️ Authors](#️-authors)
  - [🔨 Similar Tools](#-similar-tools)

## 🧐 About

An update of [tinydate](https://github.com/lukeed/tinydate/) by [Luke Edwards](https://lukeed.com), this module returns a "render" function that efficiently re-render your deconstructed template. This allows for highly performant results!

However, please notice that this only provides a [limited subset of Date methods](#patterns).

## Install

### Package Manager

#### NPM <!-- omit in TOC -->

```sh
npm i tiny_date_formatter
```

#### PNPM <!-- omit in TOC -->

```sh
pnpm add tiny_date_formatter
```

#### Yarn <!-- omit in TOC -->

```sh
yarn add tiny_date_formatter
```

### CDN

#### Skypack <!-- omit in TOC -->

For Web and Deno, no install is required! Just put this line at the top of your file:

```typescript
import { formatter } from 'https://cdn.skypack.dev/tiny_date_formatter';
```

If you want type support with skypack, follow the directions [here]('https://docs.skypack.dev/skypack-cdn/code/javascript#using-skypack-urls-in-typescript')

#### UNPKG <!-- omit in TOC -->

```html
<script src="https://unpkg.com/tiny_date_formatter"></script>
```

And use it like you would any other package from UNPKG

## 🔧 Running the tests

The basic set of tests are in the test script, the coverage script, and the report script. Just run those using your perferred package manager (npm, yarn, pnpm, etc.) to make sure nothing has broken.

## 🎈 Usage

Here's the great part: thanks to [microbundle](https://github.com/developit/microbundle), this package supports CJS, UMD, and ESM formats.
That means that wherever and however you use this package — in browser or node, with import or require — you *should* be set, no configuration required.

### Example

```js
import {formatter} from ('tiny_date_formatter');
const exampleDate = new Date('5/1/2017, 4:30:09 PM');

const stamp = formatter('Current time: [{HH}:{mm}:{ss}]');

stamp(fooDate);
//=> Current time: [16:30:09]

stamp(new Date());
//=> Current time: [17:09:34]
```

### API

#### formatter(pattern, dict?)(date?)

Returns: `Function`

Returns a rendering function that accepts a [`date`](#date) value as its only argument.

##### pattern

Type: `String`
Required: `true`

The template pattern to be parsed. any characters besides braces are allowed. A TypeError will be thrown if the text inside doesn't match any of the defaults or newly entered custom patterns.
Examples: `"{HH}:{mm}"` `"Last changed {MM}"`

##### dict

Type: `Object`
Required: `false`

A custom dictionary of template patterns. You may override [existing patterns](#patterns) or declare new ones.

> **Important:** All dictionary items **must be a function** and must control its own formatting. A date will be passed in but it is not necessary to use it. For example, when defining your own `{ss}` template, `tinydate` **will not** pad its value to two digits.

```js
const today = new Date('2019-07-04, 5:30:00 PM');

// Example custom dictionary:
//   - Adds {MMMM}
//   - Overrides {DD}
const stamp = tinydate('Today is: {MMMM} {DD}, {YYYY}', {
 MMMM: d => d.toLocaleString('default', { month: 'long' }),
 DD: d => d.getDate()
});

stamp(today);
//=> 'Today is: July 4, 2019'
```

Other example dictionaries: `{SP: ()=>"__spaces__"}`, `{'DD-3':(d:Date)=>d.getDate()-3.toString()`

### Patterns

- `{YYYY}`: full year; eg: **2017**
- `{YY}`: short year; eg: **17**
- `{MM}`: month; eg: **04**
- `{DD}`: day; eg: **01**
- `{HH}`: hours; eg: **06** (24h)
- `{mm}`: minutes; eg: **59**
- `{ss}`: seconds; eg: **09**
- `{fff}`: milliseconds; eg: **555**

## 📃 License

Distributed under the MIT License. See `LICENSE` for more information.

## ✍️ Authors

Find me [@illumincrotty](https://github.com/illumincrotty) on github or [@illumincrotty](https://twitter.com/illumincrotty) on twitter

## 🔨 Similar Tools

If this tool isn't working for you, try one of these:

- [date-fns]("https://github.com/date-fns/date-fns")
- [@bitty/format-date]("https://github.com/VitorLuizC/format-date")
- [fecha]("https://github.com/taylorhakes/fecha") 
  