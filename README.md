<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![MIT License][license-shield]][license-url]

Интерактивный список пользователей, их альбомов и фотографий на нативном JavaScript.

<a href="https://dennis-kurochkin.github.io/preview/photolog/index.html" target="_blank" rel="noopener noreferrer">🔍 Посмотреть как работает</a>


## Содержание

- [Содержание](#содержание)
- [О проекте](#о-проекте)
  - [Что я использовал](#что-я-использовал)
- [Полезные ссылки](#полезные-ссылки)
- [TODO](#todo)


## О проекте

Выводит интерактивный список пользователей, получаемый с помощью API. Приложение позволяет просматривать фотоальбомы и фотографии пользователей, а также добавлять фотографии в избранные. Можно перейти как на страницу каталога, так и на страницу избранных фотографий.


### Что я использовал

* JavaScript & ESNext: 
  * IIFE
  * Async / Await
  * Classes, static methods and properties
  * Template Strings
  * Event Delegation
  * local storage
* JSDoc
* Sass
* App state
* Global constants
* MVC architecture


## Полезные ссылки

📧 Мой e-mail:  dennis.kurochkin@gmail.com <br />
💼 Ссылка на проект: [https://github.com/dennis-kurochkin/photolog](https://github.com/dennis-kurochkin/photolog)


## TODO

- [x] Get and list users in the UI
- [x] Get and list albums for users in the UI
- [x] Get and list photos for albums in the UI
- [x] Add photo title
- [x] Add favorite photos thing, write 'em to local storage
- [x] Add pop-up by click to every image 
- [x] Add clickable 'Catalog' and 'Favorite' links
- [x] No page reloads
- [ ] In favorites page make a list of photos with just titles, on click show the photo full screen, add star there too
- [x] Works in chrome and firefox


<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/dennis-kurochkin/photolog.svg?style=flat-square
[contributors-url]: https://github.com/dennis-kurochkin/photolog/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dennis-kurochkin/photolog.svg?style=flat-square
[forks-url]: https://github.com/dennis-kurochkin/photolog/network/members
[stars-shield]: https://img.shields.io/github/stars/dennis-kurochkin/photolog.svg?style=flat-square
[stars-url]: https://github.com/dennis-kurochkin/photolog/stargazers
[issues-shield]: https://img.shields.io/github/issues/dennis-kurochkin/photolog.svg?style=flat-square
[issues-url]: https://github.com/dennis-kurochkin/photolog/issues
[license-shield]: https://img.shields.io/github/license/dennis-kurochkin/photolog.svg?style=flat-square
[license-url]: https://github.com/dennis-kurochkin/photolog/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
