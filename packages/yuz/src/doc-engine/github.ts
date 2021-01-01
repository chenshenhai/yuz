import simpleGit, { SimpleGit } from 'simple-git';
import compose from 'koa-compose';
import { TypeGithubDocInfo } from './../types/github'

export async function cloneRepo(params: {
  user: string,
  repository: string,
  localPath: string,
}) {
  const { user, repository, localPath } = params;
  // const url = `git@github.com:${name}/${repo}.git`;
  const url = `https://github.com/${user}/${repository}.git`;
  const git: SimpleGit = simpleGit();
  const result = await git.clone(url, localPath);
  return result;
}

export async function readRepoList(params: { localPath: string, }): Promise<string[]> {
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

// export async function readRepoRemote(params: { localPath: string, }): Promise<string[]> {
//   const { localPath } = params;
//   const git: SimpleGit = simpleGit({baseDir: localPath});
//   let result: string = await git.raw('remote', 'show', 'origin');
//   const paths = result.replace(/\\r\\n/ig, '\n').split('\n');
//   const list: string[] = [];
//   paths.forEach((i) => {
//     if (typeof i === 'string' && i.length > 0) {
//       list.push(i);
//     }
//   });
//   return list;
// }


export async function readRepoFileTime(
  params: { localPath: string, filePath: string }
): Promise<{createTime: string, modifiedTime: string}> {
  const { localPath, filePath } = params;
  const git: SimpleGit = simpleGit({baseDir: localPath});
  let timeRes: string = await git.raw('log', '--pretty=format:%at', '--', filePath);
  const times = timeRes.replace(/\r\n/, '\n').split('\n');
  return {
    createTime: times[times.length - 1],
    modifiedTime: times[0],
  };
}


// ["Already up-to-date.",""]


// // add and edit
// ["Updating d8c851e..1f8c319","Fast-forward"," SUMMARY.md  | 1 +"," docs/003.md | 7 +++++++"," docs/101.md | 2 +-"," docs/102.md | 6 ++++--"," 4 files changed, 13 insertions(+), 3 deletions(-)"," create mode 100644 docs/003.md",""]

// // rename and edit
//  ["Updating 1f8c319..dfe3f4d","Fast-forward"," SUMMARY.md              | 4 ++--"," docs/{003.md => 103.md} | 2 +-"," 2 files changed, 3 insertions(+), 3 deletions(-)"," rename docs/{003.md => 103.md} (54%)",""]

// // delete
// ["Updating dfe3f4d..384094e","Fast-forward"," SUMMARY.md  | 3 +--"," docs/103.md | 7 -------"," 2 files changed, 1 insertion(+), 9 deletions(-)"," delete mode 100644 docs/103.md",""]
// // delete 2
// ["Updating 384094e..bc73b5d","Fast-forward"," docs/002.md | 5 -----"," docs/102.md | 7 -------"," 2 files changed, 12 deletions(-)"," delete mode 100644 docs/002.md"," delete mode 100644 docs/102.md",""]

export async function pullRepo (
  params: { localPath: string }
): Promise<string[]> {
  const { localPath } = params;
  const git: SimpleGit = simpleGit({baseDir: localPath});
  let res: string = await git.raw('pull');
  let list = res.replace(/\r\n/, '\n').split('\n');
  return list;
}
