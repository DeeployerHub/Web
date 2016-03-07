module.exports = {
    findUserWithId: function(userId, result) {
        var usersSchema = getModelSchema('users');

        usersSchema.find({ id: userId }, function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    },
    findUserWithEmail: function(userEmail, result) {
        var usersSchema = getModelSchema('users');

        usersSchema.find({ email: userEmail }, function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    },
    registerNewUser: function(email, result) {
        var usersSchema = getModelSchema('users');
        var newUser = new usersSchema({ 
            email: email,
            activated: false
        });

        newUser.save(function(err, res){
            if (err) {
                return console.error(err);
            }

            result(res[0]);
        });
    }  
};