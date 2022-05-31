// node的 util 模块 promisify可以把回调promise化
const { promisify } = require("util");
// 进度显示工具
const ora = require("ora");

// 颜色显示工具
const chalk = require("chalk");

// 下载git 仓库代码工具
const download = promisify(require("download-git-repo"));

/**
 *
 * @param {string} repo 仓库地址
 * @param {string}  dir 文件夹
 * @param {object}  opotions 配置项
 */
const clone = async function(repo, dir, opotions = {}) {
  // Spinner 初始设置
  const dlSpinner = ora(chalk.cyan(`开始下载 ${chalk.blue(repo)}`))

  // 开始执行等待动画
  dlSpinner.start()

  try {
    await download(repo, dir, opotions);
    dlSpinner.text = `下载成功 ${chalk.green(repo)} `;
    // 终止等待动画并显示 ✔ 标志
    dlSpinner.succeed()
  } catch (error) {
    dlSpinner.text = chalk.red(`下载失败. ${error}`);
    // 终止等待动画并显示 X 标志
    dlSpinner.fail()
    process.exit();
  }
};

module.exports = clone;