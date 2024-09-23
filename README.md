# Glider

The Glider is a simple React component that allows an array 
of children to glide gracefully to their next location. The
primary use case was for Drag & Drop operations.

```tsx
<ul>
<Glider ms={500} className="glider">
  {
    items.map<MyDataItem>(item => 
      (
        <MyListItem 
          key={item.id} 
          item={item}
          ref={createRef()}
        />
      )
    )
  }
</Glider>
</ul>
```
- **ms**: Optional. Default 500. Time in milliseconds to move from one position to the next.
- **className**: Optional. Default glider. Class to be applied to html elements while they move.
- **key**: Required. Identifier to track where data moves
- **ref**: Required. Used to track the underlying html element

The component itself needs to accept the `ref` by using a 
`forwardRef`.

```tsx
interface MyItemData {
  id: number,
  name: string
}
interface Props {
  item: MyItemData
}
export const MyListItem = 
  forwardRef<RefObject<HTMLLIElement>, Props>(
    ({ item }, fRef) => {
      const ref = fRef as RefObject<HTMLLIElement>;
      return <li ref={ref}>{item.name}</li>
    }
  );
```

If the order of the data changes within the list, then they
will appear to slide past eachother to get to their new
positions.

## Quirks

Using the @atlassian/pragmatic-drag-and-drop library, the
class name for the item being dragged was not being applied
while it moved. In order to still be able to style the
element, you can style elements with the `data-glide`
attribute.

```css
[data-glide] {
  opacity: 0.5;
}
```

## Flickering

For operations that detect movements and hovering elements,
the movement of the elements may trigger events to re-order
the position of your items. In my case, I was able to
disable this behavior through a `canDrop` callback during
the transition. Not only can you detect if the `data-glide`
attribute is present, but you can also determine if it's no
longer valid, as it stores a timestamp indicating when the
transition completes.

```ts
const canDrop = ({ source }) => {
  if (!isDragAndDropItem(source.data)) return false;

  const timeout = ref.current?.getAttribute('data-glide');
  
  // not gliding?
  if(!timeout) return true;

  // still gliding?
  if (parseInt(timeout, 10) > Date.now()) return false;

  // gliding expired
  return true;
},
```
