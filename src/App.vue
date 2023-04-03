<script>
import News from "./components/News.vue";
import Loading from "./components/Loading.vue";
import axios from "axios";

export default {
  name: "App",

  components: {
    News,
    Loading,
  },

  data() {
    return {
      loading: false,
      error: null,
      posts: [],
      allPosts: {},
      favorits: [],
      page: 1,
      pageSize: 12,
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
      showFavorites: false,
      totalResults: 0,
    };
  },

  created() {
    const initialValue = localStorage.getItem("favorites");
    this.categories.forEach((item) => {
      this.allPosts[item] = [];
    });
    this.favorits = JSON.parse(initialValue) ? JSON.parse(initialValue) : [];
    this.error = this.post = null;
    this.fetchData();
    window.addEventListener("scroll", this.handleScroll);
  },

  methods: {
    async fetchData() {
      this.loading = true;
      const URL = `https://newsapi.org/v2/top-headlines?category=${
        this.categories[this.category]
      }&page=${this.page}&pageSize=${this.pageSize}&language=${
        this.language
      }&apiKey=67e83e28725a4c3fb7566013ff4fff39`;
      await axios
        .get(URL)
        .then(({ data }) => {
          if (this.page === 1) {
            this.allPosts[this.categories[this.category]] = [];
          }
          this.allPosts[this.categories[this.category]].push(...data.articles);
          this.allPosts[this.categories[this.category]].forEach(
            (item, index) =>
              (item.id = `${index}-${this.categories[this.category]}`)
          );
          this.posts = [...this.allPosts[this.categories[this.category]]];
          this.totalResults = data.totalResults;
          if (data.totalResults === 0) {
            this.error = `Data not found`;
          }
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleScroll() {
      const scrollY = window.scrollY;
      const visibleHeight = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollY + visibleHeight >= pageHeight) {
        this.page = this.page + 1;
        if (this.page < 8) {
          this.fetchData();
        }
      }
    },

    addFavorite(data, action) {
      if (action) {
        this.favorits.push(data);
      } else {
        this.favorits = this.favorits.filter((item) => item.id !== data.id);
        if (this.showFavorites) {
          this.posts = [...this.favorits];
        }
      }
      this.favorits.sort((a, b) => a.id - b.id);
      localStorage.setItem("favorites", JSON.stringify(this.favorits));
    },

    changeData() {
      this.page = 1;
      this.fetchData();
    },

    showOnlyFavorits() {
      this.showFavorites = !this.showFavorites;
      this.posts = this.showFavorites
        ? this.favorits
        : this.allPosts[this.categories[this.category]];
      console.log(this.posts);
    },
  },
};
</script>

<template>
  <div class="header">
    <select v-if="!loading" v-model="category" @change="changeData">
      <option v-for="(item, index) in categories" :key="index" :value="index">
        {{ item }}
      </option>
    </select>
    <div class="totalFavorits" @click="showOnlyFavorits">
      <span>{{ favorits.length }}</span>
    </div>
  </div>
  <div v-if="loading" class="lds-roller">
    <Loading />
  </div>

  <div v-else-if="error" class="error">{{ error }}</div>

  <div v-else-if="posts" class="container">
    <News
      v-for="elem in posts"
      :post="elem"
      :key="elem.id"
      @addFavorite="addFavorite"
      :favorites="favorits"
    />
  </div>
</template>

<style>
.header {
  display: flex;
  width: 100%;
  height: 100px;
  justify-content: center;
  gap: 50px;
  align-items: center;
  margin-top: 20px;
}

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
  color: white;
  border: 2px solid white;
  font-size: 20px;
}

option {
  background-color: #2f3242;
}

.totalFavorits > span {
  position: absolute;
  font-size: 24px;
  font-weight: bold;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-30%, -30%);
}

.totalFavorits {
  width: 41px;
  height: 41px;
  position: relative;
  text-align: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}
.totalFavorits:before,
.totalFavorits:after {
  content: "";
  position: absolute;
  display: block;
  border-top-left-radius: 36px;
  background-color: red;
  z-index: 1;
}
.totalFavorits:before {
  border-bottom-left-radius: 36px;
  width: inherit;
  height: 30px;
  top: 12px;
  left: 0;
}
.totalFavorits:after {
  width: 30px;
  top: 0;
  left: 12px;
  height: inherit;
  border-top-right-radius: 36px;
}
</style>
