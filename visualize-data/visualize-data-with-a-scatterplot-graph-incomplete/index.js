// http://matthewgladney.com/blog/data-science/no-nonsense-guide-getting-started-scatter-plots-d3-js-d3-csv/

// 数据来源 :https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json
// 每条成绩的格式为
//  {
//    "Time":"36:50", //常规显示成绩
//    "Place":1, //  排名
//    "Seconds":2210, // 秒计算成绩
//    "Name":"Marco Pantani", // 姓名
//    "Year":1995, // 年份
//    "Nationality":"ITA", // 国籍
//    "Doping":"Alleged drug use during 1995 due to high hematocrit levels", // 违禁品
//    "URL":"https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use" // URL地址
//  }

//var formatCount = d3.format(",.0f"); //定义数据无小数位

/*
var formatTime = d3.timeFormat("%H:%M");// 定义时间格式为H:M

function formatMinutes(d){
   var t = new Date(2016, 0, 1, 0, d); //按2016年元旦格式化一个日期
    t.setSeconds(t.getSeconds() + d);
    return formatTime(t);
};
*/

function formatMinutes(d){
  var rt="";
  var s=(d%60)<10?"0"+(d%60).toString():(d%60).toString();
  rt=""+Math.floor(d/60)+":"+s;
  return rt;
}

//d3 默认配置
var margin = {
    top: 80,
    right: 140,
    bottom: 60,
    left: 60
  };
  var width = 800 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

//创建 SVG元素
var svg = d3.select("#container").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// 添加提示数据位置
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//添加标题 和 子标题
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", -margin.top/2)
  .attr("text-anchor", "middle")
  .attr("class", "title")
  .text("专业自行车赛车中的兴奋剂问题");

svg.append("text")
  .attr("x", (width / 2))
  .attr("y", -margin.top/2 + 35)
  .attr("text-anchor", "middle")
  .attr("class", "subtitle")
  .text("阿尔杜维兹赛中35个最快成绩选手");

svg.append("text")
  .attr("x", (width / 2))
  .attr("y", -margin.top/2 + 55)
  .attr("text-anchor", "middle")
  .attr("class", "asterix")
  .text("标准的13.8km距离");

// 数据获取和处理 
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  function(json){
    var alps =json; //获取的数据
    var fastestTime = d3.min(alps,function(d){return d.Seconds;}); //获取最快速度用时
    var slowTime = d3.max(alps,function(d){return d.Seconds;}); // 获取最慢速度用时
    console.log((slowTime- fastestTime));
    var cMax = alps.length; // 获取数据个数
    console.log("data.length:"+cMax);
    for(var i=0;i<cMax;i++){ // 数据预处理
      alps[i].behind = alps[i].Seconds - fastestTime; // 数据中添加behind数据
       if ( alps[i].Doping != "") { // 数据中添加指明是否有 违禁药物传闻的类属性
           alps[i].legend = "Doping Allegations";
        } else {
           alps[i].legend = "No Doping Allegation";
        }
    }
       

    var yScale = d3.scaleLinear() // 创建y值坐标放缩系数
      .domain([0, cMax])
      .range([0, height]);

    var xScale = d3.scaleLinear()  // 创建x值坐标放缩系数
      .domain([slowTime-fastestTime, 0])
      .range([width,0]);

    var yAxis = d3.axisLeft(yScale) // 创建y坐标轴
      .ticks(8);

    var xAxis = d3.axisBottom(xScale) // 创建x坐标轴
      .ticks(6)
      .tickFormat(formatMinutes);

svg.append("g") // 绘制x轴
  .attr("class", "axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("text")
  .attr("x",xScale(10))
  .attr("y",yScale(cMax+1+2))
  .attr("dy", ".35em")
  .style("text-anchor", "middle")
  .text("落后最快速度时间(分钟)");;

svg.append("g") // 绘制y轴
  .attr("class", "axis")
  .attr("transform", "translate(0, 0)")
  .call(yAxis);

svg.append("text")
  .attr("x", xScale(-8))
  .attr("y", yScale(-2.5))
  .style("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .text("速度排名");

  svg.append("circle") //图例，违纪红色圈 
  .attr("cx", function(d) {
    return xScale(10);
  })
  .attr("cy", function(d) {
    return yScale(23);
  })
  .attr("r", 5)
  .attr("fill", "#f44");
 
svg.append("text") // 违纪图例说明
  .attr("x", function(d) {
    return xScale(12);
  })
  .attr("y", function(d) {
    return yScale(23)+4;
  })
  .attr("text-anchor", "left")
  .attr("class", "legend")
  .text("被指控服用兴奋剂的选手");

    svg.append("circle") //绘制图例，没有违纪
      .attr("cx", function(d) {
      return xScale(10);
      })
      .attr("cy", function(d) {
      return yScale(20);
      })
      .attr("r", 5)
      .attr("fill", "#333");

    svg.append("text")// 没有违纪图例说明
      .attr("x", function(d) {
        return xScale(12);
      })
      .attr("y", function(d) {
        return yScale(20)+4;
      })
      .attr("text-anchor", "left")
      .attr("class", "legend")
      .text("没有兴奋剂指控的选手");

var ascents = svg.append("g"); // 数据绘制区
ascents.selectAll("circle")
  .data(alps)
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return xScale(d.behind);
  })
  .attr("cy", function(d) {
    return yScale(d.Place);
  })
  .attr("r", 5)
  .attr("fill", function(d) {
    if (d.Doping == "") {
      return "#333";
    }
    return "#f44";
  })
  .attr("data-legend", function(d) {
    return d.legend;
  })
  .on("mouseover", function(d) { //添加鼠标操作
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(createToolTip(d))
    .style("left", ( width/2+50) + "px")
    .style("top", (540) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });

  // 添加文字标签
  ascents.selectAll("text")
  .data(alps)
  .enter()
  .append("text")
  .text(function(d) {
    return d.Name;
  })
  .attr("x", function(d) {
    return xScale(d.behind);
  })
  .attr("y", function(d) {
    return yScale(d.Place);
  })
  .attr("transform", "translate(15,+4)");

  function createToolTip(d) { // 显示具体信息的函数
  var tooltipHTML = "<span class='info'>运动员:</span><span class = 'name'>" + d.Name + "/ <span class='info'>国籍-</span>" + d.Nationality + "</span>";
  tooltipHTML += "<br/><span class='info'>成绩年:</span> " + d.Year + ",<span class='info'> 成绩用时:</span> " + d.Time + "<br/>";
  if (d.Doping !== "") {
    tooltipHTML += "<br/><span class='nogood'> 受违纪指控情况:</span>" + d.Doping+"";
  } else {
    tooltipHTML += "<br/><span class='good'> 没有受到兴奋剂指控</span>";
  }
  return tooltipHTML;
}

});


