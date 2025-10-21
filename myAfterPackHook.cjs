const asarmor = require("asarmor");
const path = require('path');

module.exports = async ({ appOutDir, packager }) => {
  const asarPath = path.join(packager.getResourcesDir(appOutDir), 'app.asar');
  const archive = await asarmor.open(asarPath);
  archive.patch(); // 应用补丁，使asar文件无法被正常解压
  await archive.write(asarPath);
};