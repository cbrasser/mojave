<template>
  <div id="app">
    <Screen />
  </div>
</template>

<script>
import Screen from "./components/Screen.vue";

export default {
  name: "App",
  components: {
    Screen,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap");
body,
html {
  padding: 0;
  margin: 0;
  font-size: 18px;
  color: var(--fg);
  font-family: "Share Tech Mono", monospace;
}

p {
  margin-bottom: 0;
  margin-top: 0;
}
body {
  background-image: url("./bg.jpg");
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}
#app {
}

:root {
  --fg: #55d980;
  --bg: black;
}

.anim-typewriter {
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid var(--fg);
  border-right-color: transparent;
  animation: typewriter 2s steps(44) 1s 1 normal both,
    blinkTextCursor 500ms steps(44) 1s 4 normal;
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 24em;
  }
}
@keyframes blinkTextCursor {
  from {
    border-right-color: var(--fg);
  }
  to {
    border-right-color: transparent;
  }
}
</style>
