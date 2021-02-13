class AuthorWidget{

    constructor(element){
        let self = this;

        if (element.tagName !== "SCI-LIST-INPUT"){
            throw new TypeError("AuthorWidget is an envelope for sci-list-input element. Please, put the valid item");
        }

        this.__element = element;
        this.__addDialog = element.querySelector(".add-dialog");
        this.__language = "ru";

        this.__element.updateItem = function(value){
            let validated = true;
            if (value.language === "ru"){
                try{
                    let nameRu = self.__correctRussianName(value.name_ru);
                    let nameEn = self.__correctEnglishName(value.name_en);
                    this.label = `${nameRu} (${nameEn})`;
                } catch (e){
                    this.label = `${value.name_ru} (${value.name_en})`;
                    validated = false;
                }
            } else {
                try{
                    this.label = self.__correctEnglishName(value.name_en);
                } catch (e){
                    this.label = value.name_en;
                    validated = false;
                }
            }
            if (!validated){
                this.error = true;
                this.selected = false;
            } else {
                this.error = false;
                this.selected = value.is_employee;
            }
        }

        this.__element.onItemAdd = function(str){
            let addPromise;

            if (self.language === "ru"){
                addPromise = self.__addRussianPublication(str);
            } else if (self.language === "en"){
                addPromise = self.__addEnglishPublication(str);
            } else {
                addPromise = Promise.reject("AuthorWidget: widget language is incorrectly defined");
            }

            return addPromise;
        }

        this.__element.onLivesearch = function(str){
            return new Promise((resolve, reject) => {
                if (str.match(AuthorWidget.AUTHOR_RU_VALIDATOR) !== null ||
                    str.match(AuthorWidget.AUTHOR_EN_VALIDATOR) !== null){
                    resolve([]);
                }
                setTimeout(() => {
                    console.log("request received");
                    if (Math.random() < 1.1){
                        resolve([
                            {
                                value: {
                                    language: self.language,
                                    name_ru: "Иванов И.И.",
                                    name_en: "Ivanov I.I.",
                                    is_employee: true,
                                    uid: 1,
                                    lid: 1
                                },
                                html: `<p>Иванов Иван Иванович</p><p><i>Лаборатория нейроинформатики</i></p>`
                            },
                            {
                                value: {
                                    language: self.language,
                                    name_ru: "Петров П.П.",
                                    name_en: "Petrov P.P.",
                                    is_employee: true,
                                    uid: 2,
                                    lid: 2
                                },
                                html: `<p>Петров Пётр Петрович</p><p><i>Лаборатория нейрофизиологии</i></p>`
                            },
                            {
                                value: {
                                    language: self.language,
                                    name_ru: "Боширов С.Я.",
                                    name_en: "Boshirov S.Y.",
                                    is_employee: true,
                                    uid: 3,
                                    lid: 3
                                },
                                html: `<p>Боширов Самуил Яковлевич</p><p><i>Лаборатория нейрофилософии</i></p>`
                            }
                        ]);
                    } else {
                        reject("Проблемы со связью");
                    }
                }, 2000);
            });
        }

        this.__addDialog.addEventListener("sci-window-open", event => {
            this.__addDialog.querySelector(".input-box").focus();
        });


        window.addEventListener("load", event => {
            this.__addDialog.onSubmit = function(data){
                try{
                    let nameEn = self.__correctEnglishName(data.name_en);
                    return Promise.resolve({name_en: nameEn});
                } catch (message){
                    return Promise.reject({name_en: message});
                }
            }

            this.__addDialog.onReset = function(){
                return Promise.resolve({name_en: ""});
            }

            this.__addDialog.querySelector(".input-box").addEventListener("keyup", event => {
                if (event.key === "Enter"){
                    self.__addDialog.submit();
                }
            });

            this.__element.editBox.addEventListener("sci-modal", event => {
                self.updateEmployee();
            });

            this.__element.editBox.getElement("is_employee").addEventListener("click", event => {
                self.updateEmployee();
            });

            this.__element.editBox.onSubmit = function(value){
                try{
                    let data = self.validate(value);
                    return Promise.resolve(data);
                } catch (messages){
                    return Promise.reject(messages);
                }
            }
        });
    }

    __addRussianPublication(str){
        let addPromise;

        try{
            let nameRu = this.__correctRussianName(str);
            this.__addDialog.querySelector(".author-name").innerText = nameRu;
            addPromise = this.__addDialog.openModal()
                .then(result => {
                    return {
                        language: "ru",
                        name_ru: nameRu,
                        name_en: result.name_en,
                        is_employee: false
                    }
                })
                .catch(() => {
                    throw false;
                });
        } catch (message){
            addPromise = Promise.reject(message);
        }

        return addPromise;
    }

    __addEnglishPublication(str){
        let addPromise;

        try{
            let data = {
                language: "en",
                name_en: this.__correctEnglishName(str),
                is_employee: false
            };
            addPromise = Promise.resolve(data);
        } catch (message){
            addPromise = Promise.reject(message);
        }

        return addPromise;
    }

    __correctRussianName(name){
        name = this.__correctLatinLetters(name);
        name = this.__correctWrongOrder(name, "ru");
        name = this.__removeExtraSpace(name);
        name = this.__correctRussianInitials(name);

        if (name.match(AuthorWidget.AUTHOR_RU_VALIDATOR) === null){
            throw "Проверьте правильность написания фамилии и инициалов автора";
        }

        return name;
    }

    __correctLatinLetters(name){
        name = name
            .replace("\u0041", "\u0410") /* replace A (latin) -> A (cyrillic) */
            .replace("\u0042", "\u0412") /* replace B (latin) -> B (cyrillic) */
            .replace("\u0043", "\u0421") /* etc. */
            .replace("\u0045", "\u0415")
            .replace("\u0048", "\u041D")
            .replace("\u004B", "\u041A")
            .replace("\u004D", "\u041C")
            .replace("\u004F", "\u041E")
            .replace("\u0050", "\u0420")
            .replace("\u0054", "\u0422")
            .replace("\u0058", "\u0425")
            .replace("\u0061", "\u0430")
            .replace("\u0063", "\u0441")
            .replace("\u0065", "\u0435")
            .replace("\u006F", "\u043E")
            .replace("\u0070", "\u0440")
            .replace("\u0078", "\u0445")
            .replace("\u0079", "\u0443");

        if (name.match(/[A-Za-z]/) !== null){
            throw "Фамилия и инициалы автора не должны содержать латинских символов";
        }

        return name;
    }

    __correctRussianInitials(name){
        if (name.match(AuthorWidget.AUTHOR_RU_VALIDATOR) === null &&
            name.match(AuthorWidget.WRONG_INITIALS_RU) !== null){
            throw "После каждого инициала должна стоять точка";
        }

        return name;
    }

    __correctEnglishName(name){
        name = this.__correctCyrillicLetters(name);
        name = this.__correctWrongOrder(name, "en");
        name = this.__removeExtraSpace(name);
        name = this.__correctEnglishInitials(name);

        if (name.match(AuthorWidget.AUTHOR_EN_VALIDATOR) === null){
            throw "Проверьте правильность написания фамилии и инициалов автора";
        }

        return name;
    }

    __correctCyrillicLetters(name){
        name = name
            .replace("\u0410", "\u0041") /* replace A (cyrillic) -> A (latin) */
            .replace("\u0412", "\u0042") /* replace B (cyrillic) -> B (latin) */
            .replace("\u0421", "\u0043") /* etc. */
            .replace("\u0415", "\u0045")
            .replace("\u041D", "\u0048")
            .replace("\u041A", "\u004B")
            .replace("\u041C", "\u004D")
            .replace("\u041E", "\u004F")
            .replace("\u0420", "\u0050")
            .replace("\u0422", "\u0054")
            .replace("\u0425", "\u0058")
            .replace("\u0430", "\u0061")
            .replace("\u0441", "\u0063")
            .replace("\u0435", "\u0065")
            .replace("\u043E", "\u006F")
            .replace("\u0440", "\u0070")
            .replace("\u0445", "\u0078")
            .replace("\u0443", "\u0079");

        /* Extended latin (Ä, Ä, Ü, ...) goes here... For the sake of simplicity let's replace them by simple latin */

        for (let replacement in AuthorWidget.EXTENDED_LATIN){
            if (AuthorWidget.EXTENDED_LATIN.hasOwnProperty(replacement)){
                for (let extendedLetter of AuthorWidget.EXTENDED_LATIN[replacement]){
                    name = name.replace(extendedLetter, replacement);
                }
            }
        }

        if (name.match(/[А-Яа-яЁё]/) !== null){
            throw "Фамилия и инициалы автора не должны содержать русских символов";
        }

        return name;
    }

    __correctEnglishInitials(name){
        if (name.match(AuthorWidget.AUTHOR_EN_VALIDATOR) === null &&
            name.match(AuthorWidget.WRONG_INITIALS_EN) !== null){
            throw "После каждого инициала должна стоять точка";
        }

        return name;
    }

    __correctWrongOrder(name, lang){
        let validator;
        name = name.replace(/\s+/g, " ");

        if (lang === "ru"){
            validator = AuthorWidget.WRONG_INITIALS_VALIDATOR_RU;
        } else if (lang === "en"){
            validator = AuthorWidget.WRONG_INITIALS_VALIDATOR_EN;
        } else {
            validator = null;
        }

        if (name.match(validator)){
            throw "Инициалы автора должны стоять после его фамилии";
        }

        return name;
    }

    __removeExtraSpace(name){
        let nameParts = name.split(/\s/);
        if (nameParts[0].match(/[a-z]{1,3}/) && nameParts.length > 2){
            nameParts = [`${nameParts[0]} ${nameParts[1]}`, ...nameParts.slice(2)];
        }
        if (nameParts.length < 2){
            throw "Не указаны фамилия или инициалы";
        }
        let surname = nameParts[0];
        let initials = nameParts.slice(1).join("");
        return `${surname} ${initials}`;
    }

    get language(){
        return this.__language;
    }

    set language(value){
        this.__language = value;
    }

    get value(){
        try{
            return this.__element.value;
        } catch (e){
            this.__element.errorMessage = "Некоторые авторы указаны с ошибками, они подсвечены красным. Исправьте " +
                "ошибки, нажав на кнопку с карандашом справа от автора";
        }
    }

    set value(value){
        this.__element.value = value;
    }

    appendItem(value){
        return this.__element.appendItem(value);
    }

    deleteItem(value){
        return this.__element.deleteItem(value);
    }

    editItem(value){
        return this.__element.editItem(value);
    }

    updateEmployee(){
        let editBox = this.__element.editBox;
        let isEmployee = editBox.getElement("is_employee").value;

        if (isEmployee && !editBox.classList.contains("employee")){
            editBox.classList.add("employee");
        }
        if (!isEmployee && editBox.classList.contains("employee")){
            editBox.classList.remove("employee");
        }

        if (this.language === "en" && !editBox.classList.contains("language-en")){
            editBox.classList.add("language-en");
        }
        if (this.language !== "en" && editBox.classList.contains("language-en")){
            editBox.classList.remove("language-en");
        }

        editBox.getElement("name_ru").errorMessage = null;
        editBox.getElement("name_en").errorMessage = null;

        try{
            this.validate(editBox.value);
        } catch (messages){
            if (messages.name_ru){
                editBox.getElement("name_ru").errorMessage = messages.name_ru;
            }
            if (messages.name_en){
                editBox.getElement("name_en").errorMessage = messages.name_en;
            }
        }

        editBox.updateHeight();
    }

    validate(value){
        if (value.is_employee){
            return {
                language: this.language,
                name_ru: "Иванов И.И.",
                name_en: "Ivanov I.I.",
                is_employee: true,
                lid: value.lid,
                uid: value.uid
            }
        } else {
            let data;
            let validated = true;
            let messages = {};
            try{
                data = {
                    language: this.language,
                    name_en: this.__correctEnglishName(value.name_en),
                    is_employee: false
                };
            } catch (message){
                validated = false;
                messages.name_en = message;
                data = {
                    language: this.language,
                    name_en: undefined,
                    is_employee: false
                }
            }
            if (this.language === "ru"){
                try{
                    data.name_ru = this.__correctRussianName(value.name_ru);
                } catch (message){
                    validated = false;
                    messages.name_ru = message;
                }
            }
            if (validated){
                return data;
            } else {
                throw messages;
            }
        }
    }

}

