// 初始化相关参数
var width = '100%',
    height = '100%',
    sizeModifier = 50,
    hue = 0, colors = {},
    meteorites;

// 定义一个
var projection = d3.geoMercator()
  .translate([780,360])
  .scale(300);

// 定义一个放缩处理
var zoom = d3.zoom()
  .on("zoom", zoomed);

// 定义一个地图路径
var path = d3.geoPath()
  .projection(projection);

// 初始化绘图区域
var svg = d3.select('#container')
  .append('svg')
  .attr('width', '100%');

// 设置一个背景
svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', '#266D98')
  .call(zoom);


// 设置尺寸变更处理
d3.select(window).on("resize", sizeChange);

// 提示框
var div = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

var map = svg.append('g');

// 加载全球地图
d3.json('https://d3js.org/world-50m.v1.json', function(json) {
  map.selectAll('path')
    .data(topojson.feature(json, json.objects.countries).features) // 利用topojson转换格式为geojson，注意https://cdnjs.cloudflare.com/ 的topojson 2.0内容有问题,必须用2.2.0
    .enter()
    .append('path')
    .attr('fill', '#95E1D3')
    .attr('stroke', '#266D98')
    .attr('d', path);
    
});

// 陨石数据加载 https://data.nasa.gov/resource/y77d-th95.geojson https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json
d3.json('https://data.nasa.gov/resource/y77d-th95.geojson', function(json) {

  json.features.sort(function(a,b) { // 根据陨落日期排序
    return new Date(a.properties.year) - new Date(b.properties.year);
  })
  json.features.map(function(e) { // 
    hue+=.35;
    colors[e.properties.year] = hue; // 颜色处理
    e.color = 'hsl(' + hue + ',100%, 50%)';
  })

  json.features.sort(function(a,b) { // 根据陨落数量排序
    return b.properties.mass - a.properties.mass
  })

  meteorites = svg.append('g')
  .selectAll('path')
    .data(json.features)
    .enter()
      .append('circle')
      .attr('cx', function(d) { return projection([d.properties.reclong,d.properties.reclat])[0] })
      .attr('cy', function(d) { return projection([d.properties.reclong,d.properties.reclat])[1] })
      .attr('r', function(d) { 
        var range = 718750/2/2; // 根据数量 定义陨落点半径
    
        if (d.properties.mass <= range) return 2;
        else if (d.properties.mass <= range*2) return 10;
        else if (d.properties.mass <= range*3) return 20;
        else if (d.properties.mass <= range*20) return 30;
        else if (d.properties.mass <= range*100) return 40;
        return 50;
      })
      .attr('fill-opacity', function(d) {
        var range = 718750/2/2; // 定义范围标准，超过的填充色是50%透明度
        if (d.properties.mass <= range) return 1;
        return .5;
      })
      .attr('stroke-width', 1)
      .attr('stroke', '#EAFFD0')
      .attr('fill', function(d) { return d.color })
      .on('mouseover', function(d) {
        d3.select(this).attr('d', path).style('fill', 'black');
        // 显示提示（淡入）
        div.transition()
          .duration(200)
          .style('opacity', .9);
        div.html( '<span class="def">记录编号:</span> ' + d.properties.id + '<br>' +
                  '<span class="def">陨落状态:</span> ' + d.properties.fall + '<br>' +  
                  '<span class="def">数量:</span> ' + d.properties.mass + '<br>' + 
                  '<span class="def">陨石名称:</span> ' + d.properties.name + '<br>' + 
                  '<span class="def">已定名:</span> ' + d.properties.nametype + '<br>' +
                  '<span class="def">类型:</span> ' + d.properties.recclass + '<br>' + 
                   '<span class="def">陨落经度:</span> ' +( d.properties.reclong<0?"西经":"东经") +Math.abs(d.properties.reclong )+ '度<br>' + 
                  '<span class="def">陨落纬度:</span> ' +( d.properties.reclat<0?"北纬":"南纬") + d.properties.reclat + '度<br>' + 
                  '<span class="def">陨落年:</span> ' +d.properties.year.split("-")[0] + '<br>')
          .style('left', (d3.event.pageX+30) + 'px')
          .style('top', (d3.event.pageY/1.5) + 'px')
      })
      .on('mouseout', function(d) {
        // 重置颜色
        d3.select(this).attr('d', path).style('fill', function(d) { return d.properties.hsl });

        // 淡出提示
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });
  
  // 初始化地图尺寸
  sizeChange();
});

// 移动和放缩地图和陨落状态
function zoomed() {
  map.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  meteorites.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
}


// 改变窗口尺寸处理
function sizeChange() {
  d3.selectAll("g").attr("transform", "scale(" + $("#container").width()/1900 + ")");
  $("svg").height($("#container").width()/2);
}