const BadRequest = require("../core/BadRequest");
const UserFriendRepository = require("../repositories/UserFriend.repository");
const UserFriendHelper = require("../helpers/UserFriendHelper");
const { socketIOObject } = require("../sockets/conversation.socket");
const UserRepository = require("../repositories/User.repository");

class UserFriendService{
    async requestAddFriend(userId, friendId){
        if(userId == friendId) throw new BadRequest('You can\'t send friend request to yourself.');

        if(await UserFriendRepository.isFriend(userId, friendId)) throw new BadRequest('You are already friends.');

        if(await UserFriendRepository.isRelationshipExist(userId, friendId)) throw new BadRequest('You already have a relationship with this user.');
        
        const result = await UserFriendRepository.requestAddFriend(userId, friendId);
        
        const requestInfo = await UserRepository.findById(userId);
        socketIOObject.value.emit('friend:request', { userId: friendId, friendRequest: result, requestInfo: {
            _id: requestInfo._id,
            name: requestInfo.name,
            avatar: requestInfo.avatar
        } });

        return result;
    }

    async acceptFriendRequest(userId, friendId){
        if(await UserFriendRepository.isUserFriend(userId, friendId)) throw new BadRequest('You are already friends.');

        const pendingRequest = await UserFriendRepository.findById(friendId);
        if(!pendingRequest) throw new BadRequest('Friend request not found.');
        if(pendingRequest.recipient != userId) throw new BadRequest('You are not the recipient of this friend request.');

        pendingRequest.status = 'accepted';
        await pendingRequest.save();
        // const result = await UserFriendRepository.acceptFriendRequest(userId, friendId);
        const userIdFriend = pendingRequest.requester;

        console.log(userIdFriend, result);
        const userInfo = await UserRepository.findById(userId);
        socketIOObject.value.emit('friend:accept', { userId: userIdFriend, friendRequest: result, userInfo: {
            _id: userInfo._id,
            name: userInfo.name,
            avatar: userInfo.avatar
        } });

        return result;
    }

    async rejectFriendRequest(userId, friendId){
        return await UserFriendRepository.rejectFriendRequest(userId, friendId);
    }

    async cancelFriendRequest(userId, friendId){
        if(await UserFriendRepository.isUserFriend(userId, friendId)) throw new BadRequest('You are already friends.');

        return await UserFriendRepository.rejectFriendRequest(userId, friendId);
    }

    async removeFriend(userId, friendId){
        if(!await UserFriendRepository.isUserFriend(userId, friendId)) throw new BadRequest('You are not friends.');

        return await UserFriendRepository.removeFriend(friendId);
    }

    async getCurrentUserFriends(userId){
        const friends = await UserFriendRepository.getCurrentUserFriends(userId);
        
        return friends.map(friend => UserFriendHelper.generateUserFriend(friend, userId));
    }
    
    async getFriendRequests(userId){
        const requests = await UserFriendRepository.getFriendRequests(userId);

        return requests.map(request => UserFriendHelper.generateUserFriend(request, userId));
    }
}

module.exports = new UserFriendService();