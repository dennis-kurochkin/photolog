const Model = (() => {

  class User {
    constructor(id, title, email) {
      this.id = id;
      this.title = title;
      this.email = email;
    }

    async getAlbums() {

    }
  }

  class Album {
    constructor(id, title) {
      this.id = id;
      this.title = title;
    }

    async getPhotos() {

    }
  }

})();

const View = (() => {

})();

const Photolog = (() => {

  return {
    init: () => {
      console.log('Hello world!');
    }
  }

})();

Photolog.init();