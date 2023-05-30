import qrcode from 'qrcode-terminal';
import whatsappService, { Client } from 'whatsapp-web.js';
import { Menus } from '../classes/Menus.js';
import "../database/database.js"
import MenuDB from '../database/Menu.js';

let currentMenu = null

async function initList() {
  const menuRootSaved = await MenuDB.find({keys: null, menuParent: null})
  const menuRoot = new Menus(menuRootSaved[0].value, menuRootSaved[0]._id).root;
  
  async function addOptions(menuParent) {
    const options = await MenuDB.find({menuParent: menuParent.id})
    
    if (!options || options.length === 0) return;

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      menuParent.addOption(option.keys, option.value, option._id);
      await addOptions(menuParent.options[i]);
    }
  }

  await addOptions(menuRoot)

  return menuRoot
}

function listMenu(menu) {
  currentMenu = menu;
  let message = menu.value + "\n";
  if (currentMenu.menuParent != null) message = "_Opticion elegida:_ \n  " + message;
  if (menu.options.length === 0) message += "\n  Este menú no tiene opciones";
  menu.options.forEach(element => message += "\n  " + element.value);
  if (currentMenu.menuParent != null) message += "\n\nEscribe *volver* para regresar al anterior menú";
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
  if ( currentMenu === null && message.body !== "" || message.body === "Inicio") {
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

 