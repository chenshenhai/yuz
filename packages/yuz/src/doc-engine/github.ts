import simpleGit, { SimpleGit } from 'simple-git';


export async function clone(params: {
  name: string,
  repo: string,
  dirPath: string,
}) {
  const { name, repo, dirPath } = params;
  // const url = `git@github.com:${name}/${repo}.git`;
  const url = `https://github.com/${name}/${repo}.git`;
  const git: SimpleGit = simpleGit();
  const result = await git.clone(url, dirPath);
  return result;
}