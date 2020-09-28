/**
 * script used to update version
 * and to build module
 *
 * possible params:
 *      version YOUR_VERSION - version param need to be followed by version value
 *      ignore - if present and if version param present, it will change varsion and ignore build
 */
import {config} from './src/app/config/copmmon-config';

const exec = require('child_process').exec;
const fs = require('fs');
const package_json = require('./package.json');
// const config = require('./src/app/common/common-config');

const deployRepository = package_json.usufr.deploy_path;//'app/main/webapp/';

console.log('passed arguments argv: ', process.argv);

// let pubRep = 'menu/';
/**
 * normally packageVersion==configVersion
 * but in case of delta we take both
 */
let packageVersion = package_json.version;
let configVersion = config.version;
/**
 * parse node params
 */
const args = process.argv.slice(2);

let version = '';
let noBuild;

const versionIdx = args.indexOf('version');
if (versionIdx !== -1) {
  version = args[versionIdx + 1];
  noBuild = !(args.indexOf('ignore') === -1);
}

console.log('passed arguments', args);
console.log('param version', version);
console.log('package version', packageVersion);
console.log('config version', configVersion);
console.log('will not build', noBuild);
/**
 * if version exist, it means that we will release
 * so we need to update version in package.json and app/common/common-config.js
 */
const cleanBuild = removeRepo(createRepo);// remove src/main/webapp and tagret repos, then build
if (version) {

  console.log('in version');

  if (noBuild) {
    console.log('in no build');
    // only update version
    updatePackageVersion(updateConfigVersion(null));
  } else {
    console.log('in build');
    // update version and build
    updatePackageVersion(updateConfigVersion(cleanBuild));
  }
} else {
  console.log('build without version');
  cleanBuild();
}

function updatePackageVersion(fn) {
  fs.readFile('package.json', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    let result = data.replace('"version": "' + packageVersion + '"', '"version": "' + version + '"');

    fs.writeFile('package.json', result, 'utf8', function (err) {
      if (err) return console.log(err);
      fn.call(this);
    });
  });
}

function updateConfigVersion(fn) {
  return function () {
    fs.readFile('src/app/common/common-config.ts', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      let result = data.replace('version: \'' + configVersion + '\'', 'version: \'' + version + '\'');
      console.log('config version', configVersion);
      console.log('version', version);
      console.log('result', result);

      fs.writeFile('src/app/common/common-config.ts', result, 'utf8', function (err) {
        if (err) return console.log(err);
        if (fn) {
          fn.call(this);
        }
      });
    });
  };
}

function removeRepo(fn) {
  return function () {
    let rmRepo = exec('rm -rf src/main target', (error, stdout, stderr) => {
      if (error !== null) {
        console.error('Removing old build repository failed !!! Build stopped.');
      } else {
        console.log('/** Old repositories src/main/webapp/ and target/ removed');
        fn.call(this, build);
      }
    });
  };
}

function createRepo(fn) {
  let mkdirRepo = exec('mkdir "' + deployRepository + '"',
    (error, stdout, stderr) => {
      console.log('/** repositories ' + deployRepository + ' created');
      // console.log(stdout);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      } else {
        fn.call(this);
      }
    });
}

function build() {
  let build = exec('npm run build-prod',
    {maxBuffer: 1024 * 500},
    (error, stdout, stderr) => {
      console.log('');
      console.log('/** starting ng build process');
      console.log('');
      console.log(stdout);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
      // copyIndexFile();
      // copyFavicon();
      // copyContentFiles();
      // copyTranslateFiles();
      copyDistFiles();
      copyWebXml();
      // copyAssetsFiles();
      // copyEnvironmentsFiles();
    });
}

function copyDistFiles() {
  let cpIndex = exec('cp -rf "dist/." "' + deployRepository + '"',
    (error, stdout, stderr) => {
      console.log('/** copy all dist generated files');
      // console.log(stdout);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
}

function copyIndexFile() {
  let cpIndex = exec('cp "src/index.html" "' + deployRepository + 'index.html"',
    (error, stdout, stderr) => {
      console.log('/** copy index.html file');
      // console.log(stdout);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
}

function copyFavicon() {
  let cpIndex = exec('cp src/favicon.ico ' + deployRepository + 'favicon.ico',
    (error, stdout, stderr) => {
      console.log('/** copy favicon.ico file');
      // console.log(stdout);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });

}

// function copyContentFiles() {
//   let cpContent = exec('cp -rf src/assets/data ' + deployRepository + 'assets/data',
//     (error, stdout, stderr) => {
//       console.log('/** copy contetnt files');
//       // console.log(stdout);
//       if (error !== null) {
//         console.log(`exec error: ${error}`);
//       }
//     });
// }

// function copyTranslateFiles() {
//     let cpTranslate = exec('cp -rf app/translate/ ' + deployRepository + 'translate',
//                     (error, stdout, stderr) => {
//                         console.log('/** copy translate files');
//                         // console.log(stdout);
//                         if (error !== null) {
//                             console.log(`exec error: ${error}`);
//                         }
//                     });
// }
function copyAssetsFiles() {
  let cpAssets = exec('cp -rf "src/assets/" "' + deployRepository + '"',
    (error, stdout, stderr) => {
      console.log('/** copy assets files');
      // console.log(stdout);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
}

function copyEnvironmentsFiles() {
  let cpEnvironments = exec('cp -rf "src/environments/" "' + deployRepository + 'environments"',
    (error, stdout, stderr) => {
      console.log('/** copy environments files');
      // console.log(stdout);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
}

function copyWebXml() {
  let cpWebXml = exec('mkdir "' + deployRepository + 'WEB-INF" && cp "web.xml" "' + deployRepository + 'WEB-INF"',
    (error, stdout, stderr) => {
      console.log('/** copy web.xml file');
      // console.log(stdout);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
}
