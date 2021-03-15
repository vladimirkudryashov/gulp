const {
    src,
    dest,
    watch,
    parallel,
    series
} = require("gulp");
const scss = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const sync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
// const fi = require('gulp-file-include');

const fs = require("fs");

function createFiles () {
    createFolders();
    setTimeout(() => {
        fs.writeFile("newfolder/index.html", "!", function (err) {
            if ( err ) {
                throw err;
            }
            console.log("File created");
        });
        fs.writeFile("newfolder/scss/style.scss", "", function (err) {
            if ( err ) {
                throw err;
            }
            console.log("File created");
        });
    }, 500);
}

// !Создание папок
function createFolders () {
    return src("*.*", { read: false})
    .pipe(dest("./newfolder/scss/"))
    .pipe(dest("./newfolder/js/"))
    .pipe(dest("./newfolder/img/"))
    .pipe(dest("./newfolder/fonts/"))
}

// ! HTML parts

// const fileinclude = function () {
//     return src(["app/pages/**/*.html"])
//     .pipe(
//         fi({
//             prefix: '@@',
//             basepath: 'file'
//         })
//     )
//     .pipe(dest("app"));
// }

// ! Dev
function convertStyles () {
    return src('app/scss/style.scss')
        
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(prefix({
            cascade: true,
            grid: true,
            flexbox: true
        }))
        .pipe(dest('app/css'))
};

function uglifyJS () {
    return src('app/js/draft/*.js')
    .pipe(uglify())
    .pipe(dest('app/js'))
}

function imagesCompressed () {
    return src('app/_img/*.{jpg,png,svg}')
    .pipe(imagemin())
    .pipe(dest('app/img'))
}

function browserSync () {
    sync.init({
        server: {
            baseDir: "app",
            open: "local"
        }
    });
};

function watchFiles() {
    watch('app/scss/**/*.scss', convertStyles);

    watch('app/*.html').on("change", sync.reload);
    watch('app/css/*.css').on("change", sync.reload);
    watch('app/js/*.js').on("change", sync.reload);

    watch('app/js/draft/*.js', uglifyJS);

    watch('app/_img', imagesCompressed);

};

exports.convertStyles = convertStyles;
exports.watchFiles = watchFiles;
exports.browserSync = browserSync;
exports.imagesCompressed = imagesCompressed;
exports.uglifyJS = uglifyJS;

// !Папки и файлы

exports.struct = createFiles;

exports.default = parallel(fileinclude, convertStyles, uglifyJS, browserSync, watchFiles);

// ! Build
function movehtml () {
    return src('app/*.html')
    .pipe(dest('dist'))
}

function moveCss () {
    return src('app/css/*.css')
    .pipe(dest('dist/css'))
}

function moveJS () {
    return src('app/js/*.js')
    .pipe(dest('dist/js'))
}

function moveImgs () {
    return src('app/img')
    .pipe(dest('dist'))
}

exports.movehtml = movehtml;
exports.moveCss = moveCss;
exports.moveJS = moveJS;
exports.moveImgs = moveImgs;


exports.build = series(movehtml, moveCss, moveJS, moveImgs);

