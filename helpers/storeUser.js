const User = require('../model/discordUser');

async function storeUser(mention, birthday) {
    const user = new User({
        id: mention,
        birthday: birthday,
    })

    //function that checks if the user is already stored in the database
    const checkUser = await User.findOne({ id: mention });
    if (checkUser) {
        return;
    } else {
        user.save()
        .then(result => {
            return true
        })
        .catch(err => {
            console.error(err)
        })
    }
}

module.exports = storeUser;