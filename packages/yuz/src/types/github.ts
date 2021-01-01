
export type TypeGithubDocInfo = {
  user: string;
  repository: string;
  src: {
    [key: string]: {
      createTime: string,
      modifiedTime: string
    }
  }
}

export type TypeGithubFileInfo = {
  path: string,
  createTime: number,
  lastTime: number,
}