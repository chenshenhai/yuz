


export type TypeGithubFileInfo = {
  path: string,
}


export type TypeGithubRepoCompareItem = {
  filename: string,
  status: 'modified' | 'added' | 'removed' | 'renamed' | 'unchanged',
  previous_filename?: string,
}