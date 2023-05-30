export class Menu {
  constructor(keys, value, id) {
    if (id) this.id = id
    this.keys = keys;
    this.value = value;
    this.options = [];
    this.menuParent = null; // Referencia al nodo padre
  }

  getParentMenu() {
    return this.menuParent ? this.menuParent : "Es la cabeza del arbol.";
  }

  addOption(keys, value, id) {
    const option = new Menu(keys, value, id);
    option.menuParent = this; // Establecer referencia al nodo padre
    this.options.push(option);
    return option;
  }
}