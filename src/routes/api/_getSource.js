import fs from 'fs';
import { join } from 'path';

export default function getSource(dir, filePath) {
  const absPath = join(dir, filePath)
  console.log('dir -> ', dir);
  console.log('filePath -> ', filePath);
  const fileContents = fs.readFileSync(absPath, 'utf-8');
  return JSON.stringify(fileContents);
}
