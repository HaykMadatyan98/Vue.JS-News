<script>
export default {
  name: "News",

  props: ["post"],

  data() {
    return {
      title: this.post.title,
      published: this.post.publishedAt,
      content: this.post.content ? this.post.content : this.post.description,
      image: this.post.urlToImage,
      pageUrl: this.post.url,
    };
  },

  methods: {},
};
</script>

<template>
  <div class="newsElement">
    <a :href="pageUrl">{{ title }}</a>
    <p>{{ new Date(published).toDateString() }}</p>
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

p {
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
</style>
