import { Menu } from "./Menu.js";

export class Menus {
  constructor(value, id) {
    this.root = new Menu(null, value, id);
  }

  showTree(node = this.root) {
    if (node === null) {
      return;
    }
    console.log(node.value);
    for (const menu of node.options) {
      this.showTree(menu);
    }
  }
  
}