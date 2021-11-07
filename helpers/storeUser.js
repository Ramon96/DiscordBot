const User = require('../model/discordUser');

async function storeUser(mention, birthday) {
    const user = new User({
        id: mention,
        birthday: birthday,
    })

    //function that checks if the user is already stored in the database
    const checkUser =  User.findOne({ id: mention });
    if (checkUser) {
        return false;
    } else {
        await user.save()
        .then(result => {
            console.log(result);
            return result
        })
        .catch(err => {
            console.error(err)
        })
    }
    
}

module.exports = storeUser;