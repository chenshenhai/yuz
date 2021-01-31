export type TypeDocSnapshot = {
  name?: string; // ${site}/${user}/${repos}
  sha?: string;
  time: number;
  docMap: {
    [id: string]: {
      id: string; // path md5 uuid
      name: string;
      path: string;
      status: 'EXISTED' | 'NOT_EXISTED'
    }
  }
  imageMap: {
    [id: string]: {
      id: string; // path md5 uuid
      name?: string;
      path: string;
      status: 'EXISTED' | 'NOT_EXISTED';
    }
  };
}


export type TypeDiffDocSnapshot = {
  docMap: {
    [id: string]: {
      status: 'CREATED' | 'EDITED' | 'DELETED'
    }
  },
  imageMap: {
    [id: string]: {
      status: 'CREATED' | 'EDITED' | 'DELETED'
    }
  }
}