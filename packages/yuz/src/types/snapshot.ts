export type TypeDocSnapShot = {
  name?: string; // ${site}/${user}/${repos}
  time: number;
  docMap: {
    [id: string]: {
      id: string; // path md5 uuid
      path: string;
      createTime: number;
      lastTime: number;
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