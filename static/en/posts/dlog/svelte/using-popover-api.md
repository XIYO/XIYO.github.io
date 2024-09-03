# Using the Popover API

My blog navigation used to implement a toggle feature using the `input` tag.

```html
<input id="toggle-nav" type="checkbox" hidden />

<div id="nav">
	<label for="toggle-nav">Toggle</label>
	Menu...
</div>
```

Although I was able to toggle the invisible `input` by using the `for` attribute of the `label`, this approach lacked maintainability and was not a modern method. I have now updated this code to align with modern practices. The primary goal of this code is to ensure it works in a no-JS environment.

This code replacement was carried out to both adopt modern syntax and ensure functionality in a no-JS environment.

## Code Replacement

The process of changing the code was quite straightforward.

1. Use a `button` tag that actually acts as a button instead of the `label` tag.
2. Add new attributes to the popover target.
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

While the previous method allowed toggling an invisible `input` using the `for` attribute of the `label`, it was not a maintainable or modern approach. Additionally, the goal was to ensure that the code would work in a **no-JS** environment. This update modernizes the code while still ensuring compatibility with **no-JS** environments.

## Additional Features of the Popover API

The Popover API offers features that can be implemented using only HTML, reducing code dependencies and minimizing code length. This provides significant benefits in terms of code maintainability, allowing developers to write clean and easy-to-manage code.

1. **Background Blur Effect**: When the popover is activated, you can blur the background to help users focus solely on the popover content. This can be easily implemented with pure HTML, adding visual effects without the need for additional scripts.

2. **Auto-Close Functionality**: You can set the popover to automatically close when the user clicks outside of it or presses the ESC key. This, too, can be implemented using just HTML attributes, eliminating the need for unnecessary JavaScript code.

3. **Animation Effects**: Animation effects that smoothly transition the popover in and out can also be applied with HTML, reducing code complexity and making maintenance easier.

However, since this API is only supported in modern browsers, caution is needed when using it in projects where compatibility is crucial. Not all users may be on the latest browsers, so careful consideration is required based on the development environment.

Using the Popover API makes your code more concise and reduces reliance on external libraries, which greatly enhances code readability and maintainability for developers. However, due to the need for browser compatibility, it is essential to use this API appropriately according to the project's requirements.
