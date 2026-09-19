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


const VERSION_FILE = path.join(__dirname, 'version.txt');

/**
 * 只读取版本，不修改文件
 */
function readVersion() {
  version = fs.readFileSync(VERSION_FILE, 'utf8').trim();
  var arr = version.split('.');
  shortVersion = arr.slice(0, -1).join('.');
  hasAliasVersion = arr.length > 3;
  return version
}

/**
 * 读取版本，最后位+1，写回文件，返回新的版本字符串
 */
function getAndIncVersion() {
  //读文件，去除换行空格
  let raw = readVersion();
  let arr = raw.split('.');
  //最后一段转数字 +1
  let last = Number(arr.pop());

  const currentMonth = new Date().getMonth() + 1;

  let nextVal;
  if (last + 1 > currentMonth) {
    nextVal = currentMonth;
  } else {
    nextVal = last + 1;
  }

  arr.push(String(nextVal));
  let newVer = arr.join('.');
  //写回version.txt
  fs.writeFileSync(VERSION_FILE, newVer, 'utf8');
  console.log(`版本更新：${raw}  →  ${newVer}`);
  return newVer;
}

// 默认只读取版本，不修改文件；仅 default 构建任务执行时才会自增
var version = readVersion();
var shortVersion = '';
var hasAliasVersion = false;

/**
 * 根据版本号刷新 3 段版本别名（形如 1.2.6.4 -> 1.2.6）
 */
function refreshVersion(v) {
  version = v;
  var arr = v.split('.');
  shortVersion = arr.slice(0, -1).join('.');
  hasAliasVersion = arr.length > 3;
}
refreshVersion(version);

/**
 * 等待 gulp 写盘完成（gulp.dest 在所有文件写完后触发 finish）
 */
function waitStream(stream) {
  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('finish', resolve);
  });
}

const d = new Date();
const pad = n => String(n).padStart(2, '0');
var time = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;


function makeRedeme() {
  return "/*   ___          ___          ___           ___            ___        \r\n    /\\  \\        /\\  \\        /\\  \\         /\\__\\          /\\  \\       \r\n   /::\\  \\       \\:\\  \\       \\:\\  \\       /:/  /         /::\\  \\      \r\n  /:/\\:\\  \\       \\:\\  \\       \\:\\  \\     /:/  /         /:/\\:\\  \\     \r\n /::\\~\\:\\  \\      /::\\  \\      /::\\  \\   /:/  /  ___     \\:\\~\\:\\  \\    \r\n/:/\\:\\ \\:\\__\\    /:/\\:\\__\\    /:/\\:\\__\\ /:/__/  /\\__\\  /\\ \\:\\ \\:\\__\\   \r\n\\/__\\:\\/:/  /   /:/  \\/__/   /:/  \\/__/ \\:\\  \\ /:/  /  \\:\\ \\:\\ \\/__/   \r\n     \\::/  /   /:/  /       /:/  /       \\:\\  /:/  /    \\:\\ \\:\\__\\     \r\n     /:/  /   /:/  /       /:/  /         \\:\\/:/  /      \\:\\/:/  /     \r\n    /:/  /    \\/__/        \\/__/           \\::/  /        \\::/  /      \r\n    \\/__/                                   \\/__/          \\/__/       \r\n\r\n	艾特图斯 https://www.attus.cn\r\n	" + time + " Beijing.Shanghai.Ningbo.China\r\n	Wechat:alextus\r\n	Mobile:13717810545\r\n	Atu.js不兼容IE6、8、9、10 浏览器，移动项目专用\r\n	version:v" + version + "\r\n*/"
}
var redeme = makeRedeme();

var paths = {
  scripts: ['src/atu.js', 'src/event.js', 'src/ajax.js', 'src/animate.js', 'src/loadFile.js', 'src/message.js', 'src/common.js']
  //,'src/anime.js','src/tabSwitch.js',
}


