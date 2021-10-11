# react-accessible-menu

![](https://badgen.net/npm/v/react-accessible-menu)
![](https://badgen.net/npm/types/react-accessible-menu)
[![](https://badgen.net/bundlephobia/dependency-count/react-complex-tree)](https://bundlephobia.com/package/react-accessible-menu)
[![](https://badgen.net/bundlephobia/minzip/react-complex-tree)](https://bundlephobia.com/package/react-accessible-menu)

> Accessible keyboard-friendly interactive list/menu component

<div style="text-align: center">
<a href="http://lukasbach.github.io/react-accessible-menu/storybook">Demo</a> -
<a href="http://lukasbach.github.io/react-accessible-menu/">Docs</a> -
</div>

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
