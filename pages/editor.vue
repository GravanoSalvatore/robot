<template>
    <div class="media-editor-container">
      <div class="editor-wrapper">
        <!-- Основное текстовое поле -->
        <textarea 
          v-model="message" 
          class="form-control message-textarea" 
          placeholder="Напишите сообщение для Telegram канала..."
          rows="6"
        ></textarea>
  
        <!-- Превью загруженных медиафайлов -->
        <div v-if="uploadedFiles.length" class="media-preview mt-3">
          <div 
            v-for="(file, index) in uploadedFiles" 
            :key="index" 
            class="media-item"
          >
            <!-- Превью изображений -->
            <img 
              v-if="file.type.startsWith('image/')" 
              :src="file.preview" 
              class="img-thumbnail"
            />
            
            <!-- Превью видео -->
            <video 
              v-else-if="file.type.startsWith('video/')" 
              controls 
              class="video-preview"
            >
              <source :src="file.preview" :type="file.type">
            </video>
            
            <!-- Превью аудио -->
            <audio 
              v-else-if="file.type.startsWith('audio/')" 
              controls 
              class="audio-preview"
            >
              <source :src="file.preview" :type="file.type">
            </audio>
  
            <!-- Кнопка удаления файла -->
            <button 
              @click="removeFile(index)" 
              class="btn btn-danger btn-sm remove-file-btn"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
  
        <!-- Панель управления медиа -->
        <div class="media-controls mt-3">
          <!-- Кнопки загрузки медиа -->
          <div class="btn-group" role="group">
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileUpload" 
              multiple 
              accept="image/*,video/*,audio/*"
              style="display: none"
            >
            <button 
              @click="$refs.fileInput.click()" 
              class="btn-danger1"
              
            >
              <i class="bi bi-upload"></i> Загрузить медиа
            </button>
            
            <!-- Дополнительные опции -->
            <button 
              class="btn-danger1 dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-gear"></i>
            </button>
            <ul class="dropdown-menu">
              <li>
                <label class="dropdown-item">
                  <input 
                    type="checkbox" 
                    v-model="options.spoilerMode"
                    class="form-check-input me-2"
                  > 
                  Режим спойлера
                </label>
              </li>
              <li>
                <label class="dropdown-item">
                  <input 
                    type="checkbox" 
                    v-model="options.sendWithPreview"
                    class="form-check-input me-2"
                  > 
                  Предварительный просмотр
                </label>
              </li>
            </ul>
          </div>
  
          <!-- Кнопка отправки -->
          <button 
            @click="sendMessage" 
            class="btn-danger1 ms-2"
            :disabled="!message && !uploadedFiles.length"
          >
            <i class="bi bi-send"></i> Отправить
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue'
  import axios from 'axios'
  
  export default {
    data(){
      return{
        botToken: "6903896787:AAG-rPGukp422cw17k4y17UsJUiDMl5tdbc", 
      }
    },
    props: {
      channelId: {
        type: String,
        required: true
      }
    },
    setup(props, { emit }) {
      const message = ref('')
      const uploadedFiles = ref([])
      const fileInput = ref(null)
      const options = reactive({
        spoilerMode: false,
        sendWithPreview: true
      })
  
      const handleFileUpload = (event) => {
        const files = Array.from(event.target.files)
        files.forEach(file => {
          const reader = new FileReader()
          reader.onload = (e) => {
            uploadedFiles.value.push({
              file: file,
              preview: e.target.result,
              type: file.type
            })
          }
          reader.readAsDataURL(file)
        })
      }
  
      const removeFile = (index) => {
        uploadedFiles.value.splice(index, 1)
      }
  
      const sendMessage = async () => {
        const formData = new FormData()
        
        // Добавляем текстовое сообщение
        formData.append('message', message.value)
        
        // Добавляем медиафайлы
        uploadedFiles.value.forEach((mediaFile, index) => {
          formData.append(`media_${index}`, mediaFile.file)
        })
  
        // Опции отправки
        formData.append('spoiler', options.spoilerMode)
        formData.append('preview', options.sendWithPreview)
        formData.append('channel_id', props.channelId)
  
        try {
          const response = await axios.post(`https://api.telegram.org/bot${this.botToken}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
  
          // Очищаем форму после успешной отправки
          message.value = ''
          uploadedFiles.value = []
          
          emit('message-sent', response.data)
        } catch (error) {
          console.error('Ошибка отправки сообщения:', error)
          emit('message-error', error)
        }
      }
  
      return {
        message,
        uploadedFiles,
        fileInput,
        options,
        handleFileUpload,
        removeFile,
        sendMessage
      }
    }
  }
  </script>
  
  <style scoped>
  .media-editor-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .message-textarea {
    resize: vertical;
    min-height: 150px;
  }
  
  .media-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .media-item {
    position: relative;
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 8px;
  }
  
  .media-item img, 
  .media-item video, 
  .media-item audio {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-file-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
  }
  
  .media-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>