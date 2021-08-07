(function () {
  'use strict';
  const menuBurger = document.querySelector('.burger');
  const burgerLine = menuBurger.children[0];
  const menuList = document.querySelector('.menu');

  // click on the burger
  menuBurger.addEventListener('click', function () {
    burgerLine.classList.toggle('burger__line--open');
    menuList.classList.toggle('menu--open');
  });

  // click out of the menu
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu') && !e.target.closest('.burger') && menuList.classList.contains('menu--open')) {
      burgerLine.classList.remove('burger__line--open');
      menuList.classList.remove('menu--open');
    }
  });

  // add/delete active link in menu
  menuList.addEventListener('click', function (e) {
    if (e.target.closest('.menu__item')) {
      let active = menuList.querySelector('.menu__link--active');
      active.classList.remove('menu__link--active');
      e.target.classList.add('menu__link--active');
    }
  });
})();

(function () {
  'use strict';

  // Change viewbox attribute for svg logo
  const logo = document.querySelector('.header__logo');

  changeLogoViewBox();
  window.addEventListener('resize', changeLogoViewBox);

  function changeLogoViewBox() {
    if (document.documentElement.clientWidth <= 480) {
      logo.setAttribute('viewBox', '35 0 150 211');
    } else {
      logo.setAttribute('viewBox', '0 0 765.3 211');
    }
  }
})();
