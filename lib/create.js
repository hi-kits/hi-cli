const chalk = require("chalk");

// 用户与命令行交互的工具
const Prompt = require("inquirer");

const clone = require("./clone");
const { isExistencent, deleteTarget } = require("./file");
// gitlab:owner/name
// 对应github仓库地址https://github.com/l-x-f/admin-template
// #dev 是dev分支，不写默认master分支
const templateUrl = "github:hi-kits/hiTemplate#master";

  // https://github.com/hi-kits/hiTemplate
  // angular: "https://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@github.com/hi-kits/bizTemplate.git"

const initQuestions = name => [
  {
    type: "confirm",
    name: "isInit",
    message: `确定要在${chalk.green(name)}文件夹下创建项目?`,
    prefix: "?",
    default: true
  }
];
const checkQuestions = name => [
  {
    type: "confirm",
    name: "isContinue",
    message: `${chalk.green(name)}文件夹已存在,如果继续的话会直接覆盖当前项目，是否继续?`,
    // prefix: "?"
  }
];


const init = async name => {
  try {
    const { isInit } = await Prompt.prompt(initQuestions(name));
    if (isInit) {
      // 询问需要创建的项目类型
      console.log('🚀开始创建项目:' + name);
      const hasCreated = isExistencent(name);
      // 此项目已经存在
      if (hasCreated) {
        const {isContinue} = await Prompt.prompt(checkQuestions(name));
        if (!isContinue) {
          console.log(chalk.red("程序提前结束"));
          return;
        }
        deleteTarget(name).then(() => {
          clone(templateUrl, name, {proxy: '13.114.40.48:443'});
        })
      } else {
        await clone(templateUrl, name, {proxy: '13.114.40.48:443'});
      }
    } else {
      console.log(chalk.red("程序提前结束"));
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
};

module.exports = init;