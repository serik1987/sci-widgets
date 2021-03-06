# sci-time

Служит для отображения времени. Пример использования:

```
<sci-time label="Начало эксперимента" value="08:00"></sci-time>
```

Время всегда в виде строки hh:mm:ss.mmm и не имеет ничего общего с классом Date.
Допускается также задавать время в виде объекта, содержащего свойства hour, minute, second,
millisecond, например:

```
{hour: 2, minute: 36, second: 48, millisecond: 853}
```

эквивалентна вот такой вот строке:

```
"2:36:48.853"
```

Если атрибут relative опущен, то допускается не указывать секунды, они будут равны нулю. Кроме этого,
если атрибут relative поднят, то допускается не указывать часы

Вне зависимости от значения атрибута relative допускается не указывать миллисекунды. Они также
будут равны нулю.

Времена возвращаются только в виде объекта.

## Атрибуты

### hours

Если атрибут relative не выставлен, то значение этого атрибута игнорируется.

Если выставлен атрибут relative и атрибут hours, то часы в этом виджете отображаются и могут принимать значение
от 0 до 23.

Если выставлен атрибут relative, но убран атрибут hours, то время не может превышать 0:59:59.999, а сами часы
не отображаются.

### maxvalue

Если этот атрибут проставлен, то время не может быть выше определенного значения

### millis

Если этот атрибут выставлен, то поддерживается время в миллисекундах. Если же он убран, такая
поддержка отсутствует, возвращаемое количество миллисекунд всегда равно 0.

Без проставленного атрибута seconds, либо без проставленного атрибута relative не работает.

### minvalue

Если этот атрибут проставлен, то время не может быть ниже определенного значения

### relative [только чтение]

Если этот атрибут выставлен, то указывается так называемое "относительное время", у которого количество
часов может быть больше 23, если атрибут hours стоит, либо не превышать 0, если этот атрибут отсутствует.

### required

Если этот атрибут выставлен, то при попытке прочитать время, которое не было введено пользователем или программно
будет сгенерировано исключение.

### seconds

Если этот атрибут выставлен, то поддерживается время в секундах. Если же он убран, то подобный атрибут
не поддерживается, количество секунд всегда равно 0.

Не работает, если свойство relative выставлено: система ведет себя так, как если бы этот атрибут был бы выставлен.

### value [только чтение]

Начальное значение времени. Если этот атрибут отсутствует, то - "00:00:00.000".

## Свойства

### defaultValue [только чтение]

Начальное значение времени, как оно было указано в атрибуте. Это значение не меняется программно или
пользователем.

### hours

Позволяет управлять значением атрибута hours.

### maxValue

Если это свойство принимает значение, отличное от значения null, то время не может превышать значение,
указанное в этом свойстве

### millis

Если значение свойства true, то поддерживается время в миллисекундах. Если оно равно false, то такая поддержка
отсутствует, время в миллисекундах всегда равно нулю.

Без проставленного атрибута seconds, либо без проставленного атрибута relative не работает.

### minValue

Если это свойство принимает значение, отличное от значения null, то время не может быть ниже значения,
указанного в этом свойстве.

### relative [только чтение]

Позволяет управлять атрибутом relative

### required

Если значение данного атрибута - true, то при попытке прочитать время, которое не было выставлено пользователем,
будет сформировано исключение.

### seconds

Если значение этого свойства - true, то поддерживается время в секундах. В противном случае секунды не
поддерживаются, а количество секунд всегда 0.

Не работает в том случае, если выставлен атрибут relative. В этой ситуации секунды всегда отображаются.

### value

Текущее показание виджета, выставленное пользователем или заданное программно. Время представлено в
объектной форме, однако этому параметру можно присвоить и строку.

## Методы

### getTime(dt)

Заполняет часы, минуты и секунды объекта dt (объект класса DateTime) текущим временем.

## События

### sci-overspin-up

Возникает, когда пользователь при прокрутке превышает верхний предел по времени

### sci-overspin-down

Возникает, когда пользователь при прокрутке оказывается ниже нижнего предела по времени