import React, { useCallback, useRef, useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { Menu, MenuImperativeHandle, MenuOrientation, MenuProps } from '.';
import { AutoSizer, List as VirtualizedList, ListRowRenderer } from 'react-virtualized';
import { MenuItem } from './MenuItem';
import { action } from '@storybook/addon-actions';
import { useMenu } from './useMenu';
import { useMenuItem } from './useMenuItem';

export default {
  title: 'Accessible Menu',
  component: Menu,
  subcomponents: {Menu, MenuItem},
} as ComponentMeta<typeof Menu>;

const numbers = "-".repeat(100).split("").map((_, idx) => idx);
const largeList = "-".repeat(1_000_000).split("").map((_, idx) => idx);
const strings = ['Apple', 'Banana', 'Blueberry', 'Brownies', 'Chowder', 'Lemon', 'Mac and Cheese', 'Orange', 'Ravioli', 'Smash Burger', 'Strawberry'];

const listActionHandlers: Pick<MenuProps, 'onSelectItem' | 'onFocusItem'> = {
  onFocusItem: action("onFocusItem"),
  onSelectItem: action("onSelectItem"),
};

export const SimpleExample = () => (
  <Menu
    {...listActionHandlers}
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
        <MenuItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Strawberry
            </button>
          )}
        />
        <MenuItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Blueberry
            </button>
          )}
        />
      </div>
    )}
  />
);

export const JumpToKey = () => (
  <Menu
    {...listActionHandlers}
    renderMenu={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        {strings.map(item => (
          <MenuItem<HTMLButtonElement>
            key={item}
            id={item}
            renderItem={({ props, ref,  }) => (
              <button {...props} ref={ref} className="item">
                { item }
              </button>
            )}
          />
        ))}
      </div>
    )}
  />
);

export const UsingHooks = () => {
  /**
   * Note: Using the `useMenuItem` hook to compose custom list items is really helpful,
   * however using the `useMenu` hook is usually a worse choice compared to using the
   * `Menu` component. You can still compose custom list items with `useMenuItem` while
   * stille using the `Menu` container component.
   */
  const { Provider, contextProps, focusedItem, focusItem, items, renderProps } = useMenu({});

  const Item = useCallback<React.FC<{ id?: string }>>(({ children, id }) => {
    const { renderProps } = useMenuItem<HTMLButtonElement>({ id });
    return (
      <button {...renderProps.props} ref={renderProps.ref} className="item">
        { children }
      </button>
    );
  }, []);

  const currentlySelected = items.current.find(item => item.id === focusedItem)?.searchLabel;

  return (
    <Provider value={contextProps}>
      <div className="list" ref={renderProps.ref} {...renderProps.props}>
        <Item>Apple</Item>
        <Item>Orange</Item>
        <Item id="strawb">Strawberry</Item>
        <Item>Blueberry</Item>
      </div>
      {currentlySelected && `Currently focused is ${currentlySelected}. `}
      <button onClick={() => focusItem("strawb")}>Focus Strawberry</button>
    </Provider>
  )
};

export const LotsOfItems = () => (
  <Menu
    {...listActionHandlers}
    renderMenu={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        {numbers.map(item => (
          <MenuItem<HTMLButtonElement>
            key={item}
            id={item}
            renderItem={({ props, ref, }) => (
              <button {...props} ref={ref} className="item">
                Item { item }
              </button>
            )}
          />
        ))}
      </div>
    )}
  />
);

export const CustomSearchKeys = () => (
  <Menu
    {...listActionHandlers}
    renderMenu={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        {["a", "b", "c", "d", "e", "f", "g"].map(item => (
          <MenuItem<HTMLButtonElement>
            key={item}
            id={item}
            searchLabel={item}
            renderItem={({ props, ref, }) => (
              <button {...props} ref={ref} className="item">
                I'll focus when pressing the key {item}!
              </button>
            )}
          />
        ))}
      </div>
    )}
  />
);

export const MinimalisticExample = () => (
  <Menu
    {...listActionHandlers}
    renderMenu={({ props, ref }) => (
      <div ref={ref} {...props}>
        {strings.map(item => (
          <MenuItem<HTMLButtonElement>
            key={item}
            id={item}
            renderItem={({ props, ref, }) => (
              <button {...props} ref={ref}>
                { item }
              </button>
            )}
          />
        ))}
      </div>
    )}
  />
);

export const ImperativeHandle = () => {
  const menu = useRef<MenuImperativeHandle>(null);

  return (
    <Menu
      ref={menu}
      {...listActionHandlers}
      renderMenu={({ props, ref }) => (
        <div ref={ref} {...props} className="list">
          {strings.map(item => (
            <MenuItem<HTMLButtonElement>
              key={item}
              id={item}
              renderItem={({ props, ref, }) => (
                <button {...props} ref={ref} className="item">
                  { item }
                </button>
              )}
            />
          ))}
          <button onClick={() => menu.current?.focusItem("Blueberry")}>Focus Blueberry</button>
        </div>
      )}
    />
  );
};

export const VerticalList = () => (
  <Menu
    {...listActionHandlers}
    orientation={MenuOrientation.Vertical} // Only for the aria-orientation attribute
    renderMenu={({ props, ref }) => (
      <div className="list vertical" ref={ref} {...props}>
        {strings.map(item => (
          <MenuItem<HTMLButtonElement>
            key={item}
            id={item}
            renderItem={({ props, ref, }) => (
              <button {...props} ref={ref} className="item">
                { item }
              </button>
            )}
          />
        ))}
      </div>
    )}
  />
);

