import simpleGit, { SimpleGit } from 'simple-git';


export async function clone(params: {
  name: string,
  repo: string,
  dirPath: string,
}) {
  const { name, repo, dirPath } = params;
  const ssh = `git@github.com:${name}/${repo}.git`
  const git: SimpleGit = simpleGit();
  const result = await git.clone(ssh, dirPath);
  return result;
}