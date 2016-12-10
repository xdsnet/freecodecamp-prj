// temperature data URL

var URL_temperatureData = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

var month = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];// 定义本地化月份查询表


var colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];//调色板定义


var buckets = colors.length; // 总共颜色数

var margin = {
  top: 5,
  right: 0,
  bottom: 90,
  left: 100
};
var width = 1200 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;
var legendElementWidth = 35;

// 定义Y坐标标签位置
var axisYLabelX = -65;
var axisYLabelY = height / 2;

// 定义X坐标标签位置
var axisXLabelX = width / 2;
var axisXLabelY = height + 45;



d3.json(URL_temperatureData, function(error, data) { //获取数据并处理
  if (error) throw error;

  var baseTemp = data.baseTemperature;  // 获取基准温度
  var temperatureData = data.monthlyVariance; 

  var yearData = temperatureData.map(function(obj) { // 获得年度列表
    return obj.year;
  });
  yearData = yearData.filter(function(v, i) { //保留yearData元素唯一性
    return yearData.indexOf(v) == i;
  });

  var varianceData = temperatureData.map(function(obj) {//获取温度信息
    return obj.variance;
  });

  var lowVariance = d3.min(varianceData);
  var highVariance = d3.max(varianceData);

  var lowYear = d3.min(yearData);
  var highYear = d3.max(yearData);

  var minDate = new Date(lowYear, 0);
  var maxDate = new Date(highYear, 0);

  var gridWidth = width / yearData.length; //获取网格宽
  var gridHeight = height / month.length;//获取网格高


  var colorScale = d3.scaleQuantile() //颜色取值放缩函数
    .domain([lowVariance + baseTemp, highVariance + baseTemp])
    .range(colors);
  
  var svg = d3.select("#chart").append("svg") // 创建svg对象
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var div = d3.select("#chart").append("div") // 创建用于展示详细信息的元素
    .attr("class", "tooltip")
    .style("opacity", 0);

  var monthLabels = svg.selectAll(".monthLabel") // 创建月度标记
    .data(month)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return i * gridHeight;
    })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridHeight / 1.5 + ")")
    .attr("class", "monthLabel scales axis axis-months");


  var xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width]);

  var xAxis = d3.axisBottom(xScale)

  svg.append('g')
    .attr('transform', 'translate(' + axisYLabelX + ', ' + axisYLabelY + ')')
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr("class", "axislabel")
    .text('月份');

  svg.append('g')
    .attr('transform', 'translate(' + axisXLabelX + ', ' + axisXLabelY + ')')
    .append('text')
    .attr('text-anchor', 'middle')
    .attr("class", "axislabel")
    .text('年度');

  svg.append("g") // 添加年度坐标轴
    .attr("class", "axis axis-years")
    .attr("transform", "translate(0," + (height + 1) + ")")
    .call(xAxis);

  var temps = svg.selectAll(".years")
    .data(temperatureData, function(d) {
      return (d.year + ':' + d.month);
    });

  temps.enter()
    .append("rect")
    .attr("x", function(d) {
      return ((d.year - lowYear) * gridWidth);
    })
    .attr("y", function(d) {
      return ((d.month - 1) * gridHeight);
    })
    .attr("rx", 0)
    .attr("ry", 0)
    .attr("width", gridWidth)
    .attr("height", gridHeight)
    .style("fill", function(d){return colorScale(d.variance + baseTemp)})
    .on("mouseover", function(d) {
      div.transition()
        .duration(100)
        .style("opacity", 0.8)
        .style("color",colorScale(d.variance+baseTemp));
      div.html("<span class='year'>年月:" + d.year + " - " + month[d.month - 1] + "</span><br>" +
          "<span class='temperature'>平均气温:" + (Math.floor((d.variance + baseTemp) * 1000) / 1000) + " &#8451" + "</span><br>" +
          "<span class='variance'>偏离:" + d.variance + " &#8451" + "</span>")
        .style("left", (d3.event.pageX - ($('.tooltip').width()/2)) + "px")
        .style("top", (d3.event.pageY - 75) + "px");
    })
    .on("mouseout", function(d) {
      div.transition()
        .duration(200)
        .style("opacity", 0);
    });

  temps.transition().duration(1000)
    .style("fill", function(d) {
      return colorScale(d.variance + baseTemp);
    });
 
  svg.append("text")
    .attr("x", (width - legendElementWidth * buckets-33))
    .attr("y",height + 65)
    .attr('text-anchor', 'middle')
    .attr("class", "axislabel")
    .text("温度色卡");
    

  var legend = svg.selectAll(".legend") //处理颜色图列
    .data([0].concat(colorScale.quantiles()));

    legend.enter().append("g")
    .attr("class", "legend")
    .append("rect")
    .attr("x", function(d, i) {
      return legendElementWidth * i + (width - legendElementWidth * buckets);
    })
    .attr("y", height + 50)
    .attr("width", legendElementWidth)
    .attr("height", gridHeight / 2)
    .style("fill", function(d, i) {
      return colorScale(d);
      // return colors[i];
    });
    
    legend.enter().append("text")
    .attr("class", "scales")
    .text(function(d) {
      return (Math.floor(d * 10) / 10);
    })
    .attr("x", function(d, i) {
      return ((legendElementWidth * i) + Math.floor(legendElementWidth / 2) - 6 + (width - legendElementWidth * buckets));
    })
    .attr("y", height + gridHeight + 50);
});
