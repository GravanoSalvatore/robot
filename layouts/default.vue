<template lang="">
  <div class="">
    <div class="container">
      <NuxtLink style="text-decoration: none; margin-left:" to="/">
        <h5 style="color: cornflowerblue" class="fw-bold pointer my-4 text-center">
          
          <!-- <img
            src="https://cdn.pixabay.com/photo/2016/12/13/21/20/alien-1905155_640.png"
            style="width: 50px"
          /> -->
          4VROBOT<i class="bi bi-telegram"></i>N</h5>
         
          
      </NuxtLink>
    </div>
    <button
      class="theme-toggle-btn"
      @click="themeStore.toggleTheme"
      :title="
        themeStore.isDark
          ? 'Переключить на светлую тему'
          : 'Переключить на тёмную тему'
      "
    >
      <svg
        v-if="!themeStore.isDark"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="yellow"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="theme-icon"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="theme-icon"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
    <!-- <div>
    <h1>{{ $t('welcome') }}</h1>
    <button @click="changeLocale('en')">{{ $t('change_language') }}: English</button>
    <button @click="changeLocale('ru')">{{ $t('change_language') }}: Русский</button>
  </div> -->
    <NuxtPage />
  </div>
</template>
<script>
import { useThemeStore } from "~/stores/useThemeStore";
export default {
  setup() {
    const themeStore = useThemeStore();

    // Инициализация темы
    try {
      themeStore.setThemeFromStorage();
    } catch (error) {
      console.error("Ошибка загрузки темы:", error);
    }

    // Данные для аккордеона

    return {
      themeStore,
    };
  },
};
</script>
<style lang="css" scoped>
.theme-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  position: absolute; /* Абсолютное позиционирование */
  top: 2px; /* Отступ сверху */
  right: 10px; /* Отступ справа */
  z-index: 1000; /* Убедитесь, что кнопка поверх контента */
}

.theme-toggle-btn:hover {
  background-color: rgba(214, 247, 32, 0.1);
}

.dark-theme .theme-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.theme-icon {
  transition: transform 0.3s ease;
  caret-color: yellow;
}

.theme-toggle-btn:hover .theme-icon {
  transform: rotate(30deg);
}
</style>
