module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
    // 🔥 IMPORTANTE: 'assumptions' ayuda a Babel a trabajar menos y más rápido
    assumptions: {
      setPublicClassFields: true,
      privateFieldsAsProperties: true,
    },
    // 🔥 IMPORTANTE: exclude evita que Babel intente recompilar librerías que ya vienen listas
    exclude: [
        '**/node_modules/**',
    ],
  };
};