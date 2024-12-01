<template>
  <div class="container">
    <!-- Active channel ID: {{ activeChannelId }}   -->
    <div class="categories">
      <crypto v-if="selectedCategory === 'Криптовалюты'" />
      <button
        class=" btn-danger3 "
        @click="selectCategory('Новости')"
      >News
        <!-- {{ $t("news") }} -->
      </button>
      <button
        class=" btn-danger3"
        @click="selectCategory('Здоровье')"
      >Health
        <!-- {{ $t("health") }} -->
      </button>
      <button
        class=" btn-danger3"
        @click="selectCategory('Криптовалюты')"
      >Cryptocurrency
        <!-- {{ $t("cryptocurrency") }} -->
      </button>
      
      
      <button class=" btn-danger3" @click="selectCategory('Бизнес')">
        <!-- {{ $t("business") }} -->Business
      </button>
      <button class=" btn-danger3" @click="selectCategory('Спорт')">
        <!-- {{ $t("sport") }} -->Sport
      </button>
      <button
        class=" btn-danger3"
        @click="selectCategory('Технологии')"
      >
        <!-- {{ $t("technology") }} -->Technology
      </button>
      <button
        class=" btn-danger3"
        @click="selectCategory('Политика')"
      >
        <!-- {{ $t("policy") }} -->Policy
      </button>
      <button class=" btn-danger3" @click="selectCategory('IT')">
        Internet technologies
      </button>
      <button
        class=" btn-danger3"
        @click="selectCategory('Развлечения')"
      >
        <!-- {{ $t("entertainment") }} -->Entertainment
      </button>
      <button class=" btn-danger3" @click="selectCategory('Наука')">
        <!-- {{ $t("science") }} -->Science
      </button>
    </div>
    <div v-if="selectedCategory">
     
     <div class="container" style="">
      <v-btn
        v-if="languageAvailable(selectedCategory, 52)"
        class="language-btn  fw-bold "
        @click="selectLanguage(52)"
        >Русский</v-btn
      >
      <v-btn
        v-if="languageAvailable(selectedCategory, 14)"
        class="language-btn  fw-bold "
        @click="selectLanguage(14)"
        >English</v-btn
      >
      <v-btn
        v-if="languageAvailable(selectedCategory, 65)"
        class="language-btn  fw-bold "
        @click="selectLanguage(65)"
        >Українська</v-btn
      >
      <v-btn
        v-if="languageAvailable(selectedCategory, 45)"
        class="language-btn  fw-bold "
        @click="selectLanguage(45)"
        >Nederlands</v-btn
      >
      <v-btn
        v-if="languageAvailable(selectedCategory, 13)"
        class="language-btn  fw-bold "
        @click="selectLanguage(13)"
        >Немецкий</v-btn
      >
    </div>
    </div>
<br/>
    <div v-if="selectedLanguage">
      <v-text-field
        variant="underlined"
        bg-color="dark"
        type="text"
        v-model="tagSearch"
        placeholder="Поиск тегов"
        class="tag-search text-white"
      ></v-text-field>
      <div class="over tags-lis">
        
        <div class="">
          
          <button
            style="font-size: 12px"
            class="btn-danger2"
            v-for="tag in sortedFilteredTags"
            :key="tag"
            @click="fetchData(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>

    
     
      <br />
     

   

      <news-list  
  v-if="isNewsVisible"  
  :articles="articles"  
 
  :sendToTelegram="sendToTelegram"  
  :image="image"  
  :closed="closed"  
/>
  </div>
</template>

<script>
;
import axios from "axios";

 import SavedTagsMenu from "../components/SavedTagsMenu.vue";
import NewsList from "../components/NewsList.vue";
import { useCategoryStore } from '../stores/categories'; // Импортируем созданный магазин
import { useChannelStore } from '../stores/channelStore';
import { mapState, mapActions } from 'pinia';