export const Grid = () => (
  <Menu
    {...listActionHandlers}
    renderMenu={({ props, ref }) => (
      <div className="list grid" ref={ref} {...props}>
        {numbers.map(item => (
          <MenuItem<HTMLButtonElement>
            key={item}
            id={item}
            renderItem={({ props, ref, }) => (
              <button {...props} ref={ref} className="item">
                { item }
              </button>
            )}
          />
        ))}
      </div>
    )}
  />
);

export const AutoFocusItem = () => {
  const [isRendering, setIsRendering] = useState(false);
  return isRendering ? (
    <Menu
      {...listActionHandlers}
      renderMenu={({ props, ref }) => (
        <div className="list" ref={ref} {...props}>
          {strings.map(item => (
            <MenuItem<HTMLButtonElement>
              key={item}
              id={item}
              renderItem={({ props, ref, }) => (
                <button {...props} ref={ref} className="item">
                  { item }
                </button>
              )}
            />
          ))}
          <MenuItem<HTMLButtonElement>
            id="autofocused"
            autoFocus={true}
            renderItem={({ props, ref, }) => (
              <button {...props} ref={ref} className="item">
                I am focused by default!
              </button>
            )}
          />
        </div>
      )}
    />
  ) : (
    <div>
      <button onClick={() => setIsRendering(true)}>Render</button>
    </div>
  )
};

export const ComplexNesting = () => (
  <Menu
    {...listActionHandlers}
    renderMenu={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        <MenuItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Apple
            </button>
          )}
        />
        <div className="card">
          <MenuItem<HTMLButtonElement>
            renderItem={({ props, ref,  }) => (
              <button {...props} ref={ref} className="item">
                Orange
              </button>
            )}
          />
          <div className="card vertical">
            <MenuItem<HTMLButtonElement>
              renderItem={({ props, ref,  }) => (
                <button {...props} ref={ref} className="item">
                  Strawberry
                </button>
              )}
            />
            <MenuItem<HTMLButtonElement>
              renderItem={({ props, ref,  }) => (
                <button {...props} ref={ref} className="item">
                  Blueberry
                </button>
              )}
            />
          </div>
        </div>
      </div>
    )}
  />
);

export const InterruptedList = () => (
  <Menu
    {...listActionHandlers}
    renderMenu={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        <h1>Section 1</h1>
        <button>Another focusable item</button>
        <MenuItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Apple
            </button>
          )}
        />
        <h1>Section 2</h1>
        <input defaultValue="Another focusable item" />
        <MenuItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Orange
            </button>
          )}
        />
        <MenuItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Manderine
            </button>
          )}
        />
        <h1>Section 3</h1>
        <button>Another focusable item</button>
        <button>Another focusable item</button>
        <MenuItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Strawberry
            </button>
          )}
        />
        <MenuItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Blueberry
            </button>
          )}
        />
      </div>
    )}
  />
);

export const DynamicChangesToList = () => {
  const [customItemCount, setCustomItemCount] = useState(0);
  const [customLabel, setCustomLabel] = useState("Custom Label");

  return (
    <Menu
      {...listActionHandlers}
      renderMenu={({ props, ref }) => (
        <div ref={ref} {...props}>
          Custom item label: <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} type="text" /><br />
          Count of additional items: <input value={customItemCount} onChange={e => setCustomItemCount(Math.max(parseInt(e.target.value), 0))} type="number" /><br />
          <br />

          <div className="list">
            <MenuItem<HTMLButtonElement>
              renderItem={({ props, ref,  }) => (
                <button {...props} ref={ref} className="item">
                  Starting item
                </button>
              )}
            />
            {"-".repeat(customItemCount).split("").map((_, idx) => (
              <MenuItem<HTMLButtonElement>
                key={idx}
                renderItem={({ props, ref,  }) => (
                  <button {...props} ref={ref} className="item">
                    Item {idx}
                  </button>
                )}
              />
            ))}
            <MenuItem<HTMLButtonElement>
              renderItem={({ props, ref,  }) => (
                <button {...props} ref={ref} className="item">
                  {customLabel}
                </button>
              )}
            />
            <MenuItem<HTMLButtonElement>
              renderItem={({ props, ref,  }) => (
                <button {...props} ref={ref} className="item">
                  Ending item
                </button>
              )}
            />
          </div>
        </div>
      )}
    />
  );
};

export const VirtualizedExample = () => {
  const [scrollToIndex, setScrollToIndex] = useState<number>();

  const rowRenderer = useCallback<ListRowRenderer>((item) => (
    <div style={item.style} key={item.key} data-id={item.key}>
      <MenuItem<HTMLButtonElement>
        id={item.index}
        renderItem={({ props, ref, }) => (
          <button {...props} ref={ref} className="item">
            Item { largeList[item.index] }
          </button>
        )}
      />
    </div>
  ), []);

  return (
    <Menu
      {...listActionHandlers}
      scrollToItem={(id) => setScrollToIndex(id as number)}
      renderMenu={({ props, ref }) => (
        <div className="list" style={{ height: "100%", minHeight: "400px" }} ref={ref} {...props}>
          <AutoSizer>
            {({width, height}) => (
              <VirtualizedList
                width={width}
                height={height}
                rowCount={largeList.length}
                rowHeight={37}
                rowRenderer={rowRenderer}
                overscanRowCount={20}
                scrollToIndex={scrollToIndex}
              />
            )}
          </AutoSizer>
        </div>
      )}
    />
  );
};
