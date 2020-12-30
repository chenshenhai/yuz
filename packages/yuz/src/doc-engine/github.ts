import simpleGit, { SimpleGit } from 'simple-git';
import compose from 'koa-compose';

export async function cloneRepository(params: {
  name: string,
  repository: string,
  localPath: string,
}) {
  const { name, repository, localPath } = params;
  // const url = `git@github.com:${name}/${repo}.git`;
  const url = `https://github.com/${name}/${repository}.git`;
  const git: SimpleGit = simpleGit();
  const result = await git.clone(url, localPath);
  return result;
}

export async function readRepositoryList(params: { localPath: string, }): Promise<string[]> {
  const { localPath } = params;
  const git: SimpleGit = simpleGit({baseDir: localPath});
  let result: string = await git.raw('ls-tree', '-r', '--name-only', 'HEAD');
  const paths = result.replace(/\\r\\n/ig, '\n').split('\n');
  const list: string[] = [];
  paths.forEach((i) => {
    if (typeof i === 'string' && i.length > 0) {
      list.push(i);
    }
  });
  return list;
}

// export async function readListTime(list: string[]): Promise<[]> {
  
// }