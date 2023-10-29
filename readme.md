# icu-to-json

<a href="https://pkg-size.dev/icu-to-json"><img src="https://pkg-size.dev/badge/bundle/1039" title="Bundle size for icu-to-json"></a>

Precompile i18n [icu syntax](https://formatjs.io/docs/core-concepts/icu-syntax) translations to JSON at build time and render them at runtime

Build Time: `compile("Hello {name}")` → `[["name"],"Hello ",0]`  
Run Time: `run( [["name"],"Hello ",0], { name: "World"} )` → `"Hello World"`

![icu-to-json logo](https://raw.githubusercontent.com/jantimon/icu-to-json/main/docs/logo.jpg)

## Goal

The main goal is to boot up javascript apps with ICU translations as fast as possible for the end user.

Therefore this library provides a way to compile ICU MessageFormat strings to compressed JSON at build time and render them at runtime with a minimal runtime footprint.

[![overhead size comparison](https://raw.githubusercontent.com/jantimon/icu-to-json/main/docs/sizes.png)](https://playground-icu-to-json.vercel.app/comparison)

[![size of icu-to-json](https://raw.githubusercontent.com/jantimon/icu-to-json/main/docs/size.png)](https://pkg-size.dev/icu-to-json)

## Features

1. **Smaller Runtime Footprint**  
 The runtime footprint is only 1kb (minified and gzipped)
2. **No parsing at runtime**  
 The precompiled JSON can be rendered without any string parsing at runtime
3. **Flexible**  
 The runtime is able to not only return strings but also any object (aka rich text elements like JSX)
4. **Types**  
 The compiler has an optional feature to generate typescript types for the ICU messages and their arguments


[![animation showing type autocomplete](https://raw.githubusercontent.com/jantimon/icu-to-json/main/docs/types.gif)](https://github.com/jantimon/icu-to-json/blob/main/src/__tests__/__snapshots__/cli.test.messages.ts)  
⚠️ the typed `t()` function is not part of this library. It is only an example how the generated types could be used.

## Installation

```sh
npm install icu-to-json
```

## Usage

### Runtime

#### Pure Interpolations

```js
import { run } from 'icu-to-json';

// e.g. precompiled icu messsage:
// "Hello {name}!"
run(precompiledMessage, "en", { name: 'World' })) // Hello, World!
```

#### Plurals and Selectordinal

```js
import { run } from 'icu-to-json';

// e.g. precompiled icu messsage:
// "You have {count, plural, one {# unread message} other {# unread messages}}."
run(precompiledMessage, "en", { count: 1 })) // You have 1 unread message.
```

#### Tags

Tags can be used to wrap parts of the message. 

```js
import { run } from 'icu-to-json';

// e.g. precompiled icu messsage:
// "You have <b>{count}</b> messages."
run(precompiledMessage, "en", { count: 2, b: (content: number) => `**${number}**`})) // You have **2** messages.
```

#### Rich Text

The runtime is able to not only return strings but also richtext elements (e.g. JSX).  
JSX is only used as an example here - it works with any other object as well.

```jsx
import { evaluateAst } from 'icu-to-json';

// e.g. precompiled icu messsage:
// "You have <link><b>{count, plural, one {# unread message} other {# unread messages}}.</b></link>"
evaluateAst(precompiledMessage, "en", { 
    count: 1, 
    link: (content: string) => <a href="/messages">{content}</a>,
    b: (content: string) => <b>{content}</b>
}) // [ 'You have ', <a href="/messages"><b>1 unread message.</b></a> ]
```

### Compile

#### CLI

The CLI can be used to compile ICU MessageFormat strings to JSON at build time.

```sh
# compile icu messages to json
icu-to-json src/messages.json dist/messages.json
# generate typescript types, locales and formatters from the icu messages
icu-to-json --types src/messages.json dist/messages.json
```

#### API

```js
import { compile } from 'icu-to-json/compiler';

const precompiledMessage = compile('Hello {name}!');
```

## Status

This library is still in early development and not yet ready for production use.

## How does it work?

The main work is done by the `@formatjs/icu-messageformat-parser`, which parses the ICU MessageFormat strings and returns an AST.
The AST is then traversed and compiled to JSON by `icu-to-json`.

## License

MIT