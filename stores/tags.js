import { defineStore } from 'pinia';
import axios from 'axios';

export const useTagStore = defineStore('tagStore', {
  state: () => ({
    query: "",
    tags: [],
    news: [],
    totalTags: 0,
    loading: false,
    sortOption: "popularity",
    progress: 0,
    image: "", // Замените на URL изображения-заглушки
    botToken: "6903896787:AAG-rPGukp422cw17k4y17UsJUiDMl5tdbc", // Замените на ваш токен бота
    savedTags: [],
    currentTag: "",
  }),
  getters: {
    isTagSaved(state) {
      return state.savedTags.includes(state.currentTag);
    },
    sortedTags(state) {
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
    // async searchTags() {
    //   if (this.query.trim() === "") {
    //     this.tags = [];
    //     this.news = [];
    //     return;
    //   }

    //   this.loading = true;
    //   this.tags = [];
    //   this.progress = 0;

    //   try {
    //     const promises = [];
    //     for (let page = 1; page <= 50; page++) {
    //       const promise = axios.get(`https://4v-news-api.azurewebsites.net/Tags/Search`, {
    //         params: {
    //           SiteId: 1,
    //           Page: page,
    //           PageSize: 100,
    //           Query: this.query,
    //         },
    //       });
    //       promises.push(promise);
    //     }

    //     const responses = await Promise.all(promises);
    //     responses.forEach((response, index) => {
    //       if (index === 0) {
    //         this.totalTags = response.data.totalItemsCount;
    //       }
    //       this.tags.push(...response.data.items);
    //       this.progress = Math.min((this.tags.length / this.totalTags) * 100, 100);
    //     });

    //     this.smoothProgress(100);
    //   } catch (error) {
    //     console.error("Ошибка при поиске тегов:", error);
    //     this.tags = [];
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async searchTags() {
      if (this.query.trim() === "") {
        this.tags = [];
        this.news = [];
        return;
      }
    
      this.loading = true;
      this.tags = [];
      this.progress = 0;
    
      try {
        let page = 1;
        let totalFetched = 0;
        const pageSize = 100; // Размер страницы
        const maxTags = 1000; // Максимальное количество тегов, которое нужно получить
    
        while (totalFetched < maxTags) {
          const response = await axios.get(`https://4v-news-api.azurewebsites.net/Tags/Search`, {
            params: {
              SiteId: 1,
              Page: page,
              PageSize: pageSize,
              Query: this.query,
            },
          });
    
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
    
    // async fetchNews(tagName) {
    //   this.loading = true;
    //   this.currentTag = tagName;

    //   try {
    //     const response = await axios.get(
    //       `https://4v-news-api.azurewebsites.net/News`,
    //       {
    //         params: {
    //           SiteId: 1,
    //           Tags: tagName,
    //           Page: 1,
    //           PageSize: 100,
    //         },
    //       }
    //     );

    //     this.news = response.data.items;
    //   } catch (error) {
    //     console.error("Ошибка при получении новостей:", error);
    //     this.news = [];
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async fetchNews(tagName) {
      try {
        const response = await axios.get("https://4v-news-api.azurewebsites.net/News", {
          params: {
            SiteId: 1,
            Tags: tagName,
            Page: 1,
            PageSize: 100,
          },
        });
    
        const newItems = response.data.items;
    
        // Проверяем новые новости
        const newNews = newItems.filter(
          (item) => !this.news.some((existing) => existing.id === item.id)
        );
    
        this.news = newItems;
    
        // Если автопилот включён и есть новые новости
        if (this.isAutopilotEnabled && newNews.length > 0) {
          newNews.forEach((newsItem) => {
            this.sendToTelegram(newsItem, this.activeChannelId);
          });
        }
      } catch (error) {
        console.error("Ошибка при получении новостей:", error);
      }
    }
,    
    sendToTelegram(item, chatId) {  
      const data = {  
        chat_id: chatId,  
        text: `<b>${item.title}</b>\n${item.description ? item.description : ''}\n\n${item.content ? item.content : ''}\n<a href="${item.url}">Читать полностью</a>`,  
        parse_mode: "HTML",  
      };  
    
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

// import { defineStore } from 'pinia';
// import axios from 'axios';

// export const useTagStore = defineStore('tagStore', {
//   state: () => ({
//     query: "",
//     tags: [],
//     news: [],
//     totalTags: 0,
//     loading: false,
//     sortOption: "popularity",
//     progress: 0,
//     image: "", // Замените на URL изображения-заглушки
//     botToken: "6903896787:AAG-rPGukp422cw17k4y17UsJUiDMl5tdbc", // Ваш токен бота
//     savedTags: [],
//     currentTag: "",
//     autopilotTag: null, // Тег, для которого включён автопилот
//     autopilotNewsSent: new Set(), // ID уже отправленных новостей
//     isAutopilotEnabled: false, // Флаг включения автопилота
//     autopilotInterval: null, // ID интервала автопилота
//   }),
//   getters: {
//     isTagSaved(state) {
//       return state.savedTags.includes(state.currentTag);
//     },
//     sortedTags(state) {
//       if (state.sortOption === "popularity") {
//         return [...state.tags].sort((a, b) => b.popularity - a.popularity);
//       } else {
//         return [...state.tags].sort((a, b) => a.name.localeCompare(b.name));
//       }
//     },
//   },
//   actions: {
//     loadSavedTags() {
//       const saved = localStorage.getItem("savedTags");
//       if (saved) {
//         this.savedTags = JSON.parse(saved);
//       }
//     },
//     toggleSaveTag(tag) {
//       if (this.isTagSaved) {
//         this.savedTags = this.savedTags.filter((savedTag) => savedTag !== tag);
//         localStorage.setItem("savedTags", JSON.stringify(this.savedTags));
//         console.log("Тег удалён:", tag);
//       } else {
//         this.savedTags.push(tag);
//         localStorage.setItem("savedTags", JSON.stringify(this.savedTags));
//         console.log("Тег сохранён:", tag);
//       }
//     },
//     async searchTags() {
//       if (!this.query || this.query.trim().length < 2) { 
//         // Проверяем, чтобы Query был заполнен и имел хотя бы 2 символа
//         console.error("Ошибка: слишком короткий или пустой запрос.");
//         return;
//       }
    
//       this.loading = true;
//       this.tags = [];
//       this.progress = 0;
    
//       try {
//         const response = await axios.get(`https://4v-news-api.azurewebsites.net/Tags/Search`, {
//           params: {
//             SiteId: 1,
//             Page: 1, // Обязательный параметр Page
//             PageSize: 100,
//             Query: this.query,
//           },
//         });
    
//         this.tags = response.data.items || [];
//       } catch (error) {
//         console.error("Ошибка при поиске тегов:", error.response?.data || error.message);
//       } finally {
//         this.loading = false;
//       }
//     }
// ,    
//     async fetchNews(tagName) {
//       this.loading = true;
//       try {
//         const response = await axios.get("https://4v-news-api.azurewebsites.net/News", {
//           params: {
//             SiteId: 1,
//             Tags: tagName,
//             Page: 1,
//             PageSize: 100,
//           },
//         });

//         const newItems = response.data.items || [];

//         // Отфильтруем только новые новости
//         const newNews = newItems.filter(
//           (item) => !this.news.some((existing) => existing.id === item.id)
//         );

//         this.news = newItems;

//         // Если автопилот включен, отправляем только новые новости
//         if (this.isAutopilotEnabled && this.autopilotTag === tagName) {
//           newNews.forEach((newsItem) => {
//             if (!this.autopilotNewsSent.has(newsItem.id)) {
//               this.sendToTelegram(newsItem, this.activeChannelId);
//               this.autopilotNewsSent.add(newsItem.id); // Помечаем как отправленное
//             }
//           });
//         }
//       } catch (error) {
//         console.error("Ошибка при получении новостей:", error);
//       } finally {
//         this.loading = false;
//       }
//     },
//     toggleAutopilot(tagName, channelId) {
//       if (this.isAutopilotEnabled) {
//         this.stopAutopilot();
//         console.log("Автопилот выключен");
//       } else {
//         this.startAutopilot(tagName, channelId);
//         console.log(`Автопилот включен для тега: ${tagName}`);
//       }
//     },
//     startAutopilot(tagName, channelId) {
//       this.isAutopilotEnabled = true;
//       this.autopilotTag = tagName;
//       this.activeChannelId = channelId;
//       this.autopilotNewsSent.clear(); // Сбрасываем список отправленных новостей

//       this.autopilotInterval = setInterval(async () => {
//         await this.fetchNews(tagName); // Обновляем новости для активного тега
//       }, 60000); // Интервал проверки новых новостей (60 секунд)
//     },
//     stopAutopilot() {
//       this.isAutopilotEnabled = false;
//       this.autopilotTag = null;
//       if (this.autopilotInterval) {
//         clearInterval(this.autopilotInterval);
//         this.autopilotInterval = null;
//       }
//     },
//     sendToTelegram(item, chatId) {
//       if (!chatId) {
//         console.error("ID канала не указан!");
//         return;
//       }

//       const data = {
//         chat_id: chatId,
//         text: `<b>${item.title}</b>\n${item.description || ''}\n<a href="${item.url}">Читать полностью</a>`,
//         parse_mode: "HTML",
//       };

//       axios
//         .post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, data)
//         .then(() => {
//           console.log(`Новость "${item.title}" отправлена в Telegram.`);
//         })
//         .catch((error) => {
//           console.error("Ошибка при отправке сообщения в Telegram:", error);
//         });
//     },
//     clearNews() {
//       this.news = [];
//     },
//     formatDateTime(dateTime) {
//       const date = new Date(dateTime);
//       return date.toLocaleString();
//     },
//     updateSortOption(option) {
//       this.sortOption = option;
//     },
//     smoothProgress(targetValue) {
//       const step = () => {
//         if (this.progress < targetValue) {
//           this.progress += 1;
//           requestAnimationFrame(step);
//         }
//       };
//       requestAnimationFrame(step);
//     },
//     scrollToTop(tagsList) {
//       if (tagsList) {
//         tagsList.scrollTo({
//           top: 0,
//           behavior: "smooth",
//         });
//       }
//     },
//   },
// });
