window.addEventListener('DOMContentLoaded', () => {
    
    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items'); 
          
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    };

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadLine = '2020-12-31';

    // функция возвращает остаток времени в виде объекта
    function getTimeRemaining(endtime) {
        // Date.parse разбирает строковое представление даты и возвращает кол-во милисекунд, прошедших с 01.01.1970
        const t = Date.parse(endtime) - Date.parse(new Date), // разница между датами в милисекундах
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor( (t / (1000 * 60 * 60) % 24)), // делим на 24 и возвращаем остаточные часы от суток
              minutes = Math.floor((t / (1000 * 60) % 60),
              seconds = Math.floor((t / 1000) % 60));

        // возвращаем объект
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    };

    // функция добавляет 0 перед числом, если число меньше 10
    function getZero (num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    };

    // функция устанавливает таймер на страницу
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');  
          modalCloseBtn = document.querySelector('[data-close]');

    // функция открытия модального окна
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; // не дает прокручиваться body, во время откртого модального окна

        clearInterval(modalTimerId); // очищаем таймер modalTimerId 
    };

    // для всех кнопок с data атрибутом [data-modal] добавляем событие показа модального окна
    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    // функция закрытия модального окна
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);

    // закрытие модального окна при событии нажатия в элемент modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // закрытие модального окна клавишой Esc
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // задаем переменную, с таймером запуска открытия функции openModal через 3 сек
    // const modalTimerId = setTimeout(openModal, 3000);

    // функция прказывает один раз модальное окно, при скролле в самый низ, после чего удаляется это событие
    function showModalByScroll() {
        // pageYOffset количество px на которые проскроллен документ по вертикали Y
        if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            
            window.removeEventListener('scroll', showModalByScroll);
        }
        
    }

    window.addEventListener('scroll', showModalByScroll);

    // Menu template

    class MenuCard {
        constructor (
            src,
            img,
            subtitle,
            descr,
            price,
            parent
        ) {
            this.src = src;
            this.img = img;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parent);
            this.currency = 80;
            this.currencyToRub();
        }

        currencyToRub() {
            this.price = this.price * this.currency;
        }

        createElement() {
            const newDiv = document.createElement('div');
            newDiv.classList.add('menu__item');
            newDiv.innerHTML = ( `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `);

            this.parent.append(newDiv); // добавляем созданный элемент на страницу
        }
    };

    new MenuCard(
        "../img/tabs/vegy.jpg",
        "vegy",
        "Меню “Фитнес“",
        "Меню 'Фитнес' - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
        850,
        ".menu .container").createElement();

    new MenuCard(
        "../img/tabs/elite.jpg",
        "elite",
        "Меню “Премиум“",
        "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
        450,
        ".menu .container").createElement();

    new MenuCard(
        "../img/tabs/post.jpg",
        "post",
        "Меню “Постное“",
        "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
        1000,
        ".menu .container").createElement();
});