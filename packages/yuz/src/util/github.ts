import simpleGit, { SimpleGit } from 'simple-git';
import compose from 'koa-compose';
import { TypeGithubFileInfo } from '../types/github'


export async function readRepoListInfo(params: { localPath: string, pathList: string[]}): Promise<TypeGithubFileInfo[]> {
  const { localPath, pathList } = params;
  const tasks: ((ctx: TypeGithubFileInfo[], next: Function) => void)[] = [];
  const result: TypeGithubFileInfo[] = [];
  pathList.forEach((filePath) => {
    tasks.push(async(ctx: TypeGithubFileInfo[], next: Function) => {
      ctx.push({
        path: filePath,
      })
      await next();
    })
  })
  await compose(tasks)(result);
  return result;
}