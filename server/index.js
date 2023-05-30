// Import for server
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createServer } from "http";

// Import for database
import "./database/database.js";
import Menu from "./database/Menu.js";

const app = express();
const server = createServer(app);

// Server config
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

server.listen(4000, () => console.log("\nServer on port", 4000));

app.get("/chatbot/menu/get/:id", async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).exec();
    if (!menu) throw new Error("Error: menu not found")
    res.json(menu)
  } catch (error) {
    if (error.message == "Error: menu not found") return res.status(404).json({ "Error message": error.message });

    return res.status(500).json({ "Error message": error.message });
  }
})

app.post("/chatbot/menu/add", async (req, res) => {
  try {
    const menu = Menu(req.body);

    if (!menu.options) menu.options = [];

    await menu.save();

    res.json({ action: "Menu saved", menu: menu.id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ "Error message": error.message });
  }
});

app.post("/chatbot/menu/addOption/:id", async (req, res) => {
  try {
    const idParent = req.params.id;
    const menu = Menu(req.body);

    if (!menu.menuParent) menu.menuParent = idParent;
    if (!menu.options) menu.options = [];

    await menu.save();
    await Menu.updateOne({ _id: idParent }, { $push: { options: menu.id } });

    res.json({ action: "Menu added", parent: idParent, son: menu.id });

  } catch (error) {
    console.error(error);
    res.status(400).json({ "Error message": error.message });
  }
});

app.delete("/chatbot/menu/deleteOption/:id", async (req, res) => {
  try {
    const menuParent = await Menu.findById(req.params.id).exec();

    if (!menuParent) throw new Error("Error: Menu parent not found");

    const idMenu = req.body.id;
    await Menu.deleteOne({_id: idMenu});

    const indexMenu = menuParent.options.indexOf(idMenu);
    if (indexMenu === -1) throw new Error("Error: Menu children not found");
    menuParent.options.splice(indexMenu, 1);

    await Menu.findOneAndUpdate(
      { _id: req.params.id },
      { options: menuParent.options }
    );

    res.json({ action: "Menu deleted", parent: menuParent.id, son: idMenu });

  } catch (error) {
    console.error(error);

    if (
      error.message === "Error: Menu son not found" 
      || error.message === "Error: Menu parent not found"
    ) {
      return res.status(404).json({ "Error message": error.message });
    }

    return res.status(500).json({ "Error message": error.message });
  }
});



export default server;
