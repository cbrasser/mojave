const DB_NAME = "mojave";
const DB_VERSION = 2;

let DB;

export default {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }

      let request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.log("Error opening db", e);
        reject("Error");
      };

      request.onsuccess = (e) => {
        DB = e.target.result;
        console.log("got db");
        resolve(DB);
      };

      request.onupgradeneeded = (e) => {
        let db = e.target.result;
        console.log(e.oldVersion);
        if (e.oldVersion < 2) {
          db.createObjectStore("links", {
            autoIncrement: true,
          });
          db.createObjectStore("username", {
            autoIncrement: true,
          });
        }
      };
    });
  },

  async getUsername() {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["username"], "readonly");
      trans.oncomplete = () => {
        resolve(username);
      };

      let store = trans.objectStore("username");
      let username = "USER";

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          username = cursor.value;
          cursor.continue();
        }
      };
    });
  },

  async saveUsername(name) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["username"], "readwrite");
      trans.oncomplete = () => {
        resolve(true);
      };

      trans.onerror = (e) => {
        console.log(e);
        resolve(false);
      };
      let store = trans.objectStore("username");
      store.put(name);
    });
  },

  async getLinks() {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["links"], "readonly");
      trans.oncomplete = () => {
        resolve(links === undefined ? [] : links);
      };

      let store = trans.objectStore("links");
      let links = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          links = cursor.value;
          cursor.continue();
        }
      };
    });
  },

  async saveLinks(links) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["links"], "readwrite");
      trans.oncomplete = () => {
        resolve(true);
      };

      trans.onerror = (e) => {
        console.log(e);
        resolve(false);
      };
      let store = trans.objectStore("links");
      store.put(links);
    });
  },
};
