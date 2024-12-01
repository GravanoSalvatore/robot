export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      document.body.classList.toggle('dark-theme', this.isDark);
      document.body.classList.toggle('light-theme', !this.isDark);
      // Добавляем установку темы для Bootstrap
      document.documentElement.setAttribute('data-bs-theme', this.isDark ? 'dark' : 'light');
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      }
    },
    setThemeFromStorage() {
      if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
          this.isDark = true;
          document.body.classList.add('dark-theme');
          document.body.classList.remove('light-theme');
          document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
          this.isDark = false;
          document.body.classList.add('light-theme');
          document.body.classList.remove('dark-theme');
          document.documentElement.setAttribute('data-bs-theme', 'light');
        }
      }
    }
  }
});