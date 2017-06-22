 module.exports = {
     entry: { 
         javascript : './scmSpine.js',
         javascript : './scm2D.js',
         javascript : './spineView.js' 
     },
     output: {
         filename: './bin/app.bundle.js',
		chunkFilename: '[id].[chunkhash].js'

     }
 };