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

export function readJson(filePath: string): {[key: string]: any} | any[] | null {
  let result : {[key: string]: any} | null = null;
  if (!(fs.existsSync(filePath) && fs.statSync(filePath).isFile())) {
    return result;
  }
	const content = fs.readFileSync(filePath, { encoding: 'utf8' });
	try {
		result = JSON.parse(content);
	} catch (err) {
		console.log(err);
	}
	return result;
}


export function getMaxNumDirName(baseDir: string): string|null {
  let numName: string|null = null;
  if (fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory()) {
    const dirs = fs.readdirSync(baseDir);
    dirs.sort();
    let name: string | undefined = undefined;
    while(dirs.length > 0) {
      name = dirs.pop();
      if (name && /^[0-9]{1,}$/ig.test(name)) {
				numName = name
        break;
      }
    }
  }
  return numName;
}

export function getMaxNumFileName(baseDir: string): string|null {
  let numName: string|null = null;
  if (fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory()) {
		const files = fs.readdirSync(baseDir);
    files.sort();
    let name: string | undefined = undefined;
    while(files.length > 0) {
      name = files.pop();
      if (name && /^[0-9]{1,}\.[0-9a-z]{1,}$/ig.test(name)) {
				numName = name;
        break;
      }
    }
	}
  return numName;
}