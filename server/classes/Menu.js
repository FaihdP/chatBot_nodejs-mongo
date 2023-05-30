export class Menu {
  constructor(keys, value) {
    this.keys = keys;
    this.value = value;
    this.options = [];
    this.menuParent = null; // Referencia al nodo padre
  }

  getParentMenu() {
    return this.menuParent ? this.menuParent : "Es la cabeza del arbol.";
  }

  addOption(keys, value) {
    const option = new Menu(keys, value);
    option.menuParent = this; // Establecer referencia al nodo padre
    this.options.push(option);
    return option;
  }
}