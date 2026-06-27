const fs = require('fs');
const path = require('path');
const os = require('os');

// === 1. PARCHE DE C++ (SKIA / REANIMATED) ===
const gradleCacheDir = path.join(os.homedir(), '.gradle', 'caches');

function findAndPatch(dir) {
    if (!fs.existsSync(dir)) return;
    let files;
    try { files = fs.readdirSync(dir); } catch (e) { return; }

    for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
            if (fs.statSync(fullPath).isDirectory()) {
                if (file === 'modules-2' || file === 'jars-9' || file === 'build-cache-1') continue;
                findAndPatch(fullPath);
            } else if (file === 'graphicsConversions.h') {
                let content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('std::format("{}%", dimension.value)')) {
                    content = content.replace('std::format("{}%", dimension.value)', 'std::to_string(dimension.value) + "%"');
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log('✅ [AUTO-PARCHE] Bug de C++ aniquilado.');
                }
            }
        } catch(e) {}
    }
}
console.log('🕵️ Buscando bugs en el entorno nativo...');
findAndPatch(gradleCacheDir);

// === 2. INYECCIÓN DE KOTLIN (TRACK PLAYER) ===
const ktPath = path.join(process.cwd(), 'node_modules', 'react-native-track-player', 'android', 'src', 'main', 'java', 'com', 'doublesymmetry', 'trackplayer', 'module', 'MusicModule.kt');

if (fs.existsSync(ktPath)) {
    let ktContent = fs.readFileSync(ktPath, 'utf8');
    
    // 1. Separar la inyección anterior (si existe) para no duplicarla
    let mainCode = ktContent;
    if (ktContent.includes('// Función inyectada')) {
        mainCode = ktContent.split('// Función inyectada')[0];
    }

    // 2. Limpiar rastros de intentos fallidos
    mainCode = mainCode.replace(/Arguments\.toBundle\((.*?)\)!!/g, 'Arguments.toBundle($1)');
    mainCode = mainCode.replace(/Arguments\.toBundle\((.*?)\) \?: android\.os\.Bundle\(\)/g, 'Arguments.toBundle($1)');
    
    // 3. Reemplazar TODAS las llamadas por nuestra función segura
    mainCode = mainCode.replace(/Arguments\.toBundle/g, 'safeToBundle');

    // 4. Crear la función nativa que el compilador no puede rechazar
    const injectedCode = `
// Función inyectada por el Auto-Parchador de Node.js
fun safeToBundle(map: com.facebook.react.bridge.ReadableMap?): android.os.Bundle {
    return if (map == null) android.os.Bundle() else (com.facebook.react.bridge.Arguments.toBundle(map) ?: android.os.Bundle())
}
`;

    // 5. Ensamblar y guardar
    fs.writeFileSync(ktPath, mainCode + injectedCode, 'utf8');
    console.log('✅ [AUTO-PARCHE] Función nativa inyectada en Kotlin con éxito.');
} else {
    console.log('⚠️ No se encontró el archivo de TrackPlayer.');
}