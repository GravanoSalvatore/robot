

<template>
  <div class="container">
    <!-- Поле поиска -->
    <div class="search-container">  
  <input  
    type="text"  
    v-model="query"  
    class="form-control mb-3"  
    placeholder="Search..."  
    style="  
      max-width: 300px;  
      display: inline-block;  
      border-bottom: 2px solid #ccc !important;  
      border-top: none !important;  
      border-left: none !important;  
      border-right: none !important;  
      box-shadow: none !important;
    "  
  />  
  <svg  
    @click="searchTags"  
    xmlns="http://www.w3.org/2000/svg"  
    width="16"  
    height="16"  
    fill="currentColor"  
    class="bi bi-search pointer"  
    viewBox="0 0 16 16"  
    style="cursor: pointer; margin-left: 10px"  
  >  
    <path  
      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"  
    />  
  </svg>  
</div>
    <!-- <div class="search-container">
      <input
        type="text"
        v-model="query"
        class="form-control mb-3"
        placeholder="Search..."
        style="
        max-width: 300px; 
        display: inline-block;
        border: none !important;
        "
      />
      <svg
        @click="searchTags"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-search pointer"
        viewBox="0 0 16 16"
        style="cursor: pointer; margin-left: 10px"
      >
        <path
          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
        />
      </svg>
    </div> -->

    <!-- <div class="search-container">  
  <div class="input-group">  
    <input  
      type="text"  
      v-model="query"  
      class="form-control mb-3"  
      placeholder="Search..."  
      style="max-width: 300px; display: inline-block; border: none !important;"  
    >  
    <button  
      class="btn btn-outline-secondary btn-sm"  
      type="button"  
      v-if="query"  
      @click="query = ''"  
      style="margin-left: -40px;"  
    >  
      <i class="bi bi-x-lg"></i>  
    </button>  
  </div>  
</div> -->
    <!-- Список тегов -->
    <div class="tags-list">
      <div class="tags-lis" v-if="tags.length > 0">
        <!-- <div class="">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="sortOptions"
              id="sortPopularity"
              value="popularity"
              v-model="sortOption"
              @change="updateSortOption($event.target.value)"
            />
            <label class="form-check-label" for="sortPopularity">Popular</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="sortOptions"
              id="sortAlphabet"
              value="alphabet"
              v-model="sortOption"
              @change="updateSortOption($event.target.value)"
            />
            <label class="form-check-label" for="sortAlphabet"
              >Alphabetical</label
            >
          </div>
        </div> -->

        <div style="margin-left: 23px" class="mb-1 fw-bold pt-4">
          Total: {{ tags.length }}
        </div>
        <div
          class="scrollable-tags-list rounded"
          ref="tagsList"
          style="max-height: 300px; overflow-y: auto"
        >
          <button
            v-for="tag in sortedTags"
            :key="tag.id"
            class="btn-danger2 m-1"
            @click="fetchNews(tag.name)"
          >
            {{ tag.name }} -
            <span class="badge">{{ tag.popularity }}</span>
          </button>
        </div>
        <div style="margin-left: 23px" class="mb-1 fw-bold pt-4">
          <!-- Total: {{ tags.length }} -->
        </div>
        <!-- <img
            class="pointer mt-3"
            @click="scrollToTop"
            style="width: 50px; cursor: pointer;"
            src="https://cdn3d.iconscout.com/3d/premium/thumb/top-arrow-3d-icon-download-in-png-blend-fbx-gltf-file-formats--up-direction-arrows-universal-3-pack-icons-6138447.png?f=webp"
          /> -->
      </div>
    </div>
 
    <!-- Список новостей -->
    <div v-if="news.length > 0" class="news-list">
    <div style="position: relative;">
      <button
        class="btn-danger1 me-2"
        :class="{ 'btn-primary': isTagSaved }"
        @click="toggleSaveTag(currentTag)"
      >
        {{ isTagSaved ? "Delete" : "Save" }}
      </button>

      <button
          @click="toggleAutopilot"
          :class="['btn-danger1 fw-bold me-2', { 'btn-primary': autopilotActive }]"
        >
          {{ autopilotActive ? "Stop Autopilot" : "Start Autopilot" }}
        </button>
