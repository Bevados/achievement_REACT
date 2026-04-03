import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const sourceRoots = ['src', 'api', 'lib'];
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const docsRoot = path.join(projectRoot, 'Docs');

function walkFiles(dirPath, out = []) {
  if (!fs.existsSync(dirPath)) {
    return out;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, out);
      continue;
    }

    const ext = path.extname(entry.name);
    if (allowedExtensions.has(ext)) {
      out.push(fullPath);
    }
  }

  return out;
}

function sourceToDocPath(sourcePath) {
  const relativeSourcePath = path.relative(projectRoot, sourcePath).split(path.sep).join('/');
  return path.join(docsRoot, `${relativeSourcePath}.md`);
}

function createDocContent(relativeSourcePath) {
  return `# ${relativeSourcePath}\n\n## Что делает файл\n\nКоротко: какая ответственность у файла и какую задачу он решает.\n\n## Импорты и зависимости\n\n1. Перечислить только значимые импорты.\n2. Для каждого значимого импорта написать, зачем он нужен.\n\n## Экспорты и контракты\n\n1. Какие функции, типы, хуки или компоненты экспортируются.\n2. Какие входные данные ожидают и что возвращают.\n3. Какие ограничения или важные инварианты есть у контракта.\n\n## Нетривиальная логика\n\n1. Описать только сложные ветки, проверки, условия и edge cases.\n2. Пояснить бизнес-правила и их причины.\n\n## Где используется\n\n1. Основные точки использования в проекте.\n2. Если файл пока не используется напрямую, отметить это явно.\n`;
}

const sourceFiles = sourceRoots.map((root) => walkFiles(path.join(projectRoot, root))).flat();

let createdCount = 0;

for (const sourceFile of sourceFiles) {
  const docPath = sourceToDocPath(sourceFile);

  if (fs.existsSync(docPath)) {
    continue;
  }

  fs.mkdirSync(path.dirname(docPath), { recursive: true });
  const relativeSourcePath = path.relative(projectRoot, sourceFile).split(path.sep).join('/');
  fs.writeFileSync(docPath, createDocContent(relativeSourcePath), 'utf8');
  createdCount += 1;
}

console.log(`Docs scaffold completed. Created files: ${createdCount}`);
