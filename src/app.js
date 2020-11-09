window.addEventListener('DOMContentLoaded', () => {

  const model = (() => {

    class User {
      constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
      }

      async getAlbums() {
        try {
          await fetch(`https://json.medrating.org/albums?userId=${this.id}`)
            .then(response => response.json())
            .then(data => this.albums = data.map(album => new Album(album.userId, album.id, album.title)));
          
            return this.albums;
        } catch (e) {
          console.error(e);
        }
      }
    }

    class Album {
      constructor(userId, id, title) {
        this.userId = userId;
        this.id = id;
        this.title = title;
      }

      async getPhotos() {

      }
    }

    const getUsers = async () => {
      try {
        return await fetch('https://json.medrating.org/users/')
          .then(response => response.json())
          .then(data => data.map(
            user => user.username && user.email ? new User(user.id, user.username, user.email) : null
          ))
          .then(data => data.filter(Boolean));
      } catch (e) {
        console.error(e);
      }
    }

    return { getUsers }

  })();

  const view = (() => {

    const elements = {
      main: document.querySelector('.js-main')
    }

    const selectors = {

    }

    const renderAlbums = async user => {
      const albums = await user.getAlbums();

      const markup = albums.reduce((albums, album) => {
        return albums += /*html*/`
          <div class="album user__album" data-id="${album.id}">
            <div class="album__main">
              <h3 class="album__title">${album.title}</h3>
              <button class="js-album-toggle btn-toggle-sm album__btn-toggle" title="Показать альбомы пользователя">
                  <img src="images/icon-arrow-down.svg" width="16" height="16" alt="" aria-hidden="true">
              </button>
            </div>
          </div>
        `;
      }, '');
    }

    const renderUsers = users => {
      users.forEach(user => {
        const albums = renderAlbums(user);

        const markup = /*html*/`
            <article class="user" data-id="${user.id}">
              <div class="user__main">
                <header class="user__info">
                  <h2 class="user__title">${user.username}</h2>
                  <p class="user__email">${user.email}</p>
                </header>
                <button class="js-user-toggle btn-toggle user__btn-toggle" title="Показать альбомы пользователя">
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
      });
    }

    return {
      elements,
      selectors,
      renderUsers
    }
  })();

  const photolog = (() => {

    return {
      init: async () => {

        view.elements.main.innerHTML = '';
        const users = await model.getUsers();

        view.renderUsers(users);

      }
    }

  })(model, view);

  photolog.init();

})