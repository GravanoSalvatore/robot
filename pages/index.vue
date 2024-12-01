<!-- <template>
  <div class="container-fluid ">
   
    <div class="row ">
     

      <div class="col-12 col-md-3 fixed-sidebar mb-4 mb-md-0">
        <div class="sidebar-content">
          <div class="accordion accordion-flush" id="accordionFlushExample">
  <div
    v-for="(item, index) in accordionItems"
    :key="index"
    class="accordion-item"
  >
    <h2 class="accordion-header">
      <button
        @click="item.title !== 'Channels' && item.title !== 'Posting' ? navigateToRoute(item.route) : null"
        class="accordion-button collapsed"
        type="button"
        :data-bs-toggle="item.title === 'Channels' || item.title === 'Posting' ? 'collapse' : ''"
        :data-bs-target="item.title === 'Channels' || item.title === 'Posting' ? '#flush-collapse' + index : ''"
        :aria-controls="item.title === 'Channels' || item.title === 'Posting' ? 'flush-collapse' + index : ''"
      >
        <div class="card-icon me-2" v-html="item.icon"></div>
        <span>{{ item.title }}</span>
      </button>
    </h2>

    <div
      v-if="item.title === 'Channels' || item.title === 'Posting'"
      :id="'flush-collapse' + index"
      class="accordion-collapse collapse"
      data-bs-parent="#accordionFlushExample"
    >
      <div class="accordion-body">
        {{ item.content }}
      </div>
    </div>
  </div>
</div>

          
          
        </div>
      </div>

     
      <div class="col-12 col-md-9" ref="newsContainer">
        <div class="row">
          <Grid />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useThemeStore } from '~/stores/useThemeStore';
import Grid from '../components/Grid.vue';

export default {
  setup() {
    const themeStore = useThemeStore();
    // const router = useRouter();
    // Инициализация темы
    try {
      themeStore.setThemeFromStorage();
    } catch (error) {
      console.error('Ошибка загрузки темы:', error);
    }

    // Данные для аккордеона
    const accordionItems = [
    { title: 'Personal account', content: 'Content for item #8.',icon:'<i class="bi bi-person-check-fill"></i>', },
      { title: 'About us', icon:'<i class="bi bi-file-earmark-text"></i>' },
      { title: 'Privacy policy',icon:'<i class="bi bi-shield-check"></i>' },
      // { title: 'Setting',icon:'<i class="bi bi-sliders"></i>',route: "/setting", },
      { title: "Setting", icon: '<i class="bi bi-sliders"></i>', route:"/setting" },
      { title: 'Channels', content: 'Content for item #4.',icon:'<i class="bi bi-chat-square-text"></i>' },
      { 
        title: 'Posting', 
      
        icon:'<i class="bi bi-stickies"></i>'
       },
       { title: 'Payments', content: 'Content for item #4.',icon:'<i class="bi bi-wallet2"></i>' },
      { title: 'Documentation', content: 'Content for item #6.',icon:'<i class="bi bi-filetype-doc"></i>', },
      { title: 'Invite friends', content: 'Content for item #7.',icon:'<i class="bi bi-people-fill"></i>', },
      
      { title: 'Disclaimer', content: 'Content for item #9.', icon:'<i class="bi bi-exclamation-triangle-fill"></i>', },
      { title: 'Feedback', content: 'Content for item #10.', icon:'<i class="bi bi-chat-text-fill"></i>', },
      // { title: 'Accordion Item #11', content: 'Content for item #11.' },
      // { title: 'Accordion Item #12', content: 'Content for item #12.' },
    ];
    
  
   
    return {
     
      themeStore,
      accordionItems,
    };
  },
  methods: {
    navigateToRoute(route) {
      console.log("navigateToRoute")
      this.$router.push(route);
    },
  },

  components: {
    Grid,
  },
};
</script>

<style scoped>
.accordion-button[disabled]::after {
  display: none; /* Убираем стрелку */
}
h4{font-weight: bold;}
/* Исправленные стили */
.theme-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  position: absolute; /* Абсолютное позиционирование */
  top: 2px; /* Отступ сверху */
  right: 10px; /* Отступ справа */
  z-index: 1000; /* Убедитесь, что кнопка поверх контента */
}


.theme-toggle-btn:hover {
  background-color: rgba(214, 247, 32, 0.1);
}

.dark-theme .theme-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.theme-icon {
  transition: transform 0.3s ease;
  caret-color: yellow;
}

