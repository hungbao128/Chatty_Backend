const userFriendService = require("../services/userFriend.service");

class UserFriendController{
    async requestAddFriend(req, res, next){
        const {user} = req;
        const {id} = req.params;
        const result = await userFriendService.requestAddFriend(user._id, id);
        return res.status(200).json({
            status: "success",
            message: "Friend request sent successfully!",
            data: result
        });
    }

    async acceptFriendRequest(req, res, next){
        const {user} = req;
        const {id} = req.params;
        const result = await userFriendService.acceptFriendRequest(user._id, id);

        return res.status(200).json({
            status: "success",
            message: "Friend request accepted successfully!",
            data: result
        });
    }

    async rejectFriendRequest(req, res, next){
        const {user} = req;
        const {id} = req.params;
        await userFriendService.rejectFriendRequest(user._id, id);

        return res.status(200).json({
            status: "success",
            message: "Friend request rejected successfully!"
        });
    }

    async cancelFriendRequest(req, res, next){
        const {user} = req;
        const {id} = req.params;
        await userFriendService.cancelFriendRequest(user._id, id);

        return res.status(200).json({
            status: "success",
            message: "Friend request canceled successfully!"
        });
    }

    async getCurrentUserFriends(req, res, next){
        const {user} = req;

        const result = await userFriendService.getCurrentUserFriends(user._id);

        return res.status(200).json({
            status: "success",
            message: "Get current user friends successfully!",
            data: result
        });
    }

    async getFriendRequests(req, res, next){
        const {user} = req;

        const result = await userFriendService.getFriendRequests(user._id);

        return res.status(200).json({
            status: "success",
            message: "Get friend requests successfully!",
            data: result
        });
    }

    async removeFriend(req, res, next){
        const {user} = req;
        const {id} = req.params;
        await userFriendService.removeFriend(user._id, id);

        return res.status(200).json({
            status: "success",
            message: "Remove friend successfully!"
        });
    }
}

module.exports = new UserFriendController();