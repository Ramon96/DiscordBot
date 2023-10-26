import User from "../../model/discordUser";

async function storeUser(mention: string, birthday: string) {
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
      .catch((err: Error) => {
        console.error(err);
      });
  }
}

export default storeUser;
