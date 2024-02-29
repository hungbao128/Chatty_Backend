const BadRequest = require("../core/BadRequest");
const UserFriendRepository = require("../repositories/UserFriend.repository");

class UserFriendService{
    async requestAddFriend(userId, friendId){
        if(userId === friendId) throw new BadRequest('You can\'t send friend request to yourself.');

        if(await UserFriendRepository.isFriend(userId, friendId)) throw new BadRequest('You are already friends.');

        if(await UserFriendRepository.isPendingRequest(userId, friendId)) throw new BadRequest('You already request add friend.');
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
        
        if(!await UserFriendRepository.isPendingRequest(userId, friendId)) throw new BadRequest('You don\'t have pending request.');

        return await UserFriendRepository.rejectFriendRequest(userId, friendId);
    }

    async removeFriend(userId, friendId){
        if(!await UserFriendRepository.isUserFriend(userId, friendId)) throw new BadRequest('You are not friends.');

        return await UserFriendRepository.removeFriend(friendId);
    }

    async getCurrentUserFriends(userId){
        return await UserFriendRepository.getCurrentUserFriends(userId);
    }
}

module.exports = new UserFriendService();