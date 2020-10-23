import fs from 'fs';

export function loadJsonSync(jsonPath: string): {[key: string]: any}|undefined {
  let result = undefined;
  if (fs.existsSync(jsonPath) === true) {
    const configText = fs.readFileSync(jsonPath, { encoding: 'utf8' });
    result = JSON.parse(configText);
  }
  return result;
}