# expo-theme-changer

A powerful and easy-to-use Expo module for managing app themes with support for light, dark, and system-based themes. Automatically detects and responds to system theme changes in real-time.

## Features

✨ **Three Theme Modes**: Light, Dark, and System (follows device settings)  
🔄 **Real-time Updates**: Automatically detects system theme changes  
📱 **Cross-platform**: Works seamlessly on iOS and Android  
🎯 **Type-safe**: Full TypeScript support  
⚡ **Native Performance**: Built with native modules for optimal performance  
🎨 **Event-driven**: Listen to theme changes and update your UI reactively

## Installation

```bash
npm install expo-theme-changer
```

or

```bash
yarn add expo-theme-changer
```

### Basic Example

```tsx
import * as ThemeChanger from 'expo-theme-changer';
import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [themeSetting, setThemeSetting] = useState(ThemeChanger.getTheme());
  const [effectiveTheme, setEffectiveTheme] = useState(ThemeChanger.getEffectiveTheme());

  useEffect(() => {
    // Listen for theme changes
    const subscription = ThemeChanger.addThemeListener(({ theme, effectiveTheme }) => {
      setThemeSetting(theme);
      setEffectiveTheme(effectiveTheme);
    });

    return () => subscription.remove();
  }, []);

  const isDark = effectiveTheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={{ color: isDark ? '#fff' : '#000' }}>
        Current Theme: {themeSetting}
      </Text>
      <Button
        title="Toggle Theme"
        onPress={() => {
          const nextTheme = themeSetting === 'light' ? 'dark' : 
                          themeSetting === 'dark' ? 'system' : 'light';
          ThemeChanger.setTheme(nextTheme);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API Reference

### Types

```typescript
type Theme = "light" | "dark" | "system";

type ThemeChangeEvent = {
  theme: Theme;
  effectiveTheme: "light" | "dark";
};
```

### Methods

#### `setTheme(theme: Theme): void`

Sets the app theme preference.

```typescript
ThemeChanger.setTheme('dark');      // Set to dark mode
ThemeChanger.setTheme('light');     // Set to light mode
ThemeChanger.setTheme('system');    // Follow system theme
```

**Parameters:**
- `theme`: One of `"light"`, `"dark"`, or `"system"`

---

#### `getTheme(): Theme`

Gets the current theme setting.

```typescript
const currentTheme = ThemeChanger.getTheme();
// Returns: "light" | "dark" | "system"
```

**Returns:** The current theme setting

---

#### `getEffectiveTheme(): "light" | "dark"`

Gets the effective theme that is currently applied. If the theme is set to `"system"`, this returns the actual system theme.

```typescript
const effectiveTheme = ThemeChanger.getEffectiveTheme();
// Returns: "light" | "dark"
```

**Returns:** The effective theme being applied

---

#### `getSystemTheme(): "light" | "dark"`

Gets the current system theme, regardless of the app's theme setting.

```typescript
const systemTheme = ThemeChanger.getSystemTheme();
// Returns: "light" | "dark"
```

**Returns:** The system's current theme

---

#### `addThemeListener(listener: (event: ThemeChangeEvent) => void): EventSubscription`

Adds a listener for theme changes. The listener is called whenever:
- The theme is changed via `setTheme()`
- The system theme changes (when app theme is set to `"system"`)

```typescript
const subscription = ThemeChanger.addThemeListener(({ theme, effectiveTheme }) => {
  console.log('Theme changed to:', theme);
  console.log('Effective theme:', effectiveTheme);
});

// Don't forget to remove the listener when done
subscription.remove();
```

**Parameters:**
- `listener`: Callback function that receives a `ThemeChangeEvent`

**Returns:** A subscription object with a `remove()` method

## How It Works

### Theme Modes

1. **Light Mode**: Forces the app to use light theme
2. **Dark Mode**: Forces the app to use dark theme  
3. **System Mode**: Automatically follows the device's system theme and updates in real-time when the system theme changes

### Real-time System Theme Detection

When the theme is set to `"system"`, the module:
- ✅ Automatically detects when the user changes their device theme
- ✅ Emits a theme change event to all listeners
- ✅ Works when the app is in the foreground
- ✅ Checks for changes when the app returns to the foreground

No polling or manual refresh needed! The module uses native APIs:
- **Android**: `ComponentCallbacks2` for configuration changes
- **iOS**: `NotificationCenter` for trait collection changes

## Best Practices

### 1. Set up the listener in your root component

```typescript
useEffect(() => {
  const subscription = ThemeChanger.addThemeListener(handleThemeChange);
  return () => subscription.remove();
}, []);
```

### 2. Initialize state with current values

```typescript
const [theme, setTheme] = useState(ThemeChanger.getTheme());
const [effectiveTheme, setEffectiveTheme] = useState(ThemeChanger.getEffectiveTheme());
```

### 3. Use effectiveTheme for UI styling

Always use `effectiveTheme` (not `theme`) to determine colors and styles, as it resolves "system" to the actual theme.

```typescript
const isDark = effectiveTheme === 'dark';
const backgroundColor = isDark ? '#000' : '#fff';
```

### 4. Persist theme preference

The theme preference is automatically persisted:
- **Android**: Stored in `SharedPreferences`
- **iOS**: Stored in `UserDefaults`

## Example App

Check out the [example app](./example) in this repository for a complete implementation.

## Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/berlinbruno/expo-theme-changer#contributing).

## License

MIT

## Author

**berlinbruno** - [GitHub](https://github.com/berlinbruno)

## Repository

[https://github.com/berlinbruno/expo-theme-changer](https://github.com/berlinbruno/expo-theme-changer)

## Issues

Found a bug or have a feature request? [Open an issue](https://github.com/berlinbruno/expo-theme-changer/issues)
