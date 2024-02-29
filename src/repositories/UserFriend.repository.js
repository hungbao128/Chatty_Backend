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

    async rejectFriendRequest(userId, requesterId){
        return await UserFriendModel.deleteOne({requester: requesterId, recipient: userId});
    }

    async rejectFriendRequest(userId, friendId){
        return await UserFriendModel.deleteOne({requester: userId, recipient: friendId});
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

    async getCurrentUserFriends(userId){
        return await UserFriendModel.find({
            $or: [
                {requester: userId, status: 'accepted'},
                {recipient: userId, status: 'accepted'}
            ]
        });
    }
}

module.exports = new UserFriendRepository();