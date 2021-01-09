export function parseImageUrl(md: string): string[] {
  const urls: string[] = [];
  const regMd = /\!\[([^\)]+)?\]\(([^\)]+)?\)/ig
  const regImg = /\<img([^\>]+)?src([^\>]+)=([^\>]+)?\>/ig
  const resMd = md.match(regMd);
  const resImg = md.match(regImg);

  resMd?.forEach((str) => {
    if (str.indexOf('(') > 0 && str.indexOf(')') > str.indexOf('(')) {
      const temp = str.substring(str.indexOf('(') + 1, str.indexOf(')'));
      if (temp) {
        urls.push(temp);
      }
    }
  });

  resImg?.forEach((str) => {
    if (str.indexOf('src=') > 0) {
      let temp = str.substring(str.indexOf('src=') + 4, str.length);
      temp.trim();
      const tag = temp[0];
      if (tag === '\'' || tag === '\"') {
        temp = temp.replace(tag, '');
        temp = temp.substring(0, temp.indexOf(tag));
        if (temp) urls.push(temp);
      }
    }
  });
  return urls;
}


export function parseImageRelativeUrl(md: string): string[] {
  const list = parseImageUrl(md);
  const urls: string[] = [];
  list.forEach((url: string) => {
    if (!(url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0)) {
      urls.push(url);
    }
  })
  return urls;
}