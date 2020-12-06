import fs from 'fs';
import path from 'path';

export function loadJsonSync(jsonPath: string): {[key: string]: any}|undefined {
  let result = undefined;
  if (fs.existsSync(jsonPath) === true) {
    const configText = fs.readFileSync(jsonPath, { encoding: 'utf8' });
    result = JSON.parse(configText);
  }
  return result;
}

export function removeFullDir(dirPath: string) {
  let files = [];
	if (fs.existsSync(dirPath)) {
		files = fs.readdirSync(dirPath);
		files.forEach((filename) => {
      let curPath = path.join(dirPath, filename);
			if(fs.statSync(curPath).isDirectory()) {
				removeFullDir(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(dirPath);
	}
}

export function makeFullDir() {
	// TODO
}