# Code Block Examples

```javascript
function fancyAlert(arg) {
  if (arg) {
    $.facebox({ div: "#foo" });
  }
}
```

```js
import { h, Component, render } from "https://unpkg.com/preact?module";

const app = h("h1", null, "Hello World!");
render(app, document.body);
```

```css
body {
  color: var(--color-text);
  font-size: 1.2rem;
}
```

```sql
SELECT column1, column2
FROM table
WHERE column1='value'
```

```bash
#!/bin/bash
i=0

while [ $i -le 4 ]; do
  echo Number: $i
  ((i++))
done
```

```haskell
main = do
  writeFile "file.txt" "Hello, world!"
  readFile "file.txt" >>= print
```

```rust
fn greet_user(name: Option<String>) {
  match name {
    Some(name) => println!("Hello there, {}!", name),
    None => println!("Well howdy, stranger!"),
  }
}
```