.theme-toggle-btn:hover .theme-icon {
  transform: rotate(30deg);
}

.fixed-sidebar {
  max-height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

@media (max-width: 767px) {
  .fixed-sidebar {
    position: static;
  }
}
</style> -->
<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Левая колонка -->
      <div class="col-12 col-md-3 fixed-sidebar mb-4 mb-md-0">
        <div class="sidebar-content">
          <div class="accordion accordion-flush" id="accordionFlushExample">
            <div
              v-for="(item, index) in accordionItems"
              :key="index"
              class="accordion-item"
            >
              <h2 class="accordion-header">
                <button
                  @click="handleItemClick(item, index)"
                  class="accordion-button"
                  :class="{
                    'collapsed': item.title === 'Channels' || item.title === 'Posting',
                    'no-arrow': !(item.title === 'Channels' || item.title === 'Posting')
                  }"
                  type="button"
                  :data-bs-toggle="item.title === 'Channels' || item.title === 'Posting' ? 'collapse' : ''"
                  :data-bs-target="item.title === 'Channels' || item.title === 'Posting' ? '#flush-collapse' + index : ''"
                  :aria-controls="item.title === 'Channels' || item.title === 'Posting' ? 'flush-collapse' + index : ''"
                >
                  <div class="card-icon me-2" v-html="item.icon"></div>
                  <span>{{ item.title }}</span>
                </button>
              </h2>
              <!-- Контент только для "Channels" и "Posting" -->
              <div
                v-if="item.title === 'Channels' || item.title === 'Posting'"
                :id="'flush-collapse' + index"
                class="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div class="accordion-body">
                  {{ item.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка -->
      <div class="col-12 col-md-9" ref="newsContainer">
        <div class="row">
          <Grid />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Grid from '../components/Grid.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  components: {
    Grid
  },
  setup() {
    const router = useRouter();

    const accordionItems = ref([
      { 
        title: 'Personal account', 
        content: 'Content for item #8.',
        icon: '<i class="bi bi-person-check-fill"></i>'
      },
      { 
        title: 'About us', 
        icon: '<i class="bi bi-file-earmark-text"></i>',
        route: '/aboutUs'
      },
      { 
        title: 'Privacy policy',
        icon: '<i class="bi bi-shield-check"></i>',
        route: '/privacy'
      },
      { 
        title: "Setting", 
        icon: '<i class="bi bi-sliders"></i>', 
        route: "/setting" 
      },
      { 
        title: 'Channels', 
        content: 'Content for item #4.',
        icon: '<i class="bi bi-chat-square-text"></i>' 
      },
      { 
        title: 'Posting', 
        icon: '<i class="bi bi-stickies"></i>',
        content: 'Content for Posting'
      },
      { 
        title: 'Payments', 
        content: 'Content for item #4.',
        icon: '<i class="bi bi-wallet2"></i>' ,
         route: '/pay'
      },
      { 
        title: 'Documentation', 
        content: 'Content for item #6.',
        icon: '<i class="bi bi-filetype-doc"></i>',
        route: '/doc'
      },
      { 
        title: 'Invite friends', 
        content: 'Content for item #7.',
        icon: '<i class="bi bi-people-fill"></i>' ,
         route: '/ref'
      },
      { 
        title: 'Disclaimer', 
        content: 'Content for item #9.', 
        icon: '<i class="bi bi-exclamation-triangle-fill"></i>',
        route: '/disclaimer'
      },
      { 
        title: 'Feedback', 
        content: 'Content for item #10.', 
        icon: '<i class="bi bi-chat-text-fill"></i>',
        route: '/feedback'
      },
    ]);

    const handleItemClick = (item, index) => {
      // Для Channels и Posting не выполнять навигацию
      if (item.title !== 'Channels' && item.title !== 'Posting') {
        if (item.route) {
          router.push(item.route);
        } else {
          console.warn(`No route defined for ${item.title}`);
        }
      }
    };

    return {
      accordionItems,
      handleItemClick
    };
  }
};
</script>

<style scoped>
.accordion-button.no-arrow::after {
  display: none !important;
}

.accordion-button[disabled]::after {
  display: none;
}

.fixed-sidebar {
  max-height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

@media (max-width: 767px) {
  .fixed-sidebar {
    position: static;
  }
}

.accordion-button {
  display: flex;
  align-items: center;
}

.card-icon {
  margin-right: 10px;
}
</style>