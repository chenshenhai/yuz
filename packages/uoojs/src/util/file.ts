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

export function makeFullDir(dirPath: string) {
	if (fs.existsSync(dirPath)) {
		return true;
	} else {
		if (makeFullDir(path.dirname(dirPath))) {
			fs.mkdirSync(dirPath);
			return true;
		}
	}
}

export function writeJson(filePath: string, json: {[key: string]: any}): void {
	fs.writeFileSync(filePath, JSON.stringify(json));
}

export function readJson(filePath: string): {[key: string]: any} | null {
	const content = fs.readFileSync(filePath, { encoding: 'utf8' });
	let result : {[key: string]: any} | null = null;
	try {
		result = JSON.parse(content);
	} catch (err) {
		console.log(err);
	}
	return result;
}