AuthorWidget.AUTHOR_RU_VALIDATOR = /^[А-ЯЁ][а-яё]+(?:\-[А-ЯЁ][а-яё]+)*\s[А-ЯЁ][а-яё]?\.(?:\-?[А-ЯЁ][а-яё]?\.)*$/;
AuthorWidget.AUTHOR_EN_VALIDATOR =
    /^([a-z]{1,3}\s)?[A-Z][A-Za-z]+(?:\-[A-Z][a-z]+)*\s[A-Z][a-z]?\.(?:\-?[A-Z][a-z]?\.)*$/;

AuthorWidget.WRONG_INITIALS_VALIDATOR_RU = /^[А-ЯЁ][а-яё]?\.(?:\-?[А-ЯЁ][а-яё]?\.)*\s[А-ЯЁ][а-яё]+(?:\-[А-ЯЁ][а-яё]+)*$/;
AuthorWidget.WRONG_INITIALS_VALIDATOR_EN = /^[A-Z][a-z]?\.(?:\-?[A-Z][a-z]?\.)*\s[A-Z][A-Za-z]+(?:\-[A-Z][a-z]+)*$/;

AuthorWidget.WRONG_INITIALS_RU = /[А-ЯЁ][а-яё]?\.?(?:\-?[А-ЯЁ][а-яё]?\.?)*$/;
AuthorWidget.WRONG_INITIALS_EN = /[A-Z][a-z]?\.?(?:\-?[A-Z][a-z]?\.?)*$/;

