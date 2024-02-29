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

    async acceptFriendRequest(userId, friendId){
        return await UserFriendModel.updateOne({_id: friendId, recipient: userId}, {status: 'accepted'});
    }

    async isUserFriend(userId, friendId){
        return await UserFriendModel.countDocuments({_id: friendId, recipient: userId, status: 'accepted'});
    }

    async rejectFriendRequest(userId, friendId){
        return await UserFriendModel.deleteOne({_id: friendId, recipient: userId});
    }

    async rejectFriendRequest(userId, friendId){
        return await UserFriendModel.deleteOne({requester: userId, recipient: friendId});
    }

    async isPendingRequest(userId, friendId){
        const count = await UserFriendModel.countDocuments({_id: friendId, recipient: userId, status: 'pending'});
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

    async removeFriend(friendId){
        return await UserFriendModel.deleteOne({_id: friendId});
    }
}

module.exports = new UserFriendRepository();