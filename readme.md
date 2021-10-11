# react-accessible-menu

![](https://badgen.net/npm/v/react-accessible-menu)
![](https://badgen.net/npm/types/react-accessible-menu)
[![](https://badgen.net/bundlephobia/dependency-count/react-complex-tree)](https://bundlephobia.com/package/react-accessible-menu)
[![](https://badgen.net/bundlephobia/minzip/react-complex-tree)](https://bundlephobia.com/package/react-accessible-menu)

> Accessible keyboard-friendly interactive list/menu component

<div style="text-align: center">
<a href="http://lukasbach.github.io/react-accessible-menu/storybook">Demo</a> -
<a href="http://lukasbach.github.io/react-accessible-menu/">Docs</a>
</div>

## Features

- List items can be navigated with Arrow keys, Home, End and letter keys for quick navigation
- ARIA attributes and other accessibility attributes are automatically bound
- Unopinionated, allows completely customized render logic and arbitrary DOM nesting ([Demo 1](https://lukasbach.github.io/react-accessible-menu/storybook/?path=/docs/accessible-menu--complex-nesting), [Demo 2](https://lukasbach.github.io/react-accessible-menu/storybook/?path=/docs/accessible-menu--interrupted-list))
- Tiny in size and with minimal performance overhead
- Trivially virtualizable ([Demo](https://lukasbach.github.io/react-accessible-menu/storybook/?path=/docs/accessible-menu--virtualized-example))
- Provides both a component-based and hook-based interface ([Demo](https://lukasbach.github.io/react-accessible-menu/storybook/?path=/docs/accessible-menu--using-hooks))
- Typed with Typescript
- Supports dynamic updates to list ([Demo](https://lukasbach.github.io/react-accessible-menu/storybook/?path=/docs/accessible-menu--dynamic-changes-to-list))

## Installation

To start using react-accessible-menu, install it to your project as a dependency via

```
npm install react-accessible-menu
```

then import it and add your menu with

```typescript jsx
import { Menu, MenuItem } from 'react-accessible-menu';

<Menu
  renderMenu={({ props, ref }) => (
    <div className="list" ref={ref} {...props}>
      <MenuItem<HTMLButtonElement>
        renderItem={({ props, ref,  }) => (
          <button {...props} ref={ref} className="item">
            Apple
          </button>
        )}
      />
      <MenuItem<HTMLButtonElement>
        renderItem={({ props, ref,  }) => (
          <button {...props} ref={ref} className="item">
            Orange
          </button>
        )}
      />
    </div>
  )}
/>
```

You can find more examples in the [Project's Storybook](https://github.com/lukasbach/react-accessible-menu/blob/main/src/Menu.stories.tsx).
