const { readFileSync: readFile } = require('fs');
const child = require('child_process').spawn;
const path = require('path');

const beforeDeploy = (params) =>
  new Promise((resolve, reject) => {
    const cwd = process.cwd();
    let { pathToCode } = params;
    pathToCode = pathToCode.startsWith(cwd)
      ? pathToCode
      : path.join(cwd, pathToCode);
    const { dependencies } = JSON.parse(
      readFile(path.join(pathToCode, 'package.json'), 'utf8')
    );

    if (!dependencies.sharp) {
      return resolve();
    }

    const args = [
      'install',
      '--arch=x64',
      '--platform=linux',
      '--target=8.10.0',
      `sharp@${dependencies.sharp}`,
    ];
    const options = { cwd: pathToCode, shell: true };
    const spawn = child('npm', args, options);
    spawn.on('exit', (code) => {
      if (code !== 0) {
        reject(`Error, code: ${code}`);
      } else {
        return resolve();
      }
    });
    spawn.on('error', reject);
  });

module.exports = { beforeDeploy };
