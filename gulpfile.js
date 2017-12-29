var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var proxy = require('http-proxy-middleware');

//target: 'http://10.3.15.187',


var middleware = [],
  proxyValue = {
    target: 'http://172.20.18.183',
    changeOrigin: true,
    logLevel: 'debug'
  };

var middle = [

  /*{
    url: "/msconsole/",
    target: "http://172.19.228.1:8082"
  },*/

  {
    url: "/portal/"
  }, {
    url: "/accesscenter/"
  }, {
    url: "/peizhitime",
    target: "http://localhost:8083"
  }, {
    url: "/logs",
    target: "http://localhost:8083"
  }, {
    url: "/app-manage/"
  }, {
    url: "/res-pool-api/"
  }, {
    url: "/invitecode/"
  }, {
    url: "/app-publish/"
  }, {
    url: "/app-upload/"
  }, {
    url: "/posts",
    target: "http://localhost:8083"
  }, {
    url: "/app-approve/"
  }, {
    url: "/status"
  }, {
    url: "/uploadlist",
    target: "http://localhost:8083"
  }, {
    url: "/v2/"
  }, {
    url: "/ycm-yyy/"
  }, {
    url: "/ycm-yco/"
  }, {
    url: "/app-docker-registry/"
  }, {
    url: "/usr/"
  }, {
    url: "/model-create/"
  }, {
    url: "/res-alarm-center/"
  }, {
    url: "/portal/web/v1/userres",
    target: "http://172.20.8.76"
  }, {
    url: "/ycm-yyy/web/v1/"
  }, {
    url: "/web-terminal/33001/startup/10.3.15.189:33001"
  }, {
    url: "/web-terminal/33002/startup/10.3.15.189:33002"
  }, {
    url: "/web-terminal/33003/startup/10.3.15.189:33003"
  }, {
    url: "/web-terminal/33004/startup/10.3.15.189:33004"
  }, {
    url: "/web-terminal/33005/startup/10.3.15.189:33005"
  }, {
    url: "/data-authority/"
  }, {
    url: "/edna/"
  }, {
    url: "/middleware/web/v1",
    //target:"http://10.11.64.20:8080/"
  }, {
    url: "/confcenter/"
  }, {
    url: "/searchlog/"
  }, {
    url: "/res-pool-manager/",
    //target:"http://117.78.46.134"
  }, {
    url: "/md-cms/",
    target: "http://192.168.32.10:19870/"
  }, {
    url: "/runtime-log/",
    //target:"http://117.78.46.134/"
  }, {
    url: "/md-cms/",
    target: "http://192.168.32.10:19870/"
  }, {
    url: "/devops/",
    target: "http://changedog.app.yyuap.com"

  }, {
    url: "/iuapInsight",
    target: 'https://developer.yonyoucloud.com'
  }, {
    url: "/opensearch-manage-platform",
    target: 'http://10.10.24.34:8099'
    // target:'http://10.11.64.63:8080'
  }, {
    url: "/cloudtest/",
  },{
    url: "/msconsole/",
  }, {
    url:"/cloudtest/",
  },{
    url: "/monitorShow",
    target: "http://t9ear40q.c87e2267-1001-4c70-bb2a-ab41f3b81aa3.app.yyuap.com"
  },
];


//循环生成middleware数组对象
for (var i = 0; i < middle.length; i++) {
  var value = JSON.parse(JSON.stringify(proxyValue));
  var o = Object.assign(value, middle[i]);

  middleware.push(
    proxy(o.url, o)
  )
}


//编译代码

gulp.task('webpack_task', function(cb) {
  webpack(require('./webpack.config.js'), function(err, stats) {
    // 重要 打包过程中的语法错误反映在stats中
    console.log('webpack log:' + stats);
    if (err) cb(err);
    console.info('###### webpack_task done ######');
    cb();
  });
});

gulp.task('style_task', function() {
  gulp.src('./src/pages/**/*.css')
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('./build/Release'))
});

gulp.task('reload_task', ['webpack_task'], function() {
  reload();
});

gulp.task('reload_style', ['style_task'], function() {
  reload();
});

//启动服务


gulp.task('server', ['webpack_task'], function() {

  browserSync({
    server: {
      baseDir: './build/Release',
      index: "index.html",
      middleware: middleware

    },
    startPath: "/index.html"
  });

  gulp.watch(['./src/**/*.js', './src/**/**/*.js', './src/**/**/*.css', './src/**/*.css', './src/**/**/*.less', './src/**/*.less'], ['reload_task']);
  //gulp.watch(['./src/**/*.css'], ['reload_style']);

});
