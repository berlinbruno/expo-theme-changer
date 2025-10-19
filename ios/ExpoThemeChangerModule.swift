import ExpoModulesCore
import UIKit

public class ExpoThemeChangerModule: Module {
  private var lastSystemTheme: String?
  
  public func definition() -> ModuleDefinition {
    Name("ExpoThemeChanger")

    Events("onChangeTheme")

    OnCreate {
      self.lastSystemTheme = self.getCurrentSystemTheme()
      self.startObservingTraitChanges()
    }

    OnDestroy {
      self.stopObservingTraitChanges()
      self.lastSystemTheme = nil
    }

    OnAppEntersForeground {
      self.checkSystemThemeChange()
    }

    Function("setTheme") { (theme: String) -> Void in
      // Validate theme value
      let validThemes = ["light", "dark", "system"]
      guard validThemes.contains(theme) else {
        throw NSError(domain: "ExpoThemeChanger", code: 1, 
                     userInfo: [NSLocalizedDescriptionKey: "Theme must be 'light', 'dark', or 'system'"])
      }
      
      UserDefaults.standard.set(theme, forKey: "theme")
      self.sendEvent("onChangeTheme", [
        "theme": theme,
        "effectiveTheme": self.getEffectiveTheme(theme: theme)
      ])
    }
    
    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? "system"
    }

    Function("getEffectiveTheme") { () -> String in
      let savedTheme = UserDefaults.standard.string(forKey: "theme") ?? "system"
      return self.getEffectiveTheme(theme: savedTheme)
    }

    Function("getSystemTheme") { () -> String in
      return self.getCurrentSystemTheme()
    }
  }

  private func getCurrentSystemTheme() -> String {
    if #available(iOS 13.0, *) {
      // Get the key window's trait collection for accurate theme detection
      if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
         let window = windowScene.windows.first {
        switch window.traitCollection.userInterfaceStyle {
        case .dark:
          return "dark"
        case .light:
          return "light"
        default:
          return "light"
        }
      }
      // Fallback to UITraitCollection.current
      switch UITraitCollection.current.userInterfaceStyle {
      case .dark:
        return "dark"
      case .light:
        return "light"
      default:
        return "light"
      }
    } else {
      return "light"
    }
  }

  private func getEffectiveTheme(theme: String) -> String {
    if theme == "system" {
      return getCurrentSystemTheme()
    } else {
      return theme
    }
  }

  private func startObservingTraitChanges() {
    if #available(iOS 13.0, *) {
      NotificationCenter.default.addObserver(
        forName: UIScene.didActivateNotification,
        object: nil,
        queue: .main
      ) { [weak self] _ in
        self?.checkSystemThemeChange()
      }
    }
  }

  private func stopObservingTraitChanges() {
    NotificationCenter.default.removeObserver(self)
  }

  private func checkSystemThemeChange() {
    let currentSystemTheme = getCurrentSystemTheme()
    let savedTheme = UserDefaults.standard.string(forKey: "theme") ?? "system"
    
    // Only emit event if theme is set to "system" and system theme actually changed
    if savedTheme == "system" && lastSystemTheme != currentSystemTheme {
      lastSystemTheme = currentSystemTheme
      sendEvent("onChangeTheme", [
        "theme": "system",
        "effectiveTheme": currentSystemTheme
      ])
    } else {
      lastSystemTheme = currentSystemTheme
    }
  }
}