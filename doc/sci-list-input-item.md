# sci-list-input-item

Представляет собой отдельный компонент списка sci-list-input. Этот элемент должен обязательно размещаться внутри
самого элемента sci-list-input

## Атрибуты

### error

Если этот атрибут проставлен, то отображается белый текст на красном фоне.

### selected

Если этот атрибут проставлен, то отображается белый текст на синем фона.

## Свойства

### error

Если свойство принимает значение true то отображается белый текст на красном фоне.

### localRect

Возвращает объект со следующими свойствами:
* left - расстояние от левой границы элемента sci-list-input до левой границы данного элемента
* right - расстояние от правой границы элемента sci-list-input до правой границы данного элемента
* top - расстояние от верхней границы элемента sci-list-input до верхней границы данного элемента
* bottom - расстояние от нижней границы элемента sci-list-input до нижней границы данного элемента
* width - ширина элемента
* height - высота элемента

### selected

Если свойство принимает значение, равное true, то отображается белый текст на синем фоне.

### updateValue

Функция, которая автоматически запускается, когда изменяется значение списка, или null, если никакую подобную функцию
запускать не надо.

С помощью этой функции задайте значения метки, а также атрибутов selected и error.

### value

Значение данного элемента списка. Значением любого элемента списка всегда является объект. При изменении значения
элемента списка автоматически запускается функция, определяемая свойством updateValue

## Методы

## События

### sci-delete-item

Событие возникает, когда пользователь нажимает на кнопку с крестиком. Заметьте, что само по себе нажатие к удалению
данного элемента не приводит.

### sci-edit-item

Событие возникает, когда пользователь нажимает на кнопку с карандашом. Заметьте, что само окно для редактирования
элемента списка при этом не открывается.
