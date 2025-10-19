import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoThemeChangerViewProps } from './ExpoThemeChanger.types';

const NativeView: React.ComponentType<ExpoThemeChangerViewProps> =
  requireNativeView('ExpoThemeChanger');

export default function ExpoThemeChangerView(props: ExpoThemeChangerViewProps) {
  return <NativeView {...props} />;
}
