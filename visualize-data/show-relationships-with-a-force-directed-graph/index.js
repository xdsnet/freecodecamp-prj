//注意：因为数据原来的数据提供服务点("https://www.freecodecamp.com/news/hot")失效，所以数据改用在页面中插入来集成
var data = document.getElementById('fccdata').innerHTML;
data = JSON.parse(data);
data = data.campers;

//图的东西在这里

//图形尺寸
var width = 700,
    height = 550;

// 在页面中添加SVG
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);



var graph = { // 对data数据进行处理，以放置链接关系等。
  "map": {},
  "nodes": [],
  "links": []
};

var count = 0;

  for (var i = 0; i < data.length; i++) { //生成map数据，用于后续节点数据生成和 链接数据生成,其实就是对用户名和链接的hostname进行排序编号
    var name = data[i].author.username;
    var site = data[i].link;
    site = site.split('/');
    site = site[2];
    // 生成nodes节点数组
    if (!graph.map[name]) { 
      graph.map[name] = count;
      graph.nodes.push(data[i].author);
      count++;
    }
    if (!graph.map[site]) {
      graph.map[site] = count;
      graph.nodes.push({
        "site": site
      });
      count++;
    }
  }
  // 生成链接数组，包括source/target和value 3个属性(注意value是后面生成，这里只有2个)
  for (var i = 0; i < data.length; i++) {
    var name = data[i].author.username;
    var site = data[i].link;
    site = site.split('/');
    site = site[2];
    //look up in map 在map中查询关系，生成链接数据
    var camper = graph.map[name];
    var target = graph.map[site];
    //push to links
    graph.links.push({
      "source": camper,
      "target": target
    });
  }


//力导向布局
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink())
    .force("charge", d3.forceManyBody().strength([-15]) ) // 调整默认连接距离计算基数
    .force("center", d3.forceCenter(width/2 , height/2 )); // 调整中心位置

simulation
      .nodes(graph.nodes)
      .on("tick", function() {
          link.attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
      });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
  
  simulation.force("link")
      .links(graph.links)
      .distance(40); //默认链接长度
      

// 添加节点连线
  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link");

// 添加节点
var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
     .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

node.append("image") //为节点添加图像、图标等
    .attr("xlink:href", function(d) {
      var key = (Object.keys(d));
      if (key[0] === "site") {
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/BlackDot.svg/2000px-BlackDot.svg.png";
      } else {
        return d.picture;
      }
    })
    .attr("x", function(d) {
      var count = 1;
      var index = d.index;
      for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source.index === index || graph.links[i].target.index === index) {
          count = count + 0.2;
        }
      }
      return -8 * count;
    })
    .attr("y", function(d) {
      var count = 1;
      var index = d.index;
      for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source.index === index || graph.links[i].target.index === index) {
          count = count + 0.2;
        }
      }
      return -8 * count;
    })
    .attr("width", function(d) {
      var count = 1;
      var index = d.index;
      for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source.index === index || graph.links[i].target.index === index) {
          count = count + 0.2;
        }
      }
      return 16 * count;
    })
    .attr("height", function(d) {
      var count = 1;
      var index = d.index;
      for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source.index === index || graph.links[i].target.index === index) {
          count = count + 0.2;
        }
      }
      return 16 * count;
    })
    .append('svg:title').text(function(d) {
      var key = (Object.keys(d));
      if (key[0] === "site") {
        return d.site;
      } else {
        return d.username;
      }
    });

// 处理拖动
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.1).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}