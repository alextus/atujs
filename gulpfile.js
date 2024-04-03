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


var version = "1.2.1"
var time = "2024.03.29"

                                      

var redeme = "/*   ___          ___          ___           ___            ___        \r\n    /\\  \\        /\\  \\        /\\  \\         /\\__\\          /\\  \\       \r\n   /::\\  \\       \\:\\  \\       \\:\\  \\       /:/  /         /::\\  \\      \r\n  /:/\\:\\  \\       \\:\\  \\       \\:\\  \\     /:/  /         /:/\\:\\  \\     \r\n /::\\~\\:\\  \\      /::\\  \\      /::\\  \\   /:/  /  ___     \\:\\~\\:\\  \\    \r\n/:/\\:\\ \\:\\__\\    /:/\\:\\__\\    /:/\\:\\__\\ /:/__/  /\\__\\  /\\ \\:\\ \\:\\__\\   \r\n\\/__\\:\\/:/  /   /:/  \\/__/   /:/  \\/__/ \\:\\  \\ /:/  /  \\:\\ \\:\\ \\/__/   \r\n     \\::/  /   /:/  /       /:/  /       \\:\\  /:/  /    \\:\\ \\:\\__\\     \r\n     /:/  /   /:/  /       /:/  /         \\:\\/:/  /      \\:\\/:/  /     \r\n    /:/  /    \\/__/        \\/__/           \\::/  /        \\::/  /      \r\n    \\/__/                                   \\/__/          \\/__/       \r\n\r\n	艾特图斯 https://www.attus.cn\r\n	" + time + " Beijing.Shanghai.China\r\n	Wechat:alextus\r\n	Mobile:13717810545\r\n	Atu.js不兼容IE6、8、9、10 浏览器，移动项目专用\r\n	version:v" + version + "\r\n*/"

var paths = {
  scripts: ['src/atu.js', 'src/event.js', 'src/ajax.js', 'src/tween.js','src/animate.js', 'src/loadFile.js', 'src/message.js',  'src/common.js']
  //,'src/anime.js','src/tabSwitch.js',
}
gulp.task('build:atu', async () => {
  gulp.src(['src/atu.js', 'src/event.js', 'src/ajax.js', 'src/common.js'])
    .pipe(babel())
    .pipe(concat('core.js'))
    .pipe(gulp.dest('build/atu'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });
    gulp.src(['src/tween.js', 'src/animate.js'])
    .pipe(babel())
    .pipe(concat('tween.js'))
    .pipe(gulp.dest('build/atu'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });
    
  let others = ['loadFile.js', 'message.js', 'tabSwitch.js', 'markdown.js']
  for (i = 0; i < others.length; i++) {
    gulp.src(['src/' + others[i]])
      .pipe(babel())
      .pipe(concat(others[i]))
      .pipe(gulp.dest('build/atu'))
      .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      });
  }

})
gulp.task('default', async () => {

  gulp.src(paths.scripts)
    .pipe(babel())
    .pipe(replace('13717810545', time.substring(0,7)))
    .pipe(replace('/* readme */',redeme))
    .pipe(concat('atu.' + version + '.js'))
    .pipe(uglify({
      mangle: false,        //类型：Boolean 默认：true， 是否修改变量名
      compress: false,      //类型：Boolean 默认：true， 是否完全压缩
      output: {
        preamble: redeme,
        comments: function (node, comment) {
          return comment.value.indexOf("@date") >= 0;  //含有@date字符 部分的注释进行保留
        },
      }
    }))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });

  gulp.src(paths.scripts)
    .pipe(babel())
    .pipe(replace('13717810545', time.substring(0,7)))
    .pipe(replace('/* readme */',redeme))
    .pipe(concat('atu.' + version + '.min.js'))
    .pipe(uglify({
      mangle: true,        //类型：Boolean 默认：true， 是否修改变量名
      compress: true,      //类型：Boolean 默认：true， 是否完全压缩
      output: {
        preamble: redeme,
        comments: function (node, comment) {
          return comment.value.indexOf("@date") >= 0;  //含有@date字符 部分的注释进行保留
        },
      }
    }))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });


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
    var needCoppyFiles = ['atu.'+version+'.js', 'atu.'+version+'.min.js', 'atu.markdown.0.1.0.js']
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
  gulp.src('src/markdown.js')//{sourcemaps:true}   src/*.js
  .pipe(babel())
  .pipe(concat('atu.markdown.0.1.0.js'))
  .pipe(gulp.dest('build'))
  .on('error', function (err) {
    gutil.log(gutil.colors.red('[Error]'), err.toString());
  });
})
