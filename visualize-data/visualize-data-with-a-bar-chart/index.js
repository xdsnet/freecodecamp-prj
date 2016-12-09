$('document').ready(function() {

  var url = 'http://2am.ninja/json/gdp.json';

  var months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  var formatCurrency = d3.format("$,.2f");
  $.get(url,function(jsonData){
    var data = jsonData.data;
   console.log(data);
  //  console.log(JSON.stringify(jsonData));
    d3.select(".notes")
      .append("text")
      .text(jsonData.description); // 展示描述信息

      var margin = { // 定义 实际展示区 和外部间距以及展示区实际宽和高
          top: 5,
          right: 10,
          bottom: 30,
          left: 75
        },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var barWidth = Math.ceil(width / data.length);

      minDate = new Date(data[0][0]);
      maxDate = new Date(data[data.length-1][0]); // 日期范围，用作x轴坐标

      var parseDate = d3.timeParse("%Y-%m-%d"),
          formatCount = d3.format(",.1f");

      var x = d3.scaleTime()
          .domain([minDate , maxDate])
          .rangeRound([0, width]);

      var y = d3.scaleLinear()
          .rangeRound([height, 0])
          .domain([0, d3.max(data, function(d) {
                  return d[1]*10;
                  })]);

      var xAxis = d3.axisBottom(x)
                    .ticks(d3.timeYear);
      var yAxis = d3.axisLeft(y)
                    .ticks(10,"");


    var svg = d3.select(".chart") // 获取绘制区域

    var g=svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var div = d3.select(".card").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    g.append("g")   // 添加横坐标
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    g.append("g") // 添加纵坐标
      .attr("class","axis axis--y")
      .call(d3.axisLeft(y))

    g.append("text") // 添加说明
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.8em")
      .style("text-anchor", "end")
      .text("GDP, 美国");

      g.selectAll(".bar") // 添加各个数据条
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return x(new Date(d[0]));
        })
        .attr("y", function(d) {
          return y(d[1]*10);
        })
        .attr("height", function(d) {
          return height - y(d[1]*10);
        })
        .attr("width", barWidth)
        .on("mouseover", function(d) {
          var rect = d3.select(this);
          rect.attr("class", "mouseover");
          var currentDateTime = new Date(d[0]);
          var year = currentDateTime.getFullYear();
          var month = currentDateTime.getMonth();
          var dollars = d[1]*10;

          div.transition()
            .duration(200)
            .style("opacity", 0.9);

          div.html("<span class='amount'>" + formatCurrency(dollars) + "&nbsp;亿 </span><br><span class='year'>" + year + ' - ' + months[month] + "</span>")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
        })
        //*
        .on("mouseout", function() {
          var rect = d3.select(this);
          rect.attr("class", "mouseoff");
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
        //*/

  });

});
