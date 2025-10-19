import * as React from 'react';

import { ExpoThemeChangerViewProps } from './ExpoThemeChanger.types';

export default function ExpoThemeChangerView(props: ExpoThemeChangerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
