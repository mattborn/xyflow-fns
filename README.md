# xyflow-fns

Extracts `getSmoothStepPath` and `Position` from [@xyflow/system](https://github.com/xyflow/xyflow) into a single client-side script with no dependencies.

`@xyflow/system` is ~100KB and bundles d3 for interactivity like drag, pan, and zoom. `getSmoothStepPath` alone resolves to 8 functions and ~7KB, which is all you need (edge math) to render node connections.

## Usage

```html
<script src="xyflow-fns.js"></script>
<script>
  const [d, labelX, labelY] = getSmoothStepPath({
    sourceX: 0, sourceY: 0, sourcePosition: 'bottom',
    targetX: 200, targetY: 88, targetPosition: 'top',
  })
</script>
```

## Extracting

```sh
node extract
```

Fetches the latest `@xyflow/system` from npm, walks the `functions` array for their internal dependencies, pulls only what they need into `xyflow-fns.js`, and test-runs the result before writing.
