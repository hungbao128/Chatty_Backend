const conservationService = require('./../services/conservation.service');

class ConservationController {
    async openConservation(req, res, next) {
        const {_id} = req.user;
        const { id } = req.params;
        const result = await conservationService.openConservation(_id, id);

        return res.status(200).json({
            status: "success",
            message: 'Open conservation successfully.',
            data: result
        });
    }

    async getUserConservations(req, res, next){
        const {_id} = req.user;
        const result = await conservationService.getUserConservations(_id);

        return res.status(200).json({
            status: "success",
            message: 'Get user conservations successfully.',
            data: result
        });
    }
}

module.exports = new ConservationController();