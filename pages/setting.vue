 
    <!--<template>
  <div class="container">
    <h1 class="mt-4">Manage Telegram Channels</h1>

    
 <form @submit.prevent="handleAddChannel" class="mb-4">
      <div class="mb-3">
        <label for="chatId" class="form-label">Telegram Chat ID</label>
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
        <label for="channelName" class="form-label">Channel Name</label>
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

   
    <div v-if="channels.length > 0" class="card mt-4">
      <div class="card-header">
        <h5>Saved Channels</h5>
      </div>
      <ul class="list-group list-group-flush">
        <li
          v-for="(channel, index) in channels"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center"
          :class="{ 'active-channel': activeChannelId === channel.id }" 
        >
          <span @click="handleSelectChannel(channel.id)" style="cursor: pointer;">
            {{ channel.name }}
          </span>
          <div>
            <button
              @click="handleRemoveChannel(index)"
              class="btn btn-danger btn-sm"
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
    const channelStore = useChannelStore(); // Получаем хранилище Pinia
    const newChatId = ref(''); // Поле для нового chatId
    const newChannelName = ref(''); // Поле для нового имени канала

    // Реактивное состояние каналов
    const channels = computed(() => channelStore.channels);
    const activeChannelId = computed(() => channelStore.activeChannelId);
    // Загрузка сохраненных каналов при монтировании
    onMounted(() => {
      console.log('Component mounted. Loading channels...');
      channelStore.loadChannels();
    });

    // Добавление нового канала
    const handleAddChannel = () => {
      if (newChatId.value && newChannelName.value) {
        console.log('Adding channel:', newChatId.value, newChannelName.value);
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
      console.log('Removing channel at index:', index);
      channelStore.removeChannel(index);
    };
    const handleSelectChannel = (channelId) => {
      console.log('Selecting channel:', channelId);
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
  background-color:cornflowerblue; /* Окраска активного канала */
  color: white;
}
</style>  -->
<template>
  <div class="container">
    <setting/>
  </div>
</template>


<script>
import setting from '../components/Setting.vue'
export default {
  components: {
    setting
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 20px auto;
}
.active-channel {
  font-size: 20px;
  font-weight: bold;
  color:cornflowerblue;
}
</style>
