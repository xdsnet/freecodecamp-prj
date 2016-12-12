//NOTE: This was originally based on a Free Code Camp link ("https://www.freecodecamp.com/news/hot") that is no longer available, so I reverse engineered the same type of data and put it as a script in the HTML section.
var data = document.getElementById('fccdata').innerHTML;
data = JSON.parse(data);
data = data.campers;

//GRAPH STUFF STARTS HERE

//Graph size
var width = 700,
  height = 550;

//Force layout
var force = d3.layout.force()
  .charge(-130)
  .linkDistance(60)
  .size([width, height]);

//Append SVG to page
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var graph = {
  "map": {},
  "nodes": [],
  "links": []
};
var count = 0;
//THIS WAS THE JSON CALL PREVIOUSLY
  // create a map of all the entries
  //push camper name object into nodes
  //push important part of url links into nodes under "site:"

  for (var i = 0; i < data.length; i++) {
    var name = data[i].author.username;
    var site = data[i].link;
    site = site.split('/');
    site = site[2];
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
  // go through the data to create links.
  // each link should have source, target, value
  for (var i = 0; i < data.length; i++) {
    var name = data[i].author.username;
    var site = data[i].link;
    site = site.split('/');
    site = site[2];
    //look up in map
    var camper = graph.map[name];
    var target = graph.map[site];
    //push to links
    graph.links.push({
      "source": camper,
      "target": target
    });
  }

  force.nodes(graph.nodes)
    .links(graph.links)
    .start();

  //Create lines
  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link");

  //Create nodes
  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

  node.append("image")
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

  force.on("tick", function() {
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
