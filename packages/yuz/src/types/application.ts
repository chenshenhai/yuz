export type TypeApplicationOptions = {
  baseDir: string;
}

export interface TypeApplication {
  launch(): void;
}

export interface TypeAppConfig {
  name: string;
  theme: {
    portal: {
      baseDirName: string,
      port: number,
    },
    admin: {
      baseDirName: string,
      port: number;
    }
  }
}