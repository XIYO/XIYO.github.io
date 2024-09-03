# Using GitHub Action Cache

While using GitHub Actions, I experienced a gradual slowdown in build speed. To improve this, I introduced a caching strategy that can save time on dependency installation.

## Changes in Build Speed

![Initial build speed was under 40 seconds](/static/resources/usging-cache-on-github-action-20240815232353052.png)

Initially, the build speed was very fast, taking less than 40 seconds. However, as time passed, the build time gradually increased, especially after adding a Mermaid parser to Markdown files, which caused a dramatic increase in build time.

![Slowed build speed exceeded 1 minute, approaching 1 minute 30 seconds](/static/resources/usging-cache-on-github-action-20240815232537900.png)

This isn't solely due to the Mermaid syntax. My blog uses Svelte for pre-rendering, which requires time to parse all Markdown files during the initial build.

Moreover, I wanted to avoid using front matter in Markdown files while ensuring they display correctly on GitHub, so I didn't include metadata like creation or modification dates. To compensate for this, I used the `git log` command to add this data, which resulted in many CPU-intensive tasks, making performance improvements difficult. (Separating these into workers could improve performance, but that's beyond my current skills...)

![Just installing dependencies takes 30 seconds](/static/resources/usging-cache-on-github-action-20240815233139668.png)

Ultimately, to optimize the build, I decided to focus first on reducing package installation time.

## Modifying GitHub Workflow

Part of the `Initial Workflow`:

```yml
jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: build
        env:
          BASE_PATH: '/${{ github.event.repository.name }}'
        run: |
          pnpm run build
      - name: Upload Artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          # this should match the `pages` option in your adapter-static options
          path: 'build/'
```

The initial workflow didn't utilize any caching. As it was my first time using GitHub Actions and Svelte, I was satisfied as long as the automatic build worked correctly.

Part of the `Optimized Workflow`:

```diff
jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

	  - name: Install pnpm
-       uses: pnpm/action-setup@v3
+       uses: pnpm/action-setup@v4
        with:
-         version: 8
+         run_install: false

+     - name: Install Node.js
+       uses: actions/setup-node@v4
+       with:
+         node-version: 22
+         cache: 'pnpm'  # Enable caching for node modules (using built-in feature)

      - name: Install dependencies
        run: pnpm install # Faster installation due to caching

+     - name: Get installed Playwright version
+       id: playwright-version
+       run: echo "PLAYWRIGHT_VERSION=$(pnpm list @playwright/test --depth=0 | grep @playwright/test | awk '{print $2}')" >> $GITHUB_ENV

+     - name: Cache playwright binaries
+       uses: actions/cache@v4.0.2
+       id: playwright-cache
+       with:
+         path: ~/.cache/ms-playwright
+         key: ${{ runner.os }}-playwright-${{ env.PLAYWRIGHT_VERSION }}

+     - run: pnpx playwright install --with-deps chromium
+       if: steps.playwright-cache.outputs.cache-hit != 'true'

      - name: build
        env:
          BASE_PATH: '/${{ github.event.repository.name }}'
        run: |
          pnpm run build
      - name: Upload Artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          # this should match the `pages` option in your adapter-static options
          path: 'build/'
```

The key to this optimized code is the effective use of caching.

Node.js module caching was activated by setting the `cache: pnpm` option provided by `actions/setup-node@v4`. While it's possible to manually store the cache, I decided it was more efficient to use the abstracted option provided by default.

In particular, `playwright`, which was a major cause of build speed degradation, was cached separately to minimize installation time. If the cache already exists, the installation step can be skipped, further optimizing build time.

> [!note]
> The `playwright` version extraction feature in the above code is for pnpm packages. If you're using a different package manager, look for different code...🥲

## Changes in Build Speed

![Optimized build speed is around 1 minute 10 seconds...](/static/resources/usging-cache-on-github-action-20240816000140052.png)

![Internal speed does not exceed 50 seconds](/static/resources/usging-cache-on-github-action-20240816000251502.png)

While the build speed didn't improve dramatically, I achieved a satisfactory result through appropriate optimization.

### Additional Optimization Strategies

A few more optimization methods to consider include:

- Parallel execution
- Using custom runners to use custom containers
- Integrating all processes into a single workflow
