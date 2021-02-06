export type TypeThemeConfig = {
  name: string;
  version: string;
}


export type TypeBuildThemeOptions = {
  // srcDir: string;
  // distDir: string;
  baseDir: string;
}

export type TypeDevThemeOptions = {
  port: number;
  // distDir: string;
  // srcDir: string;
  baseDir: string;
  type?: 'admin' | 'portal'; // default portal
}