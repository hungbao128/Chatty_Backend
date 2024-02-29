
const generateUserFriend = (userFriend, userId) => {
    const {requester, recipient, _id} = userFriend;
    const result = {
        _id,
    }
    if(requester._id.toString() == userId){
        result['name'] = recipient.name;
        result['userId'] = recipient._id;
        result['avatar'] = recipient.avatar;
    }
    else if(recipient._id.toString() == userId){
        result['name'] = requester.name;
        result['userId'] = requester._id;
        result['avatar'] = requester.avatar;
    }

    return result;
}

module.exports = {
    generateUserFriend
}