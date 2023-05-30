import { Schema, model } from "mongoose";

const menuSchema = new Schema(
  {
    keys: [{type: String, required: true}],
    value: {type: String, required: true},
    options: [{type: Schema.ObjectId, ref: "Menu", required: true}],
    menuParent: {type: Schema.ObjectId, ref: "Menu", required: true}
  }
);

export default model("Menu", menuSchema);