<!-- Button trigger modal -->
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
      <!-- Индикатор загрузки -->
<div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <!-- <span class="visually-hidden">Loading...</span> -->
      </div>
    </div>
      <div class="row row-cols-1 row-cols-md-3 g-3 mt-3">
        <div v-for="item in news" :key="item.id" class="col">
          <div class="car ">
            <img
              v-if="item.tempImageUrl || item.urlToImage"
              :src="item.tempImageUrl || item.urlToImage"
              class="card-img-top c"
            />
            <img v-else :src="image" class="card-img-top c" />

            <div class="card-body">
              <h5 class="card-title">
                <a :href="item.url" target="_blank">{{ item.sourceName }}</a>
              </h5>
              <p class="card-text">
                <small class="text-muted">{{
                  formatDateTime(item.publishedAt)
                }}</small>
              </p>
              <p v-if="item.author" class="badge bg-primary" :style="{ 'max-width': '200px', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' }">  
  {{ item.author }}  
</p>
              <p v-else class="badge bg-secondary">Unknown</p>
             <div class="over">
              <p class="fw-bold">{{ item.title }}</p>
              <p>{{ item.description }}</p>
              <p v-html="item.content"></p>
            </div>
              <button @click="openEditModal(item)" class="btn-danger1 mt-2">
                Edit
              </button>
              <button @click="sendToTelegram(item)" class="btn-danger1 mt-2">
                Send to Telegram
                <i style="color: cornflowerblue" class="bi bi-telegram"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для редактирования -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          
          <div class="modal-body">
            <setting/>
            <div class="mb-3">
              <div class="text-center mt-3">
                <img
                  :src="editableItem.tempImageUrl || editableItem.urlToImage"
                  class="img-fluid"
                  alt="Preview"
                />
              </div>
              <div class="mb-3">
                <label for="editImageFile" class="form-label"
                  >Upload Image</label
                >
                <input
                  id="editImageFile"
                  type="file"
                  @change="uploadImage"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label for="editImage" class="form-label">Image URL</label>
                <input
                  id="editImage"
                  type="text"
                  v-model="editableItem.tempImageUrl"
                  class="form-control"
                />
              </div>
              <label for="editTitle" class="form-label">Title</label>
              <input
                id="editTitle"
                type="text"
                v-model="editableItem.title"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label for="editDescription" class="form-label"
                >Description</label
              >
              <textarea
                id="editDescription"
                v-model="editableItem.description"
                class="form-control"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="editContent" class="form-label">Content</label>
              <textarea
                id="editContent"
                v-model="editableItem.content"
                class="form-control"
              ></textarea>
            </div>
          </div>

          <div  class="modal-footer">
            <button type="button" class="btn-danger1" data-bs-dismiss="modal">
              Close
            </button>
            <button
              type="button"
              class="btn-danger1"
              @click="saveChanges"
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
            <button @click="sendToTelegram(item)" class="btn-danger1 mt-2">
                Send to Telegram
                <i style="color: cornflowerblue" class="bi bi-telegram"></i>
              </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTagStore } from "../stores/tags";
