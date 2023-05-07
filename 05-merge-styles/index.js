const { readdir } = require('node:fs/promises');
const { join, extname } = require('node:path');
const { pipeline } = require('node:stream/promises');
const { createReadStream, createWriteStream } = require('node:fs');

const stylesPath = join(__dirname, 'styles');
const bundlePath = join(__dirname, 'project-dist', 'bundle.css');

async function getStyles(path) {
  const files = await readdir(path, { withFileTypes: true });
  const styles = files.filter(file => extname(file.name) === '.css');
  return styles;
}

async function combineFiles(filePath) {
  const input = createReadStream(filePath, 'utf-8');
  const output = createWriteStream(bundlePath, { flags: 'a' });
  await pipeline(
    input,
    output
  );
}

async function combineStyles() {
  const styles = await getStyles(stylesPath);
  styles.forEach(async (file) => {
    const filePath = join(stylesPath, file.name);
    await combineFiles(filePath);
  })
}

combineStyles();
