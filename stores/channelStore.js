
import { defineStore } from 'pinia';

export const useChannelStore = defineStore('channelStore', {
  state: () => ({
    botToken: "6903896787:AAG-rPGukp422cw17k4y17UsJUiDMl5tdbc",
    channels: [], // Массив каналов
    activeChannelId: null, // ID активного канала
  }),
  actions: {
    loadChannels() {
      if (process.client) {
        const savedChannels = localStorage.getItem('telegramChannels');
        const savedActiveChannelId = localStorage.getItem('activeChannelId');

        if (savedChannels) {
          this.channels = JSON.parse(savedChannels);
        }
        if (savedActiveChannelId) {
          this.activeChannelId = savedActiveChannelId;
        }
      }
    },
    addChannel(newChannel) {
      this.channels.push(newChannel);
      this.saveToLocalStorage();
    },
    removeChannel(index) {
      if (this.channels[index]?.id === this.activeChannelId) {
        this.activeChannelId = null; // Сброс активного канала
      }
      this.channels.splice(index, 1);
      this.saveToLocalStorage();
    },
    setActiveChannel(channelId) {
      this.activeChannelId = channelId;
      localStorage.setItem('activeChannelId', channelId); // Сохранение активного канала
    },
    saveToLocalStorage() {
      localStorage.setItem('telegramChannels', JSON.stringify(this.channels));
    },
  },
});
