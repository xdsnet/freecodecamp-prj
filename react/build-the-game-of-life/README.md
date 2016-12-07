[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  建立细胞生命模拟器游戏(build-the-game-of-life)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含Sass和React
* 当我第一次进入游戏时，它能随机生成一个棋盘，然后我能开始游戏。
*  用户需求： 我能够开始和结束游戏。
* 用户需求： 我能设置棋盘。
* 用户需求： 我也可以清空棋盘。
* 用户需求： 当我点击开始时，游戏将开始。
* 用户需求： 每次棋盘更改时，我能看到经过了多少世代。



## 实现说明
1. 想使用React的JSX语法，你需要使用[https://github.com/babel/babel-standalone](https://github.com/babel/babel-standalone)提供的Babel作为预处理器
2. 因为要使用sass编写样式(sass模式)，所以引入npm做项目依赖管理并进行sass到css的处理


## 项目结构
* index.html - 入口和所有内容的展示
* index.scss - SCSS语法的样式文件，将编译输出`index.css`文件供`index.html`引入
* index.jsx - React扩展的javascript文件，需要`babel`库来引入
* sass2css.js - 利用`node-sass`编译`index.sass`的脚本
* package.json - npm管理用的配置文件，clone后执行`npm install`即可自动编译输出相关文件，使得`index.html`达到可用状态

## Codepen.io 展示
[Xdsnet的细胞生命模拟器](https://codepen.io/xdsnet/full/pNVPOE)
