export type TypeDocSnapshot = {
  name?: string; // ${site}/${user}/${repos}
  time: number;
  docMap: {
    [id: string]: {
      id: string; // path md5 uuid
      name: string;
      path: string;
      createTime: number;
      lastTime: number;
      status: 'EXISTED' | 'NOT_EXISTED'
    }
  }
  imageMap: {
    [id: string]: {
      id: string; // path md5 uuid
      name?: string;
      path: string;
      createTime: number;
      lastTime: number;
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