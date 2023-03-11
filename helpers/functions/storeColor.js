const Hottie = require("../../model/hotties");

async function storeColor(userId, color) {
  Hottie.findOne({ id: userId }).then(async (doc) => {
    doc.color = color;
    doc.markModified("color");
    await doc.save();
  });
}

module.exports = storeColor;
