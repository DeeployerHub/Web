module.exports = {
    collectionName: 'users',
    schema: {
        email: {
            type: String,
            index: {
              unique: true
            }
        },
        activated: Boolean,
    }
};