<template>
  <div class="frame">
    <img :src="frameImage" alt="" />
    <div class="screen">
      <Game v-on:done="openStartpage()" v-if="status === 0" />
      <Startpage v-if="status === 1" />
    </div>
  </div>
</template>

<script>
import Game from "./Game.vue";
import Startpage from "./Startpage.vue";
import frameImage from "../frame2.png";

export default {
  name: "Screen",
  components: {
    Game,
    Startpage,
  },
  data() {
    return {
      status: 0,
      frameImage,
    };
  },
  props: {},
  methods: {
    openStartpage() {
      this.status = 1;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.frame {
  background-size: cover;
  height: 730px;
  width: 900px;
  position: relative;
}
.frame img {
  position: absolute;
  height: 100%;
  z-index: 98;
  pointer-events: none;
}
.screen {
  padding-left: 100px;
  max-height: 800px;
  padding-top: 40px;
  padding-right: 40px;
  z-index: 99;
}
.screen .inner {
  background: black;
  padding-left: 80px;
  padding-right: 70px;
  padding-top: 60px;
  padding-bottom: 60px;
  height: 460px;
}
</style>
