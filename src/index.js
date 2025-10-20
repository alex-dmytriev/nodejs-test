import path from 'node:path';
import fs from 'node:fs/promises';

const pathToDir = path.join(process.cwd());
const pathToFile = path.join(pathToDir, 'some-folder', 'some-file.txt');

console.log(pathToDir);
console.log(pathToFile);
console.log(path.parse(pathToFile));

await fs.writeFile('src/test.txt', 'New text arrived', 'utf8');
console.log('Data is written successfuly');
