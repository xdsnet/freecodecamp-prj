[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  力导向图数据展示(show-relationships-with-a-force-directed-graph)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含D3.js
* 用力导向图（ Force-directed Graph）显示每个 camper 在 Camper News 上所发表链接的域名。
* 用户需求： 在每个节点上显示 camper 的头像。
* 用户需求： 显示每个 camper 之间以及他们所发表链接的域名之间的联系。
* 用户需求： 每个 camper 的头像大小表示他所发表的指定域名下链接的次数。
* 用户需求： 每个域名的节点大小表示该域名下链接被引用的次数。



## 实现说明
1. 数据来源 [https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json](https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json)，获取赛事成绩信息。
2. 注意因为与示例程序引入的库不同，所以很多调用接口有变化
3. 示例程序显示差值为横坐标，但快速的在最后，我把它换了方向
4. 数据采用json加载（数据放置在html的script标签中）



## 项目结构
* index.html - 入口和所有内容的展示
* index.js - 运用了D3的脚本文件
* index.css - CSS语法的样式文件，供`index.html`引入


## Codepen.io 展示
[Xdsnet的力导向图数据展示](https://codepen.io/xdsnet/full/LbBaPO)
