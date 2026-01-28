const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add web-specific module resolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && moduleName === 'react-native-maps') {
        return {
            filePath: path.resolve(__dirname, 'react-native-maps.web.js'),
            type: 'sourceFile',
        };
    }
    // Fallback to default resolution
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
