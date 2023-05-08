const { readFile, readdir, mkdir, copyFile, writeFile, access, rm } = require('fs/promises');
const { join } = require('path');

async function findTemplates(path) {
  const fileContent = await readFile(path, 'utf-8');
  const regexp = /{{\w+}}/g;
  const templates = fileContent.match(regexp);
  return templates;
}

async function replaceTemplates(templates, file, pathsToComponents) {
  let result = file;
  for (let i = 0; i < templates.length; i++) {
    const componentContent = await readFile(pathsToComponents[i], 'utf-8');
    result = result.replace(templates[i], componentContent);
  }
  return result;
}

async function buildHtml() {
  const distHtmlPath = join(__dirname, 'project-dist', 'index.html');
  const templatePath = join(__dirname, 'template.html');
  await copyFile(templatePath, distHtmlPath);
  const templates = await findTemplates(distHtmlPath);
  const componentPaths = templates.map(template => join(__dirname, 'components', `${template.slice(2, -2)}.html`));
  const contentWithTemplates = await readFile(distHtmlPath, 'utf-8');
  const contentWithComponents = await replaceTemplates(templates, contentWithTemplates, componentPaths);
  await writeFile(distHtmlPath, contentWithComponents);
}

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

async function buildPage() {
  mkdir(join(__dirname, 'project-dist'), { recursive: true });
  await buildHtml();
  const srcAssetsPath = join(__dirname, 'assets');
  const copyAssetsPath = join(__dirname, 'project-dist', 'assets');
  await clearDestinationDir(copyAssetsPath);
  await makeDirCopy(srcAssetsPath, copyAssetsPath);
}

buildPage();