import { useChannelStore } from '@/stores/channelStore';
import { computed, onMounted, ref } from "vue";
import setting from '../components/Setting.vue'
export default {
  methods:{
  //   clearInput() {  
  //   this.query = '';  
  // }, 
  },
  components: { setting},
  // chatId:'-1002133325378',
  // props: {
  //   chatId: {
  //     type: String,
  //     required: true,
  //   },
  // },
  setup(props) {
    
    const autopilotInterval = ref(null);
    const autopilotActive = ref(false);
    
    const toggleAutopilot = () => {
      if (autopilotActive.value) {
        clearInterval(autopilotInterval.value);
        autopilotInterval.value = null;
        autopilotActive.value = false;
      } else {
        autopilotActive.value = true;
        autopilotInterval.value = setInterval(() => {
          store.fetchNews(store.currentTag).then(() => {
            store.news.forEach((news) => {
              store.sendToTelegram(news, activeChannelId.value);
            });
          });
        }, 60000); // Отправляем каждые 60 секунд
      }
    };

    const store = useTagStore();
    const channelStore = useChannelStore();
    // Действия
    const activeChannelId = computed(() => channelStore.activeChannelId); // Достаём ID активного канала

    const tagsList = ref(null);
    const editableItem = ref({});
    const query = computed({
      get: () => store.query,
      set: (value) => (store.query = value),
    });

    const sortOption = computed({
      get: () => store.sortOption,
      set: (value) => store.updateSortOption(value),
    });

    const uploadImage = (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        editableItem.value.tempImageUrl = imageUrl;
      }
    };
    const openEditModal = (item) => {
      editableItem.value = { ...item };
      const modal = new bootstrap.Modal(document.getElementById("editModal"));
      modal.show();
    };

    const saveChanges = () => {
      const index = store.news.findIndex(
        (news) => news.id === editableItem.value.id
      );
      if (index !== -1) {
        // Проверяем, есть ли новое изображение
        if (editableItem.value.tempImageUrl !== editableItem.value.urlToImage) {
          // Сохраняем новое изображение
          store.news[index].urlToImage = editableItem.value.tempImageUrl;
        }
        // Сохраняем остальные изменения
        store.news[index] = { ...editableItem.value };
      }
    };

    const searchTags = () => store.searchTags();
    const fetchNews = (tagName) => store.fetchNews(tagName);
    const clearNews = () => store.clearNews();
   
    const sendToTelegram = (item) => {
      if (!activeChannelId.value) {
        alert("Please select a Telegram channel first.");
        return;
      }
      store.sendToTelegram(item, activeChannelId.value);
    };

    // const sendToTelegram = (item) => store.sendToTelegram(item, activeChannelId.value);
    const toggleSaveTag = (tag) => store.toggleSaveTag(tag);
    const scrollToTop = () => store.scrollToTop(tagsList.value);
    const sendChatIdAndTagId = () => {
      // Реализуйте логику автоматической отправки данных
    };

    onMounted(() => {
      store.loadSavedTags();
    });

    return {
      autopilotActive,
      toggleAutopilot,
      query,
      tags: computed(() => store.tags),
      news: computed(() => store.news),
      loading: computed(() => store.loading),
      sortOption,
      totalTags: computed(() => store.totalTags),
      progress: computed(() => store.progress),
      image: computed(() => store.image),
      sortedTags: computed(() => store.sortedTags),
      currentTag: computed(() => store.currentTag),
      isTagSaved: computed(() => store.isTagSaved),
      searchTags,
      fetchNews,
      clearNews,
      sendToTelegram,
      toggleSaveTag,
      scrollToTop,
      tagsList,
      sendChatIdAndTagId,
      formatDateTime: store.formatDateTime,
      activeChannelId,
      editableItem,
      openEditModal,
      saveChanges,
    };
  },
};
</script>




<style lang="css" scoped>

.c{
  height: 220px;
}
@media screen and (max-width: 350px) {
  .c{
  height: 180px;
}
}
.over{
  overflow-x: hidden;
  overflow-y: auto;
  height: 250px;
}
a {
  text-decoration: none;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 250px;
}

.loading {
  text-align: center;
  margin-top: 20px;
}

.tags-lis {
  box-shadow: 0px 8px 16px rgba(19, 93, 147, 0.3);
 border-radius: 20px;
}

.scrollable-tags-list {
  max-height: 300px;
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
  /* height: auto; */
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
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
}
.save-tag-btn.active {
  background-color: #f93402;
}
.save-tag-btn:hover {
  background-color: #0056b3;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>
