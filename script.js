'use strict';

///////////////////////////////////////

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');
const nav = document.querySelector('.nav');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const section1 = document.querySelector('#section--1');
const section3 = document.querySelector('#section--3');

//-----------------Modal function------------
const modalFn = function () {
  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};
//-----------------Button Smooth scroll------------

const buttonSmooth = function () {
  btnScrollTo.addEventListener('click', function (e) {
    const s1coords = section1.getBoundingClientRect();
    // console.log(s1coords);

    // console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

    // console.log(
    //   'heigh/width viewport',
    //   document.documentElement.clientHeight,
    //   document.documentElement.clientWidth
    // );

    //Scrolling
    // window.scrollTo({
    //   left: s1coords.left + window.pageXOffset,
    //   top: s1coords.top + window.pageYOffset,
    //   behavior: 'smooth',
    // });

    section1.scrollIntoView({ behavior: 'smooth' });
  });
};
//-----------------Page Navigation-----------------
const pageNavi = function () {
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      if (id !== '#')
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });
};
//-----------Tabbed component

// Method 1 (forEach)
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Method 2
// Không forEach làm chậm tiến trình
// Dùng listener lên cha của nó
// Dùng e.targer trỏ đến phần tử được click
//1. Add event listener to common parent element
//2. Determine what element originated the event

// Tabbed component

const tabbedComponent = function () {
  tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    // Guard clause
    // Chặn lỗi add class khi không tìm được el
    if (!clicked) return;

    //xoá active trên mọi el content và active
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));
    tabs.forEach(t => t.classList.remove('operations__tab--active'));

    // Activate tab
    clicked.classList.add('operations__tab--active');
    // Activate content
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
};
//-----------Menu fade animation------------
const fadeAnimation = function () {
  const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        if (el !== link) el.style.opacity = this;
      });
      logo.style.opacity = this;
    }
  };
  // Passing "argument" into handler

  nav.addEventListener('mouseover', handleHover.bind(0.5));
  nav.addEventListener('mouseout', handleHover.bind(1));
};

//-----------Sticky navigation-----------

//old method luôn quan sát vị trí scroll -> chậm
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(this.window.scrollY);
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, //Giao cắt với viewport
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const stickyNavi = function () {
  const navHeight = nav.getBoundingClientRect().height;
  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting === true) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });
  headerObserver.observe(header);
};

//-----------Reveal sections---------
const revealSections = function () {
  const allSections = document.querySelectorAll('.section');

  const revealSection = function (entries, observer) {
    const [entry] = entries;

    //if isInter = true -> run
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');

    //Close effect
    observer.unobserve(entry.target);
  };

  //options config
  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  //initialization khởi tạo
  allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
};

//-----------Lazy loading image---------
const lazyImg = function () {
  const imgTarget = document.querySelectorAll('img[data-src]');

  const lazyLoading = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;

    //chỉ xoá mờ khi tải xong
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  };

  const lazyImgObserver = new IntersectionObserver(lazyLoading, {
    root: null,
    threshold: 0, // gọi callback ngay khi một pixel của phần tử được quan sát hiển thị
    rootMargin: '50px', // bắt đầu gọi callback trước khi phần tử đến 200px của viewport
  });

  imgTarget.forEach(img => lazyImgObserver.observe(img));
};

//--------------Slider--------
const slider = function () {
  const defaultSlide = 2;
  let curSlide = defaultSlide;
  const maxSlide = slides.length;

  ////Functions
  //create dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //activate dots
  const activateDot = function (slide) {
    // clear active
    [...document.querySelectorAll('.dots__dot')].forEach(t => {
      t.classList.remove('dots__dot--active');
    });

    //add
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // go to slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  // default display

  // Next slide
  const nextSlide = function () {
    curSlide = document.querySelector('.dots__dot--active').dataset.slide;
    if (Number(curSlide) === maxSlide - 1) {
      curSlide = 0;
    } else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // Prev slide
  const prevSlide = function () {
    curSlide = document.querySelector('.dots__dot--active').dataset.slide;
    if (Number(curSlide) === 0) {
      curSlide = maxSlide - 1;
    } else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(defaultSlide);
    activateDot(defaultSlide);
  };
  init();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Arrow Left && Right keydown slide

  // Method 1: all document
  // document.addEventListener('keydown', function (e) {
  //   if (e.key === 'ArrowLeft') prevSlide();
  //   e.key === 'ArrowRight' && nextSlide();
  // });

  // Method 2: Focus (add tabindex="0")
  document.addEventListener('keydown', function (e) {
    // const isFocusInside = section3.contains(document.activeElement);

    // Method 3: getBounding
    const section3Rect = section3.getBoundingClientRect();
    const isFocusInside = section3Rect.top <= 0 && section3Rect.bottom >= 0;

    // section3Rect.left >= 0 &&
    // section3Rect.bottom <=
    //   (window.innerHeight || document.documentElement.clientHeight);
    // section3Rect.right <=
    //   (window.innerWidth || document.documentElement.clientWidth);

    if (isFocusInside) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      }
      if (e.key === 'ArrowRight') {
        nextSlide();
      }
    }
  });

  dotContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  });
};

// init
const init = function () {
  modalFn();
  buttonSmooth();
  pageNavi();
  tabbedComponent();
  slider();
  lazyImg();
  revealSections();
  stickyNavi();
  fadeAnimation();
};

init();
////////////////////////////////
// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'white';

// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// // Closest đối lập với querySelector
// // querySelector tìm sâu vào trong đối tượng dù sâu bao nhiêu
// // Closest tìm bên ngoài đối tượng cha dù xa bao nhiêu
// h1.closest('.header').style.background = 'black';

// // Going sideways: siblings
// // Đi ngang

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.9)';
// });

// const alertH1 = function (e) {
//   alert('addEventListener');

//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter');
// };
// //creating and inserting elements
// const messsage = document.createElement('div');
// messsage.classList.add('cookie-message');

// //add content
// messsage.innerHTML = `We use cookied for improved functionality and analytics. <button class ="btn btn--close-cookie">Got it!</button>`;

// //add element to html
// header.append(messsage);

// //delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     messsage.remove();
//   });

// //Styles
// messsage.style.backgroundColor = '#37383d';
// messsage.style.width = '120%';
// messsage.style.height =
//   Number.parseFloat(getComputedStyle(messsage).height, 10) + 30 + 'px';
