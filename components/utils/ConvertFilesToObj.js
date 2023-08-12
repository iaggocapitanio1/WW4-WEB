/* eslint-disable array-callback-return */
function ConvertFilesToObj (files) {
  const folders = {};

  for (const file of files) {
    const pathSegments = file.path.split('/');
    let currentFolder = folders;

    for (let i = 1; i < pathSegments.length - 1; i++) {
      const folderName = pathSegments[i];

      currentFolder[folderName] = currentFolder[folderName] || {};
      currentFolder = currentFolder[folderName];
    }

    const fileName = pathSegments[pathSegments.length - 1];

    currentFolder[fileName] = file;
  }

  return folders;
}

export default ConvertFilesToObj;
