import { Document } from "mongoose";
import Hottie from "../../model/hotties";

interface IHottie extends Document {
  color: string;
}

async function storeColor(userId: string, color: string) {
  Hottie.findOne({ id: userId }).then(async (doc: IHottie) => {
    doc.color = color;
    doc.markModified("color");
    await doc.save();
  });
}

export { storeColor };
