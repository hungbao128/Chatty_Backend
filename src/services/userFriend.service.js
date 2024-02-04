const BadRequest = require("../core/BadRequest");
const UserFriendRepository = require("../repositories/UserFriend.repository");

class UserFriendService{
    async requestAddFriend(userId, friendId){
        if(userId === friendId) throw new BadRequest('You can\'t send friend request to yourself.');

        if(await UserFriendRepository.isFriend(userId, friendId)) throw new BadRequest('You are already friends.');

        if(await UserFriendRepository.isPendingRequest(userId, friendId)) throw new BadRequest('You already request add friend.');
        return await UserFriendRepository.requestAddFriend(userId, friendId);
    }

    async removeFriend(userId, friendId){
        // Remove friend from user
    }

    async getFriends(userId){
        // Get all friends of user
    }
}

module.exports = new UserFriendService();