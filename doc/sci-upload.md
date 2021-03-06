# sci-upload

Представляет собой виджет, который позволяет пользователю выбрать файл для его последующей отправки на сервер

### Атрибуты

#### accept

Принимаемые типы файлов

#### multiple

Если атрибут проставлен, то пользователю разрешено выбрать несколько файлов. Если нет, то пользователь может выбрать
только один файл.

#### no-label

Если этот атрибут проставлен, то не отобразится метка.

#### no-status-bar

Если этот атрибут проставлен, то не отображается строка с именем файла и статусом загрузки.

### Свойства

#### accept

Принимаемые типы файлов, либо null, если не принимает никакие типы файлов.

#### multiple

Если данное свойство принимает значение true, то пользователю разрешено выбрать несколько файлов. Если свойство
принимает значение false, то пользователю разрешено выбрать только один файл.

#### onRemove [обязательное свойство]

Для того, чтобы загруженный пользователем файл удалялся с сервера, пожалуйста, задайте функцию onRemove. Эта функция
отвечает за удаление выбранного пользователем файла с сервера.

Функция принимает только один аргумент - объект типа File, если свойство multiple равно false, либо объект типа
FileList, если свойство multiple равно true, либо строковое значение, если невозможно доподлинно восстановить,
какой файл / файлы были загружены на серввр.

Функция должна возвращать промис, который и отвечает на непосредственное удаление файла с сервера.

Промис разрешается любым значением, если загруженный файл успешно удалён с сервера. В случае, если удаление
файла было завершено с ошибкой, промис отклоняется.

#### onUpload [обязательное свойство]

Для того, чтобы выбранные пользователем файлы загружались на сервер, пожалуйста, задайте функцию onUpload. Эта функция
отвечает за непосредственную передачу выбранной пользователем информации на сервер.

Функция принимает один аргумент - объект типа File, если свойство multiple равно false, либо объект типа FileList,
если свойство multiple равно true.

Функция должна возвращать промис, который и загружает файл на сервер. При
успешной загрузке файла промис должен быть разрешён значением, соответствующим URL загруженного файла, либо значением
undefined, если загруженный файл не имеет URL.

Отклонение промиса означает отсутствие успешной загрузки, после чего промис также переходит в свой первозданный вид.
Обратите внимание, что исключение в этом случае не выбрасывается. То есть, к моменту генерации исключительной ситуации
внутри самого виджета считается, что она уже была корректно обработана.

#### url [только чтение]

Возвращает URL объекта

#### value

Отражает текущий выбранный файл. Представляет собой объект класса File в случае, если атрибут multiple убран, либо
массив из объектов класса File в случае, если атрибут multiple выставлен.

Присвойте свойству value строковое значение, если Вы хотите оставвить отметку о том, что данный файл загружен.

### Методы

#### load()

Выполняет действия, аналогичные тем, что происходят, когда пользователь нажимает на кнопку "Загрузить".

#### remove()

Выполняет действия, аналогичные тем, что происходит, когда пользователь нажимает на кнопку "Удалить".

### События

#### sci-upload-failed

Событие возникает тогда, когда файл, выбранный пользователем, не был загружен на сервер по причине ошибки. Значением
свойства detail является исключение, которым был отклонён соответствующий промис.

#### sci-upload-start

Событие возникает тогда, когда пользователь выбрал тот или иной файл, но перед непосредственной отправкой файла
на сервер. Значением свойства detail этого события является выбранный пользователем файл (Объект File, либо массив
таких объектов)

#### sci-upload-success

Событие возникает тогда, файл, выбранный пользователем, был успешно загружен на сервер. Значением свойства detail
является URL-адрес файла, полученный от сервера.

#### sci-remove-failed

Событие возникает тогда, когдф удаление файла с сервера не было успешно завершено. Значением свойства detail
является та или иная ошибка.

#### sci-remove-start

Событие возникает тогда, когда пользователь запускает процедуру удаления файла с сервера. Значением свойства detail
является непосредственно удаляемый файл (объект класса File, либо массив таких объектов).

#### sci-remove-success

Событие возникает тогда, когда удалени6е файла с сервера было успешно завершено. Свойство detail в этом случае
всегда равно null.