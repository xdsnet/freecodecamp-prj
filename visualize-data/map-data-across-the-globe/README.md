[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  全球陨石分布图(map-data-across-the-globe)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含D3.js
* 用户需求： 在一个世界地图上显示陨石坠落地。
* 用户需求： 在图中显示陨石的相对大小。
* 用户需求： 移动鼠标经过图上某点时，提示当前位置的详细信息。

## 实现说明
0. 世界地图数据来源[https://d3js.org/world-50m.v1.json](https://d3js.org/world-50m.v1.json)
1. 陨石数据来源 [https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json](https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json)，也可以采用[https://data.nasa.gov/resource/y77d-th95.geojson](https://data.nasa.gov/resource/y77d-th95.geojson)数据。
2. 注意因为与示例程序引入的库不同，所以很多调用接口有变化
3. 数据采用json加载
4. *注意*[https://cdnjs.cloudflare.com/](https://cdnjs.cloudflare.com/) 提供的`topojson`版本`2.0`内容有问题,必须用`2.2.0`


## 项目结构
* index.html - 入口和所有内容的展示
* index.js - 运用了D3的脚本文件
* index.scss - scss样式文件，经由编译后输出`index.css`供`index.html`引入
* package.json - `npm`项目配置文件，这里仅仅用来加载样式编辑，使用`npm install`将自动编辑输出样式
* sass2css.js - 供`npm`调用转换`index.scss`为`index.css`的工具脚本

## Codepen.io 展示
[Xdsnet的全球陨石分布图](https://codepen.io/xdsnet/full/pNOBje)
