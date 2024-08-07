const UserFriendModel = require('./../models/UserFriend.model');

class UserFriendRepository{
    async findById(id){
        return await UserFriendModel.findById(id);
    }
    
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

    async isRelationshipExist(userId, friendId){
        const count = await UserFriendModel.countDocuments({
            $or: [
                {requester: userId, recipient: friendId},
                {requester: friendId, recipient: userId}
            ]
        });
        return count > 0;
    }

    async findUserRelationship(userId, friendId){
        return await UserFriendModel.findOne({
            $or: [
                {requester: userId, recipient: friendId},
                {requester: friendId, recipient: userId}
            ]
        });
    }

    async acceptFriendRequest(userId, friendId){
        return await UserFriendModel.findOneAndUpdate({_id: friendId, recipient: userId}, {status: 'accepted'});
    }

    async isUserFriend(userId, friendId){
        return await UserFriendModel.countDocuments({_id: friendId, $or: [
            {recipient: userId},
            {requester: userId}
        ], status: 'accepted'});
    }

    async rejectFriendRequest(userId, friendId){
        return await UserFriendModel.deleteOne({_id: friendId});
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
        }).populate('requester recipient', '-password -createdAt -updatedAt -email -__v');
    }

    async getFriendRequests(userId){
        return await UserFriendModel.find({recipient: userId, status: 'pending'}).populate('requester', '-password -createdAt -updatedAt -email -__v');;
    }

    async removeFriend(friendId){
        return await UserFriendModel.deleteOne({_id: friendId});
    }
}

module.exports = new UserFriendRepository();