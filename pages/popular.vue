<template>
  <div class="container">
    <!-- Индикатор загрузки -->
    <div v-if="loading" class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="50"
      ></v-progress-circular>
    </div>

    <!-- Список тегов -->
    <div class="tags-list">
      <div class="tags-lis" v-if="tags.length > 0">
        <div style="margin-left: " class=" fw-bold ">
          <!-- Total: {{ tags.length }} -->
        </div>
        <div class="scrollable-tags-list rounded" ref="tagsList">
          <button
            v-for="tag in sortedTags"
            :key="tag.id"
            class="btn-danger2"
            @click="fetchNews(tag.name)"
          >
            {{ tag.name }} -
            <span class="rounded" style="padding: 5px">
              {{ tag.popularity }}
            </span>
          </button>
        </div>
        <div style="margin-left: " class="mb-1 fw-bold pt-4">
          <!-- Total: {{ tags.length }} -->
        </div>
      </div>
      <div v-else-if="loadingTags">
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        ></v-progress-circular>
      </div>
      <div v-else>
        <!-- <p>Теги не найдены или загрузка не удалась.</p> -->
      </div>
    </div>

    <!-- Индикатор загрузки новостей -->
    <div v-if="loadingNews" class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="50"
      ></v-progress-circular>
    </div>

    <!-- Список новостей -->
    <div v-if="news.length > 0" class="news-list">
      <div style="position: relative;">
      <button
        v-if="news.length > 0"
        :class="[' btn-danger1 me-2', { active: isTagSaved }]"
        @click="toggleSaveTag(currentTag)"
      >
        {{ isTagSaved ? "Delete tags" : "Save tags" }}
      </button>

      <button
        v-if="news.length > 0"
        @click="sendChatIdAndTagId"
        class="btn-danger1 mt-1 fw-bold me-2"
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
      <i style="position: absolute;right: 0;top:-25px" @click="clearNews" class="bi bi-x-circle pointer"></i>
  </div>

      <div class="row row-cols-1 row-cols-md-4 g-3 mx-auto m-1">
        <div v-for="item in localNews" :key="item.id" class="col">
          <div class="card-body">
            <!-- Изображение -->
            <img
              v-if="item.urlToImage"
              :src="item.urlToImage"
              class="card-img-top mb-2"
            />
            <img v-else :src="image" class="card-img-top mb-2" />

            <!-- Редактируемый заголовок -->
            <input
              v-model="item.title"
              class="form-control mb-2"
              placeholder="Редактировать заголовок"
            />

            <!-- Редактируемое описание -->
            <textarea
              v-model="item.description"
              class="form-control mb-2"
              placeholder="Редактировать описание"
            ></textarea>

            <!-- Редактируемое содержимое -->
            <textarea
              v-model="item.content"
              class="form-control mb-2"
              placeholder="Редактировать содержимое"
            ></textarea>
            <p v-if="item.author" class="badge bg-primary" :style="{ 'max-width': '200px', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' }">  
  {{ item.author }}  
</p>
            <!-- Дата публикации -->
            <span style="font-size: 10px" class="fw-bold ml-2">{{
              formatDateTime(item.publishedAt)
            }}</span>
            <br /><br />
            <!-- Кнопка отправки -->
            <button
              @click="sendToTelegram(item)"
              class="btn-danger1 mt m-1 fw-bold"
            >
              Send to telegram
              <i style="color: cornflowerblue" class="bi bi-telegram"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useTopTagsStore } from "../stores/popular";
import { computed, onMounted, ref } from "vue";
import { useChannelStore } from '@/stores/channelStore';
export default {
  // props: {
  //   chatId: {
  //     type: String,
  //     required: true,
  //   },
  // },
  setup() {
    const store = useTopTagsStore();
    const tagsList = ref(null);
    const localNews = ref([]);
    const channelStore = useChannelStore();
    // Действия
    const activeChannelId = computed(() => channelStore.activeChannelId); // Достаём ID активного канала

    const fetchTags = () => store.fetchTags();
    const fetchNews = async (tagName) => {
      await store.fetchNews(tagName);
      localNews.value = store.news.map((item) => ({ ...item })); // Локальная копия для редактирования
    };
    const clearNews = () => {
      store.clearNews();
      localNews.value = [];
    };
    const sendToTelegram = (item) => {
  if (!activeChannelId.value) {
    alert('Выберите канал для отправки новостей!');
    return;
  }

  // Безопасная обработка полей перед отправкой
  const editedItem = {
    ...item,
    title: item.title?.trim() || "", // Если title null или undefined, используем пустую строку
    description: item.description?.trim() || "",
    content: item.content?.trim() || "",
  };

  // Отправляем сообщение
  store.sendToTelegram(editedItem, activeChannelId.value);
};


    onMounted(() => {
      store.loadSavedTags();
      fetchTags();
    });

    return {
      tags: computed(() => store.tags),
      news: computed(() => store.news),
      loadingTags: computed(() => store.loadingTags),
      loadingNews: computed(() => store.loadingNews),
      loading: computed(() => store.loading),
      sortedTags: computed(() => store.sortedTags),
      currentTag: computed(() => store.currentTag),
      isTagSaved: computed(() => store.isTagSaved),
      formatDateTime: store.formatDateTime,
      localNews,
      fetchTags,
      fetchNews,
      clearNews,
      sendToTelegram,
      activeChannelId,
      toggleSaveTag: store.toggleSaveTag,
      sendChatIdAndTagId: () => {},
    };
  },
};
</script>

<style scoped>
.tags-lis {
  box-shadow: 0px 8px 16px rgba(19, 93, 147, 0.3);
 border-radius: 20px;
}
.form-control {
  width: 100%;
  margin-bottom: 10px;
}
a {
  text-decoration: none;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading {
  text-align: center;
  margin-top: 20px;
}

.tags-list {
  margin-top: px;
}

.scrollable-tags-list {
  max-height: 310px;
  overflow-y: auto;
  padding: 10px;
}

.tag-item {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.tag-item:hover {
  background-color: #f0f0f0;
  color: rgb(3, 145, 246);
}

.no-tags {
  text-align: center;
  margin-top: 20px;
}

.news-list {
  margin-top: 20px;
}

.card-body {
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
}

.card-img-top {
  width: 100%;
  height: auto;
}

.btn {
  cursor: pointer;
}

.v-progress-circular {
  margin: 1rem;
}

.span {
  border-radius: 5px;
  margin: 5px;
  padding: 1px 12px 3px;
  box-shadow: 1px 0px 4px 1px rgb(138, 163, 182);
}

.span:hover {
  background-color: #092541;
  color: white;
}

.pointer {
  cursor: pointer;
}

.saved-tags {
  margin: 10px 0;
}
.saved-tag {
  margin: 5px 0;
  font-weight: bold;
}
.save-tag-btn {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
  /* color: #fff;
    background-color: #007bff; */
  /* border: none;
    border-radius: 5px; */
}
.save-tag-btn.active {
  background-color: #f93402;
}
.save-tag-btn:hover {
  background-color: #0056b3;
}
</style>
