/** Global app state */
const state = {
  favorites: []
};

/**
 * Represents a user.
 */
class User {
  /**
   * @param {number} id 
   * @param {string} username 
   * @param {string} email 
   */
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  /**
   * Gets albums for the user.
   */
  async getAlbums() {
    try {
      const response = await fetch(`https://json.medrating.org/albums?userId=${this.id}`)
      const data = await response.json();

      this.albums = data.map(album => new Album(album.userId, album.id, album.title));

      return this;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Gets album by ID.
   * @param {number} albumId Album ID
   */
  getAlbum(albumId) {
    return this.albums.find(album => album.id === albumId);
  }
}

/**
 * Represents an album of the user.
 */
class Album {
  /**
   * @param {number} userId User ID
   * @param {number} id 
   * @param {string} title 
   */
  constructor(userId, id, title) {
    this.userId = userId;
    this.id = id;
    this.title = title;
  }

  /**
   * Gets photos for the album.
   */
  async getPhotos() {
    try {
      const response = await fetch(`https://json.medrating.org/photos?albumId=${this.id}`)
      const data = await response.json();

      this.photos = data.map(photo => new Photo(photo.albumId, photo.id, photo.title, photo.url));

      return this;
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Represents a photo.
 */
class Photo {
  /**
   * @param {number} albumId Album ID
   * @param {number} id
   * @param {string} title 
   * @param {string} url
   */
  constructor(albumId, id, title, url) {
    this.albumId = albumId;
    this.id = id;
    this.title = title;
    this.url = url;
  }
}

/**
 * Represents app main model.
 */
class Model {
  /** Users property. */
  static users = [];

  /**
   * Gets all the users.
   */
  static async getUsers() {
    try {
      const response = await fetch('https://json.medrating.org/users/');
      const data = await response.json();

      const users = data.map(
        user => user.username && user.email ? new User(user.id, user.username, user.email) : null
      ).filter(Boolean);

      for (const user of users) {
        await user.getAlbums();
      }

      this.users = await users;

      return this.users;

    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Gets user by ID.
   * @param {number} userId User ID.
   */
  static getUser(userId) {
    return this.users.find(user => user.id === userId);
  }
};

/**
 * View layer of the app
 */
class View {

  /**
  * DOM elements.
  */
  static elements = {
    main: document.querySelector('.js-main')
  };

  /**
  * DOM selectors.
  */
  static selectors = {
    user: 'js-user',
    album: 'js-album',
    photo: 'js-photo',
    albumGallery: 'js-album-gallery',
    albumsToggleButton: 'js-user-toggle',
    photosToggleButton: 'js-album-toggle',
    favoriteToggleButton: 'js-toggle-favorite'
  }

  /**
   * Returns markup of albums for the provided user.
   * @param {User} user 
   * @returns {string} albums markup
   */
  static getAlbumsMarkup(albums) {
    return albums.reduce((albums, album) => albums += /*html*/`
      <div class="${this.selectors.album} album user__album" data-id="${album.id}">
        <div class="album__main">
          <h3 class="album__title">${album.title}</h3>
          <button class="${this.selectors.photosToggleButton} btn-toggle-sm album__btn-toggle" title="Показать альбомы пользователя">
              <img src="images/icon-arrow-down.svg" width="16" height="16" alt="" aria-hidden="true">
          </button>
        </div>
        <div class="${this.selectors.albumGallery} album__gallery"></div>
      </div>
    `, '');
  }

  /**
   * Renders users in the DOM using provided users.
   * @param {array} users 
   */
  static renderUsers(users) {
    users.forEach(user => {
      const markup = /*html*/`
        <article class="${this.selectors.user} user" data-id="${user.id}">
          <div class="user__main">
            <header class="user__info">
              <h2 class="user__title">${user.username}</h2>
              <p class="user__email">${user.email}</p>
            </header>
            <button class="${this.selectors.albumsToggleButton} btn-toggle user__btn-toggle" title="Показать альбомы пользователя">
              <img src="images/icon-arrow-down.svg" width="24" height="24" alt="" aria-hidden="true">
            </button>
          </div>
          <div class="user__albums">
            <h3 class="user__albums-title">Альбомы:</h3>
            ${this.getAlbumsMarkup(user.albums)}
          </div>
        </article>
      `;

      this.elements.main.insertAdjacentHTML('beforeend', markup);
    });
  }

  /**
   * Renders photos for the passed album.
   * @param {Album} album 
   */
  static getPhotosMarkup(album) {
    return album.photos.reduce((photos, photo) => photos += /*html*/`
      <figure 
        class="${this.selectors.photo} ${state.favorites.find(id => photo.id === id) ? 'favorite' : ''} album__photo photo" 
        data-id="${photo.id}"
      >
        <button class="${this.selectors.favoriteToggleButton} photo__btn-favorite">
          <img src="images/icon-star.svg" width="20" height="20" alt="" aria-hidden="true">
        </button>
        <img src="${photo.url}" title="${photo.title}" alt="${photo.title}">
      </figure>
    `, '');
  }

  /**
   * Toggles user albums visibility.
   * @param {number} userId User ID
   */
  static toggleUserAlbums(userId) {
    document.querySelector(`.${this.selectors.user}[data-id="${userId}"]`).classList.toggle('open');
  }

  /**
   * Toggles album photos visibility and updates the UI.
   * @param {Album} album 
   */
  static toggleAlbumPhotos(album) {
    const albumElement = document.querySelector(`.${this.selectors.album}[data-id="${album.id}"]`);

    albumElement.classList.toggle('open');
    albumElement
      .querySelector(`.${this.selectors.albumGallery}`)
      .insertAdjacentHTML('beforeend', this.getPhotosMarkup(album))
  }
}

/**
 * Main app controller
 */
const photolog = (() => {

  /**
   * Persists favorite photos in local storage.
   */
  const persistFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
  }

  /**
   * Retrieves favorites from local storage.
   */
  const retrieveFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites'));

    if (favorites) state.favorites = favorites;
  }

  /**
   * Gets album photos and updates the UI.
   * @param {Event} e 
   */
  const getAlbumPhotos = async (button) => {
    const albumId = parseInt(button.closest(`.${View.selectors.album}`).dataset.id);
    const userId = parseInt(button.closest(`.${View.selectors.user}`).dataset.id);
    const album = Model.getUser(userId).getAlbum(albumId);

    if (!album.photos) await album.getPhotos();

    return View.toggleAlbumPhotos(album);
  }

  /**
   * Toggles favorite photo in UI and state.
   * @param {HTMLElement} button 
   */
  const toggleFavoritePhoto = button => {
    const element = button.closest(`.${View.selectors.photo}`);
    const id = parseInt(element.dataset.id);

    element.classList.toggle('favorite');
    state.favorites.push(id);
    persistFavorites();
  }

  /**
   * Delegates events.
   * @param {Event} e
   */
  const delegateEvents = e => {
    switch (true) {

      case e.target.closest(`.${View.selectors.albumsToggleButton}`) && true:
        return View.toggleUserAlbums(e.target.closest(`.${View.selectors.user}`).dataset.id);

      case e.target.closest(`.${View.selectors.photosToggleButton}`) && true:
        return getAlbumPhotos(e.target.closest(`.${View.selectors.album}`));

      case e.target.closest(`.${View.selectors.favoriteToggleButton}`) && true:
        return toggleFavoritePhoto(e.target.closest(`.${View.selectors.favoriteToggleButton}`));

      default:
        break;
    }
  }

  return {

    /** 
     * Initializes app.
     */
    init: async () => {

      retrieveFavorites();

      const users = await Model.getUsers();

      View.renderUsers(users);

      View.elements.main.addEventListener('click', e => {
        delegateEvents(e);
      });

    }

  }

})();


window.addEventListener('DOMContentLoaded', () => {
  photolog.init();
});