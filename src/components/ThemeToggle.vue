<template>
  <div class="relative">
    <button
      type="button"
      class="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :title="`Theme: ${getThemeLabel(theme)}`"
      :aria-label="`Theme switcher, current: ${getThemeLabel(theme)}`"
      @click="toggleDropdown"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="getThemeIcon(currentTheme)"
        />
      </svg>
    </button>

    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      role="menu"
    >
      <div class="py-1">
        <button
          v-for="themeOption in themeOptions"
          :key="themeOption"
          type="button"
          role="menuitem"
          :class="[
            'w-full px-4 py-2 text-left text-sm transition-colors flex items-center space-x-3',
            theme === themeOption
              ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
          @click="handleThemeChange(themeOption)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="getThemeIcon(themeOption)"
            />
          </svg>
          <span>{{ getThemeLabel(themeOption) }}</span>
          <svg
            v-if="theme === themeOption"
            class="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      aria-hidden="true"
      @click="showDropdown = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const themeOptions: Theme[] = ['light', 'dark', 'system']
const theme = ref<Theme>('system')
const systemPrefersDark = ref(false)
const showDropdown = ref(false)

const currentTheme = computed<'light' | 'dark'>(() => {
  if (theme.value === 'system') return systemPrefersDark.value ? 'dark' : 'light'
  return theme.value
})

function applyTheme() {
  const isDark =
    theme.value === 'dark' ||
    (theme.value === 'system' && systemPrefersDark.value)
  document.documentElement.classList.toggle('dark', isDark)
}

function setTheme(newTheme: Theme) {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  applyTheme()
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function handleThemeChange(newTheme: Theme) {
  setTheme(newTheme)
  showDropdown.value = false
}

function getThemeIcon(value: Theme | 'light' | 'dark'): string {
  switch (value) {
    case 'light':
      return 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
    case 'dark':
      return 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
    case 'system':
    default:
      return 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  }
}

function getThemeLabel(value: Theme): string {
  switch (value) {
    case 'light':
      return 'Hell'
    case 'dark':
      return 'Dunkel'
    case 'system':
      return 'System'
  }
}

let mediaQuery: MediaQueryList | null = null

function onSystemChange(e: MediaQueryListEvent) {
  systemPrefersDark.value = e.matches
  applyTheme()
}

onMounted(() => {
  const stored = localStorage.getItem('theme') as Theme | null
  theme.value = stored && themeOptions.includes(stored) ? stored : 'system'
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemPrefersDark.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onSystemChange)
  applyTheme()
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', onSystemChange)
})
</script>
