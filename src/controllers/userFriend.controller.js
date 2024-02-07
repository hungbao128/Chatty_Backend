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

    async acceptFriendRequest(req, res, next){
        const {user} = req;
        const {id} = req.params;
        await userFriendService.acceptFriendRequest(user._id, id);

        return res.status(200).json({
            message: "Friend request accepted successfully!"
        });
    }

    async rejectFriendRequest(req, res, next){
        const {user} = req;
        const {id} = req.params;
        await userFriendService.rejectFriendRequest(user._id, id);

        return res.status(200).json({
            message: "Friend request rejected successfully!"
        });
    }

    async cancelFriendRequest(req, res, next){
        const {user} = req;
        const {id} = req.params;
        await userFriendService.cancelFriendRequest(user._id, id);

        return res.status(200).json({
            message: "Friend request canceled successfully!"
        });
    }
}

module.exports = new UserFriendController();