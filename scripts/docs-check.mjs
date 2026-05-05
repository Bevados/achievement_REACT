import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const projectRoot = process.cwd();
const sourceRoots = ['src/', 'api/', 'lib/', 'contracts/'];
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const requiredSections = [
  '## Что делает файл',
  '## Импорты и зависимости',
  '## Экспорты и контракты',
  '## Нетривиальная логика',
  '## Где используется',
];
const forbiddenTemplateMarkers = [
  'Коротко: какая ответственность у файла и какую задачу он решает.',
  'Перечислить только значимые импорты.',
  'Для каждого значимого импорта написать, зачем он нужен.',
  'Какие функции, типы, хуки или компоненты экспортируются.',
  'Какие входные данные ожидают и что возвращают.',
  'Какие ограничения или важные инварианты есть у контракта.',
  'Описать только сложные ветки, проверки, условия и edge cases.',
  'Пояснить бизнес-правила и их причины.',
  'Основные точки использования в проекте.',
  'Если файл пока не используется напрямую, отметить это явно.',
];

function runGitCommand(command) {
  try {
    const [subcommand, ...args] = command.split(' ');
    if (subcommand !== 'git') {
      return '';
    }

    return execFileSync('git', args, { cwd: projectRoot, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function parseLines(output) {
  if (!output) {
    return [];
  }

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(path.sep).join('/'));
}

function getChangedFiles() {
  const envTracked = process.env.DOCS_CHECK_TRACKED_FILES;
  const envAll = process.env.DOCS_CHECK_ALL_FILES;

  if (envTracked !== undefined && envAll !== undefined) {
    return {
      tracked: parseLines(envTracked),
      all: parseLines(envAll),
    };
  }

  const trackedUnstaged = parseLines(runGitCommand('git diff --name-only'));
  const trackedStaged = parseLines(runGitCommand('git diff --name-only --cached'));
  const untrackedSource = parseLines(
    runGitCommand('git ls-files --others --exclude-standard -- src api lib contracts'),
  );
  const untrackedDocs = parseLines(
    runGitCommand(
      'git ls-files --others --exclude-standard -- Docs/src Docs/api Docs/lib Docs/contracts',
    ),
  );

  return {
    tracked: [...new Set([...trackedUnstaged, ...trackedStaged])],
    all: [...new Set([...trackedUnstaged, ...trackedStaged, ...untrackedSource, ...untrackedDocs])],
  };
}

function isSourceFile(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  const inSourceRoot = sourceRoots.some((root) => normalized.startsWith(root));
  if (!inSourceRoot) {
    return false;
  }

  const ext = path.extname(normalized);
  return allowedExtensions.has(ext);
}

function sourceToDocPath(relativeSourcePath) {
  return `Docs/${relativeSourcePath}.md`.split(path.sep).join('/');
}

function isDocFile(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  if (!normalized.startsWith('Docs/')) {
    return false;
  }

  if (!normalized.endsWith('.md')) {
    return false;
  }

  const mirroredRoots = ['Docs/src/', 'Docs/api/', 'Docs/lib/', 'Docs/contracts/'];
  return mirroredRoots.some((root) => normalized.startsWith(root));
}

function checkRequiredSections(docRelativePath) {
  const absoluteDocPath = path.join(projectRoot, docRelativePath);
  if (!fs.existsSync(absoluteDocPath)) {
    return ['<missing-file>'];
  }

  const content = fs.readFileSync(absoluteDocPath, 'utf8');
  return requiredSections.filter((section) => !content.includes(section));
}

function checkTemplateMarkers(docRelativePath) {
  const absoluteDocPath = path.join(projectRoot, docRelativePath);
  if (!fs.existsSync(absoluteDocPath)) {
    return ['<missing-file>'];
  }

  const content = fs.readFileSync(absoluteDocPath, 'utf8');
  return forbiddenTemplateMarkers.filter((marker) => content.includes(marker));
}

const changedFiles = getChangedFiles();
const trackedChangedSet = new Set(changedFiles.tracked);
const changedSet = new Set(changedFiles.all);

const changedSourceFiles = [...changedSet].filter(isSourceFile);
const changedTrackedDocFiles = [...trackedChangedSet].filter(isDocFile);

if (changedSourceFiles.length === 0 && changedTrackedDocFiles.length === 0) {
  console.log('docs:check passed. No changed files in src/api/lib/contracts and Docs mirror.');
  process.exit(0);
}

const missingDocs = [];
const notUpdatedDocs = [];
const invalidDocs = [];
const templateDocs = [];

for (const sourceFile of changedSourceFiles) {
  const sourceAbsPath = path.join(projectRoot, sourceFile);

  if (!fs.existsSync(sourceAbsPath)) {
    continue;
  }

  const docPath = sourceToDocPath(sourceFile);
  const docAbsPath = path.join(projectRoot, docPath);

  if (!fs.existsSync(docAbsPath)) {
    missingDocs.push({ sourceFile, docPath });
    continue;
  }

  if (!changedSet.has(docPath)) {
    notUpdatedDocs.push({ sourceFile, docPath });
  }

  const missingSections = checkRequiredSections(docPath);
  if (missingSections.length > 0) {
    invalidDocs.push({ docPath, missingSections });
  }

  const foundTemplateMarkers = checkTemplateMarkers(docPath);
  if (foundTemplateMarkers.length > 0) {
    templateDocs.push({ docPath, foundTemplateMarkers });
  }
}

for (const changedDocFile of changedTrackedDocFiles) {
  const changedDocAbsPath = path.join(projectRoot, changedDocFile);

  if (!fs.existsSync(changedDocAbsPath)) {
    continue;
  }

  const missingSections = checkRequiredSections(changedDocFile);
  if (missingSections.length > 0) {
    invalidDocs.push({ docPath: changedDocFile, missingSections });
  }

  const foundTemplateMarkers = checkTemplateMarkers(changedDocFile);
  if (foundTemplateMarkers.length > 0) {
    templateDocs.push({ docPath: changedDocFile, foundTemplateMarkers });
  }
}

if (
  missingDocs.length === 0 &&
  notUpdatedDocs.length === 0 &&
  invalidDocs.length === 0 &&
  templateDocs.length === 0
) {
  console.log('docs:check passed. Documentation is aligned with changed source files.');
  process.exit(0);
}

console.error('docs:check failed.');

if (missingDocs.length > 0) {
  console.error('\nMissing documentation files:');
  for (const item of missingDocs) {
    console.error(`- ${item.sourceFile} -> ${item.docPath}`);
  }
}

if (notUpdatedDocs.length > 0) {
  console.error('\nDocumentation files exist but were not updated in this change set:');
  for (const item of notUpdatedDocs) {
    console.error(`- ${item.sourceFile} -> ${item.docPath}`);
  }
}

if (invalidDocs.length > 0) {
  console.error('\nDocumentation files missing required sections:');
  for (const item of invalidDocs) {
    console.error(`- ${item.docPath}`);
    for (const section of item.missingSections) {
      console.error(`  * ${section}`);
    }
  }
}

if (templateDocs.length > 0) {
  console.error('\nDocumentation files still contain template placeholders:');
  for (const item of templateDocs) {
    console.error(`- ${item.docPath}`);
    for (const marker of item.foundTemplateMarkers) {
      console.error(`  * ${marker}`);
    }
  }
}

process.exit(1);
