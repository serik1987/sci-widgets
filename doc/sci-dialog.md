# sci-dialog

Отображает диалоговое окно.

Диалоговое окно отличается от формы тем, что диалоговое окно по-умолчанию не видно. Оно отображается при вызове
метода open(), а также закрывается при вызове метода close(). Пользователь может также закрыть окно, нажав на
кнопку с крестиком в правом верхнем его углу.

## Атрибуты

### size

Задаёт ширину окна на десктопных устройствах. Принимает следующие значения:
* "tiny" - 250 пикселей;
* "small" - 500 пикселей;
* "large" - 1000 пикселей.
Ширина окна на мобильных устройствах будет подстроена под ширину экрана Вашего мобильного устройства.

## Свойства

## Методы

### close()

Закрывае окно и сбрасывает поля формы.

### open()

Открывает окно и сбрасывает поля формы.

### updateHeight()

Меняет высоту окна так, чтобы оно подстроилось под высоту экрана. При загрузке Web-страницы, изменении размеров
окна браузера, при отображении и скрытии диалогового окна, а также при обращении к свойству value этот метод вызывается
автоматически. Тем не менее, в некоторых случаях (например, Вы меняете количество виджетов) его придётся вызвать
вручную.

## События
