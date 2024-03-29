const gulp = require('gulp');
const uncommentIt = require('gulp-uncomment-it');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');  //压缩
const concat = require('gulp-concat'); //合并
const babel = require('gulp-babel')

const del = require("del");
const connet = require("gulp-connect");
const browserSync = require("browser-sync");
const fs = require('fs');
const path = require('path');


var version = "1.1.8"
var time = "2021.09.01"
var redeme = "/*\r\n	ATTUS https://www.attus.cn\r\n	" + time + " Beijing.Shanghai.China\r\n	Wechat:alextus\r\n	Mobile:13717810545\r\n	Atu.js不兼容IE6、8、9、10 浏览器，移动项目专用\r\n	version:v" + version + "\r\n*/"

var paths = {
  scripts: ['src/atu.js', 'src/event.js', 'src/ajax.js', 'src/tween.js','src/animate.js', 'src/loadFile.js', 'src/message.js', 'src/tabSwitch.js', 'src/common.js']
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


  gulp.src('src/markdown.js')//{sourcemaps:true}   src/*.js
    .pipe(babel())
    .pipe(concat('atu.markdown.0.1.0.js'))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });

  gulp.src(paths.scripts)//{sourcemaps:true}   src/*.js
    .pipe(babel())
    //.pipe(uncommentIt())
    .pipe(concat('atu.' + version + '.js'))
    .pipe(gulp.dest('build'))
    .pipe(babel())
    .pipe(uglify({
      mangle: true,        //类型：Boolean 默认：true， 是否修改变量名
      compress: true,      //类型：Boolean 默认：true， 是否完全压缩
      output: {
        preamble: redeme,
        comments: function (node, comment) {
          return comment.value.indexOf("@date") >= 0;  //含有@date字符 部分的注释进行保留
        },
      }


    }))//压缩  
    .pipe(concat('atu.' + version + '.min.js'))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });

  //  复制文件到这里
  var needCoppyFiles = ['atu.1.1.8.js', 'atu.1.1.8.min.js', 'atu.markdown.0.1.0.js']
  for (let i = 0; i < needCoppyFiles.length; i++) {
    copyFile('./build/' + needCoppyFiles[i], '../../alextu.com/static/js/', needCoppyFiles[i]);
  }
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

gulp.task('clean', async () => {
  del(['./build/'], () => {
    console.log("clean")
  })

})