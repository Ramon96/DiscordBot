const User = require('../model/discordUser');

async function storeUser(mention, birthday) {
    // console.log(mention)
    const user = new User({
        id: mention,
        birthday: birthday,
    })

    //function that checks if the user is already stored in the database
    const checkUser = await User.exists({ id: mention });
    console.log(checkUser)
    if (checkUser) {
        console.log('ik kom hier')
        return false;
    } else {
        return await user.save()
        .then(result => {
            return true
        })
        .catch(err => {
            console.error(err)
        })
    }
    
}

module.exports = storeUser;