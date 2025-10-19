import { registerWebModule, NativeModule } from 'expo';

import { ExpoThemeChangerModuleEvents } from './ExpoThemeChanger.types';

class ExpoThemeChangerModule extends NativeModule<ExpoThemeChangerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoThemeChangerModule, 'ExpoThemeChangerModule');
