const conservationService = require('./../services/conservationService.service');

class ConservationController {
    async openConservation(req, res, next) {
        const {_id} = req.user;
        const { id } = req.params;
        const result = await conservationService.openConservation(_id, id);

        return res.status(200).json({
            message: 'Open conservation successfully.',
            data: result
        });
    }
}

module.exports = new ConservationController();