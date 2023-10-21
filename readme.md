# icu-to-json

Compile ICU MessageFormat strings to JSON at build time and render them at runtime

![icu-to-json](https://raw.githubusercontent.com/jantimon/icu-to-json/main/logo.jpg)

## Goal

This library aims to provide a way to compile ICU MessageFormat strings to compressed JSON at build time and render them at runtime with a minimal runtime footprint.

## Features

![icu-to-json](https://raw.githubusercontent.com/jantimon/icu-to-json/main/size.png)

1. **Smaller Runtime Footprint**  
 The runtime footprint is only 1kb (minified and gzipped)
2. **No parsing at runtime**  
 The precompiled JSON can be rendered without any string parsing at runtime
3. **Flexible**  
 The runtime is able to not only return strings but also richtext elements (e.g. JSX)

## Installation

```sh
npm install icu-to-json
```

## Usage

### Compile

```sh
icu-to-json src/messages.json dist/messages.json
```

### Render

Pure Interpolations

```js
import { run } from 'icu-to-json';

// e.g. precompiled icu messsage:
// "Hello {name}!"
run(precompiledMessage, ['en'], { name: 'World' })) // Hello, World!
```

Plurals and Selectordinal

```js
import { run } from 'icu-to-json';

import { en } from "@messageformat/runtime/lib/cardinals";
import { en as enOd } from "make-plural/ordinals";

// e.g. precompiled icu messsage:
// "You have {count, plural, one {# unread message} other {# unread messages}}."
run(precompiledMessage, ['en', en, enOd], { count: 1 })) // You have 1 unread message.

```

Tags

```js
import { run } from 'icu-to-json';

// e.g. precompiled icu messsage:
// "You have <b>{count}</b> messages."
run(precompiledMessage, ['en'], { count: 1, b: (content: number) => `**${number}**`})) // You have **1** messages.
```

## Status

This library is still in early development and not yet ready for production use.

## License

MIT