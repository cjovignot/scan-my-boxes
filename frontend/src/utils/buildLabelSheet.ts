import type { LabelPreset } from "./labelPresets";

export function buildLabelSheetHTML(
  preset: LabelPreset,
  labelImages: string[],
  startIndex: number
) {
  const totalSlots = preset.rows * preset.cols;

  const cells: string[] = [];

  for (let i = 0; i < totalSlots; i++) {
    const imageIndex = i >= startIndex ? i - startIndex : null;

    const img =
      imageIndex !== null && imageIndex < labelImages.length
        ? `<img src="${labelImages[imageIndex]}" />`
        : "";

    cells.push(`
      <div class="cell">${img}</div>
    `);
  }

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page {
    size: A4;
    margin: 0;
  }
  body {
    margin: 0;
    padding: 0;
    width: 21cm;
    height: 29.7cm;
  }

  .sheet {
    display: grid;
    width: 100%;
    height: 100%;
    padding-top: ${preset.marginTopCm}cm;
    padding-left: ${preset.marginLeftCm}cm;

    grid-template-columns: repeat(${preset.cols}, ${preset.labelWidthCm}cm);
    grid-auto-rows: ${preset.labelHeightCm}cm;

    column-gap: ${preset.gutterXcm}cm;
    row-gap: ${preset.gutterYcm}cm;
  }

  .cell {
    width: ${preset.labelWidthCm}cm;
    height: ${preset.labelHeightCm}cm;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
</head>
<body>
  <div class="sheet">
    ${cells.join("\n")}
  </div>

  <script>
    window.onload = () => window.print();
  </script>
</body>
</html>
`;
}
