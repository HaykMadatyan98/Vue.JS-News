<script>
import News from "./components/News.vue";
import Loading from "./components/Loading.vue";
import Pagination from "./components/Pagination.vue";
import axios from "axios";

export default {
  name: "App",

  components: {
    News,
    Loading,
    Pagination,
  },

  data() {
    return {
      loading: false,
      posts: null,
      error: null,
      totalPages: null,
      page: 1,
      pageSize: 9,
      language: "en",
      categories: [
        "Business",
        "Entertainment",
        "General",
        "Health",
        "Science",
        "Sports",
        "Technology",
      ],
      category: 0,
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.error = this.post = null;
      this.loading = true;
      const URL = `https://newsapi.org/v2/top-headlines?category=${
        this.categories[this.category]
      }&page=${this.page}&pageSize=${this.pageSize}&language=${
        this.language
      }&apiKey=67e83e28725a4c3fb7566013ff4fff39`;
      console.log(URL);
      await axios
        .get(URL)
        .then(({ data }) => {
          this.posts = data.articles;
          this.totalPages =
            Math.ceil(data.totalResults / 9) > 10
              ? 10
              : Math.ceil(data.totalResults / 9);
          if (data.totalResults === 0) {
            this.error = `Data not found`;
          }
        })
        .catch((error) => {
          this.error = error;
        });
      this.loading = false;
    },

    onClickHandler(selectedPage) {
      if (this.page !== selectedPage) {
        this.page = selectedPage;
        this.fetchData();
      }
    },

    changeData() {
      this.page = 1;
      this.fetchData();
    },
  },
};
</script>

<template>
  <select v-if="!loading" v-model="category" @change="changeData">
    <option v-for="(item, index) in categories" :key="index" :value="index">
      {{ item }}
    </option>
  </select>

  <div v-if="loading" class="lds-roller">
    <Loading />
  </div>

  <div v-else-if="error" class="error">{{ error }}</div>

  <div v-else-if="posts" class="container">
    <News v-for="elem in posts" :post="elem" />
  </div>

  <div v-if="!loading && !error" class="pagination">
    <Pagination
      :pageCount="totalPages"
      :currentPage="page"
      :selectPageFtn="onClickHandler"
    />
  </div>
</template>

<style>
.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.error {
  position: absolute;
  text-align: center;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
}

select {
  border-radius: 20px;
  width: 200px;
  height: 50px;
  text-align: center;
  background-color: inherit;
  margin-top: 10px;
  color: white;
  border: 2px solid white;
  font-size: 20px;
}

option {
  background-color: #2f3242;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
