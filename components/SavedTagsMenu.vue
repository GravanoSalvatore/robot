<template>
  <v-menu>
    <template v-slot:activator="{ props: menu }">
      <v-tooltip location="top">
        <template v-slot:activator="{ props: tooltip }">
          <span color=" fw-bold" v-bind="Object.assign({}, menu, tooltip)">
            <img
              class="pointer"
              style="width: 65px"
              src="https://cdn3d.iconscout.com/3d/premium/thumb/data-dashboard-9838104-8017824.png?f=webp"
            /> </span
          ><br />
        </template>
        <span>{{ $t("selectTag") }}</span>
      </v-tooltip>
    </template>
    <v-list class="saved-tags-list">
      <v-list-item
        v-for="(tag, index) in items"
        :key="index"
        @click="fetchSavedTagData(tag.title)"
      >
        <v-list-item-title
          >{{ tag.title }}
          <svg
            @click.stop="removeTag(tag.title)"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            fill="red"
            class="bi bi-trash3-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
            />
          </svg>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    fetchSavedTagData: {
      type: Function,
      required: true,
    },
    removeTag: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.saved-tags-list {
  max-height: 200px;
  overflow-y: auto;
}
</style>
