<template>
    <div class="">
      <h3 class="mt-4">Manage Channels</h3>
  
      <!-- Форма для добавления канала -->
      <form @submit.prevent="handleAddChannel" class="mb-4">
    <div class="mb-3">
      <!-- <label for="chatId" class="form-label">Telegram Chat ID</label> -->
      <input
        type="text"
        id="chatId"
        v-model="newChatId"
        class="form-control"
        placeholder="Enter Telegram Chat ID"
        required
      />
    </div>
    <div class="mb-3">
      <!-- <label for="channelName" class="form-label">Channel Name</label> -->
      <input
        type="text"
        id="channelName"
        v-model="newChannelName"
        class="form-control"
        placeholder="Enter Channel Name"
        required
      />
    </div>
    <button type="submit" class="btn-danger1">Add Channel</button>
  </form>
  
  
      <!-- Список каналов -->
      <div v-if="channels.length > 0" class="card mt-4">
        <!-- <div class="card-header">
          <h5>Saved Channels</h5>
        </div> -->
        <ul class="list-group list-group-flush">
          <li
            v-for="(channel, index) in channels"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
            :class="{ 'active-channel': activeChannelId === channel.id }"
          >
            <!-- Название канала -->
            <span
              @click="handleSelectChannel(channel.id)"
              style="cursor: pointer;font-size: 12px;"
            >
              {{ channel.name }}
            </span>
            <div>
              <!-- Кнопка для удаления канала -->
              <button
                @click="handleRemoveChannel(index)"
                class="btn-danger btn-sm"
              >
                Remove
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No channels saved yet. Add a new channel above.</p>
      </div>
    </div>
  </template>
  
  
  <script>
  import { useChannelStore } from '@/stores/channelStore';
  import { ref, onMounted, computed } from 'vue';
  
  export default {
    setup() {
      const channelStore = useChannelStore(); // Pinia-хранилище
      const newChatId = ref(''); // Поле для нового chatId
      const newChannelName = ref(''); // Поле для нового имени канала
  
      // Реактивные состояния
      const channels = computed(() => channelStore.channels);
      const activeChannelId = computed(() => channelStore.activeChannelId);
  
      // Загрузка сохраненных каналов при монтировании
      onMounted(() => {
        channelStore.loadChannels();
      });
  
      // Добавление нового канала
      const handleAddChannel = () => {
        if (newChatId.value && newChannelName.value) {
          channelStore.addChannel({
            id: newChatId.value,
            name: newChannelName.value,
          });
          newChatId.value = ''; // Очистка поля
          newChannelName.value = ''; // Очистка поля
        }
      };
  
      // Удаление канала
      const handleRemoveChannel = (index) => {
        channelStore.removeChannel(index);
      };
  
      // Выбор активного канала
      const handleSelectChannel = (channelId) => {
        channelStore.setActiveChannel(channelId);
      };
  
      return {
        newChatId,
        newChannelName,
        channels,
        activeChannelId,
        handleAddChannel,
        handleRemoveChannel,
        handleSelectChannel,
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 20px auto;
  }
  .active-channel {
    /* font-size: 20px; */
    font-weight: bold;
    color:cornflowerblue;
  }
  </style>
  