let babelConfig = {
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
    .pipe( babel(babelConfig))
    .pipe(concat('atu.core.js'))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });
  gulp.src([ 'src/animate.js'])
    .pipe(babel(babelConfig) )
    .pipe(concat('atu.tween.js'))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });

  let others = ['loadFile.js', 'message.js', 'plugin/tabSwitch.js', 'plugin/markdown.js','plugin/upload.js','plugin/lazyload.js']
  for (i = 0; i < others.length; i++) {
    gulp.src(['src/' + others[i]])
      .pipe( babel(babelConfig) )
      .pipe(concat('atu.'+others[i].replace("plugin/","")))
      .pipe(gulp.dest('build'))
      .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      });
  }

})
gulp.task('default', async () => {

  // 只有执行 default 构建任务时才把版本号 +1，其它任务只读取版本
  refreshVersion(getAndIncVersion());
  redeme = makeRedeme();

  // 公共配置抽离
  const uglifyOpts = {
    normal: {
      mangle: false,
      compress: false,
      output: {
        preamble: redeme,
        comments: function (node, comment) { return comment && comment.value.indexOf("@date") >= 0; }
      }
    },
    min: {
      mangle: true,
      compress: true,
      output: {
        preamble: redeme,
        comments: function (node, comment) { return comment && comment.value.indexOf("@date") >= 0; }
      }
    }
  };



  // 一次性处理：正常版 + 压缩版
  const buildScripts = (isMin = false, isEs6 = false) => {
    const fileName = `atu.${version}${isEs6 ? '' : '.es5'}${isMin ? '.min' : ''}.js`;
    const stream = gulp.src(paths.scripts)
      .pipe(!isEs6 ? babel(babelConfig) : gutil.noop())
      .pipe(replace('13717810545', time.substring(0, 7)))
      .pipe(replace('/* readme */', redeme + '"use strict";'))
      .pipe(concat(fileName))
      .pipe(uglify(isMin ? uglifyOpts.min : uglifyOpts.normal))
      .pipe(gulp.dest('build'))
      .on('error', err => gutil.log(gutil.colors.red('[Error]'), err.toString()));
    // 4 段版本写盘完成后，用同一份内容覆盖对应的 3 段版本
    return waitStream(stream).then(() => {
      if (!hasAliasVersion) return;
      const aliasName = fileName.replace(`atu.${version}`, `atu.${shortVersion}`);
      const buildDir = path.join(__dirname, 'build');
      if (copyFile(path.join(buildDir, fileName), buildDir, aliasName)) {
        console.log('  -> 同步 3 段版本：' + aliasName);
      }
    });
  };
  // 执行构建：每个 4 段版本生成后，同步覆盖 3 段版本
  await Promise.all([
    //buildScripts(0),   // atu.x.x.x.x.es5.js     -> atu.x.x.x.es5.js
    //buildScripts(1),   // atu.x.x.x.x.es5.min.js -> atu.x.x.x.es5.min.js
    buildScripts(0, 1), // atu.x.x.x.x.js         -> atu.x.x.x.js
    buildScripts(1, 1), // atu.x.x.x.x.min.js     -> atu.x.x.x.min.js
  ]);

  // 构建完成后自动执行 copy 任务
  copyTask();
});

/**
 * 复制单个文件，成功返回 true，源文件不存在返回 false
 */
function copyFile(orgfilepath, desdirpath, desfilename) {
  if (!fs.existsSync(orgfilepath)) {
    console.error(Date().toString() + "复制文件" + orgfilepath.toString() + "不存在");
    return false;
  }
  let desfilepath = path.join(desdirpath, desfilename);
  if (fs.existsSync(desfilepath)) {
    fs.unlinkSync(desfilepath)
    console.error("[" + Date().toString() + "] " + desfilepath + " 更新");
  }
  fs.copyFileSync(orgfilepath, desfilepath);
  return true;
}
/**
 * 把构建产物（3 段版本）复制到站点目录，default 构建完成后会自动执行
 */
function copyTask() {
  //  复制文件到这里
  var needCoppyFiles = ['atu.' + shortVersion + '.js', 'atu.' + shortVersion + '.min.js']
  for (let i = 0; i < needCoppyFiles.length; i++) {
    copyFile('./build/' + needCoppyFiles[i], '../atui/js/', needCoppyFiles[i]);
  }
}
gulp.task('copy', async () => {
  copyTask();
})
gulp.task('clean', async () => {
  del(['./build/'], () => {
    console.log("clean")
  })

})
gulp.task('markdown', async () => {
  gulp.src('src/plugin/markdown.js')//{sourcemaps:true}   src/*.js
    .pipe(isEs6 ? babel(babelConfig) : gutil.noop())
    .pipe(concat('atu.markdown.0.1.0.js'))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });
})