export default {
  setup(){
    const channelStore = useChannelStore();  
  channelStore.loadChannels(); // Вызовите метод, который загружает данные из localStorage  
  return { channelStore }; 

  },
  watch: {  
  activeChannelId(newVal) {  
    console.log('ActiveChannelId changed:', newVal);  
  },  
},  
  created() {  
  // Инициализируем хранилище каналов  
  this.channelStore = useChannelStore();  
  console.log('Created, activeChannelId:', this.activeChannelId);  
} ,
  components: { 
      // closed, 
      // crypto,
      SavedTagsMenu, 
      NewsList, 
      // editor 
  },
  data() {
    return {
      // channelStore: useChannelStore() ,
      isNewsVisible: false, // Изначально новости и кнопка скрыты
    currentTag: "", 
      // image:
      //   "https://img.freepik.com/free-photo/3d-rendering-illustration-letter-blocks-forming-word-news-white-background_181624-60840.jpg",
      // currentPage: 1,
      // pageSize: 60,
      // showEditor: false,
      // currentTag: "",
      // items: [],
    };
  },
  // props: {
  //   chatId: {
  //     type: String,
  //     required: true,
  //   },
  // },
  computed: {
    activeChannelId() {  
      return this.channelStore.activeChannelId;  
    } ,
    ...mapState(useCategoryStore, ['botToken', 'articles', 'tagSearch', 'selectedCategory', 'selectedLanguage', 'tags', 'scienceEn', 'itRu', 'techEn', 'newsUa', 'newsEn', 'newsRuUa', 'businessNl', 'cryptoRu', 'savedTags']),
    sortedFilteredTags() {
      return (this.filteredTags || []).sort((a, b) => a.localeCompare(b));
    },
    filteredTags() {
      return (this.tags || []).filter((tag) =>
        tag.toLowerCase().includes(this.tagSearch.toLowerCase())
      );
    },
    isTagSaved() {
      return this.savedTags.includes(this.currentTag);
    },
  },
  mounted() {
    console.log('Mounted, activeChannelId:', this.activeChannelId);  
    this.loadSavedTags();
  },
  methods: {
    ...mapActions(useCategoryStore, ['selectCategory', 'selectLanguage', 'fetchData', 'toggleSaveTag', 'loadSavedTags', 'removeTag']),
    handleNewsSelected(news) {
      this.selectedNews = news;
    },

    switchLanguage(lang) {
      this.$i18n.locale = lang;
    },
 
  sendToTelegram(item) {
  const chatId = this.chatId;
  console.log("Chat ID при вызове sendToTelegram:", chatId);

  if (!chatId) {
    console.error("Chat ID пустой, сообщение не будет отправлено.");
    alert("Ошибка: chat ID не установлен.");
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
      console.log("Сообщение успешно отправлено в телеграм:", response.data);
      alert("Сообщение успешно отправлено в телеграм");
    })
    .catch((error) => {
      console.error("Ошибка при отправке сообщения в телеграм:", error.response.data);
      alert("Ошибка при отправке сообщения в телеграм: " + error.response.data.description);
    });
},

    languageAvailable(category, languageId) {
      if (category === "Криптовалюты" && languageId === 52) return true;
      if (category === "Технологии" && languageId === 14) return true;
      if (
        category === "Новости" &&
        (languageId === 52 || languageId === 65 || languageId === 14)
      )
        return true;
      if (category === "IT" && languageId === 52) return true;
      if (category === "Бизнес" && languageId === 45) return true;
      if (category === "Наука" && languageId === 14) return true;
      return false;
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
    closed() {
    console.log('closed');
    this.isNewsVisible = false; // Скрываем новости и кнопку
    this.articles = []; // Очищаем массив статей
  },
  handleNewsClosed() {
    this.isNewsVisible = false; // Скрываем новости и кнопку
   
  },
  async fetchData(tag) {
  this.currentTag = tag;
  const store = useCategoryStore();
  await store.fetchData(tag);
  
  this.isNewsVisible = true; // Показываем новости и кнопку
},
    async fetchSavedTagData(tag) {
      this.currentTag = tag;
      const store = useCategoryStore();
      await store.fetchData(tag);
    },
    toggleSaveTag(tag) {
      const store = useCategoryStore();
      store.toggleSaveTag(tag);
    },
    loadSavedTags() {
      const store = useCategoryStore();
      store.loadSavedTags();
    },
    removeTag(tag) {
      const store = useCategoryStore();
      store.removeTag(tag);
    },
    updateItems() {
      this.items = this.savedTags.map((tag) => ({ title: tag }));
    },
  },
};
</script>

<style scoped >
.tags-lis {
  box-shadow: 0px 8px 16px rgba(19, 93, 147, 0.3);
 border-radius: 20px;
}
.language-btn {
display: inline-block; /* Кнопки в одной строке, но могут переноситься */
margin: 5px;
padding: 8px 12px;

font-weight: bold;
border-radius: 5px;
text-align: center;
/* background-color: #007bff;
color: white; */
transition: background-color 0.3s, transform 0.3s ease;
}



@media (max-width: 767px) {
.language-btn {
  font-size: 12px; /* Уменьшение текста для мобильных устройств */
  padding: 6px 10px; /* Уменьшенные отступы */
  margin: 3px; /* Сужаем отступы между кнопками */
}
}

@media (max-width: 480px) {
.language-btn {
  font-size: 11px; /* Ещё меньший текст для узких экранов */
  padding: 4px 8px;
}
}







.saved-tags-list {
  max-height: 200px;
  overflow-y: auto;
}
.over {
  overflow-x: hidden;
  overflow-y: auto;
  height: 250px;
}
.container {
  text-align: center;
}

.categories {
  margin-bottom: 20px;
}

.category-btn,
.language-btn,
.tag-btn {
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;

  border: none;
  border-radius: 5px;
}

.language-btn:hover,
.tag-btn:hover {
  /* background-color: #0056b3; */
}
.overflow1 {
  overflow-x: hidden;
  overflow-y: auto;
  height: 135px;
}
.span {
  border-radius: 5px;
  margin: 5px;
  padding: 1px 12px 3px;
  /* box-shadow: 1px 0px 4px 1px rgb(138, 163, 182); */
}
.span:hover {
  background-color: #092541;
  color: white;
}
a {
  text-decoration: none;
}
.saved-tags {
  margin: 10px 0;
}
.saved-tag {
  margin: 5px 0;
  font-weight: bold;
}
.save-tag-btn {
 
  left:10px;
  position:absolute;
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
  /* color: #fff; */
  /* background: linear-gradient(135deg,#123c63 0%,#0a243d 50%, #291919 100%); */
 

  /* border: none; */
  /* border-radius: 5px; */
}
.save-tag-btn.active {
  background-color: #f93402;
}
/* .save-tag-btn:hover {
  background-color: #0056b3;
} */
.tag-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
</style>
