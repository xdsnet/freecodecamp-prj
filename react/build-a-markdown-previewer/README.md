[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  建立Markdown预览器(build-a-markdown-previewer)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含Sass和React
* 我可以在文本域内写“Github风格”的Markdown文档
* 可以实时预览解析后的Markdown文档



## 实现说明
1. 不必自己实现Markdown的解析引擎，你可以引入这个[https://cdnjs.com/libraries/marked](https://cdnjs.com/libraries/marked)这个Markdown解析库来帮助你解析文档
2. 想使用React的JSX语法，你需要使用[https://github.com/babel/babel-standalone](https://github.com/babel/babel-standalone)提供的Babel作为预处理器
3. 因为要使用sass编写样式(sass模式)，所以引入npm做项目依赖管理并进行sass到css的处理


## 项目结构
* index.html - 入口和所有内容的展示
* index.sass - SASS语法的样式文件，将编译输出`index.css`文件供`index.html`引入
* sass2css.js - 利用`node-sass`编译`index.sass`的脚本
* package.json - npm管理用的配置文件，clone后执行`npm install`即可自动编译输出相关文件，使得`index.html`达到可用状态

## Codepen.io 展示
[Xdsnet的markdown预览器](https://codepen.io/xdsnet/full/gLvveb)