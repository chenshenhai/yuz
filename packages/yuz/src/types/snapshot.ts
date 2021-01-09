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
  // // TODO
  // images: {
  //   id: string; // path md5 uuid
  //   path: string;
  //   createTime: number;
  //   lastTime: number;
  // }[];
}


export type TypeDiffDocSnapshot = {
  doc: {
    [id: string]: {
      status: 'CREATED' | 'EDITED' | 'DELETED'
    }
  }
  // // TODO
  // images: {
  //   id: string; // path md5 uuid
  //   path: string;
  //   createTime: number;
  //   lastTime: number;
  // }[];
}