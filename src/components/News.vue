<script>
export default {
  name: "News",

  props: ["post", "addFavorite", "favorites"],

  data() {
    return {
      title: this.post.title,
      published: this.post.publishedAt,
      content: this.post.content ? this.post.content : this.post.description,
      image: this.post.urlToImage,
      pageUrl: this.post.url,
    };
  },

  methods: {
    handleAddFavorite(event) {
      if (event.target.classList.length === 1) {
        this.$emit("addFavorite", this.post, "add");
      } else {
        this.$emit("addFavorite", this.post);
      }
      event.target.classList.toggle("active");
    },
  },
  computed: {
    checkFavorites() {
      return this.favorites?.some((item) => {
        console.log(item.id, this.post.id);
        return item.id === this.post.id;
      });
    },
  },
};
</script>

<template>
  <div class="newsElement">
    <a :href="pageUrl">{{ title }}</a>
    <div class="head">
      <span id="date">{{ new Date(published).toDateString() }}</span>
      <div>
        <span
          class="fav"
          @click="handleAddFavorite"
          :class="checkFavorites ? 'active' : ''"
        ></span>
      </div>
    </div>
    <img v-if="image" :src="image" alt="image" />
    <div style="text-align: justify">
      <span v-html="content"></span>
    </div>
  </div>
</template>

<style>
.newsElement {
  text-align: center;
  border: 2px solid white;
  overflow: hidden;
  border-radius: 20px;
  width: 30%;
  height: 200px;
  padding: 20px;
}

a {
  color: white;
  cursor: pointer;
  font-size: 16px;
  line-height: 18px;
  font-weight: 800;
}

#date {
  font-size: 12px;
  line-height: 15px;
  color: aqua;
}

img {
  position: relative;
  margin-right: 20px;
  width: 150px;
  height: 120px;
  bottom: 0px;
  left: 0px;
  float: left;
}

span {
  font-size: 14px;
  text-align: justify;
}

.head {
  display: flex;
  justify-content: space-between;
  margin: 10px;
}

.fav {
  width: 18px;
  height: 18px;
  position: relative;
  cursor: pointer;
}
.fav:before,
.fav:after {
  content: "";
  position: absolute;
  display: block;
  border-top-left-radius: 12px;
  background-color: gray;
}
.fav:before {
  border-bottom-left-radius: 12px;
  width: inherit;
  height: 12px;
  top: 6px;
  left: 0;
}
.fav:after {
  width: 12px;
  top: 0;
  left: 6px;
  height: inherit;
  border-top-right-radius: 12px;
}
.active {
  width: 18px;
  height: 18px;
  position: relative;
}
.active:before,
.active:after {
  content: "";
  position: absolute;
  display: block;
  border-top-left-radius: 12px;
  background-color: red;
}
.active:before {
  border-bottom-left-radius: 12px;
  width: inherit;
  height: 12px;
  top: 6px;
  left: 0;
}
.active:after {
  width: 12px;
  top: 0;
  left: 6px;
  height: inherit;
  border-top-right-radius: 12px;
}
</style>
