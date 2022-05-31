//这是一个简单的应用
var path = require('path');
var fs = require('fs');
var co = require('co');
const isExistencent = (name) => {
  // 检查某个目录是否存在
  // 执行路径 #!/usr/bin/env node
  // console.log(process.execPath);
  // 当前文件的地址 /Users/liulina/Documents/gitlab/hars_cli/lib
  // console.log(__dirname);
  // 当前命令执行的cmd路径
  // console.log(path.join(process.cwd(), name));
  try {
    var stat = fs.statSync(path.join(process.cwd(), name));
    return stat && stat.isDirectory();
  } catch (error) {
    return false;
  }
};

// 删除目标文件夹或文件
function deleteTarget(filePath) {
  return co(G(path.resolve(process.cwd(), filePath)))
}


// 删除目录 
function onRejected(err){
  return Promise.reject(err)
}

/**
* 删除文件
* @param {string}} filename 
* @returns Promise
*/
function removeFile(filename){
  return fs.promises.rm(filename)
}

/**
* 删除空的目录
* @param {string} dirPath 
* @returns Promise
*/
function removeEmptydir(dirPath){
  return fs.promises.rmdir(dirPath)
}

/**
* 删除目录里面的内容 
* @param {fs.dir} fsDir 
* @param {string} parentPath 
* @returns Promise
*/
function removeContent(fsDir, parentPath){
  return fsDir
          .read()
          .then(
              fsdirent =>(fsdirent !== null && co(G(path.resolve(parentPath, fsdirent.name))).then(() => removeContent(fsDir, parentPath), onRejected)),
              onRejected
          )
}

/**
* 删除的流程
* @param {string} filename 
* @returns Promise
*/
function* G(filename){
  try{
      let stats = yield fs.promises.stat(filename);
      if(stats.isDirectory()){
          let fsDir = yield fs.promises.opendir(filename);
          yield removeContent(fsDir, filename) 
          fsDir.close() /**非空的目录 必须要关闭 否则无法删除目录 */
          return removeEmptydir(filename) /** 删除目录 */
      } 
      return removeFile(filename)
  }catch(err){
      return Promise.reject(err)
  }
}



module.exports = {
  isExistencent,
  deleteTarget,
};

