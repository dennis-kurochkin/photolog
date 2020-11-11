const TAB_CATALOG = 'catalog';
const TAB_FAVORITES = 'favorites';

/** Global app state. */
const state = {
  openedTab: TAB_CATALOG,
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

  /**
   * Gets photo by ID.
   * @param {number} photoOd Photo ID
   */
  getPhoto(photoId) {
    return this.photos.find(photo => photo.id === photoId);
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
    app: document.querySelector('#app'),
    wrapper: document.querySelector('.js-wrapper'),
    main: document.querySelector('.js-main'),
    catalogButton: document.querySelector('.js-catalog-btn'),
    favoritesButton: document.querySelector('.js-favorites-btn')
  };

  /**
   * DOM selectors.
   */
  static selectors = {
    catalogButton: 'js-catalog-btn',
    favoritesButton: 'js-favorites-btn',
    user: 'js-user',
    album: 'js-album',
    photo: 'js-photo',
    albumGallery: 'js-album-gallery',
    albumsToggleButton: 'js-user-toggle',
    photosToggleButton: 'js-album-toggle',
    favoriteToggleButton: 'js-toggle-favorite',
    favoriteListItem: 'js-favorite-item',
    favoriteItemToggle: 'js-favorite-item-toggle',
    openPhotoLink: 'js-open-photo',
    popup: 'js-popup',
    popupCloseButton: 'js-popup-close',
  }

  /**
   * Clears main container in the UI.
   */
  static clearMain() {
    return this.elements.main.innerHTML = '';
  }

  /**
   * Opens catalog tab.
   * @param {array} users 
   */
  static openCatalogTab(users) {
    this.clearMain();
    this.elements.catalogButton.classList.add('active');
    this.elements.favoritesButton.classList.remove('active');
    this.renderUsers(users);
  }

  /**
   * Opens favorites tab.
   * @param {array} favorites 
   */
  static openFavoritesTab(favorites) {
    this.clearMain();
    this.elements.favoritesButton.classList.add('active');
    this.elements.catalogButton.classList.remove('active');
    this.renderFavorites(favorites);
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
   * Renders favorites photos list in the UI.
   * @param {array} favorites 
   */
  static renderFavorites(favorites) {
    const favoritesMarkup = favorites.reduce((favorites, favorite) => favorites += /*html*/`
      <div class="${this.selectors.favoriteListItem} album user__album" data-id="${favorite.id}">
        <div class="album__main">
          <h3 class="album__title">
            <a href="${favorite.url}" class="${this.selectors.openPhotoLink}" title="${favorite.title}">${favorite.title}</a>
          </h3>
          <button class="${this.selectors.favoriteItemToggle} photo__btn-favorite photo__btn-favorite--static active">
            <img src="images/icon-star.svg" width="20" height="20" alt="" aria-hidden="true">
          </button>
        </div>
      </div>
      `, '');

    const markup = /*html*/`
      <article class="user open">
        <div class="user__albums" style="margin-top: 0;">
          ${favoritesMarkup}
        </div>
      </article>
    `;

    this.elements.main.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders photos for the passed album.
   * @param {Album} album 
   */
  static getPhotosMarkup(album) {
    return album.photos.reduce((photos, photo) => photos += /*html*/`
      <figure 
        class="${this.selectors.photo} ${state.favorites.find(statePhoto => photo.id === statePhoto.id) ? 'favorite' : ''} album__photo photo" 
        data-id="${photo.id}"
      >
        <button class="${this.selectors.favoriteToggleButton} photo__btn-favorite">
          <img src="images/icon-star.svg" width="20" height="20" alt="" aria-hidden="true">
        </button>
        <a href="${photo.url}" class="${this.selectors.openPhotoLink}" title="${photo.title}">
          <img src="${photo.url}" title="${photo.title}" alt="${photo.title}">
        </a>
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

  /**
   * Renders pop-up with photo in the UI.
   * @param {string} url 
   * @param {string} title 
   */
  static renderPhotoPopUp(url, title) {
    const markup = /*html*/`
      <div class="${this.selectors.popup} overlay">
        <div class="popup">
          <button class="${this.selectors.popupCloseButton} popup__btn-close" title="Закрыть всплывающее окно">
            <img src="images/close.svg" width="20" height="20" alt="" aria-hidden="true">
          </button>
          <img src="${url}" title="${title}" alt="${title}">
        </div>
      </div>
    `;

    this.elements.app.insertAdjacentHTML('beforeend', markup)
  }

  /**
   * Removes photo from the UI.
   */
  static removePhotoPopUp() {
    document.querySelector(`.${this.selectors.popup}`).remove();
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
    const photoId = parseInt(element.dataset.id);
    const albumId = parseInt(element.closest(`.${View.selectors.album}`).dataset.id);
    const userId = parseInt(element.closest(`.${View.selectors.user}`).dataset.id);
    const photo = Model.getUser(userId).getAlbum(albumId).getPhoto(photoId);
    const photoIndexInState = state.favorites.findIndex(statePhoto => photo.id === statePhoto.id);

    photoIndexInState !== -1 ?
      state.favorites.splice(photoIndexInState, 1) : state.favorites.push(photo);

    persistFavorites();

    element.classList.toggle('favorite');
  }

  /**
   * Opens photo in pop-up.
   * @param {Event} e
   * @param {HTMLElement} link 
   */
  const openPhotoInPopUp = (e, link) => {
    e.preventDefault();

    View.renderPhotoPopUp(link.getAttribute('href'), link.getAttribute('title'));
  }

  /**
   * Toggles favorite list item in UI and state.
   * @param {HTMLElement} button 
   */
  const toggleFavoriteListItem = button => {
    const photoElement = button.closest(`.${View.selectors.favoriteListItem}`);
    const photoId = photoElement.dataset.id;
    const photoIndexInState = state.favorites.findIndex(statePhoto => photoId === statePhoto.id);

    state.favorites.splice(photoIndexInState, 1);
    persistFavorites();

    photoElement.remove();
  }


  /**
   * Delegates events.
   * @param {Event} e
   */
  const delegateEvents = e => {
    switch (true) {

      // Catalog button clicked
      case e.target.matches(`.${View.selectors.catalogButton}`):
        state.openedTab === TAB_FAVORITES ? View.openCatalogTab(Model.users) : null;
        state.openedTab = TAB_CATALOG;
        break;

      // Favorites button clicked
      case e.target.matches(`.${View.selectors.favoritesButton}`):
        state.openedTab === TAB_CATALOG ? View.openFavoritesTab(state.favorites) : null;
        state.openedTab = TAB_FAVORITES;
        break;

      // Open albums button clicked
      case e.target.closest(`.${View.selectors.albumsToggleButton}`) && true:
        return View.toggleUserAlbums(e.target.closest(`.${View.selectors.user}`).dataset.id);

      // Open photos button clicked
      case e.target.closest(`.${View.selectors.photosToggleButton}`) && true:
        return getAlbumPhotos(e.target.closest(`.${View.selectors.album}`));

      // Add to favorite button clicked
      case e.target.closest(`.${View.selectors.favoriteToggleButton}`) && true:
        return toggleFavoritePhoto(e.target.closest(`.${View.selectors.favoriteToggleButton}`));

      // Open pop-up button clicked
      case e.target.closest(`.${View.selectors.openPhotoLink}`) && true:
        return openPhotoInPopUp(e, e.target.closest(`.${View.selectors.openPhotoLink}`));

      // Close pop-up button clicked
      case e.target.closest(`.${View.selectors.popupCloseButton}`) && true:
        return View.removePhotoPopUp();

      // Favorite list item toggle button click
      case e.target.closest(`.${View.selectors.favoriteItemToggle}`) && true:
        return toggleFavoriteListItem(e.target.closest(`.${View.selectors.favoriteItemToggle}`));

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

      View.elements.app.addEventListener('click', e => {
        delegateEvents(e);
      });

    }

  }

})();

// Initialize app when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  photolog.init();
});