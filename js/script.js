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

    // закрытие модального окна при событии нажатия в элемент modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
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
    const modalTimerId = setTimeout(openModal, 50000);

    // функция прказывает один раз модальное окно, при скролле в самый низ, после чего удаляется это событие
    function showModalByScroll() {
        // pageYOffset количество px на которые проскроллен документ по вертикали Y
        if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            
            window.removeEventListener('scroll', showModalByScroll);
        }   
    };

    window.addEventListener('scroll', showModalByScroll);

    // MenuCard (class)

    class MenuCard {
        constructor (
            src, alt, subtitle, descr, price, parent, ...classes)
         {
            this.src = src;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.classes = classes; // массив в качестве свойства (rest оператор ...classes)
            this.parent = document.querySelector(parent);
            this.currency = 80;
            this.currencyToRub();
        }

        currencyToRub() {
            this.price = this.price * this.currency;
        }

        render() {
            const element = document.createElement('div');

            // проверка, если не передан ни один класс (пустой массив) присваеваем класс menu__item
            if (this.classes.length === 0) {
                this.element = 'meu__item';
                element.classList.add('menu__item');
            } else { 
                this.classes.forEach(className => element.classList.add(className)); // перебираем массив из классов и добавляем класс, переданный в конструкторе
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;

            this.parent.append(element); // добавляем созданный элемент на страницу
        }
    };

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        "Мeню “Фитнес“",
        "Меню 'Фитнес' - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
        850,
        ".menu .container").render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        "Меню “Премиум“",
        "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
        450,
        ".menu .container").render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        "Меню “Постное“",
        "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
        1000,
        ".menu .container").render();

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });
    
    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // отменяет стандартное поведение элемента

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage)

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            request.setRequestHeader('Content-type', 'application/json')
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            });

            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                } else {
                    showThanksModal(message.failure);
                }
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        
        prevModalDialog.classList.add('hide');
        openModal();

        const thaksModal = document.createElement('div');
        thaksModal.classList.add('modal__dialog');
        thaksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thaksModal);
        setTimeout(() => {
            thaksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    };
});