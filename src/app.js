
/**
 * Represents a user.
 */
class User {
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

      return this.albums;
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Represents an album of the user.
 */
class Album {
  constructor(userId, id, title) {
    this.userId = userId;
    this.id = id;
    this.title = title;
  }

  /**
   * Gets photos for the album.
   */
  async getPhotos() {

  }
}

/**
 * App main model.
 */
const model = (() => {
  const getUsers = async () => {
    try {
      const response = await fetch('https://json.medrating.org/users/');
      const data = await response.json();

      return data.map(
        user => user.username && user.email ? new User(user.id, user.username, user.email) : null
      ).filter(Boolean);

    } catch (e) {
      console.error(e);
    }
  }

  // Returned object by IIFE
  return { getUsers }

})();

/**
 * View layer of the app
 */
const view = (() => {

  /**
   * DOM elements.
   */
  const elements = {
    main: document.querySelector('.js-main')
  }

  /**
   * DOM selectors.
   */
  const selectors = {
    user: 'js-user',
    albumsToggleButton: 'js-user-toggle'
  }

  /**
   * Returns markup of albums for the provided user.
   * @param {User} user 
   * @returns {string} albums markup
   */
  const getAlbumsMarkup = async user => {
    const albums = await user.getAlbums();
    const markup = await albums.reduce((albums, album) => albums += /*html*/`
          <div class="album user__album" data-id="${album.id}">
            <div class="album__main">
              <h3 class="album__title">${album.title}</h3>
              <button class="js-album-toggle btn-toggle-sm album__btn-toggle" title="Показать альбомы пользователя">
                  <img src="images/icon-arrow-down.svg" width="16" height="16" alt="" aria-hidden="true">
              </button>
            </div>
          </div>
        `, '');

    return markup;
  }

  /**
   * Renders users in the DOM using provided users.
   * @param {array} users 
   */
  const renderUsers = async users => {
    for (const user of users) {
      const albums = await getAlbumsMarkup(user);
      const markup = /*html*/`
            <article class="${selectors.user} user" data-id="${user.id}">
              <div class="user__main">
                <header class="user__info">
                  <h2 class="user__title">${user.username}</h2>
                  <p class="user__email">${user.email}</p>
                </header>
                <button class="${selectors.albumsToggleButton} btn-toggle user__btn-toggle" title="Показать альбомы пользователя">
                  <img src="images/icon-arrow-down.svg" width="24" height="24" alt="" aria-hidden="true">
                </button>
              </div>
              <div class="user__albums">
                <h3 class="user__albums-title">Альбомы:</h3>
                ${albums}
              </div>
            </article>
        `;

      elements.main.insertAdjacentHTML('beforeend', markup);
    }
  }

  /**
   * Renders photos for the passed album.
   * @param {Album} album 
   */
  const renderPhotos = album => {
    const markup = /*html*/`
      <figure class="album__photo photo">
        <button class="photo__btn-favorite">
          <img src="images/icon-star-grey.svg" width="20" height="20" alt="" aria-hidden="true">
        </button>
        <img src="https://via.placeholder.com/600/14ba42" alt="et qui rerum">
      </figure>
    `;
  }

  /**
   * Toggles user albums visibility.
   * @param {number} userId User ID
   */
  const toggleUserAlbums = userId => {
    document.querySelector(`.${selectors.user}[data-id="${userId}"]`).classList.toggle('open');
  }

  // Returned object by IIFE
  return {
    elements,
    selectors,
    renderUsers,
    toggleUserAlbums
  }
})();

/**
 * Main app controller
 */
const photolog = (() => {

  return {
    init: async () => {

      view.elements.main.innerHTML = '';

      const users = await model.getUsers();

      view.renderUsers(users);

      view.elements.main.addEventListener('click', e => {
        switch (true) {
          case e.target.closest(`.${view.selectors.albumsToggleButton}`) && true:
            return view.toggleUserAlbums(e.target.closest(`.${view.selectors.user}`).dataset.id);
          default:
            break;
        }
      })

    }
  }

})(model, view);


window.addEventListener('DOMContentLoaded', () => {
  photolog.init();
});