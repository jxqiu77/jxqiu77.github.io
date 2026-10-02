;(function() {
  var root = document.documentElement
  var storageKey = 'homepage-theme'
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  var preference = null
  var button

  try {
    preference = window.localStorage.getItem(storageKey)
  } catch (error) {
    // Use the system theme when storage is unavailable.
  }

  if (preference !== 'light' && preference !== 'dark') {
    preference = null
  }

  function applyTheme() {
    var theme = preference || (systemTheme.matches ? 'dark' : 'light')
    var isDark = theme === 'dark'
    root.setAttribute('data-theme', theme)

    if (button) {
      var label = isDark ? 'Switch to light mode' : 'Switch to dark mode'
      button.setAttribute('aria-label', label)
      button.setAttribute('title', label)
      button.setAttribute('aria-pressed', String(isDark))
      button.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon'
    }

    document.dispatchEvent(new CustomEvent('themechange'))
  }

  applyTheme()

  document.addEventListener('DOMContentLoaded', function() {
    button = document.getElementById('theme-toggle')
    if (!button) {
      return
    }

    button.addEventListener('click', function() {
      preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(storageKey, preference)
      } catch (error) {
        // Keep the selected theme for this visit when storage is unavailable.
      }
      applyTheme()
    })

    applyTheme()
    button.hidden = false
  })

  function followSystemTheme() {
    if (!preference) {
      applyTheme()
    }
  }

  if (systemTheme.addEventListener) {
    systemTheme.addEventListener('change', followSystemTheme)
  } else {
    systemTheme.addListener(followSystemTheme)
  }
})()
