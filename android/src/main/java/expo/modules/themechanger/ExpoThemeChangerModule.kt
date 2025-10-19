package expo.modules.themechanger

import android.content.Context
import android.content.res.Configuration
import androidx.core.os.bundleOf
import android.content.SharedPreferences
import android.content.ComponentCallbacks2
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoThemeChangerModule : Module() {
  private var lastSystemTheme: String? = null
  private var configCallback: ComponentCallbacks2? = null

  override fun definition() = ModuleDefinition {
    Name("ExpoThemeChanger")

    Events("onChangeTheme")

    OnCreate {
      lastSystemTheme = getCurrentSystemTheme()
      registerConfigurationCallback()
    }

    OnDestroy {
      unregisterConfigurationCallback()
      lastSystemTheme = null
    }

    OnActivityEntersForeground {
      // Check if system theme changed while app was in background
      checkSystemThemeChange()
    }

    Function("setTheme") { theme: String ->
      // Validate theme value
      if (theme !in listOf("light", "dark", "system")) {
        throw IllegalArgumentException("Theme must be 'light', 'dark', or 'system'")
      }
      
      getPreferences().edit().putString("theme", theme).apply()
      this@ExpoThemeChangerModule.sendEvent("onChangeTheme", bundleOf(
        "theme" to theme,
        "effectiveTheme" to getEffectiveTheme(theme)
      ))
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", "system")
    }

    Function("getEffectiveTheme") {
      val savedTheme = getPreferences().getString("theme", "system") ?: "system"
      return@Function getEffectiveTheme(savedTheme)
    }

    Function("getSystemTheme") {
      return@Function getCurrentSystemTheme()
    }
  }

  private val context
    get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }

  private fun getCurrentSystemTheme(): String {
    val nightModeFlags = context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
    return when (nightModeFlags) {
      Configuration.UI_MODE_NIGHT_YES -> "dark"
      Configuration.UI_MODE_NIGHT_NO -> "light"
      else -> "light"
    }
  }

  private fun getEffectiveTheme(theme: String): String {
    return if (theme == "system") {
      getCurrentSystemTheme()
    } else {
      theme
    }
  }

  private fun registerConfigurationCallback() {
    configCallback = object : ComponentCallbacks2 {
      override fun onConfigurationChanged(newConfig: Configuration) {
        checkSystemThemeChange()
      }

      override fun onLowMemory() {}
      override fun onTrimMemory(level: Int) {}
    }
    
    try {
      context.registerComponentCallbacks(configCallback)
    } catch (e: Exception) {
      // Context might not be ready yet
    }
  }

  private fun unregisterConfigurationCallback() {
    configCallback?.let {
      try {
        context.unregisterComponentCallbacks(it)
      } catch (e: Exception) {
        // Context might already be destroyed
      }
    }
    configCallback = null
  }

  private fun checkSystemThemeChange() {
    val currentSystemTheme = getCurrentSystemTheme()
    val savedTheme = getPreferences().getString("theme", "system") ?: "system"
    
    // Only emit event if theme is set to "system" and system theme actually changed
    if (savedTheme == "system" && lastSystemTheme != currentSystemTheme) {
      lastSystemTheme = currentSystemTheme
      this@ExpoThemeChangerModule.sendEvent("onChangeTheme", bundleOf(
        "theme" to "system",
        "effectiveTheme" to currentSystemTheme
      ))
    } else {
      lastSystemTheme = currentSystemTheme
    }
  }
}