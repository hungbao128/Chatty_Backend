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
        if(pendingRequest.recipient.toString() != userId.toString()) throw new BadRequest('You are not the recipient of this friend request.');

        pendingRequest.status = 'accepted';
        await pendingRequest.save();
        const userIdFriend = pendingRequest.requester;

        const userInfo = await UserRepository.findById(userId);
        socketIOObject.value.emit('friend:accept', { userId: userIdFriend, friendRequest: pendingRequest, userInfo: {
            _id: userInfo._id,
            name: userInfo.name,
            avatar: userInfo.avatar
        } });

        return pendingRequest;
    }

    async rejectFriendRequest(userId, friendId){
        const request = await UserFriendRepository.findById(friendId);
        if(!request) throw new BadRequest('Friend request not found.');
        if(request.recipient.toString() != userId.toString()) throw new BadRequest('You are not the recipient of this friend request.');

        const reuslt = await UserFriendRepository.rejectFriendRequest(userId, friendId);
        socketIOObject.value.emit('friend:reject', { userId: request.requester, friendRequest: request });
        return reuslt;

    }

    async cancelFriendRequest(userId, friendId){
        if(await UserFriendRepository.isUserFriend(userId, friendId)) throw new BadRequest('You are already friends.');

        const request = await UserFriendRepository.findById(friendId);
        if(!request) throw new BadRequest('Friend request not found.');
        if(request.requester.toString() != userId.toString()) throw new BadRequest('You are not the requester of this friend request.');
        
        const result = await UserFriendRepository.rejectFriendRequest(userId, friendId);
        socketIOObject.value.emit('friend:cancel', { userId: request.recipient, friendRequest: request });
        return result;
    }

    async removeFriend(userId, friendId){
        if(!await UserFriendRepository.isUserFriend(userId, friendId)) throw new BadRequest('You are not friends.');

        const request = await UserFriendRepository.findById(friendId);
        if(!request) throw new BadRequest('Friend request not found.');

        await UserFriendRepository.removeFriend(friendId);
        socketIOObject.value.emit('friend:remove', { userId: request.requester, friendRequest: request });
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