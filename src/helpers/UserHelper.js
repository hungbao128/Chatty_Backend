const _ = require('lodash');

class UserHelper{
    static createUserObject({name, email, password, dateOfBirth, gender}){
        const user = {
            name,
            email,
            password,
            dateOfBirth,
            gender
        }

        return user;
    }

    static generateUserResponse(user){
        return _.omit(user, ['password', 'createdAt', 'updatedAt', '__v']);
    }
}

module.exports = UserHelper;