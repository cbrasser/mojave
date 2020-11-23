<template>
  <div class="inner">
    <div class="transition" v-if="state === 0">
      <p class="anim-typewriter padding">
        welcome to robco industries (tm) termlink
      </p>
      <p class="padding text-animation delay-1">> logon admin</p>
      <p class="padding text-animation delay-2">enter password now</p>
      <p class="padding text-animation delay-3">***********</p>
    </div>
    <div class="startpage" v-if="state === 1">
      <div class="header">
        <p class="text-animation delay-1">
          robco industries unified operating system
        </p>
        <p class="text-animation delay-2">
          copyright 2075-2077 robco industries
        </p>
        <p class="lowercase text-animation delay-3">-Server 6-</p>
      </div>
      <div class="subheader">
        <p class="lowercase text-animation delay-4">Softlock Solutions, Inc</p>
        <p class="lowercase text-animation delay-5">
          "Your Security is Our Security"
        </p>
        <p class="lowercase text-animation delay-6">
          >\ Welcome, {{ username }}
        </p>
      </div>
      <div class="line"></div>
      <div class="links">
        <div class="link" v-for="(link, index) in links" :key="'link' + index">
          <a :href="link.url" target="_blank">> {{ link.name }}</a>
        </div>
      </div>
      <div class="prompt">
        <span>> </span
        ><input v-model="input" @keyup.enter="handleSubmit" type="text" />
      </div>
    </div>
  </div>
</template>

<script>
import idb from "./../db";

export default {
  name: "Startpage",
  data() {
    return {
      username: "user",
      state: 0,
      input: "",
      links: [{ name: "asht", url: "ashtsaht" }],
    };
  },
  methods: {
    toggleState() {
      this.state = 1;
    },
    async saveLinks() {
      await idb.saveLinks(this.links);
    },
    async handleSubmit() {
      if (this.input.indexOf(":add") !== -1) {
        let url = this.input.split(":add ")[1].split(" ")[0];
        let name = this.input
          .split(":add ")[1]
          .split(" ")
          .splice(1)
          .join(" ");
        this.links.push({ name, url });
        this.saveLinks();
      } else if (this.input.indexOf(":rm ") !== -1) {
        let name = this.input.split(":rm ")[1];
        console.log(name);
        this.links = this.links.filter((link) => link.name !== name);
        console.log(this.links);
        await this.saveLinks();
      } else if (this.input.indexOf(":setuser ") !== -1) {
        let name = this.input.split(":setuser ")[1];
        this.username = name;
        await idb.saveUsername(name);
      } else {
        window.open(`https://duckduckgo.com/&q=${this.input}`);
      }
      this.input = "";
    },
  },
  async mounted() {
    this.username = await idb.getUsername();
    this.links = await idb.getLinks();
    setTimeout(() => {
      this.toggleState();
    }, 5000);
  },
};
</script>

<style scoped>
input {
  background: var(--bg);
  border: none;
  color: var(--fg);
  outline: none;
  width: 80%;
}
.startpage {
  height: 100%;
  position: relative;
}
.prompt {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
}
.link {
}
.link:hover {
  background: var(--fg);
}
.link:hover a {
  color: var(--bg);
}
a {
  display: block;
  width: 100%;
  color: var(--fg);
  text-decoration: none;
}
p.lowercase {
  text-transform: none;
}
.line {
  border-bottom: 2px solid var(--fg);
  margin-top: 1rem;
  margin-bottom: 1rem;
  animation: line-grow 1s steps(44) 7s 1 normal both;
}
.header p {
  margin: auto;
}
.header {
  text-align: center;
  margin-bottom: 1rem;
}
.text-animation {
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid var(--fg);
  border-right-color: transparent;
}
.delay-1 {
  animation: typewriter 1s steps(44) 2s 1 normal both,
    blinkTextCursor 500ms steps(44) 2s 4 normal;
}
.delay-2 {
  animation: typewriter 1s steps(44) 3s 1 normal both,
    blinkTextCursor 500ms steps(44) 3s 4 normal;
}
.delay-3 {
  animation: typewriter 1s steps(44) 4s 1 normal both,
    blinkTextCursor 500ms steps(44) 4s 4 normal;
}
.delay-4 {
  animation: typewriter 1s steps(44) 5s 1 normal both,
    blinkTextCursor 500ms steps(44) 5s 4 normal;
}
.delay-5 {
  animation: typewriter 1s steps(44) 6s 1 normal both,
    blinkTextCursor 500ms steps(44) 6s 4 normal;
}
.delay-6 {
  animation: typewriter 1s steps(44) 7s 1 normal both,
    blinkTextCursor 500ms steps(44) 7s 4 normal;
}
.padding {
  margin-bottom: 1rem;
}
p {
  max-width: max-content;
}

@keyframes line-grow {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
