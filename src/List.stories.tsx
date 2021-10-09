import React, { useCallback, useMemo, useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { ItemId, List, ListProps, ListType } from '.';
import { List as VirtualizedList, AutoSizer, ListRowRenderer } from 'react-virtualized';
import { ListItem } from './ListItem';
import { action } from '@storybook/addon-actions';
import { useList } from './useList';
import { useListItem } from './useListItem';
import { ListContext } from './ListContext';

export default {
  title: 'Accessible List',
  component: List,
  subcomponents: {List, ListItem},
} as ComponentMeta<typeof List>;

const numbers = "-".repeat(100).split("").map((_, idx) => idx);
const largeList = "-".repeat(1_000_000).split("").map((_, idx) => idx);
const strings = ['Apple', 'Banana', 'Blueberry', 'Brownies', 'Chowder', 'Lemon', 'Mac and Cheese', 'Orange', 'Ravioli', 'Smash Burger', 'Strawberry'];

const listActionHandlers: Pick<ListProps, 'onSelectItem' | 'onFocusItem'> = {
  onFocusItem: action("onFocusItem"),
  onSelectItem: action("onSelectItem"),
};

export const SimpleExample = () => (
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        <ListItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Apple
            </button>
          )}
        />
        <ListItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Orange
            </button>
          )}
        />
        <ListItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Strawberry
            </button>
          )}
        />
        <ListItem<HTMLButtonElement>
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
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        {strings.map(item => (
          <ListItem<HTMLButtonElement>
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
   * Note: Using the `useListItem` hook to compose custom list items is really helpful,
   * however using the `useList` hook is usually a worse choice compared to using the
   * `List` component. You can still compose custom list items with `useListItem` while
   * stille using the `List` container component.
   */
  const { Provider, contextProps, focusedItem, focusItem, items, renderProps } = useList({});

  const Item = useCallback<React.FC<{ id?: string }>>(({ children, id }) => {
    const { renderProps } = useListItem<HTMLButtonElement>({ id });
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
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        {numbers.map(item => (
          <ListItem<HTMLButtonElement>
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
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        {["a", "b", "c", "d", "e", "f", "g"].map(item => (
          <ListItem<HTMLButtonElement>
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
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div ref={ref} {...props}>
        {strings.map(item => (
          <ListItem<HTMLButtonElement>
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

export const VerticalList = () => (
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div className="list vertical" ref={ref} {...props}>
        {strings.map(item => (
          <ListItem<HTMLButtonElement>
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
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div className="list grid" ref={ref} {...props}>
        {numbers.map(item => (
          <ListItem<HTMLButtonElement>
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

export const ComplexNesting = () => (
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        <ListItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Apple
            </button>
          )}
        />
        <div className="card">
          <ListItem<HTMLButtonElement>
            renderItem={({ props, ref,  }) => (
              <button {...props} ref={ref} className="item">
                Orange
              </button>
            )}
          />
          <div className="card vertical">
            <ListItem<HTMLButtonElement>
              renderItem={({ props, ref,  }) => (
                <button {...props} ref={ref} className="item">
                  Strawberry
                </button>
              )}
            />
            <ListItem<HTMLButtonElement>
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
  <List
    type={ListType.Menu}
    {...listActionHandlers}
    renderList={({ props, ref }) => (
      <div className="list" ref={ref} {...props}>
        <h1>Section 1</h1>
        <button>Another focusable item</button>
        <ListItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Apple
            </button>
          )}
        />
        <h1>Section 2</h1>
        <input defaultValue="Another focusable item" />
        <ListItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Orange
            </button>
          )}
        />
        <ListItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Manderine
            </button>
          )}
        />
        <h1>Section 3</h1>
        <button>Another focusable item</button>
        <button>Another focusable item</button>
        <ListItem<HTMLButtonElement>
          renderItem={({ props, ref,  }) => (
            <button {...props} ref={ref} className="item">
              Strawberry
            </button>
          )}
        />
        <ListItem<HTMLButtonElement>
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
    <List
      type={ListType.Menu}
      {...listActionHandlers}
      renderList={({ props, ref }) => (
        <div ref={ref} {...props}>
          Custom item label: <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} type="text" /><br />
          Count of additional items: <input value={customItemCount} onChange={e => setCustomItemCount(Math.max(parseInt(e.target.value), 0))} type="number" /><br />
          <br />

          <div className="list">
            <ListItem<HTMLButtonElement>
              renderItem={({ props, ref,  }) => (
                <button {...props} ref={ref} className="item">
                  Starting item
                </button>
              )}
            />
            {"-".repeat(customItemCount).split("").map((_, idx) => (
              <ListItem<HTMLButtonElement>
                key={idx}
                renderItem={({ props, ref,  }) => (
                  <button {...props} ref={ref} className="item">
                    Item {idx}
                  </button>
                )}
              />
            ))}
            <ListItem<HTMLButtonElement>
              renderItem={({ props, ref,  }) => (
                <button {...props} ref={ref} className="item">
                  {customLabel}
                </button>
              )}
            />
            <ListItem<HTMLButtonElement>
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
      <ListItem<HTMLButtonElement>
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
    <List
      type={ListType.Menu}
      {...listActionHandlers}
      scrollToItem={(id) => setScrollToIndex(id as number)}
      renderList={({ props, ref }) => (
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
