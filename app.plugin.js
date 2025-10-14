// app.plugin.js
const { withXcodeProject, withInfoPlist } = require("@expo/config-plugins");

module.exports = function withForceIphoneOnly(config) {
  // Force Info.plist to iPhone-only
  config = withInfoPlist(config, (cfg) => {
    cfg.modResults.UIDeviceFamily = [1];
    cfg.modResults.UIRequiresFullScreen = true;
    delete cfg.modResults["UISupportedInterfaceOrientations~ipad"];
    return cfg;
  });

  // Force Xcode build setting for ALL configurations
  return withXcodeProject(config, (cfg) => {
    const proj = cfg.modResults;
    const configs = proj.pbxXCBuildConfigurationSection();
    for (const key in configs) {
      const item = configs[key];
      if (!item || typeof item !== "object" || !item.buildSettings) continue;
      item.buildSettings.TARGETED_DEVICE_FAMILY = "1"; // iPhone only
    }
    return cfg;
  });
};