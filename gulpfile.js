const gulp = require('gulp');
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

var paths = {
  scripts: ['src/atu.js', 'src/event.js', 'src/ajax.js', 'src/tween.js', 'src/loadFile.js', 'src/message.js', 'src/tabSwitch.js', 'src/common.js']
}

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
    .pipe(concat('atu.' + version + '.js'))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });
   
  gulp.src(paths.scripts)
    .pipe(babel())
    .pipe(uglify())//压缩  
    .pipe(concat('atu.' + version + '.min.js'))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });

  //  复制文件到这里
  var needCoppyFiles=['atu.1.1.8.js','atu.1.1.8.min.js','atu.markdown.0.1.0.js']
  for(let i=0;i<needCoppyFiles.length;i++){
    copyFile('./build/'+needCoppyFiles[i], '../../alextu.com/static/js/', needCoppyFiles[i]);
  }
});

function copyFile(orgfilepath, desdirpath, desfilename) {
  if (fs.existsSync(orgfilepath)) {
    let desfilepath = path.join(desdirpath, desfilename);
  
    if (fs.existsSync(desfilepath)) {
      fs.unlinkSync(desfilepath)
      console.error("["+Date().toString()+"] alextu.com/static/js/"+desfilename+" 更新");
    }
    fs.copyFileSync(orgfilepath, desfilepath);
  } else {
    console.error(Date().toString() + "复制文件"+orgfilepath.toString()+"不存在");
  }
}