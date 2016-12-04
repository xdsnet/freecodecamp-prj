var nodeSass=require("node-sass")
var fs=("fs")
nodeSass.render({
    data: ".container\n  margin-top:15px\n.col-center-block\n  float: none\n  display: block\n  margin-left: auto\n   margin-right: auto\ntextarea\n  resize: vertical\n  height: 100%",
    error: function(error) {
        console.log(error)
    },
    success: function(css){
        console.log(css)
    }
}, function(error, result) { // node-style callback from v3.0.0 onwards
    if(!error){
        console.log(result)
      // No errors during the compilation, write this result on the disk
      fs.writeFile("index.css", result, function(err){
        if(!err){
          //file written on disk
           console.log("ok")
        }
      });
    }
})