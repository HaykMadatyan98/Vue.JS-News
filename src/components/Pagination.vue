<script>
export default {
  name: "Loading",
  props: ["pageCount", "currentPage", "selectPageFtn"],
};
</script>

<template>
  <div
    v-for="item in pageCount"
    @click="selectPageFtn(item)"
    class="paginationItem"
    :class="currentPage === item ? 'selected' : ''"
    :key="item"
  >
    {{ item }}
  </div>
</template>

<style>
.paginationItem {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 360%;
  border: 1px solid white;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.selected {
  background-color: gray;
  color: black;
}
</style>
