[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  建立食谱(build-a-recipe-box)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含Sass和React
* 用户需求： 当我填入名字和食材，我就能够创建一个食谱。
* 用户需求： 我能看见我需要的食谱的列表。
* 用户需求： 我能点进去查看食谱。
* 用户需求： 我能编辑食谱。
* 用户需求： 我能删除食谱。
* 用户需求： 所有的食谱，都应该存储在本地。当我刷新页面时，我添加的食谱不会丢失。



## 实现说明
1. 本地存储保存食谱信息，最好在键名中加上一定的前缀以防止冲突，例如：`_username-recipes`
1. 想使用React的JSX语法，你需要使用[https://github.com/babel/babel-standalone](https://github.com/babel/babel-standalone)提供的Babel作为预处理器
1. 因为要使用sass编写样式(sass模式)，所以引入npm做项目依赖管理并进行sass到css的处理


## 项目结构
* index.html - 入口和所有内容的展示
* index.sass - SASS语法的样式文件，将编译输出`index.css`文件供`index.html`引入
* index.jsx - Reactk扩展的javascript脚本，需要`babel`来支持引入。
* sass2css.js - 利用`node-sass`编译`index.sass`的脚本
* package.json - npm管理用的配置文件，clone后执行`npm install`即可自动编译输出相关文件，使得`index.html`达到可用状态

## Codepen.io 展示
[Xdsnet的食谱](https://codepen.io/xdsnet/full/aBYQwX)
