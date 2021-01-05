# SciExpandableWidget

Данный класс является общим классом-предком для таких виджетов, как sci-date, sci-time, sci-combo-box и прочие.
Их общей особенностью является то, что они состоят из двух частей: контента и описания. Описание виджета видно
всегда, оно содержит синюю метку, кототкую строку, а также кнопку-стрелку. В свою очередь контент, как правило,
скрыт. Для того, чтобы его отобразить, надо нажать на кнопку-стрелку. Повторное нажатие на кнопку-стрелку снова
спрятывает контент.

## Атрибуты

### inline [только чтение]

Делает элемент встроенным.

У встроенных элементов контент всегда виден, его невозможно спрятать. Он включен в нормальный поток документа.
Описание же, в свою очередь, всегда скрыто.

### opened

Если этот атрибут выставлен, контент виден. Если нет - то он убран.

## Свойства

### closed

true, если контент не виден, false в противном случае

### content

Возвращает элемент, который будет отображен уже после того, когда пользователь откроет список.

### opened

true, если контент виден, false в противном случае

### text

Текст, который будет выводиться под самой меткой.

## Методы

### close()

Закрывает контент

### open()

Открывает контент

## События

### sci-open

Генерируется при открытии контента пользователем, либо программно

### sci-close

Генерируется при закрытии контента пользователем, либо программно

## Для разработчика

### _adjustOpen()

Изменяет содержимое элемента-контента таким образом, чтобы тот никогда не заходил за нижнюю границу экрана.
Этот метод необходимо выполнять сразу же после того, когда все необходимые изменения в контент внесены.

### _autoadjustOpen [только чтение]

Если значение этого свойства равно true, то функция _adjustOpen() вызывается сразу же после того, когда пользователь
откроет контент. Если это значение этого свойства равно false, то Вы сами должны позаботиться о том, чтобы эта функция
вызывалась примерно вот так:

```
let self = this;
element.addEventListener("sci-open", event => {
    ..... /* Content rendering routines */
    self._adjustOpen();
});

```

### _createTemplate(htmlCode)

Этот метод был видоизменён, и теперь он содержит картинку.

### _implementExpansion()

Поместите вызов этого метода в конструктор, сразу после того, когда Вы собрали HTML-дерево и встроили его в окружение