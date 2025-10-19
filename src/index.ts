import { EventEmitter, EventSubscription } from "expo-modules-core";

import ExpoThemeChangerModule from "./ExpoThemeChangerModule";

export type Theme = "light" | "dark" | "system";

export type ThemeChangeEvent = {
  theme: Theme;
  effectiveTheme: "light" | "dark";
};

type ThemeChangerEvents = {
  onChangeTheme: (event: ThemeChangeEvent) => void;
};

const emitter = new EventEmitter<ThemeChangerEvents>(ExpoThemeChangerModule);

/**
 * Add a listener for theme changes
 * @param listener - Callback function that receives the theme change event
 * @returns Subscription object with a remove() method to unsubscribe
 */
export function addThemeListener(
  listener: (event: ThemeChangeEvent) => void
): EventSubscription {
  return emitter.addListener("onChangeTheme", listener);
}

/**
 * Get the current theme setting ("light", "dark", or "system")
 * @returns The current theme setting
 */
export function getTheme(): Theme {
  return ExpoThemeChangerModule.getTheme();
}

/**
 * Set the theme preference
 * @param theme - Theme to set: "light", "dark", or "system"
 */
export function setTheme(theme: Theme): void {
  return ExpoThemeChangerModule.setTheme(theme);
}

/**
 * Get the effective theme that is currently applied
 * If theme is set to "system", this returns the actual system theme ("light" or "dark")
 * @returns The effective theme ("light" or "dark")
 */
export function getEffectiveTheme(): "light" | "dark" {
  return ExpoThemeChangerModule.getEffectiveTheme();
}

/**
 * Get the current system theme
 * @returns The system theme ("light" or "dark")
 */
export function getSystemTheme(): "light" | "dark" {
  return ExpoThemeChangerModule.getSystemTheme();
}