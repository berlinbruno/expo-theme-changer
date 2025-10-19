// Reexport the native module. On web, it will be resolved to ExpoThemeChangerModule.web.ts
// and on native platforms to ExpoThemeChangerModule.ts
export { default } from './ExpoThemeChangerModule';
export { default as ExpoThemeChangerView } from './ExpoThemeChangerView';
export * from  './ExpoThemeChanger.types';
