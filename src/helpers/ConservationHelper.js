
class ConservationHelper {
    static generateConservation(conservation, userId) {
        if(conservation.type === 'private') {
            const result = conservation.members.filter(member => member._id.toString() != userId);
            conservation.name = result[0].name;
            conservation.image = result[0].image;
        }

        return conservation;
    }
}

module.exports = ConservationHelper;