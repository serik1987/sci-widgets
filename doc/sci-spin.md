# sci-spin

Представляет собой элемент для ввода целого или вещественного числа. Справа от поля ввода находятся
кнопки со стрелками вверх и вниз. Нажатие на стрелку вверх увеличивает значение этого числа, а нажатие на стрелку
вниз уменьшает его значение.

## Атрибуты

### align

Позволяет задавать выравнивание текста в строке ввода:

* "left" - по левому краю
* "center" - по центру
* "right" - по правому краю

### max [только чтение]

Позволяет задавать значение свойства maxValue

### min [только чтение]

Позволяет задавать значение свойства minValue

### placeholder

Задаёт плейсхолдер

### readonly

Если этот атрибут проставлен, то пользователь не сможет изменить значение данного виджета

### required

Если этот атрибут проставлен, то при обращении к свойству value в том случае, когда пользователь не ввёл какого-либо
значения, будет сгенерировано исключение типа TypeError, а сам пользователь получит соответствующее сообщение об
ошибке

### step [только чтение]

Позволяет задавать значение свойства step

### value [только чтение]

Начальное значение данного виджета. Именно такое значение будет принимать виджет сразу же после его создания

### wrap

Если этот атрибут проставлен, то при достижении минимального порога происходит перебрасос на максимальное значение

## Свойства

### defaultValue [только чтение]

Отражает значение атрибута value

### maxValue

Максимальное значение вводимой величины.

По-умолчанию свойство принимает значение, указанное в атрибуте max, либо Infinity если такой атрибут не задан.

### minValue

Минимальное значение вводимой величины.

По-умолчанию свойство принимает значение, указаенное в атрибуте min, либо -Infinity, если такой атрибут не задан.

### placeholder

Плейсхолдер

### readOnly

Если свойство принимает значение, равное true, то пользователь не сможет изменить значение данного виджета.
Если значение этого свойства равно false, то пользователь так сделать может.

### required

Если данное свойство принимает значение, равное true, то в случае, если пользователь не задал числовое значение,
обращение к свойству value будет приводить к выбросу исключения типа TypeError. При этом пользователю будет
выведено соответствующее сообщение об ошибке.

Если свойство принимает значение, равное false, то в случае, если пользователь не задал числовое значение,
обращение к свойству value будет давать null.

### step

Шаг приращения. При нажатии на стрелку вверх значение увеличивается ровно на один шаг, при нажатии на стрелку вниз - 
уменьшается на этот шаг.

По-умолчанию свойство принимает значение, указанное в атрибуте step, либо 1.0, если такой атрибут не задан.

### value

Возвращает значение, выбранное, либо введённое пользователем.

### wrap

Если значение свойства равно true, то при достижении минимального порога происходит переброс на максимального значения,
а при достижении максимального порога - на минимальное значение. Если wrap принимает значение, равное false, то
ничего такого не происходит.

## Методы

### spinUp(n)

Увеличивает значение на n шагов вперёд

### spinDown(n)

Уменьшает значение на n шагов назад

## События

