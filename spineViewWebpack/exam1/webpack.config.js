 module.exports = {
     entry: { 
         javascript : '../build/spine-canvas.js',
         javascript : '../scmSpine.js',
         javascript : '../scm2D.js',
         javascript : './spineView.js' 
     },
     output: {
         filename: './bin/app.bundle.js',
		chunkFilename: '[id].[chunkhash].js'

     }
 };