const { readdir, mkdir, copyFile, access, rm } = require('node:fs/promises');
const { join } = require('path');

async function clearDestinationDir(path, name) {
  try {
    await access(join(path, name));
    await rm(join(path, name), { recursive: true });
    makeDir(path, name).catch(console.error);
  } catch {
    makeDir(path, name).catch(console.error);
  }
}

async function makeDir(path, name) {
  const dirCopyPath = join(path, name);
  const dirCreation = await mkdir(dirCopyPath, { recursive: true });
  return dirCreation;
}

async function makeDirCopy(srcPath, copyPath) {
  const content = await readdir(srcPath, { withFileTypes: true });
  content.forEach((item) => {
    const updatedSrcPath = join(srcPath, item.name);
    const updatedCopyPath = join(copyPath, item.name);
    if(item.isDirectory()) {
      makeDir(copyPath, item.name).catch(console.error);
      makeDirCopy(updatedSrcPath, updatedCopyPath).catch(console.error);
    } else {
      copyFile(updatedSrcPath, updatedCopyPath).catch(console.error);
    }
  });
}

async function init() {
  await clearDestinationDir(__dirname,'files-copy');
  await makeDirCopy(join(__dirname, 'files'), join(__dirname, 'files-copy')).catch(console.error);
  console.log('The directory has been copied successfully');
}

init();
