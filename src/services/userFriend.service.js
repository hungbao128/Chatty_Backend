const BadRequest = require("../core/BadRequest");
const UserFriendRepository = require("../repositories/UserFriend.repository");
const UserFriendHelper = require("../helpers/UserFriendHelper");

class UserFriendService{
    async requestAddFriend(userId, friendId){
        if(userId == friendId) throw new BadRequest('You can\'t send friend request to yourself.');

        if(await UserFriendRepository.isFriend(userId, friendId)) throw new BadRequest('You are already friends.');

        if(await UserFriendRepository.isRelationshipExist(userId, friendId)) throw new BadRequest('You already have a relationship with this user.');
        
        return await UserFriendRepository.requestAddFriend(userId, friendId);
    }

    async acceptFriendRequest(userId, friendId){
        if(await UserFriendRepository.isUserFriend(userId, friendId)) throw new BadRequest('You are already friends.');

        return await UserFriendRepository.acceptFriendRequest(userId, friendId);
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