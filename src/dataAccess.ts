import { readFileSync, writeFile } from 'fs';
import { promisify } from 'util';
import { Data } from './model';

const fwrite = promisify(writeFile);
const path = './res/data.json';

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
  const content = readFileSync(path, 'utf8');
  return JSON.parse(content) as Data;
}

async function writeData() {
  const content = JSON.stringify(store);
  try {
    await fwrite(path, content);
  } catch (error) {
    console.error(error);
  }
}
