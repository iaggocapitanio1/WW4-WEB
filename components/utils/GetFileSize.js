function GetFileSize (_size) {
  // let _size = this.files[0].size;
  const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
  let i = 0;

  while (_size > 900) { _size /= 1024; i++; }

  return (Math.round(_size * 100) / 100) + ' ' + fSExt[i];
}

export default GetFileSize;
