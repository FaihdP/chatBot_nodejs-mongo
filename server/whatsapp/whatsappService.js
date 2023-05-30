import qrcode from 'qrcode-terminal';
import whatsappService, { Client } from 'whatsapp-web.js';
import { Menus } from '../classes/Menus.js';
import "../database/database.js"
import MenuDB from '../database/Menu.js';

let currentMenu = null

MenuDB.find({keys: null, menuParent: null}).then((menuRoot) => {console.log(menuRoot[0])})

async function initList() {
  const menuRoot = await MenuDB.find({keys: null, menuParent: null})
  const menus = new Menus(menuRoot[0].value)
  const menu = menus.root;
  
  menu.addOption(["A", "1", "Menu A"], "Menú A");
  menu.addOption(["B", "2", "Menu B"], "Menú B");
  const menuC = menu.addOption(["C", "3", "Menu C"], "Menú C");
  menu.addOption(["D", "4", "Menu D"], "Menú D");

  menuC.addOption(["1", "Menu 1"], "Menú 1")
  const menu2 = menuC.addOption(["2", "Menu 2"], "Menú 2")

  menu2.addOption(["I", "Menu I"], "Menu I")
  menu2.addOption(["II", "Menu II"], "Menu II")
  menu2.addOption(["III", "Menu III"], "Menu III")

  //console.log(menu);
  return menu
}

function listMenu(menu) {
  currentMenu = menu;
  let message = "*" + menu.value + "*\n";
  menu.options.forEach(element => message += "\n  " + element.value);
  if (currentMenu.menuParent != null) message += "\n  Volver";
  return message;
}

function verifyOption(currentMenu, message) {
  let menuChoosed = null;

  for (let i = 0; i < currentMenu.options.length; i++) {
    const menu = currentMenu.options[i];
    for (let j = 0; j < menu.keys.length; j++) {
      const key = menu.keys[j];
      if (key == message) {
        menuChoosed = menu;
      }
    }
  }
  return menuChoosed ? listMenu(menuChoosed) : "No se parece a ninguna opción";
}

const client = new Client({
  authStrategy: new whatsappService.LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on('message', async (message) => {
  //console.log(message.body)
  if (message.body === "prueba") {
    message.reply(listMenu(await initList()));
    return;
  }
  
  if (["Volver", "volver"].indexOf(message.body) !== -1) {
    client.sendMessage(message.from, listMenu(currentMenu.menuParent));
    return;
  }
  
  client.sendMessage(message.from, verifyOption(currentMenu, message.body))

  //console.log("currentMenu", currentMenu);

});

 