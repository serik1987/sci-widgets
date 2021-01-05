# sci-date-range

Это - комбинированный виджет, состоящий из двух элементов sci-date. Он служит для задания временных интервалов
при помощи выбора начальной даты и конечной даты.

Пример использования виджета:

```
<sci-date-range label="Дата начала поездки" finish-label="Дата окончания поездки"></sci-date-range>
```

Если Вы хотите установить конкретные даты, то наберите следующее:

```
<sci-date-range label="Дата начала поездки" finish-label="Дата окончания поездки"
    start-value="2010-08-01" finish-value="2010-08-29></sci-date-range>
```

## Атрибуты

### in-block [только чтение]

Если этот атрибут выставлен, то оба календаря располагаются строго друг под другом.

### inline [только чтение]

Если этот атрибут выставлен, то календарь перестает раскрываться. В этом случае содержимое контента календаря
всегда видно, а в описании отображается только одна метка.

### finish-label

Метка на втором виджете

### finish-value [только чтение]

Позволяет задать так называемую "верхнюю границу диапазона по-умолчанию": значение, которое принимает настоящий виджет
сразу же после рендеринга.

### maxvalue

Если этот атрибут установлен, то верхняя граница диапазона не может превышать установленное в атрибуте значение

### minvalue

Если этот атрибут установлен, то нижняя граница диапазона не може превышать установленное в атрибуте значение

### start-value [только чтение]

Позволяет задать так называемую "нижнюю границу диапазона по-умолчанию": значение, которое принимает настоящий виджет
сразу же после рендеринга.

### required

Если этот атрибут выставлен, то попытка прочитать значение свойства value приводит к ошибке типа TypeError
в том случае, если нижняя или верхняя граница диапазона дат выставлены неверно.

## Свойства

### defaultFinishValue [только чтение]

Верхняя дата "по-умолчанию", которая будет выставлена на календаре сразу же после рендеринга. Соответствует
значению атрибута value, либо равно null, если атрибут value не указан.

### defaultStartValue [только чтение]

Нижняя дата "по-умолчанию", которая будет выставлена на календаре сразу же после рендеринга. Соответствует
значению атрибута value, либо равно null, если атрибут value не указан.

### finishLabel

Метка на втором виджете

### finishValue

Верхняя граница даты в текущий момент времени

### maxValue

Если значением этого свойства является объект класса Date, то пользователь не сможет ввести верхнюю границу, которая
больше, чем значение данного свойства. Если значением этого свойства является null, то подобное ограничение отсутствует.

Если этому свойству присвоить строковое значение, то оно автоматически будет преобразовано в объект класса Date.

### minValue

Если значением этого свойства является объект класса Date, то пользователь не сможет ввести дату, которая меньше, чем
значение данного свойства. Если значением этого свойства является null, то подобное ограничение отсутствует.

Если этому свойству присвоить строковое значение, то оно автоматически будет преобразовано в объект класса Date.

### required

Если зачение этого свойства true, то при попытке прочитать дату тогда, когда пользователь эту самую дату не выставил,
приведет в выбрасыванию исключения типа TypeError.

### startValue

Нижняя граница даты в текущий момент времени.

### value

Объект, имеющий свойства start и finish. start соответствует начальной дате, a finish - конечной.

## Методы

## События

### change

Генерируется в том случае, если пользователь изменил тот или иной диапазон дат.