AuthorWidget.EXTENDED_LATIN = {
    A: ["\u00C0", "\u00C1", "\u00C2", "\u00C3", "\u00C4", "\u00C5", "\u0100", "\u0102", "\u0104", "\u01CD",
        "\u01DE", "\u01E0", "\u01FA", "\u0200", "\u0202", "\u0226", "\u023A", "\u13AA", "\u15C5", "\u15CB",
        "\uA738", "\uA73A"],
    B: ["\u0181", "\u0243", "\u13F4", "\u1E02", "\uA796"],
    C: ["\u00C7", "\u0106", "\u0108", "\u010A", "\u010C", "\u0116", "\u0187", "\u023B", "\u13DF", "\u1eE3",
        "\uA792"],
    D: ["\u00D1", "\u010E", "\u0110", "\u0189", "\u018A", "\u13A0", "\u1E02", "\u2C70"],
    E: ["\u00C8", "\u00C9", "\u00CA", "\u00CB", "\u0112", "\u0114", "\u0116", "\u0118", "\u011A", "\u018E",
        "\u018F", "\u0204", "\u0206", "\u0228", "\u0246", "\u13AC", "\u2C7E", "\uA72A"],
    F: ["\u0191", "\u15B4", "\u1E1E", "\uA731", "\uA798"],
    I: ["\u00CC", "\u00CD", "\u00CE", "\u00CF", "\u0128", "\u012A", "\u012C", "\u01CF", "\u0208", "\u0210",
        "\u13C6"],
    J: ["\u012E", "\u0134", "\u0248", "\u13AB"],
    G: ["\u011C", "\u011E", "\u0120", "\u0122", "\u0193", "\u01E4", "\u01E6", "\u01F4", "\u050C", "\u13C0",
        "\u13F3", "\uA7A0", "\uA7AC"],
    H: ["\u0124", "\u0126", "\u01F6", "\u021E", "\u13BB", "\u2C67", "\uA726", "\uA7AA"],
    K: ["\u0136", "\u0198", "\u01E8", "\u13E6", "\u2C69", "\uA740", "\uA742", "\uA744", "\uA7A2"],
    M: ["\u13B7", "\u2C6E", "\u1E40"],
    L: ["\u0139", "\u013B", "\u013D", "\u013F", "\u0141", "\u0196", "\u023D", "\u13DE", "\u2C60", "\u2C62",
        "\uA7AD"],
    N: ["\u0143", "\u0145", "\u0147", "\u014A", "\u019D", "\u01F8", "\u1790", "\u1790", "\uA7A4"],
    O: ["\u00D2", "\u00D3", "\u00D4", "\u00D5", "\u00D6", "\u00D8", "\u014C", "\u014E", "\u0150", "\u019F",
        "\u01A0", "\u01D1", "\u01EA", "\u01EC", "\u01FE", "\u020C", "\u020E", "\u022A", "\u022C", "\u022E",
        "\u0230", "\uA74A", "\uA74C", "\uA779"],
    P: ["\u01A4", "\u1E56", "\u2C63", "\u13E2", "\uA750", "\uA752", "\uA754"],
    Q: ["\u024A", "\uA756", "\uA758"],
    R: ["\u0154", "\u0156", "\u0158", "\u01A6", "\u0210", "\u0212", "\u024C", "\u13A1", "\u13D2", "\u2C64",
        "\uA776", "\uA7A6"],
    S: ["\u015A", "\u015C", "\u015E", "\u0160", "\u01A7", "\u0218", "\u13D5", "\u13DA", "\u1E60", "\uA731",
        "\uA7A8"],
    T: ["\u0162", "\u0164", "\u0166", "\u01AC", "\u01AE", "\u021A", "\u021A", "\u023E", "\u13A2", "\u1E6A"],
    U: ["\u00D9", "\u00DA", "\u00DB", "\u00DC", "\u0168", "\u016A", "\u016C", "\u016E", "\u0170", "\u0172",
        "\u01AF", "\u01B2", "\u01D3", "\u01D5", "\u01D7", "\u01D9", "\u01DB", "\u0214", "\u0216", "\u0244"],
    V: ["\u13D9", "\uA75E"],
    W: ["\u0174", "\u13B3", "\u13D4", "\u1E80", "\u1E82", "\u1E84", "\u2C72", "\uA760"],
    Y: ["\u00DD", "\u0176", "\u0178", "\u0194", "\u01B3", "\u0232", "\u024E", "\u1EF2"],
    Z: ["\u0179", "\u017B", "\u017D", "\u01B5", "\u0224", "\u13C3", "\u2C6B", "\u2C7F"],
    Aa: ["\uA732"],
    Ae: ["\u01E2", "\u01FC"],
    Aj: ["\uA736", "\uA73C"],
    Ao: ["\uA734"],
    Dz: ["\u01C4", "\u01C5", "\u01F1", "\u01F2"],
    Ij: ["\u0132"],
    Lj: ["\u01C7", "\u01C8"],
    Nj: ["\u01CA", "\u01CB"],
    Oe: ["\u0152"],
    Oo: ["\uA74E"],
    Tz: ["\uA728"],
    a: ["\u00E0", "\u00E1", "\u00E2", "\u00E3", "\u00E4", "\u00E5", "\u00E6", "\u0101", "\u0103", "\u0105",
        "\u01CE", "\u01DF", "\u01E1", "\u01FB", "\u0201", "\u0203", "\u0227", "\u2C65", "\uA739", "\uA73B",
        "\uAB30"],
    b: ["\u0180", "\u0184", "\u0185", "\u1E03", "\uA797"],
    c: ["\u00E7", "\u0107", "\u0109", "\u010B", "\u010D", "\u0188", "\u023C", "\uA793", "\uA794"],
    d: ["\u010F", "\u0111", "\u13E7", "\u1E03", "\uA771"],
    e: ["\u00E8", "\u00E9", "\u00EA", "\u00EB", "\u0113", "\u0115", "\u0117", "\u0119", "\u011B", "\u0190",
        "\u01DD", "\u0205", "\u0207", "\u0229", "\u0247", "\uA72B", "\uAB33", "\uAB34"],
    f: ["\u0192", "\01AD", "\u1E1F", "\uA799", "\uAB35"],
    g: ["\u011D", "\u011F", "\u0121", "\u0123", "\u01E5", "\u01E7", "\u01F5", "\u0260", "\u0261", "\u0262",
        "\u050D", "\uA7A1", "\uAB36"],
    h: ["\u0125", "\u0127", "\u021F", "\u0266", "\u0267", "\u2C68", "\uA727", "\uA795"],
    i: ["\u00EC", "\u00ED", "\u00EE", "\u00EF", "\u0129", "\u012B", "\u012D", "\u01D0", "\u0209", "\u021A",
        "\u0268", "\u0269", "\u026A"],
    j: ["\u012F", "\u0135", "\u0249"],
    k: ["\u0137", "\u0138", "\u0199", "\u01E9", "\u2C6A", "\uA741", "\uA743", "\uA745", "\uA7A3"],
    l: ["\u013A", "\u013C", "\u013E", "\u0140", "\u0140", "\u0142", "\u0197", "\u019A", "\u026C", "\u026D",
        "\u2C61", "\uA772"],
    m: ["\u1E41", "\uA773"],
    n: ["\u00F1", "\u0144", "\u0146", "\u0148", "\u0149", "\u014B", "\u019E", "\u01F9", "\u0220", "\u0235",
        "\uA774", "\uA791", "\uA7A5"],
    o: ["\u00F2", "\u00F3", "\u00F4", "\u00F5", "\u00F6", "\u00F8", "\u014D", "\u014F", "\u0151", "\u01A1",
        "\u01A1", "\u01D2", "\u01EB", "\u01ED", "\u01FF", "\u020D", "\u020F", "\u022B", "\u022D", "\u022F",
        "\u0231", "\uA74B", "\uA74D", "\uA77A"],
    p: ["\u01A5", "\u1E57", "\uA751", "\uA753", "\uA755", "\uA764", "\uA765", "\uA766"],
    q: ["\u024B", "\uA757", "\uA759"],
    r: ["\u0155", "\u0157", "\u0159", "\u0211", "\u0213", "\u024D", "\uA7A7"],
    s: ["\u015B", "\u015D", "\u015F", "\u0161", "\u01A8", "\u0219", "\u0219", "\u023F", "\u1E61", "\uA7A9"],
    t: ["\u0163", "\u0165", "\u0167", "\u01AB", "\u021B", "\u1E6B", "\u2C66", "\uA777"],
    u: ["\u00F9", "\u00FA", "\u00FB", "\u00FC", "\u0169", "\u016B", "\u016D", "\u016F", "\u0171", "\u0173",
        "\u01D0", "\u01D4", "\u01D6", "\u01D8", "\u01DA", "\u01DC", "\u0215", "\u0217"],
    v: ["\u2C71", "\u2C74", "\uA75F"],
    w: ["\u0175", "\u1E81", "\u1E83", "\u1E85", "\u2C73", "\uA761"],
    x: ["\uAB53", "\uAB54", "\uAB55", "\uAB56", "\uAB57", "\uAB58", "\uAB59"],
    y: ["\u00FD", "\u00FF", "\u0177", "\u01B4", "\u0233", "\u024F", "\u0263", "\u0264", "\u1EF3", "\uAB5A"],
    z: ["\u017A", "\u017C", "\u017E", "\u01B6", "\u0225", "\u0240", "\u2C6C"],
    aa: ["\uA733"],
    ae: ["\u01E3", "\u01FD", "\u1B31"],
    aj: ["\uA737", "\uA73D"],
    ao: ["\uA735"],
    dz: ["\u01C6", "\u01F3", "\u02A3", "\u02A5"],
    hu: ["\u0195"],
    ij: ["\u0133"],
    lj: ["\u01C9"],
    ls: ["\u02AA"],
    lz: ["\u02AB"],
    nj: ["\u01CC"],
    oe: ["\u0153", "\uAB40"],
    oo: ["\uA74F"],
    tc: ["\u02A8"],
    ts: ["\u02A6"],
    tz: ["\uA729"]
};