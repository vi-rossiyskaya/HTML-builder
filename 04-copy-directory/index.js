const { readdir, mkdir, copyFile, access, rm } = require('node:fs/promises');
const { join } = require('path');

async function clearDestinationDir(path) {
  try {
    await access(path);
    await rm(path, { recursive: true });
    await mkdir(path, { recursive: true });
  } catch {
    await mkdir(path, { recursive: true });
  }
}

async function makeDirCopy(srcPath, copyPath) {
  const content = await readdir(srcPath, { withFileTypes: true });
  content.forEach((item) => {
    const updatedSrcPath = join(srcPath, item.name);
    const updatedCopyPath = join(copyPath, item.name);
    if(item.isDirectory()) {
      mkdir(join(copyPath, item.name), { recursive: true });
      makeDirCopy(updatedSrcPath, updatedCopyPath).catch(console.error);
    } else {
      copyFile(updatedSrcPath, updatedCopyPath).catch(console.error);
    }
  });
}

async function init() {
  await clearDestinationDir(join(__dirname,'files-copy'));
  await makeDirCopy(join(__dirname, 'files'), join(__dirname, 'files-copy')).catch(console.error);
  console.log('The directory has been copied successfully');
}

init();
