class UserHelper{
    static createUserObject({name, email, password, phone, dateOfBirth}){
        const user = {
            name,
            email,
            password,
            phone,
            dateOfBirth
        }

        return user;
    }

    static generateUserResponse(user){
        const { _id, name, email, phone, dateOfBirth } = user;

        return {
            id: _id,
            name,
            email,
            phone,
            dateOfBirth
        }
    }
}

module.exports = UserHelper;