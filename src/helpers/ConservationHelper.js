
class ConservationHelper {
    static generateConservation(conservation, userId) {
        conservation = conservation.toObject();
        if(conservation.type === 'private') {
            const result = conservation.members.filter(member => member._id.toString() != userId);
            
            conservation.name = result[0].name;
            conservation.image = result[0].avatar;
        }
        
        conservation.isReadMessage = conservation.readStatus.get(userId.toString());
        delete conservation.readStatus;
        delete conservation.__v;
        return conservation;
    }
}

module.exports = ConservationHelper;