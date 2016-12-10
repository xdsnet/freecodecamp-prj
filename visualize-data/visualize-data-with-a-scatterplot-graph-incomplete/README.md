[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  散点图数据展示(visualize-data-with-a-scatterplot-graph-incomplete)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含D3.js
* 展示一项赛事成绩情况（模拟数据）
* 鼠标可以指点某处显示对应详细信息（当前排名情况）





## 实现说明
1. 数据来源 [https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json](https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json)，获取赛事成绩信息。
2. 注意因为与示例程序引入的库不同，所以很多调用接口有变化
3. 示例程序显示差值为横坐标，但快速的在最后，我把它换了方向
4. 取消了tiptools工具应用（该库没有查到对d3 v4的支持）
5. 数据采用json加载（以往是采用的硬写数据）



## 项目结构
* index.html - 入口和所有内容的展示
* index.js - 运用了D3的脚本文件
* index.css - CSS语法的样式文件，供`index.html`引入


## Codepen.io 展示
[Xdsnet的自行车赛事违纪情况](https://codepen.io/xdsnet/full/bBjoWm)
