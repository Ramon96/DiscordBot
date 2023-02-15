const User = require("../../model/discordUser");

async function storeUser(mention, birthday) {
  const user = new User({
    id: mention,
    birthday: birthday,
  });

  const checkUser = await User.exists({
    id: mention,
  });
  if (checkUser) {
    return false;
  } else {
    return await user
      .save()
      .then(() => true)
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = storeUser;
