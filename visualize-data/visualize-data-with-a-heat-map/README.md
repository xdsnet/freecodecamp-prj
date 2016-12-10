[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  二维气温偏离图数据展示(visualize-data-with-a-heat-map)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含D3.js
* 笛卡儿坐标系（X轴表示年份，Y轴表示月份）显示温度图
* 每个单元格的颜色代表当前单元格与其他单元格平均温度的对比度（例如：越高于平均温度，显示颜色越红，越低于平均温度，显示颜色越蓝）。
* 移动鼠标经过图上某点时，提示当前月份的详细信息。

## 实现说明
1. 数据来源 [https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json](https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json)，获取气温信息。
2. 注意因为与示例程序引入的库不同，所以很多调用接口有变化
3. 数据采用json加载
4. 显示特性增加：详细情况文字颜色为填充颜色

## 项目结构
* index.html - 入口和所有内容的展示
* index.js - 运用了D3的脚本文件
* index.css - CSS语法的样式文件，供`index.html`引入

## Codepen.io 展示
[Xdsnet的二维气温偏离图数据](https://codepen.io/xdsnet/full/dOjjWj)
