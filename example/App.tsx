import * as ThemeChanger from "expo-theme-changer";
import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";

export default function App() {
  const [themeSetting, setThemeSetting] = useState<string>(ThemeChanger.getTheme());
  const [effectiveTheme, setEffectiveTheme] = useState<string>(ThemeChanger.getEffectiveTheme());
  const [systemTheme, setSystemTheme] = useState<string>(ThemeChanger.getSystemTheme());

  useEffect(() => {
    const subscription = ThemeChanger.addThemeListener(({ theme, effectiveTheme: newEffective }) => {
      setThemeSetting(theme);
      setEffectiveTheme(newEffective);
      setSystemTheme(ThemeChanger.getSystemTheme());
    });

    return () => subscription.remove();
  }, []);

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(themeSetting as any);
    const nextIndex = (currentIndex + 1) % themes.length;
    ThemeChanger.setTheme(themes[nextIndex]);
  };

  const isDark = effectiveTheme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      <Text style={[styles.text, { color: isDark ? "#fff" : "#000" }]}>
        Theme Setting: {themeSetting}
      </Text>
      <Text style={[styles.subText, { color: isDark ? "#ccc" : "#666" }]}>
        Effective Theme: {effectiveTheme}
      </Text>
      <Text style={[styles.subText, { color: isDark ? "#ccc" : "#666" }]}>
        System Theme: {systemTheme}
      </Text>
      <Button
        title={`Switch to ${themeSetting === "light" ? "dark" : themeSetting === "dark" ? "system" : "light"}`}
        onPress={cycleTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    marginBottom: 4,
  },
});