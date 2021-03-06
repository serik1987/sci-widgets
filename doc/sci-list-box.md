# sci-list-box

Представляет собой обычный (нераскрывающийся) список.

Обычный нераскрывающийся список создаётся вот так:

```
<sci-list-box>
    <ul>
        <li data-value="value1">description 1</li>
        <li data-value="value2">description 2</li>
        <li data-value="value3">description 3</li>
    </ul>
</sci-list-box>
```

Допускается также указывать дополнительное стилевое оформление списка

```
<sci-list-box>
    <ul>
        <li data-value="value1">description 1</li>
        <li data-value="value2" class="optional">description 2</li>
        <li data-value="value3">
            <p>description 3</p>
            <p>The very long description</p>
        </li>
    </ul>
</sci-list-box>
```

## Атрибуты

### label

Наличие метки у данного виджета не предусмотрено, использование атрибута не будет иметь эффекта

### multiple

Если этот атрибут проставлен, то допускается возможность множественного выбора, а значением свойства value
является множество строк - значений атрибутов data-value выбранных элеменитов списка.

Если атрибут убран, то множественный выбор не допускается, а значением свойства value является строка - значение
атрибута data-value выбранного элемента

### required

Реакция компонента на этот атрибут зависит от того, включена ли возможность множественного выбора элементов списка.

Если возможность множественного выбора разрешена, то атрибут required должен отображать минимальное количество
элементов списка, которые может выбрать пользователь. Любое значение атрибута, которое не преобразуется  целое
положительное число, будет считаться равным нулю. Если пользователь выбрал меньше элементов списка, чем установлено
этим атрибутом, то значение этого компонента считается невалидным.

Если возможность множественного выбора отключена, то при наличии атрибута required пользователь должен выбрать ту
или иную опцию. В случае, если пользователь опцию не выберет, то значение компонента считается невалидным.

В случае, если значение компонента невалидно, то при обращении к свойству value пользователь получает соответствующее
сообщение об ошибке, при этом генерируется исключение типа TypeError.

## Свойства

### items

Список элементов

### label

Наличие метки у данного виджета не предусмотрено, использование этого свойства не будет иметь эффекта

### value

Отражает значение атрибута data-value выбранного пользователем элемента списка. В случае использования множественного
выбора данное свойство возвращает копию множества выбранных элементов списка (возвращается копия, любые изменения,
сделанные Вами в возвращённой копии, никак не отразятся на работе компонента).

В случае множественного выбора Вы можете присвоить свойству value следующие значения:
* объект класса Set, либо массив - будут выбраны те элементы, значение атрибута data-value которых присутствует
в исходном массиве или множестве
* строка - если элемент, свойство data-value которого совпадает с выбранной подстрокой, выделен пользователем, то
выделение отменяется, если он не выделен, то выделение добавляется.
* null - у всех элементов отменяется выделение.

В случае отсутствия множественного выбора принимаются строки или null.


### multiple

Если свойство принимает значение true, то допускается возможность множественного выбора, а значением свойства value
является множество строк - значений атрибутов data-value выбранных элеменитов списка.

Если свойство принимает значение false, а значением свойства value является строка - значение
атрибута data-value выбранного элемента.

### required

Реакция компонента зависит от того, разрешен ли множественный выбор или нет.

Если множественный выбор разрешён, то свойство равно минимальному количеству элементов списка, которые может выбрать
пользователь. Если пользователь выбрал меньше элементов, чем установлено этим количеством, то значение компонента
считается невалидным.

Если множественный выбор запрещён, то в случае, если свойство принимает значение true, пользователь обязан выбрать
хотя бы один из элементов списка. Если пользователь не выбрал ни один из элементов списка, то значение компонента
считается валидным в случае, если свойство принимает значение true и невалидным - если false.

В случае, если значение компонента невалидно, то при обращении к свойству value пользователь получает соответствующее
сообщение об ошибке, при этом генерируется исключение типа TypeError.

## Методы

### updateItems()

Запускайте этот метод всякий раз, как только Вы изменили содержимое окна посредством прямой манипуляцией с
DOM-структурой элемента.

## События

### change

Событие возникает в том случае, когда пользователь выбрал тот или иной элемент списка.