<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ГдеСервис — автосервисы Нижнего Новгорода</title>
    <meta name="description" content="43 автосервиса Нижнего Новгорода на карте: адреса, телефоны, услуги, сайты.">
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { 
            width: 100%; 
            height: 100%; 
            overflow: hidden; 
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            color: #fff;
        }

        .header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 10px 16px;
            background: rgba(15, 12, 41, 0.92);
            backdrop-filter: blur(12px);
            border-bottom: 2px solid rgba(233, 69, 96, 0.3);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: nowrap;
            gap: 8px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
            justify-content: center;
            min-width: 0;
            overflow: hidden;
        }

        .logo-text {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -1px;
            white-space: nowrap;
        }

        .logo-text span:first-child {
            color: #ffffff;
        }

        .logo-text span:last-child {
            color: #e94560;
        }

        .tagline {
            font-size: 10px;
            color: #a0a0c0;
            font-weight: 500;
            white-space: nowrap;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }

        .header-count {
            font-size: 11px;
            color: #a0a0c0;
            text-align: right;
            line-height: 1.2;
        }
        .header-count span {
            color: #e94560;
            font-weight: 700;
        }

        .btn-add {
            display: inline-block;
            padding: 5px 12px;
            background: #4A148C;
            color: #fff;
            border: none;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .btn-add:hover {
            background: #6A1B9A;
            transform: scale(1.02);
        }
        .btn-add .white { color: #fff; }
        .btn-add .red { color: #e94560; }

        #map { 
            width: 100%; 
            height: 100%; 
        }

        .leaflet-popup-content-wrapper {
            background: #1a1a2e !important;
            border-radius: 16px !important;
            border: 1px solid rgba(233, 69, 96, 0.3) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
            color: #fff !important;
        }

        .leaflet-popup-tip {
            background: #1a1a2e !important;
            border: 1px solid rgba(233, 69, 96, 0.3) !important;
        }

        .leaflet-popup-close-button {
            color: #888 !important;
            font-size: 20px !important;
            padding: 6px 10px !important;
        }
        .leaflet-popup-close-button:hover {
            color: #fff !important;
        }

        .popup-name { 
            font-weight: 700; 
            font-size: 17px; 
            color: #fff; 
            margin-bottom: 6px; 
        }
        
        .popup-addr { 
            font-size: 14px; 
            color: #a0a0c0; 
            margin: 4px 0; 
        }
        
        .popup-phone a { 
            color: #e94560; 
            text-decoration: none; 
            font-weight: 600; 
            display: block;
            font-size: 14px;
            margin: 2px 0;
        }

        .popup-services { 
            font-size: 12px; 
            color: #ccc; 
            margin: 10px 0; 
            padding: 10px; 
            background: rgba(255,255,255,0.06); 
            border-radius: 12px; 
            max-height: 140px; 
            overflow-y: auto; 
            line-height: 1.5;
        }

        .popup-services span { 
            display: inline-block; 
            background: rgba(233, 69, 96, 0.2); 
            color: #ff99aa;
            padding: 3px 9px; 
            border-radius: 20px; 
            margin: 3px 2px; 
            font-size: 11px; 
        }

        .popup-links { 
            display: flex; 
            gap: 10px; 
            margin-top: 12px; 
            flex-wrap: wrap; 
            align-items: center;
        }

        .popup-link { 
            display: inline-block; 
            padding: 8px 18px; 
            border-radius: 30px; 
            text-decoration: none; 
            font-size: 13px; 
            font-weight: 600; 
            transition: all 0.2s;
        }

        .popup-link-vk { 
            background: #4A148C !important; 
            color: #fff !important;
        }
        .popup-link-vk .white { color: #ffffff; }
        .popup-link-vk .red { color: #e94560; }
        .popup-link-vk:hover { 
            background: #6A1B9A !important; 
            transform: scale(1.02);
        }

        .popup-link-web { 
            background: rgba(255,255,255,0.1) !important; 
            color: #aaa !important; 
        }
        .popup-link-web:hover { 
            background: rgba(255,255,255,0.2) !important; 
            color: #fff !important; 
        }

        .leaflet-control-attribution {
            display: none !important;
        }

        .custom-attribution {
            position: absolute;
            bottom: 12px;
            right: 12px;
            z-index: 999;
            font-size: 10px;
            color: #666;
            background: rgba(0,0,0,0.6);
            padding: 4px 12px;
            border-radius: 16px;
            backdrop-filter: blur(4px);
        }
        .custom-attribution a {
            color: #888;
            text-decoration: none;
        }
        .custom-attribution a:hover {
            color: #fff;
        }

        .leaflet-control-zoom {
            margin-bottom: 60px !important;
        }

        @media (max-width: 480px) {
            .header {
                padding: 8px 12px;
                flex-wrap: nowrap;
            }
            .logo {
                gap: 4px;
                flex: 1;
                justify-content: center;
            }
            .logo-text { 
                font-size: 16px; 
            }
            .tagline { 
                font-size: 8px;
                display: none; 
            }
            .header-count { 
                font-size: 9px; 
                line-height: 1.1;
                text-align: right;
            }
            .btn-add { 
                font-size: 9px; 
                padding: 4px 8px; 
            }
            .header-right {
                gap: 4px;
            }
            .leaflet-control-zoom {
                margin-bottom: 50px !important;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <div class="logo-text">
                <span>Где</span><span>Сервис</span>
            </div>
            <div class="tagline">
                Поиск и выбор автосервисов по отзывам
            </div>
        </div>
        <div class="header-right">
            <div class="header-count">
                Нижний Новгород<br>
                <span>43 СТО</span>
            </div>
            <a href="https://vk.com/gdeservic" target="_blank" class="btn-add">
                <span class="white">Добавить</span> <span class="red">СТО</span>
            </a>
        </div>
    </div>

    <div id="map"></div>

    <div class="custom-attribution">
        <a href="https://leafletjs.com/" target="_blank">Leaflet</a> · 
        <a href="https://yandex.ru/legal/maps_api/" target="_blank">Яндекс Карты</a>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', function() {
            if (typeof L === 'undefined') {
                document.getElementById('map').innerHTML = '<div style="padding:80px 20px;text-align:center;color:#999;font-size:18px;">Не удалось загрузить карту</div>';
                return;
            }

            var SERVICES = [
                { n:'Профиль-НН', a:'Порт-Артурская ул., 9 к14', t:[56.2964586,43.9132614], p:'+7 831 2668691', w:'https://profil-nn.obiz.ru/', vk:'https://vk.com/topic-240135406', d:'Легковой автосервис, Ремонт МКПП, Ремонт ходовой части, Ремонт бензиновых двигателей, Ремонт инжекторов, Развал-схождение, Замена масла, Ремонт карбюраторов, Установка и ремонт автооптики' },
                { n:'Техцентр Луидор', a:'ул. Ларина, 18', t:[56.2395290,43.9999710], p:'8 (831) 266-16-52', w:'https://luidor-sto.ru', vk:'https://vk.com/topic-240135406_67384868', d:'Легковой и грузовой автосервис, Запчасти, Шиномонтаж, Тюнинг, Ремонт ходовой части, Развал-схождение, Ремонт двигателей, Климатические системы, Ремонт стартеров и генераторов, Автосигнализации, Ремонт АКПП и МКПП, Техосмотр' },
                { n:'Автомастер', a:'ул. Поющева, 22/1', t:[56.2521720,43.8776170], p:'+7 (495) 445-03-45, +7 (920)-036-32-87', w:'https://avtma.ru/', vk:'https://vk.com/topic-240135406_67384870', d:'Сервисное обслуживание и ремонт автобусов, грузовиков, коммерческого транспорта, узлов и агрегатов' },
                { n:'Сельхозводстрой', a:'ул. Ларина, 8а', t:[56.2412600,43.9856822], p:'+79087421322, +7 (831) 466-77-15', vk:'https://vk.com/topic-240135406_67384875', d:'Легковой автосервис, Кузовной ремонт, Ремонт стартеров и генераторов, Ремонт ходовой части, Ремонт двигателей, Замена масла, Развал-схождение, Ремонт МКПП, Выхлопные системы, Грузовой автосервис, Компьютерная диагностика' },
                { n:'Ямз 77', a:'ул. Поющева, 22/1', t:[56.2521720,43.8776170], p:'8920363287', w:'https://frc77.ru/', vk:'https://vk.com/topic-240135406_67384881', d:'Агрегатный ремонт двигателя ЯМЗ, Капитальный ремонт двигателя, V-образные двигатели, Опрессовка ГБЦ' },
                { n:'Тойота Центр НН Юг', a:'ул. Ларина, 30', t:[56.2374181,44.0174426], p:'+7 (831) 425-99-99', w:'https://toyotann.ru', vk:'https://vk.com/topic-240135406_67384887', d:'Официальный дилер Toyota' },
                { n:'Приволжский', a:'Базовый пр., 3 к2', t:[56.3033702,43.8681588], p:'+7 (831) 414-66-99', vk:'https://vk.com/topic-240135406_67384890', d:'Легковой автосервис, Развал-схождение, Ходовая часть, Автозвук, Стартеры и генераторы, Бензиновые двигатели, АКПП, МКПП, Инжекторы, Выхлопные системы, Замена масла, Карбюраторы' },
                { n:'Гранд-НН', a:'Базовый пр., 3 к2', t:[56.3035020,43.8684680], p:'+7 (831) 220-44-54', w:'https://mb-star.ru/', vk:'https://vk.com/topic-240135406_67384892', d:'Легковой автосервис, Кузовной ремонт, Ходовая часть, АКПП, Климатические системы, Дизельные и бензиновые двигатели, Стартеры, Выхлопные системы, МКПП, Замена масла, Развал-схождение' },
                { n:'Дитас', a:'Базовый пр., 3 к2', t:[56.3035020,43.8684680], p:'+7 901 870-14-14', w:'https://ditasnn.ru/', vk:'https://vk.com/topic-240135406_67384897', d:'Ремонт топливных систем Евро-3, ГАЗ, МАЗ, КамАз, Common Rail BOSCH, DELPHI, SIEMENS, DENSO, Диагностика и ремонт ТНВД, форсунок, двигателя CUMMINS' },
                { n:'Каравто', a:'ул. Тимирязева, 23а', t:[56.3063614,43.9920035], p:'+79050117772, +7527629979', vk:'https://vk.com/topic-240135406_67384903', d:'Кузовной ремонт, Шиномонтаж, Ремонт стартеров и генераторов' },
                { n:'Кольчуга', a:'Салганская ул., 9Б', t:[56.3024144,44.0144340], p:'(831) 281-81-02', w:'https://kolchuga52.ru', vk:'https://vk.com/topic-240135406_67384906', d:'Ремонт двигателя, Тормозная система, Выхлопная система, Автоэлектрика, Рулевое управление, Ходовая часть, КПП и трансмиссия' },
                { n:'БЦР моторс (Казанское)', a:'Казанское ш., 6Б', t:[56.2928900,44.0758720], p:'+7 (831) 281-00-00', w:'https://service-bcr.ru', vk:'https://vk.com/topic-240135406_67384916', d:'Диагностика, Подвеска, Развал-схождение, Рулевые рейки, Стёкла и фары, Тормозная система, Трансмиссия, Агрегатный ремонт, Выхлопная система' },
                { n:'БЦР моторс (Гагарина)', a:'пр. Гагарина, 29Д', t:[56.2907750,43.9810640], p:'+7 (831) 220-00-11', w:'https://service-bcr.ru', vk:'https://vk.com/topic-240135406_67384920', d:'Диагностика, Подвеска, Развал-схождение, Рулевые рейки, Стёкла и фары, Тормозная система, Трансмиссия, Агрегатный ремонт, Выхлопная система' },
                { n:'Масленыч', a:'Деловая, 8а', t:[56.3052640,44.0647990], p:'8-800-200-82-71', w:'https://maslenych.ru', vk:'https://vk.com/topic-240135406_67384924', d:'Замена масла, диагностика, техническое обслуживание' },
                { n:'МКС', a:'Деловая, 8б', t:[56.3053520,44.0636880], p:'+7-909-295-60-36', vk:'https://vk.com/topic-240135406_67384927', d:'Легковой автосервис, Ходовая часть, Дизельные и бензиновые двигатели, АКПП, Шиномонтаж, Развал-схождение' },
                { n:'Автосервис на Волнистой', a:'Волнистая, 30', t:[56.3347947,43.8311088], p:'+79026859445', vk:'https://vk.com/topic-240135406_67384930', d:'Бензиновые двигатели, Ходовая часть, Кузовной ремонт' },
                { n:'Автосервис ТКЦ', a:'пр. Ленина, 88Б', t:[56.2582542,43.9039898], p:'+7 831 2539363', w:'https://tkcgazato.ru/service-maintenance', vk:'https://vk.com/topic-240135406_67384936', d:'Легковой и грузовой автосервис, Ходовая часть, Стартеры и генераторы, Замена масла, Развал-схождение, МКПП, Бензиновые и дизельные двигатели, Спецтехника, Техосмотр' },
                { n:'Реномаг (Ошарская)', a:'Ошарская, 78а', t:[56.3107711,44.0186469], p:'+7 800 3500012', w:'https://renomag-nn.ru', vk:'https://vk.com/topic-240135406_67384942', d:'Легковой автосервис, Запчасти для иномарок, Бензиновые и дизельные двигатели, Стартеры и генераторы, Ходовая часть, Шиномонтаж, Развал-схождение, Электронные системы, Компьютерная диагностика, Климатические системы, МКПП, Аккумуляторы, Хранение шин' },
                { n:'Реномаг (Бурнаковская)', a:'ул. Бурнаковская, 3', t:[56.3412020,43.9207620], p:'+7 800 3500012', w:'https://renomag-nn.ru', vk:'https://vk.com/topic-240135406_67384944', d:'Легковой автосервис, Запчасти для иномарок, Бензиновые и дизельные двигатели, Стартеры и генераторы, Ходовая часть, Шиномонтаж, Развал-схождение, Электронные системы, Компьютерная диагностика, Климатические системы, МКПП, Аккумуляторы, Хранение шин' },
                { n:'Сервис-центр ElPacha', a:'Ларина, 13', t:[56.2385301,43.9941559], p:'+7 831 4239285', w:'https://elpacha.ru/', vk:'https://vk.com/topic-240135406_67384948', d:'Тонирование автостёкол, Кузовной ремонт, Детейлинг, Ремонт вмятин' },
                { n:'СанРено', a:'Ларина, 13', t:[56.2385301,43.9941559], p:'+78312809954, +79527798286', w:'https://san-reno.ru/', vk:'https://vk.com/topic-240135406_67384954', d:'Дизельные и бензиновые двигатели, Климатические системы, Шиномонтаж, Развал-схождение, Топливная система, Стартеры и генераторы, Запчасти, Автосигнализации, АКПП, МКПП, Кузовной ремонт, Компьютерная диагностика, Техосмотр' },
                { n:'Шестеренка', a:'Ларина, 13', t:[56.2385301,43.9941559], p:'+7 831 4666073, +7 831 4663930', w:'https://service.shesterenka.ru/', vk:'https://vk.com/topic-240135406_67384958', d:'Тюнинг, Замена жидкостей, Электротехнические работы, Диагностика, Слесарные работы, Шиномонтаж' },
                { n:'Абт-Сервис', a:'Вторчермета, 119п1', t:[56.3106670,43.8571450], p:'+7 831 4152563', w:'http://www.abtservice.ru/', vk:'https://vk.com/topic-240135406_67384967', d:'Ремонт выхлопных систем' },
                { n:'Газель-сервис', a:'Ларина, 13', t:[56.2385301,43.9941559], p:'+7 (831) 423-92-32, +7 (929) 053-92-32', w:'https://газель-сервис.рф', vk:'https://vk.com/topic-240135406_67384973', d:'Легковой и грузовой автосервис, Бензиновые двигатели, Ходовая часть, Развал-схождение, Стартеры и генераторы, Дизельные двигатели, Топливная система' },
                { n:'Моторный центр', a:'Федосеенко, 51', t:[56.3408451,43.8106340], p:'+7 (831) 266-02-37', w:'https://motornn.ru/', vk:'https://vk.com/topic-240135406_67384994', d:'Капитальный ремонт двигателя, Компьютерная диагностика, Экспертиза, Ремонт ГБЦ, Блок цилиндров, Шлифовка коленвала, Сварка, Запчасти' },
                { n:'Сормович', a:'ул. Ефремова, 50а', t:[56.3568984,43.8606959], p:'+7-960-188-67-27', vk:'https://vk.com/topic-240135406_67385027', d:'Легковой автосервис, Ходовая часть, Стартеры и генераторы, Контрактные запчасти, Бензиновые и дизельные двигатели, Компьютерная диагностика, Запчасти для иномарок' },
                { n:'Bestway', a:'ул. Сахарова, 3', t:[56.2810109,44.0356596], p:'+7 831 2883467', w:'https://www.bestwayservice.ru/', vk:'https://vk.com/topic-240135406_67385036', d:'Легковой автосервис, Компьютерная диагностика, Ходовая часть, Замена масла, Бензиновые и дизельные двигатели, Запчасти для иномарок, Климатические системы, АКПП, МКПП, Стартеры и генераторы, Выхлопные системы, Инжекторы, Электронные системы, Карбюраторы' },
                { n:'Ритмобиль', a:'Удмуртская, 41в', t:[56.2929138,43.8764442], p:'+79030569096', w:'https://ritmobil.ru/', vk:'https://vk.com/topic-240135406_67385043', d:'Тонировка, Автосигнализации, Автозвук, Шумоизоляция' },
                { n:'Дизель Старт', a:'ул. Федосеенко, 49д', t:[56.3401460,43.8127770], p:'+7 920 2530550', w:'https://dieselstart52.ru/', vk:'https://vk.com/topic-240135406_67385048', d:'Ремонт дизельной топливной системы' },
                { n:'Стагер', a:'Сормовское ш., 24Р', t:[56.3359730,43.8888979], p:'+7 831 2759222', w:'https://stagernn.ru', vk:'https://vk.com/topic-240135406_67385053', d:'Стартеры, Генераторы, Компрессоры, Электромоторы, Радиаторы, Топливные баки, Автоэлектрика, АКБ, Топливная система, 3D-печать' },
                { n:'Альфа', a:'Коминтерна, 39E к1', t:[56.3465120,43.8907950], p:'+7 (831) 266-74-09', w:'https://alfa-52.ru', vk:'https://vk.com/topic-240135406_67385059', d:'Диагностика и ремонт подвески, ТО, Замена масел, Развал-схождение 3D, Диагностика и ремонт двигателя, Ремонт КПП, Промывка инжектора, Заправка кондиционера' },
                { n:'Конкурент', a:'Коминтерна, 39Б к1', t:[56.3467919,43.8910716], p:'+7 831 2303738', w:'https://konkurent-auto.ru', vk:'https://vk.com/topic-240135406_67385065', d:'Легковой автосервис, Инжекторы, Запчасти для отечественных авто и иномарок, Стартеры и генераторы, Ходовая часть, Шиномонтаж, Развал-схождение, Хранение шин' },
                { n:'Люкс', a:'Донбасская, 6а', t:[56.2899690,43.9008180], p:'78312838387, +79302838387', vk:'https://vk.com/topic-240135406_67385069', d:'Легковой автосервис, Кузовной ремонт, Ходовая часть, Дизельные и бензиновые двигатели, Шиномонтаж, Развал-схождение, Выхлопные системы' },
                { n:'Восток-Авто', a:'Гагарина, 121Б к3', t:[56.2252044,43.9391225], p:'+7 (831)228-09-00', w:'https://vostok-auto.ru/', vk:'https://vk.com/topic-240135406_67385093', d:'Легковой автосервис, Запчасти для иномарок, Аккумуляторы, Автосигнализации, Замена масла, Кузовной ремонт, АКПП, Электронные системы, Компьютерная диагностика, Стартеры и генераторы, Выхлопные системы, Стёкла, Бензиновые и дизельные двигатели, Развал-схождение, Ходовая часть, Климатические системы, МКПП, Шиномонтаж' },
                { n:'Автосервис (Гужевая)', a:'Гужевая, 20', t:[56.3032505,44.0274578], p:'+7 831 4174622', vk:'https://vk.com/topic-240135406_67385101', d:'Легковой автосервис, Стартеры и генераторы, Ходовая часть, Бензиновые и дизельные двигатели, АКПП, МКПП, Запчасти для иномарок, Автосигнализации, Компьютерная диагностика, Развал-схождение, Выхлопные системы, Электронные системы, Автооптика, Автохимия' },
                { n:'Река', a:'Родниковая, 75', t:[56.3130830,44.0391510], p:'+7 831 4108844', w:'https://rekannov.ru/', vk:'https://vk.com/topic-240135406_67385107', d:'Легковой автосервис, Бензиновые двигатели, Компьютерная диагностика, Развал-схождение, Ходовая часть' },
                { n:'Автотехцентр', a:'Комсомольская, 38а', t:[56.2537920,43.8503260], p:'+78314135580', w:'https://autocentrenn.ru/', vk:'https://vk.com/topic-240135406_67385116', d:'Спецавтооборудование, Легковой автосервис, Стартеры и генераторы, Запчасти, Аккумуляторы, Автохимия, Автосигнализации, Автозвук, Шины и диски, МКПП, Компьютерная диагностика, Инжекторы, Выхлопные системы, АКПП, Бензиновые и дизельные двигатели, Ходовая часть, Шиномонтаж, Развал-схождение, Автомойка, Климатические системы, Замена масла' },
                { n:'БОРН', a:'Мончегорская, 12а к2', t:[56.2326532,43.8291876], p:'+7 (901) 248-11-07', w:'https://born-auto.ru/', vk:'https://vk.com/topic-240135406_67385121', d:'Легковой автосервис, Бензиновые двигатели, Стартеры и генераторы, Развал-схождение, Мототехника, Замена масла, Компьютерная диагностика, Выхлопные системы, Ходовая часть, Кузовной ремонт' },
                { n:'CARDINAL', a:'пр. Героев, 37/4', t:[56.3238213,43.8874141], p:'+78314290909', vk:'https://vk.com/topic-240135406_67385125', d:'Легковой автосервис, Запчасти для иномарок, Автоаксессуары, Автохимия' },
                { n:'БиБиоил', a:'Медицинская, 20', t:[56.2806750,43.9959280], p:'+7 (831) 280-51-60', w:'https://bibioil.ru', vk:'https://vk.com/topic-240135406_67385127', d:'Замена масла в ДВС, АКПП, МКПП, Замена тормозной жидкости, Замена фильтров, Замена антифриза' },
                { n:'Бахпробег', a:'Шлиссельбургская, 23Д', t:[56.2952938,43.9254008], p:'+7 831 4232361', w:'https://bahprobeg.ru', vk:'https://vk.com/topic-240135406_67385131', d:'Замена масла, Автохимия, Компьютерная диагностика, Климатические системы' },
                { n:'Карданная №1', a:'Вторчермета, 7А/1', t:[56.3062697,43.8578540], p:'+79877428868', w:'https://kardan1.ru/', vk:'https://vk.com/topic-240135406_67318983', d:'Ремонт карданных валов' },
                { n:'Селект Сервис', a:'Прямая ул., 9', t:[56.2745590,43.8887380], p:'+7 920 293 55 55', w:'https://select-sto.ru/', vk:'https://vk.com/topic-240135406_67318894', d:'Легковой автосервис, Кузовной ремонт, Ходовая часть, Бензиновые двигатели, Сварочные работы, Инжекторы, Стартеры и генераторы, Запчасти, Развал-схождение, Климатические системы, Автосигнализации, Автозвук' }
            ];

            var map = L.map('map', { 
                zoomControl: true,
                attributionControl: false
            });

            L.tileLayer('https://tiles.api-maps.yandex.ru/v1/tiles?projection=web_mercator&apikey=8f80bbc1-6346-4033-9f1a-30cdd4f1a211&x={x}&y={y}&z={z}&lang=ru_RU&l=map&scale=1', {
                maxZoom: 19,
                attribution: ''
            }).addTo(map);

            var allCoords = [];
            var layerGroup = L.layerGroup().addTo(map);

            function esc(s) {
                if (!s) return '';
                var d = document.createElement('div');
                d.appendChild(document.createTextNode(s));
                return d.innerHTML;
            }

            SERVICES.forEach(function(s) {
                var lat = s.t[0];
                var lng = s.t[1];
                allCoords.push([lat, lng]);

                var tags = s.d ? s.d.split(', ').map(function(t){ 
                    return '<span>' + esc(t) + '</span>'; 
                }).join('') : '';

                var vkBtn = s.vk ? 
                    '<a href="' + s.vk + '" target="_blank" class="popup-link popup-link-vk">' +
                    '<span class="white">Отзывы</span> <span class="red">VK</span>' +
                    '</a>' : '';

                var phoneLinks = '';
                if (s.p) {
                    var phones = s.p.split(',').map(function(p) { return p.trim(); });
                    phoneLinks = phones.map(function(p) {
                        var clean = p.replace(/[\s\-\(\)]/g,'');
                        return '<a href="tel:' + clean + '" style="color:#e94560;text-decoration:none;font-weight:600;display:block;font-size:14px;margin:2px 0;">📞 ' + esc(p) + '</a>';
                    }).join('');
                }

                var popupHtml = `
                    <div style="min-width:240px;">
                        <div class="popup-name">${esc(s.n)}</div>
                        <div class="popup-addr">📍 ${esc(s.a)}</div>
                        ${phoneLinks ? `<div class="popup-phone">${phoneLinks}</div>` : ''}
                        ${tags ? `<div class="popup-services">${tags}</div>` : ''}
                        <div class="popup-links">
                            ${vkBtn}
                            ${s.w ? `<a href="${s.w}" target="_blank" class="popup-link popup-link-web">🌐 Сайт</a>` : ''}
                        </div>
                    </div>`;

                var marker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        html: `<div style="background:#e94560;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 8px rgba(233,69,96,0.5);"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                        className: 'marker-red'
                    })
                }).bindPopup(popupHtml, { maxWidth: 320, closeButton: true });

                layerGroup.addLayer(marker);
            });

            if (allCoords.length > 0) {
                map.fitBounds(allCoords, { padding: [50, 50], maxZoom: 14 });
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    L.marker([pos.coords.latitude, pos.coords.longitude], {
                        icon: L.divIcon({
                            html: `<div style="background:#22d3ee;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px #22d3ee;"></div>`,
                            iconSize: [16,16], 
                            iconAnchor: [8,8]
                        })
                    }).bindPopup('📍 Вы здесь').addTo(map);
                }, () => {}, { timeout: 6000 });
            }
        });
    </script>
</body>
</html>
