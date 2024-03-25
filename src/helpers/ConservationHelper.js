
class ConservationHelper {
    static generateConservation(conservation, userId) {
        if(conservation.type === 'private') {
            const result = conservation.members.filter(member => member._id.toString() != userId);
            console.log(result[0]);
            conservation.name = result[0].name;
            conservation.image = result[0].avatar;
        }

        return conservation;
    }
}

module.exports = ConservationHelper;