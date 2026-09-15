# xyflow-fns

Extracts edge path functions `getBezierPath`, `getSmoothStepPath`, and `Position` from [@xyflow/system](https://github.com/xyflow/xyflow) into a single client-side script with no dependencies.

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

## Updating

```sh
node extract
```

Fetches the latest `@xyflow/system` from npm, extracts only what the path functions need, test-runs the result, and writes `xyflow-fns.js`.
