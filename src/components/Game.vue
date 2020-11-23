<template>
  <div class="inner">
    <div class="header">
      <p class="anim-typewriter">robco industries (tm) termlink protocol</p>
      <p
        class="anim-typewriter warning"
        v-if="currentAttempt === maxAttempts - 1"
      >
        !!! warning: lockout imminent !!!
      </p>
      <p v-if="!gameOver">enter password now</p>
    </div>
    <div class="attempts anim-typewriter">
      {{ maxAttempts - currentAttempt }} attempt(s) left:
      <span
        class="attempt-block"
        v-for="attempt in maxAttempts - currentAttempt"
        :key="attempt"
      ></span>
    </div>
    <div class="hacking-wrapper">
      <div class="choices">
        <div
          class="choice"
          v-for="(password, index) in passwords"
          :key="'line' + index"
        >
          <div class="line  anim-typewriter">
            <div class="hex">{{ hexValues[index] }}</div>
            <div class="string">
              <div class="pad">
                <div
                  class="pad-char"
                  @mouseenter="selectHoverChar(char)"
                  v-for="(char, padIndex) in getPadStart(index).split('')"
                  :key="'padstart' + index + 'p' + padIndex"
                >
                  {{ char }}
                </div>
              </div>
              <div
                class="password"
                @click="evaluateChoice(index)"
                @mouseenter="selectHover(index)"
              >
                {{ getPassword(index) }}
              </div>
              <div class="pad">
                <div
                  class="pad-char"
                  @mouseenter="selectHoverChar(char)"
                  v-for="(char, padIndex) in getPadEnd(index).split('')"
                  :key="'padend' + index + 'p' + padIndex"
                >
                  {{ char }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="results">
        <div class="results-wrapper">
          <div
            class="feedback"
            v-for="(feedback, index) in feedbacks"
            :key="'fb_' + index"
          >
            <div class="word">>{{ feedback.word }}</div>
            <div class="status">
              {{
                feedback.correct
                  ? ">Exact Match! Please wait while system is accessed"
                  : ">Entry denied"
              }}
            </div>
            <div class="numCorrect" v-if="!feedback.correct">
              {{ `>${feedback.numCorrect}/${wordLength} correct.` }}
            </div>
          </div>
        </div>
        <div class="input">> {{ currentHover }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { words } from "./../words";

export default {
  name: "Game",
  data() {
    return {
      currentHover: "",
      gameOver: false,
      success: false,
      maxAttempts: 5,
      currentAttempt: 0,
      wordLength: 4,
      numLines: 26,
      lineLength: 12,
      passwordIndex: undefined,
      passwords: [],
      feedbacks: [],
      hexValues: [],
      PAD_CHARACTERS: [
        "(",
        ")",
        "{",
        "}",
        "[",
        "]",
        "~",
        "#",
        "@",
        "^",
        "+",
        "*",
        "!",
        "=",
        ",",
        "/",
        "?",
        "\\",
        "&",
      ],
    };
  },
  methods: {
    selectHover(index) {
      this.currentHover = this.getPassword(index);
    },
    selectHoverChar(char) {
      this.currentHover = char;
    },
    evaluateChoice(index) {
      if (this.gameOver) {
        return;
      }
      let string = this.getPassword(index);
      if (index === this.passwordIndex) {
        this.feedbacks.push({
          word: string,
          correct: true,
          numCorrect: this.wordLength,
        });
        this.gameOver = true;
        this.success = true;
        setTimeout(() => {
          this.$emit("done");
        }, 1000);
        return;
      }
      let numMatching = this.getMatchingCharacters(string);
      this.feedbacks.push({
        word: string,
        correct: false,
        numCorrect: numMatching,
      });
      this.currentAttempt += 1;
      if (this.currentAttempt === this.maxAttempts) {
        this.gameOver = true;
        this.success = false;
      }
    },
    getMatchingCharacters(string) {
      let matching = 0;
      let correctPassword = this.getPassword(this.passwordIndex);

      for (let i = 0; i < this.wordLength; i++) {
        matching = string[i] === correctPassword[i] ? matching + 1 : matching;
      }
      return matching;
    },
    randomChoice(list) {
      return list[Math.floor(Math.random() * list.length)];
    },
    getPadCharacter() {
      return this.randomChoice(this.PAD_CHARACTERS);
    },
    generateHex() {
      return `0xF${Math.floor(Math.random() * 10)}${Math.floor(
        Math.random() * 10
      )}${Math.floor(Math.random() * 10)}`;
    },
    getPadStart(index) {
      return this.passwords[index].string
        .split("")
        .splice(0, this.passwords[index].padStart)
        .join("");
    },
    getPadEnd(index) {
      return this.passwords[index].string
        .split("")
        .splice(this.passwords[index].padStart + this.wordLength)
        .join("");
    },
    getPassword(index) {
      return this.passwords[index].string
        .split("")
        .splice(this.passwords[index].padStart, this.wordLength)
        .join("");
    },
    padString(string) {
      let splitPosition = Math.floor(
        Math.random() * (this.lineLength - this.wordLength)
      );
      for (let i = 1; i <= this.lineLength - this.wordLength; i++) {
        string =
          i <= splitPosition
            ? string.padStart(this.wordLength + i, this.getPadCharacter())
            : string.padEnd(this.wordLength + i, this.getPadCharacter());
      }
      return { string, padStart: splitPosition };
    },
    sleep(delay) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    },
    async generatePasswords() {
      let possibleWords = words
        .split(" ")
        .filter((word) => word.length === this.wordLength);
      for (let i = 0; i < this.numLines; i++) {
        this.passwords.push(this.padString(this.randomChoice(possibleWords)));
        await this.sleep(300);
      }
    },
    generateHexValues() {
      for (let i = 0; i < this.numLines; i++) {
        this.hexValues.push(this.generateHex());
      }
    },
    selectCorrectPassword() {
      this.passwordIndex = Math.floor(Math.random() * this.numLines);
    },
  },
  mounted: function() {
    this.generatePasswords();
    this.selectCorrectPassword();
    this.generateHexValues();
    // this.$emit("done");
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 2rem;
}
.attempts {
  margin-bottom: 1rem;
}
.attempt-block {
  display: inline-block;
  background: var(--fg);
  width: 1rem;
  height: 1rem;
  margin-right: 1rem;
}

.choices {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;
  margin-right: 1rem;
}
.line {
  max-width: max-content;
}
.hex,
.string {
  display: inline-block;
}

.hex {
  margin-right: 1rem;
  text-transform: none;
}
.pad,
.password {
  display: inline-block;
}
.pad-char {
  display: inline-block;
  width: max-content;
  cursor: crosshair;
}
.pad-char:hover {
  color: var(--bg);
  background: var(--fg);
}
.password {
  cursor: crosshair;
}
.password:hover {
  color: var(--bg);
  background: var(--fg);
}
.hacking-wrapper {
  display: flex;
  align-items: flex-end;
}
.results {
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  width: 200px;
}
.results-wrapper {
  width: 100%;
}
.feedback .status,
.feedback .numCorrect {
  text-transform: none;
}
.warning {
  animation: blink 1.5s ease-in-out 0s infinite;
  margin-bottom: 1rem;
}

.anim-typewriter.fast {
  animation: typewriter 0.2s steps(44) 1s 1 normal both,
    blinkTextCursor 500ms steps(44) infinite normal;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
