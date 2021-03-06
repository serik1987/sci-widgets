# sci-date

Данный виджет предназначен для отображения даты. Для встраивания этого виджета просто наберите:

```
<sci-date label="Дата проведения эксперимента"></sci-date
```

Если Вы хотите установить конкретную дату, то наберите следующее:

```
<sci-date label="Дата рождения" value="1980-01-01"></sci-date>
```

## Атрибуты

### inline [только чтение]

Если этот атрибут выставлен, то календарь перестает раскрываться. В этом случае содержимое контента календаря
всегда видно, а в описании отображается только одна метка.

### maxvalue

Если этот атрибут установлен, то пользователь не сможет ввести дату больше указанного в этом атрибуте значения

### minvalue

Если этот атрибут установлен, то пользователь не сможет ввести дату меньше указанного в этом атрибуте значения

### required

Если этот атрибут выставлен, то попытка прочитать значение свойства value приводит к ошибке типа TypeError
в том случае, если текущая дата не проставлена пользователем. Также генерируется сообщение об ошибке.

### value [только чтение]

Позволяет задать так называемую "дату по-умолчанию": значение, которое принимает настоящий виджет
сразу же после рендеринга.

## Свойства

### defaultValue [только чтение]

Дата "по-умолчанию", которая будет выставлена на календаре сразу же после рендеринга. Соответствует
значению атрибута value, либо равно null, если атрибут value не указан.

### maxValue 

Если значением этого свойства является объект класса Date, то пользователь не сможет ввести дату, которая больше,
чем значение данного свойства. Если значением этого свойства является null, то подобное ограничение отсутствует.

Если этому свойству присвоить строковое значение, то оно автоматически будет преобразовано в объект класса Date.

### minValue

Если значением этого свойства является объект класса Date, то пользователь не сможет ввести дату, которая меньше, чем
значение данного свойства. Если значением этого свойства является null, то подобное ограничение отсутствует.

Если этому свойству присвоить строковое значение, то оно автоматически будет преобразовано в объект класса Date.

### months [статическое свойство]

Массив, содержащий названия всех месяцев

### required

Если зачение этого свойства true, то при попытке прочитать дату тогда, когда пользователь эту самую дату не выставил,
приведет в выбрасыванию исключения типа TypeError.

### value

Дата в текущим момент времени, выставленная пользователем, либо заданная программно.

### weekDays [статическое свойство]

Массив, содержащий название дней недели

## Методы

## События

### change

Генерируется в том случае, если пользователь отмечает конкретную дату. Не генерируется, если дата отмечается программно.