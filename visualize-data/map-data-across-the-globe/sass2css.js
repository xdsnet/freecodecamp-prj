var nodeSass=require("node-sass")
var fs=require("fs")
nodeSass.render({
    file:"index.scss",
    error: function(error) {
        console.log(error)
    },
    success: function(css){
        console.log(css)
    },
    outFile:"index.css"
}, function(error, result) { // node-style callback from v3.0.0 onwards
    if(!error){
        console.log("OutCss:\n"+result.css.toString())
      // No errors during the compilation, write this result on the disk
      fs.writeFile("index.css", result.css, function(err){
        if(!err){
          //file written on disk
           console.log("OutCss Ok")
        }else{
            console.log("wirteErr");
        }
      });
    }else{
        console.log("sass Err");
        console.log(error.status); // used to be "code" in v2x and below
        console.log(error.column);
        console.log(error.message);
        console.log(error.line);
    }
})
