[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  建立camper排行榜(build-a-camper-leaderboard)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含Sass和React
* 展示过去30天内，FreeCodeCamp完成任务最多情况
* 能够对过去30天完成量和总完成量进行排序展示




## 实现说明
1. 数据来源 [http://fcctop100.herokuapp.com/api/fccusers/top/recent](http://fcctop100.herokuapp.com/api/fccusers/top/recent)，获取最近任务完成排行
2. 数据来源 [http://fcctop100.herokuapp.com/api/fccusers/top/alltime](http://fcctop100.herokuapp.com/api/fccusers/top/alltime)，获取总共任务完成排行
3. 因为要使用sass编写样式(sass模式)，所以引入npm做项目依赖管理并进行sass到css的处理


## 项目结构
* index.html - 入口和所有内容的展示
* index.jsx - React语法的脚本文件
* index.sass - SASS语法的样式文件，将编译输出`index.css`文件供`index.html`引入
* sass2css.js - 利用`node-sass`编译`index.sass`的脚本
* package.json - npm管理用的配置文件，clone后执行`npm install`即可自动编译输出相关文件，使得`index.html`达到可用状态

## Codepen.io 展示
[Xdsnet的camper排行榜](https://codepen.io/xdsnet/full/eBVLyJ)