<template>
  <div v-if="localArticles.length > 0" class="container">
    <!-- Кнопки управления -->
    <!-- Active channel ID: {{ activeChannelId }}   -->
    <div style="position: relative;">
    <button
      :class="['save-tag-btn btn-danger1', { active: isTagSaved }]"
      @click="toggleSaveTag(currentTag)"
    >
      {{ isTagSaved ? "Delete tag" : "Save tag" }}
    </button>
    <button
      @click="sendChatIdAndTagId"
      class="btn-danger1 mt-2 ml-2 fw-bold m-2"
    >
      Autopilot
    </button>
    <button type="button" class="btn-danger1" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Setting
</button>

<!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <!-- <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div> -->
      <div class="modal-body">
        <setting/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-danger1" data-bs-dismiss="modal">Close</button>
        <!-- <button type="button" class="btn btn-primary">Understood</button> -->
      </div>
    </div>
  </div>
</div>
    <i style="position: absolute;right: 0;top:-25px" @click="close" class="bi bi-x-circle pointer"></i>
</div>
    <!-- Список статей -->
    <div class="row row-cols-1 row-cols-md-3 g3 mx-auto m-1">
      <div v-for="item in localArticles" :key="item.id" class="col">
        <div class="card mt-4">
          <!-- Изображение -->
          <img
            v-if="item.urlToImage"
            :src="item.urlToImage"
            class="card-img-top"
          />
          <img v-else :src="image" class="card-img-top" />
          <!-- Заголовок -->
          <input
            v-model="item.title"
            type="text"
            class="form-control mb-2"
            placeholder="Редактировать заголовок"
          />

          <!-- Описание -->
          <textarea
            v-model="item.description"
            class="form-control mb-2"
            placeholder="Редактировать описание"
            rows="3"
          ></textarea>

          <!-- Содержимое -->
          <textarea
            v-model="item.content"
            class="form-control mb-2"
            placeholder="Редактировать содержимое"
            rows="5"
          ></textarea>

          <!-- Дата публикации -->
          <div class="p-1" style="font-size: 10px; border-radius: 2px">
            {{ formatDateTime(item.publishedAt) }}
          </div>

          <!-- Кнопка отправки -->
          <button
            style="font-size: 16px"
            @click="sendToTelegram(item)"
            class="btn-danger3 mt-2 m-1 fw-bold"
          >
            Send to Telegram
            <i style="color: cornflowerblue" class="bi bi-telegram"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "pinia";  
import { useChannelStore } from "@/stores/channelStore";  

export default {
  mounted(){
    this.activeChannelId = this.channelStore.activeChannelId;
    console.log('Mounted, activeChannelId:', this.activeChannelId);

  },
  setup(){
    const channelStore = useChannelStore();  
  channelStore.loadChannels(); // Вызовите метод, который загружает данные из localStorage  
  return { channelStore }; 

  },
  watch: {  
    articles: {
      handler(newArticles) {
        this.localArticles = [...newArticles];
      },
      deep: true,
    },
  activeChannelId(newVal) {  
    console.log('ActiveChannelId changed:', newVal);  
  },  
},  
  created() {  
  // Инициализируем хранилище каналов  
  this.channelStore = useChannelStore();  
  console.log('Created, activeChannelId:', this.activeChannelId);  
} ,
  props: {
    articles: {
      type: Array,
      required: true,
    },
    sendToTelegram: {
      type: Function,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    // chatId: {
    //   type: String,
    //   required: true,
    // },
    closed: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      activeChannelId: null,
      currentTag: "",
      localArticles: [...this.articles], // Локальная копия статей для редактирования
    };
  },
  // watch: {
  //   articles: {
  //     handler(newArticles) {
  //       this.localArticles = [...newArticles];
  //     },
  //     deep: true,
  //   },
  // },
  computed: {
    activeChannelId() {  
      return this.channelStore.activeChannelId;  
    } ,
    ...mapState(useCategoryStore, [
      "botToken",
      "savedTags",
      "tagSearch",
      "selectedCategory",
      "tags",
     
    ]),
    isTagSaved() {
      return this.savedTags.includes(this.currentTag);
    },
  },
  methods: {
    sendToTelegram(item) {  
  const chatId = this.activeChannelId;  

  if (!chatId) {  
    console.error("Ошибка: activeChannelId не установлен.");  
    alert("Ошибка: канал для отправки сообщений не выбран.");  
    return;  
  }  

  const botToken = this.botToken;  
  const message = `<b>${item.title}</b>\n<a href="${item.url}">Перейти на сайт</a>`;  
  const data = {  
    chat_id: chatId,  
    text: message,  
    parse_mode: "HTML",  
  };  

  axios  
    .post(`https://api.telegram.org/bot${botToken}/sendMessage`, data)  
    .then((response) => {  
      console.log("Сообщение успешно отправлено в Telegram:", response.data);  
      alert("Сообщение успешно отправлено в Telegram!");  
    })  
    .catch((error) => {  
      console.error("Ошибка при отправке сообщения в Telegram:", error.response.data);  
      alert("Ошибка при отправке сообщения в Telegram: " + error.response.data.description);  
    });  
}, 

    ...mapActions(useChannelStore, ["toggleSaveTag"]),  
    close() {  
      this.localArticles = [];  
    },  

   
    // close() {
    //   this.localArticles = [];
    // },
    toggleSaveTag(tag) {
      const store = useCategoryStore();
      store.toggleSaveTag(tag);
    },
    formatDateTime(dateTime) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      return new Date(dateTime).toLocaleString("en-US", options);
    },
    
    // sendToTelegram(item) {
    //   const chatId = this.chatId;
    //   const botToken = this.botToken;

    //   if (!chatId) {
    //     alert("Chat ID отсутствует!");
    //     return;
    //   }

    //   // Формируем сообщение с редактированными данными
    //   const message = `<b>${item.title}</b>\n${item.description}\n${item.content}\n<a href="${item.url}">Перейти на сайт</a>`;
    //   const data = {
    //     chat_id: chatId,
    //     text: message,
    //     parse_mode: "HTML",
    //   };

    //   // Отправляем сообщение
    //   axios
    //     .post(`https://api.telegram.org/bot${botToken}/sendMessage`, data)
    //     .then((response) => {
    //       console.log("Сообщение успешно отправлено:", response.data);
    //       alert("Сообщение успешно отправлено!");
    //     })
    //     .catch((error) => {
    //       console.error("Ошибка отправки сообщения:", error.response.data);
    //       alert("Ошибка при отправке: " + error.response.data.description);
    //     });
    // }
   
  },
};
</script>

<style scoped>
.overflow1 {
  overflow-x: hidden;
  overflow-y: auto;
  height: 135px;
}
a {
  text-decoration: none;
}
.save-tag-btn.active {
  background-color: #f93402;
}
.form-control {
  width: 100%;
  margin-bottom: 10px;
}

.card-img-top {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
</style>
