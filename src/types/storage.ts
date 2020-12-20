export type TypeStorageOptions = {
  baseDir: string
}

export type TypeStorageInitOptions = {
  force: boolean;
}

export type TypeStorageQueryListParams = {
  current: number,
  size: number,
  desc: boolean
}

export type TypeStorageQueryListResult = {
  total: number,
  items: TypeStorageItem[],
}


export interface TypeStorage {
  init(opts?: TypeStorageInitOptions): void;
  createItem(item: {[key: string]: any}): string;
  queryItem(uuid: string): TypeStorageItem|null;
  queryList(params: TypeStorageQueryListParams): TypeStorageQueryListResult;
}

export type TypeStorageItem = {
  uuid?: string;
  name: string;
  content: string;
  creator: string;
  createTime: number;
  lastTime: number;
}