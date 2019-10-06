var gulp = require('gulp');
var watch = require("gulp-watch");
var del = require("del");
var minCss = require('gulp-clean-css'); //gulp-minify-css:压缩css文件 npm install gulp-clean-css
var connect = require('gulp-connect'); //gulp-connect 创建服务器  npm install --save-dev gulp-connect
var minJs = require('gulp-uglify'); //压缩javascript文件  npm install gulp-uglify
var img = require('gulp-imagemin'); //gulp-imagemin:压缩png、jpj、git、svg格式图片 npm install --save-dev gulp-imagemin
var rename = require("gulp-rename"); // npm install gulp-rename --save-dev  重命名文件，把一个文件储存不同版本时使用
var concat = require('gulp-concat'); //npm install gulp-concat --save-dev  整合文件
var gulpbabel = require("gulp-babel");
/*
 * es6 转换 es5
 * $ npm install --save-dev  gulp-babel  babel-preset-env babel-preset-es2015
 * */
var minHtml = require('gulp-htmlmin'); //npm install gulp-htmlmin --save-dev 压缩html，可以压缩页面javascript、css，去除页面空格、注释，删除多余属性等操作
var vue = require('rollup-plugin-vue');
var vembedCss = require('rollup-plugin-embed-css');

var replace = require('rollup-plugin-replace');
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var json = require("rollup-plugin-json");
var postcss = require("gulp-postcss"); // 手机端自动补全css3前缀  cnpm install --save-dev gulp-postcss
var autoprefixer = require('autoprefixer'); // npm install --save-dev autoprefixer
var sass = require('gulp-sass');
var eslint = require("gulp-eslint"); // 检查es5 ees6 js gulp-eshint
var less = require("gulp-less");


// 清空目录gulp-del
gulp.task('del', function(cd) {
	// gulp.src('./dist',{read:false}).pipe(clean()); //gulp-clean

	del(["./dist"], cd); //gulp-del
});


//开启http服务器
var sev = function () {
	connect.server({
		root: 'src',
		livereload: true,
		port: 8888,


	});
}
gulp.task('connect',
	function () {
		sev();
	});


/*======================================= gulp  单项编译=================================== */

var gulpJsFile = [
	"./src/mobile/js-dev/mobile-dom.js",
	"./src/mobile/js-dev/mobile-transform.js",
	"./src/mobile/js-dev/mobile-transition.js",
	"./src/mobile/js-dev/mobile-ajax.js"

];

var outputDir = "mobile";
var outputFileName="mobile.js";

var isgulpMinJs = true;
var gulpMinJs = isgulpMinJs ? minJs : function () { };

gulp.task("gulp-build", function () {

	gulp.src(gulpJsFile)
		.pipe(gulpbabel({
			presets: ['es2015']
		})) // es6编译
		.pipe(concat(outputFileName))
		.pipe(gulpMinJs()) //压缩js文件
		.pipe(gulp.dest(`./dist/${outputDir}/`));

	gulp.src([`./src/${outputDir}/*.html`]).pipe(gulp.dest(`./dist/${outputDir}/`)); //复制html

	gulp.src([`./src/${outputDir}/demo/**/*.*`]).pipe(gulp.dest(`./dist/${outputDir}/demo`)); //复制demo目录

})

gulp.task("gulp-dev", function () {

	return gulp.src(gulpJsFile)
		.pipe(gulpbabel({
			presets: ['es2015']
		})) // es6编译
		.pipe(concat(outputFileName))
		.pipe(gulp.dest(`./src/${outputDir}`));

})

gulp.task("gulp-dev-watch", function () {

	gulp.src(gulpJsFile)
		.pipe(gulpbabel({
			presets: ['es2015']
		})) // es6编译
		.pipe(concat(outputFileName))
		.pipe(gulp.dest(`./src/${outputDir}`)).pipe(connect.reload());

})

gulp.task("gulp-watch", ["gulp-dev","connect"], function () {

	watch(gulpJsFile, function () {
		gulp.start("gulp-dev-watch")
	});


	//监听html
	watch(`./src/${outputDir}/**/*.html`, function () {
		gulp.start("gulp-html");
	});


})

gulp.task("gulp-html", function () {
	gulp.src(`./src/${outputDir}/**/*.html`).pipe(connect.reload());
});




