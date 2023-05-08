const { readFile, mkdir, copyFile, writeFile } = require('fs/promises');
const { join } = require('path');

async function makeDir(path, name) {
  const dirCopyPath = join(path, name);
  const dirCreation = await mkdir(dirCopyPath, { recursive: true });
  return dirCreation;
}

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

async function buildPage() {
  await makeDir(__dirname, 'project-dist');
  await buildHtml();
}

buildPage();

