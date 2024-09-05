# Using the Popover API

In my blog navigation, I implemented a toggle feature using the `input` tag.

```html
<input id="toggle-nav" type="checkbox" hidden />

<div id="nav">
	<label for="toggle-nav">Toggle</label>
	Menu...
</div>
```

While I was able to toggle the hidden `input` using the `for` attribute of the `label`, this method lacked maintainability and was not a modern approach. I have now improved this code to align with the latest syntax. The goal of the code is to ensure functionality even in a no-JS environment.

This code replacement was carried out not only to update to modern syntax but also to ensure functionality in a no-JS environment.

## Code Replacement

The task of changing the code was quite simple.

1. Use the `button` tag, which actually serves as a button, instead of the `label` tag.
2. Assign new attributes to the popover target.
3. Apply custom styles.

```diff
- <input id="toggle-nav" type="checkbox" hidden>
+ <button popovertarget="nav" popoveraction="toggle">Toggle</button>

- <div id="nav">
+ <div id="nav" popover>

- <label for="toggle-nav">Toggle</label>
+ <button popovertarget="nav" popoveraction="toggle">Toggle</button>

  Menu...
</div>

+ <style>
+   #nav {
+     /* reset */
+     display: block;
+     padding: unset;
+   }
+ </style>
```

While I was able to toggle the hidden `input` using the `for` attribute of the `label`, this method lacked maintainability and was not a modern approach. Additionally, the goal of the code was to ensure functionality even in a **no-JS** environment. I have now improved this code to align with the latest syntax while ensuring it works in a **no-JS** environment.

## Additional Features of the Popover API

The Popover API can be implemented using only HTML without external libraries, reducing code dependencies and minimizing code length. This provides significant advantages in terms of code maintainability, allowing for cleaner and more manageable code.

1. **Background Blurring**: When the popover is activated, the background can be blurred, allowing users to focus solely on the content of the popover. This feature can be easily implemented with pure HTML, adding visual effects without additional scripts.

2. **Auto-Close Feature**: You can set the popover to automatically close when the user clicks outside of it or presses the ESC key. This can also be implemented using just HTML attributes, completing the functionality without unnecessary JavaScript code.

3. **Animation Effects**: Animation effects that make the appearance and disappearance of the popover smooth can also be easily applied with HTML, reducing code complexity and making maintenance easier.

However, this API is only supported in modern browsers, so caution is needed when using it in projects where compatibility is important. Not all users may be using the latest browsers, so the decision to implement it should be made carefully based on the development environment.

Using the Popover API makes the code more concise and reduces dependency on external libraries, greatly aiding developers in terms of code readability and maintainability. However, it is important to consider browser compatibility, so it is crucial to use it appropriately according to the project's requirements.

