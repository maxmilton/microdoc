# Example Markdown Content

This is an example `README.md` file to show some placeholder content.

View the source of this page to see how it works. Also, see the [markdown source](https://github.com/maxmilton/microdoc/blob/master/docs/examples/README.md) of this content.

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

<p class="lead">Lead paragraph ✌</p>

Lorem, ipsum dolor sit amet [consectetur adipisicing elit](#) ❤️. Illum laboriosam iste repellat dignissimos illo exercitationem dolor in, **ratione tempora** iure _possimus amet, autem_, nesciunt fuga a ~~dolorem~~ dolores `unde animi` 👌.

> Blockquote

- a
- b
- c
  - x
  - x
    - x

1. one
1. two
1. three
   1. x
   1. x
      1. x

```
Fenced code block
```

### Horizontal Rule

---

### Table

<!-- prettier-ignore-start -->

| Default | Left | Right | Center |
| --- | :-- | --: | :-: |
| x | x | x | x |
| x | x | x | x |
| x | x | x | x |
| x | x | x | x |

<!-- prettier-ignore-end -->

### Image

![Image of a cat](https://placekitten.com/300/200)

### Form Elements

<form onsubmit="return false">
  <div style="margin-bottom:1rem">
    <label for="input">Input label</label>
    <input id="input" placeholder="Input..."></input>
    <button>Button</button>
  </div>

  <div style="margin-bottom:1rem">
    <select>
      <option>Select option 1</option>
      <option>Select option 2</option>
      <option>Select option 3</option>
    </select>
  </div>

  <div style="margin-bottom:1rem">
    <textarea>Textarea</textarea>
  </div>

  <div class="df" style="margin-bottom:1rem">
    <input id="checkbox1" type="checkbox" />
    <label for="checkbox1">Checkbox 1</label>
  </div>
  <div class="df" style="margin-bottom:1rem">
    <input id="checkbox2" type="checkbox" checked />
    <label for="checkbox2">Checkbox 2</label>
  </div>
</form>

### Loading Spinner

<div class=spinner-wrapper>
  <div class=spinner></div>
</div>

### Error

<div class=microdoc-alert>
  <strong>Error:</strong> Example error.
</div>
