// Web stub for react-native-maps
import React from 'react';
import { View } from 'react-native';

const MapView = ({ children, style, ...props }) => (
    <View style={style}>{children}</View>
);

const Marker = ({ children }) => <View>{children}</View>;
const Circle = () => null;
const Polygon = () => null;
const Polyline = () => null;
const Callout = ({ children }) => <View>{children}</View>;
const PROVIDER_GOOGLE = 'google';
const PROVIDER_DEFAULT = null;

export default MapView;
export {
    Marker,
    Circle,
    Polygon,
    Polyline,
    Callout,
    PROVIDER_GOOGLE,
    PROVIDER_DEFAULT,
};
