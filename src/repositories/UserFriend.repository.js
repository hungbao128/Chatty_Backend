const UserFriendModel = require('./../models/UserFriend.model');

class UserFriendRepository{
    async requestAddFriend(userId, friendId){
        return await UserFriendModel.create({requester: userId, recipient: friendId, status: 'pending'});
    }

    async isFriend(userId, friendId){
        const count = await UserFriendModel.countDocuments({
            $or: [
                {requester: userId, recipient: friendId, status: 'accepted'},
                {requester: friendId, recipient: userId, status: 'accepted'}
            ]
        });
        return count > 0;
    }

    async acceptFriendRequest(userId, requesterId){
        return await UserFriendModel.updateOne({requester: requesterId, recipient: userId}, {status: 'accepted'});
    }

    async isPendingRequest(userId, friendId){
        const count = await UserFriendModel.countDocuments({
            $or: [
                {requester: userId, recipient: friendId, status: 'pending'},
                {requester: friendId, recipient: userId, status: 'pending'}
            
            ]
        });
        return count > 0;
    }
}

module.exports = new UserFriendRepository();