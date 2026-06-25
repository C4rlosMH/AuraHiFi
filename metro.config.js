const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    // Le decimos a Metro que use el transformador de SASS
    babelTransformerPath: require.resolve("react-native-sass-transformer"),
  };

  config.resolver = {
    ...resolver,
    // Registramos las extensiones de SASS como archivos fuentes válidos
    sourceExts: [...resolver.sourceExts, "scss", "sass"],
  };

  return config;
})();