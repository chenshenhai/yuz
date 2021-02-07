export type TypeDocSnapshot = {
  name?: string; // ${site}/${user}/${repos}
  sha?: string;
  time: number;
  docMap: {
    [id: string]: {
      id: string; // path md5 uuid
      name: string;
      path: string;
      status: 'modified' | 'added' | 'removed' | 'renamed' | 'unchanged',
      previousPath?: string|null;
    }
  }
  imageMap: {
    [id: string]: {
      id: string; // path md5 uuid
      name?: string;
      path: string;
      previousPath?: string|null;
      status: 'modified' | 'added' | 'removed' | 'renamed' | 'unchanged',
    }
  };
}

