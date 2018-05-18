import { readFileSync, writeFile } from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Data } from '../model/constant';

const fwrite = promisify(writeFile);
const dataPath = path.resolve(__dirname, '../../res/data.json');

const store = readData();

export const data = new Proxy(store, {
  set(obj: Data, key: any, value: any) {
    if (value !== obj[key]) {
      writeData();
    }
    obj[key] = value;
    return true;
  }
});

function readData() {
  const content = readFileSync(dataPath, 'utf8');
  return JSON.parse(content) as Data;
}

async function writeData() {
  const content = JSON.stringify(store);
  try {
    await fwrite(dataPath, content);
  } catch (error) {
    console.error(error);
  }
}
