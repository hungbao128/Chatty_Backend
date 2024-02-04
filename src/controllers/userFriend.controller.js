const userFriendService = require("../services/userFriend.service");

class UserFriendController{
    async requestAddFriend(req, res, next){
        const {user} = req;
        const {id} = req.params;
        await userFriendService.requestAddFriend(user._id, id);
        return res.status(200).json({
            message: "Friend request sent successfully!"
        });
    }
}

module.exports = new UserFriendController();