import { defineStore } from "pinia";
import axios from "axios";

export const useTopTagsStore = defineStore("topTagsStore", {
  state: () => ({
    tags: [],
    news: [],
    loadingTags: false,
    loadingNews: false,
    loading: false,
    sortOption: "popularity",
    progress: 0,
    image: "", // Замените на URL изображения-заглушки
    botToken: "6903896787:AAG-rPGukp422cw17k4y17UsJUiDMl5tdbc", // Замените на ваш токен бота
    // chatId:'-1002272715205',
    savedTags: [],
    currentTag: "",
  }),
  getters: {
    isTagSaved(state) {
      return state.savedTags.includes(state.currentTag);
    },
    sortedTags(state) {
      if (!state.tags || state.tags.length === 0) {
        console.error("Нет данных для сортировки тегов.");
        return [];
      }
      if (state.sortOption === "popularity") {
        return [...state.tags].sort((a, b) => b.popularity - a.popularity);
      } else {
        return [...state.tags].sort((a, b) => a.name.localeCompare(b.name));
      }
    },
  },
  actions: {
    loadSavedTags() {
      const saved = localStorage.getItem("savedTags");
      if (saved) {
        this.savedTags = JSON.parse(saved);
      }
    },
    toggleSaveTag(tag) {
      if (this.isTagSaved) {
        this.savedTags = this.savedTags.filter((savedTag) => savedTag !== tag);
        localStorage.setItem("savedTags", JSON.stringify(this.savedTags));
        console.log("Тег удалён:", tag);
      } else {
        this.savedTags.push(tag);
        localStorage.setItem("savedTags", JSON.stringify(this.savedTags));
        console.log("Тег сохранён:", tag);
      }
    },
    async fetchTags() {
      // if (this.query.trim() === "") {
      //   this.tags = [];
      //   this.news = [];
      //   return;
      // }

      this.loading = true;
      this.tags = [];
      this.progress = 0;

      try {
        let page = 1;
        let totalFetched = 0;
        const pageSize = 100; // Размер страницы
        const maxTags = 1000; // Максимальное количество тегов, которое нужно получить

        while (totalFetched < maxTags) {
          const response = await axios.get(
            `https://4v-news-api.azurewebsites.net/Tags/Search`,
            {
              params: {
                SiteId: 1,
                Page: page,
                PageSize: pageSize,
                Query: this.query,
              },
            }
          );

          const fetchedTags = response.data.items;
          this.tags.push(...fetchedTags); // Добавляем полученные теги в массив
          totalFetched += fetchedTags.length; // Обновляем общее количество полученных тегов

          if (fetchedTags.length < pageSize) {
            // Если меньше, чем размер страницы, значит, больше тегов нет
            break;
          }

          page++; // Переходим к следующей странице
        }

        this.totalTags = totalFetched; // Обновляем общее количество тегов
        this.progress = 100; // Устанавливаем прогресс на 100%
      } catch (error) {
        console.error("Ошибка при поиске тегов:", error);
        this.tags = [];
      } finally {
        this.loading = false;
      }
    },

    // async fetchTags() {
    //   this.loadingTags = true; // Показываем индикатор загрузки тегов
    //   try {
    //     const response = await axios.get('https://4v-news-api.azurewebsites.net/Tags/Search', {
    //       params: {
    //         SiteId: 1,
    //         Page: 1,
    //         PageSize: 100,
    //       },
    //     });
    //     if (response.data && response.data.items) {
    //       this.tags = response.data.items.filter(tag => tag.name !== "0");
    //     } else {
    //       console.error("Теги не найдены:", response);
    //     }
    //   } catch (error) {
    //     console.error("Ошибка при загрузке тегов:", error);
    //     this.tags = [];
    //   } finally {
    //     this.loadingTags = false; // Скрываем индикатор загрузки тегов
    //   }
    // },

    async fetchNews(tagName) {
      this.loadingNews = true; // Показываем индикатор загрузки новостей
      this.currentTag = tagName;
      try {
        const response = await axios.get(
          "https://4v-news-api.azurewebsites.net/News",
          {
            params: {
              SiteId: 1,
              Tags: tagName,
              Page: 1,
              PageSize: 100,
            },
          }
        );
        this.news = response.data.items || [];
      } catch (error) {
        console.error("Ошибка при загрузке новостей:", error);
        this.news = [];
      } finally {
        this.loadingNews = false; // Скрываем индикатор загрузки новостей
      }
    },

    sendToTelegram(item, chatId) {
      if (!chatId) {
        console.error("chatId отсутствует!"); // Логирование в случае отсутствия chatId
        return;
      }

      const message = `<b>${item.title}</b>\n${item.description}\n<a href="${item.url}">Читать полностью</a>`;
      const data = {
        chat_id: chatId,
        text: `*${item.title}*\n\n${item.content}\n\n[Читать далее](${item.url})`,
        parse_mode: "Markdown",
      };

      console.log("Отправка сообщения в Telegram. Chat ID:", chatId); // Лог chat_id
      console.log("Данные сообщения:", data); // Лог данных для отправки

      axios
        .post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, data)
        .then((response) => {
          console.log(
            "Сообщение успешно отправлено в телеграм:",
            response.data
          );
          alert("Сообщение успешно отправлено в телеграм");
        })
        .catch((error) => {
          console.error(
            "Ошибка при отправке сообщения в телеграм:",
            error.response.data
          );
          console.log("Статус ошибки:", error.response.status); // Лог статуса ошибки
          console.log("Описание ошибки:", error.response.data.description); // Лог описания ошибки
          alert(
            "Ошибка при отправке сообщения в телеграм: " +
              error.response.data.description
          );
        });
    },

    clearNews() {
      this.news = [];
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleString();
    },
    updateSortOption(option) {
      this.sortOption = option;
    },
    smoothProgress(targetValue) {
      const step = () => {
        if (this.progress < targetValue) {
          this.progress += 1;
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    },
    scrollToTop(tagsList) {
      if (tagsList) {
        tagsList.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
  },
});
