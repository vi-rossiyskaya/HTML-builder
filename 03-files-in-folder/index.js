const fs = require('node:fs/promises');
const path = require('node:path');
const pathDir = path.join(__dirname, 'secret-folder');

async function getFilesInfo(pathDir) {
  try {
    const content = await fs.readdir(pathDir, {withFileTypes: true});
    const files = content.filter(item => item.isFile());
    const sizes = await Promise.all(
      files.map((file) => {
        const pathFile = path.join(pathDir, file.name);
        return getSize(pathFile);
      })
    );
    const filesInfo = files.map((file, index) => {
      const pathFile = path.join(pathDir, file.name);
      const name = path.parse(pathFile).name;
      const extname = path.extname(pathFile);
      return `${name} - ${extname} - ${sizes[index]}b`;
    });
    filesInfo.forEach(file => console.log(file));
  } catch (err) {
    console.error(err);
  }
}

async function getSize(pathFile) {
  return (await fs.stat(pathFile)).size;
}

getFilesInfo(pathDir);


