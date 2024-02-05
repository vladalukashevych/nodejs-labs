const fs = require("fs")

function add(language) {
    //Прочитати файл user.json
    let userJSON =  fs.readFileSync("user.json", "utf-8")
    //Перетворити дані з файлу в JS-обєкт
    let user = JSON.parse(userJSON);

    //Отримати масив мов і додати новий елемент
    user.languages.push(language)

    //Перетворити JS-обєкт в JSON
    //Записати новий JSON у файл user.json
    fs.writeFileSync("user.json", JSON.stringify(user))
}

function remove(language) {
    let userJSON = fs.readFileSync("user.json", "utf-8");
    let user = JSON.parse(userJSON);
    let l = user.languages.indexOf(language);
    user.languages.splice(l, 1);
    fs.writeFileSync("user.json", JSON.stringify(user));
}

function list() {
    let userJSON = fs.readFileSync("user.json", "utf-8");
    let user = JSON.parse(userJSON);
    console.log(user.languages);
}

function read(language) {
    let userJSON =  fs.readFileSync("user.json", "utf-8")
    let user = JSON.parse(userJSON);
    let l = user.languages.findIndex(elem => {
        return elem.title === language;});
    console.log(user.languages[l]);
}

module.exports = {add, remove, list, read}