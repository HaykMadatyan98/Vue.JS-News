<script>
import News from "./components/News.vue";
import Loading from "./components/Loading.vue";
import { mapState } from "vuex";

export default {
  name: "App",

  components: {
    News,
    Loading,
  },

  data() {
    return {};
  },

  created() {
    this.$store.commit("setLoading", true);
    const storageData = JSON.parse(localStorage.getItem("favorites")) || [];
    this.$store.commit("setError", null);
    this.$store.commit("setCurrentPosts", null);
    this.$store.commit("setFavorites", storageData);
    const categoriesObj = {};
    this.$store.state.categories.forEach((item) => {
      categoriesObj[item] = [];
    });
    this.$store.commit("setAllPosts", categoriesObj);
    this.$store.dispatch("fetchData");
    window.addEventListener("scroll", this.handleScroll);
  },

  methods: {
    handleScroll() {
      if (!this.$store.state.isShowFavorites) {
        const scrollY = window.scrollY;
        const visibleHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        if (scrollY + visibleHeight >= pageHeight) {
          this.$store.commit("setPage", this.$store.state.page + 1);
          if (this.$store.state.page < 8) {
            this.$store.dispatch("fetchData");
          }
        }
      }
    },

    addFavorite(data, action) {
      if (action) {
        this.$store.commit("addFavorites", data);
      } else {
        this.$store.commit("deleteFavorites", data.id);
        if (this.$store.state.isShowFavorites) {
          this.$store.commit("setCurrentPosts", this.$store.state.favorits);
        }
      }
      localStorage.setItem(
        "favorites",
        JSON.stringify(this.$store.state.favorits)
      );
    },

    changeData(event) {
      this.$store.commit("showFavorites", false);
      this.$store.commit("setLoading", true);
      this.$store.commit("setCategory", event.target.value);
      this.$store.commit("setPage", 1);
      this.$store.dispatch("fetchData");
    },

    showOnlyFavorits() {
      this.$store.commit("showFavorites", !this.$store.state.isShowFavorites);
      this.$store.commit(
        "setCurrentPosts",
        this.$store.state.isShowFavorites
          ? this.$store.state.favorits
          : this.$store.state.allPosts[
              this.$store.state.categories[this.$store.state.category]
            ]
      );
      console.log(this.$store.state.posts);
    },
  },
};
</script>

<template>
  <div class="header">
    <select @change="changeData">
      <option
        v-for="(item, index) in this.$store.state.categories"
        :key="index"
        :value="index"
      >
        {{ item }}
      </option>
    </select>
    <div class="totalFavorits" @click="showOnlyFavorits">
      <span>{{ this.$store.state.favorits.length }}</span>
    </div>
  </div>

  <div v-if="this.$store.state.loading" class="lds-roller">
    <Loading />
  </div>

  <div v-if="this.$store.state.error" class="error">{{ error }}</div>

  <div
    v-else-if="this.$store.state.posts && !this.$store.state.loading"
    class="container"
  >
    <News
      v-for="elem in this.$store.getters.getPosts"
      :post="elem"
      :key="elem.id"
      @addFavorite="addFavorite"
      :favorites="this.$store.state.favorits"
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
