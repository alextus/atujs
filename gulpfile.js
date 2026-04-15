const gulp = require('gulp');
const uncommentIt = require('gulp-uncomment-it');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');  //压缩
const concat = require('gulp-concat'); //合并
const babel = require('gulp-babel')
const replace = require('gulp-replace');
const del = require("del");
const connet = require("gulp-connect");
const browserSync = require("browser-sync");
const fs = require('fs');
const path = require('path');


var version = "1.2.6.1"
var time = "2026.04.14"

                                      

var redeme = "/*   ___          ___          ___           ___            ___        \r\n    /\\  \\        /\\  \\        /\\  \\         /\\__\\          /\\  \\       \r\n   /::\\  \\       \\:\\  \\       \\:\\  \\       /:/  /         /::\\  \\      \r\n  /:/\\:\\  \\       \\:\\  \\       \\:\\  \\     /:/  /         /:/\\:\\  \\     \r\n /::\\~\\:\\  \\      /::\\  \\      /::\\  \\   /:/  /  ___     \\:\\~\\:\\  \\    \r\n/:/\\:\\ \\:\\__\\    /:/\\:\\__\\    /:/\\:\\__\\ /:/__/  /\\__\\  /\\ \\:\\ \\:\\__\\   \r\n\\/__\\:\\/:/  /   /:/  \\/__/   /:/  \\/__/ \\:\\  \\ /:/  /  \\:\\ \\:\\ \\/__/   \r\n     \\::/  /   /:/  /       /:/  /       \\:\\  /:/  /    \\:\\ \\:\\__\\     \r\n     /:/  /   /:/  /       /:/  /         \\:\\/:/  /      \\:\\/:/  /     \r\n    /:/  /    \\/__/        \\/__/           \\::/  /        \\::/  /      \r\n    \\/__/                                   \\/__/          \\/__/       \r\n\r\n	艾特图斯 https://www.attus.cn\r\n	" + time + " Beijing.Shanghai.Ningbo.China\r\n	Wechat:alextus\r\n	Mobile:13717810545\r\n	Atu.js不兼容IE6、8、9、10 浏览器，移动项目专用\r\n	version:v" + version + "\r\n*/"

var paths = {
  scripts: ['src/atu.js', 'src/event.js', 'src/ajax.js', 'src/tween.js','src/animate.js', 'src/loadFile.js', 'src/message.js',  'src/common.js']
  //,'src/anime.js','src/tabSwitch.js',
}


let babelConfig={
      presets: [
        ['@babel/preset-env', {
          targets: {
            ie: '11',        // 强制兼容 IE11
            chrome: '58',
          },
          useBuiltIns: false,
          modules: false,
        }]
      ],
      plugins: [
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-block-scoping',
        '@babel/plugin-transform-template-literals',
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-for-of',
        '@babel/plugin-transform-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/proposal-nullish-coalescing-operator'
      ]
    };
gulp.task('build:atu', async () => {
  gulp.src(['src/atu.js', 'src/event.js', 'src/ajax.js', 'src/common.js'])
    .pipe(isEs6?babel(babelConfig):gutil.noop())
    .pipe(concat('core.js'))
    .pipe(gulp.dest('build/atu'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });
    gulp.src(['src/tween.js', 'src/animate.js'])
    .pipe(isEs6?babel(babelConfig):gutil.noop())
    .pipe(concat('tween.js'))
    .pipe(gulp.dest('build/atu'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });
    
  let others = ['loadFile.js', 'message.js', 'tabSwitch.js', 'markdown.js']
  for (i = 0; i < others.length; i++) {
    gulp.src(['src/plugin/' + others[i]])
      .pipe(isEs6?babel(babelConfig):gutil.noop())
      .pipe(concat(others[i]))
      .pipe(gulp.dest('build/atu'))
      .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      });
  }

})
gulp.task('default', async () => {

  // 公共配置抽离
  const uglifyOpts = {
    normal: {
      mangle: false,
      compress: false,
      output: { preamble: redeme, 
                comments: function (node, comment) { return comment && comment.value.indexOf("@date") >= 0;} 
              }
    },
    min: {
      mangle: true,
      compress: true,
      output: { preamble: redeme, 
                comments: function (node, comment) { return comment && comment.value.indexOf("@date") >= 0;} 
              }
    }
  };



  // 一次性处理：正常版 + 压缩版
  const buildScripts = (isMin = false,isEs6=false) => {
    return gulp.src(paths.scripts)
      .pipe(!isEs6 ? babel(babelConfig) : gutil.noop())
      .pipe(replace('13717810545', time.substring(0,7)))
      .pipe(replace('/* readme */', redeme+'"use strict";'))
      .pipe(concat(`atu.${version}${isEs6?'':'.es5'}${isMin ? '.min' : ''}.js`))
      .pipe(uglify(isMin ? uglifyOpts.min : uglifyOpts.normal))
      .pipe(gulp.dest('build'))
      .on('error', err => gutil.log(gutil.colors.red('[Error]'), err.toString()));
  };
  // 执行构建
  buildScripts(0); // 生成 atu.x.x.x..es5.js
  buildScripts(1);  // 生成 atu.x.x.x.es5.min.js
  buildScripts(0,1); // 生成 atu.x.x.x.js
  buildScripts(1,1);  // 生成 atu.x.x.x.min.js

});

function copyFile(orgfilepath, desdirpath, desfilename) {
  if (fs.existsSync(orgfilepath)) {
    let desfilepath = path.join(desdirpath, desfilename);

    if (fs.existsSync(desfilepath)) {
      fs.unlinkSync(desfilepath)
      console.error("[" + Date().toString() + "] alextu.com/static/js/" + desfilename + " 更新");
    }
    fs.copyFileSync(orgfilepath, desfilepath);
  } else {
    console.error(Date().toString() + "复制文件" + orgfilepath.toString() + "不存在");
  }
}
gulp.task('copy', async () => {
    //  复制文件到这里
    var needCoppyFiles = ['atu.'+version +suffix+'.js', 'atu.'+version +suffix+'.min.js']
    for (let i = 0; i < needCoppyFiles.length; i++) {
      copyFile('./build/' + needCoppyFiles[i], '../js/', needCoppyFiles[i]);
    }
})
gulp.task('clean', async () => {
  del(['./build/'], () => {
    console.log("clean")
  })

})
gulp.task('markdown', async () => {
  gulp.src('src/plugin/markdown.js')//{sourcemaps:true}   src/*.js
  .pipe(isEs6?babel(babelConfig):gutil.noop())
  .pipe(concat('atu.markdown.0.1.0.js'))
  .pipe(gulp.dest('build'))
  .on('error', function (err) {
    gutil.log(gutil.colors.red('[Error]'), err.toString());
  });
})
