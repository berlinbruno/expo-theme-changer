import { NativeModule, requireNativeModule } from 'expo';

import { ExpoThemeChangerModuleEvents } from './ExpoThemeChanger.types';

declare class ExpoThemeChangerModule extends NativeModule<ExpoThemeChangerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoThemeChangerModule>('ExpoThemeChanger');
