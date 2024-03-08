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

    async getCurrentUserFriends(req, res, next){
        const {user} = req;

        const result = await userFriendService.getCurrentUserFriends(user._id);

        return res.status(200).json({
            message: "Get current user friends successfully!",
            data: result
        });
    }

    async getFriendRequests(req, res, next){
        const {user} = req;

        const result = await userFriendService.getFriendRequests(user._id);

        return res.status(200).json({
            message: "Get friend requests successfully!",
            data: result
        });
    }

    async removeFriend(req, res, next){
        const {user} = req;
        const {id} = req.params;
        await userFriendService.removeFriend(user._id, id);

        return res.status(200).json({
            message: "Remove friend successfully!"
        });
    }
}

module.exports = new UserFriendController();