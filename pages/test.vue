<template>
    <div class="container my-4">
      <!-- <div class="text-center mb-4">
        <button @click="fetchNews" class="btn btn-primary">Загрузить новости</button>
      </div> -->
      <div class="row">
        <div
          class="col-12 col-md-6 col-lg-4 mb-4"
          v-for="(newsItem, index) in news"
          :key="index"
        >
          <div class="card h-100 shadow-sm">
            <img
              v-if="newsItem.urlToImage"
              :src="newsItem.urlToImage"
              class="card-img-top"
              alt="News Image"
            />
            <div class="card-body">
              <h5 class="card-title">{{ newsItem.title }}</h5>
              <p class="card-text">{{ newsItem.content }}</p>
            </div>
            <div class="card-footer text-center">
              <button @click="sendToTelegram(newsItem)" class="btn btn-outline-primary btn-sm">
                Отправить в Telegram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        news: [],
      };
    },
    mounted() {
      this.fetchNews();
    },
    methods: {
      async fetchNews() {
        console.log("Загрузка новостей...");
        try {
          const response = await axios.get(
            "https://4v-news-api.azurewebsites.net/News?SiteId=1&CategoryId=16&Page=1&PageSize=100"
          );
          this.news = response.data.items;
          console.log("Новости загружены успешно:", this.news);
        } catch (error) {
          console.error("Ошибка при загрузке новостей:", error);
        }
      },
      async sendToTelegram(newsItem) {
        const botToken = "6689128498:AAEVSIZpwIrdIy6Pr8YIrjFclFt7xxCYpoY";
        const chatId = "-1002133325378";
  
        try {
          const response = await axios.post(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              chat_id: chatId,
              text: `*${newsItem.title}*\n\n${newsItem.content}\n\n[Читать далее](${newsItem.url})`,
              parse_mode: "Markdown",
            }
          );
          alert("Отправлено");
          console.log("Сообщение отправлено в Telegram:", response.data);
        } catch (error) {
          console.error("Ошибка отправки в Telegram:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .card {
    border-radius: 10px;
    overflow: hidden;
  }
  .card-img-top {
    max-height: 200px;
    object-fit: cover;
  }
  .card-title {
    font-size: 1.1rem;
    font-weight: bold;
  }
  .card-text {
    font-size: 0.9rem;
    color: #555;
  }
  .btn-outline-primary {
    width: 100%;
  }
  </style>
  