const UserModel = require('../models/user.model');
const ConversationModel = require('../models/conversation.model');
const ObjectID = require('mongoose').Types.ObjectId;

/* module.exports.getAllUsers = async (req , res) => {
    //console.log(req.query.location);
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}; */

module.exports.getAllUsers = async (req , res) => {

    const liked = req.query.liked;
    const likedId = [];

    liked?.forEach(function(item){
        likedId.push(JSON.parse(item).likedUserId);
        });


    const users = await UserModel.find({
/*             'filters.location': {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: req.query.location
                    },
                    //$minDistance: 1000,
                    $maxDistance: req.query.distance * 1000 //convert to meters
                }
            }, */
            _id: {$ne: req.query.uid, $nin: req.query.matchs, $nin: likedId}, //to exclude current user, exclude users already match or liked
            //tags: {$in: req.query.tags}, 
            //age: {$gte: req.query.minAge , $lte: req.query.maxAge}
        }
        ).select('-password');
    
    res.status(200).json(users);
    //console.log(users);
};

module.exports.userInfo = (req, res) => {
    //console.log(req.params);
    // check if the ID is known
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) {
            return res.send(docs)
        }
        else {
            console.log('ID unknown :' + err)
        }
    }).select('-password');
};

// NE MARCHE PAS, RENVOIS UNE ERREUR 'ERR_HTTP_HEADERS_SENT'. POURQUOI ???

/* module.exports.updateUser = async (req, res) => {
    // check if the ID is known
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }
    
    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    description: req.body.bio
                }
            },
            {new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if(!err) { return res.send(docs)}
                if(err) { return res.status(500).send({message: err})}
            }
        )
    }

    catch (err) {
        return res.status(500).json({message: err});
    }
}; */

module.exports.updateUser = async (req, res) => {
    // check if the ID is known
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    const entries = Object.keys(req.body)
    const updates = {}
    

    // constructing dynamic query

    for (let i = 0; i < entries.length; i++) {
    updates[entries[i]] = Object.values(req.body)[i]
    }

    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: updates/* {
                    pseudo: req.body.pseudo,
                    picture: req.body.picture,
                    description: req.body.description,
                    age: req.body.age,
                    tags: req.body.tags,
                    

                    'filters.tags': req.body.filters.tags,
                    'filters.minAge': req.body.filters.minAge,
                    'filters.maxAge': req.body.filters.maxAge,
                    'filters.orientation': req.body.filters.orientation,
                    'filters.distance': req.body.filters.distance,
                    'filters.location': req.body.coordinates,
                } */
            },
            {new: true, upsert: true, setDefaultsOnInsert: true}
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(500).send({ message: err }));
    }

    catch (err) {
        return res.status(500).json({message: err});
    }
};

module.exports.deleteUser = async (req, res) => {
    // check if the ID is known
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    try {
        await UserModel.deleteOne({ _id: req.params.id}).exec();
        res.status(200).json({message: "Successfully deleted."});
    }

    catch (err) {
        return res.status(500).json({message: err});
    }
};

module.exports.likeUser = async (req, res) => {
    // check if the ID is known
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToLike)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    try {

        // add the liked user to the liked list (ajout du like ds la liste de l utilisateur qui a like)
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet:{ liked: {likedUserId: req.body.idToLike} }},
            {new: true, upsert: true}
        )
        .then((doc) => res.status(201).json(doc))
        .catch((err) => res.status(400).json(err));

        //add the like to the liked's User likes list (ajout du like ds la liste de l utilisateur q a ete liker)
        await UserModel.findByIdAndUpdate(
            req.body.idToLike,
            {$addToSet: { likes: req.params.id}}
        )
        //.then((doc) => res.status(201).json(doc))
        .catch((err) => res.status(400).json(err));

    }

    catch(err) {
        return res.status(500).json({message: err});
    }
};

module.exports.unlikeUser = async (req, res) => { // this delete a sended like by the user (delete un pedning match)
    // check if the ID is known
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnlike)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    try {

        // delete the liked user to the liked list (ajout du like ds la liste de l utilisateur qui a like)
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull:{ liked: {likedUserId: req.body.idToUnlike} }},
            {new: true, upsert: true}
        )
        .then((doc) => res.status(201).json(doc))
        .catch((err) => res.status(400).json(err));

        // delete the like to the liked's User likes list (ajout du like ds la liste de l utilisateur q a ete liker)
        await UserModel.findByIdAndUpdate(
            req.body.idToUnlike,
            {$pull: { likes: req.params.id}}
        )
        //.then((doc) => res.status(201).json(doc))
        .catch((err) => res.status(400).json(err));

    }

    catch(err) {
        return res.status(500).json({message: err});
    }
};

module.exports.matchInfo = async (req, res) => {
        // check if the ID is known
        if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToMatch)) {
            return res.status(400).send('ID unknown: ' + req.params.id);
        }

        UserModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                return res.send(docs)
            }
            else {
                console.log('ID unknown :' + err)
            }
        }).select('matchs');
};

module.exports.matchUser = async (req, res) => {
    // check if the ID is known
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToMatch)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    try {
        await UserModel.findByIdAndUpdate(
            req.params.id,
            {
            $addToSet:{ matchs: req.body.idToMatch },
            $pull: { likes: req.body.idToMatch }
            },
            {new: true, update: true}
        )
        .then((doc) => res.status(201).json(doc))
        .catch((err) => res.status(400).json(err));

        //add the match to the other
        await UserModel.findByIdAndUpdate(
            req.body.idToMatch,
            {
            $addToSet: { matchs: req.params.id},
            $pull: { liked: {likedUserId: req.params.id}}
            },

            {new: true, update: true}
        )
        //.then((doc) => res.status(201).json(doc))
        .catch((err) => res.status(400).json(err));

    }

    catch(err) {
        return res.status(500).json({message: err});
    }

};

module.exports.unmatchUser = async (req, res) => {
    // check if the ID is known
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnmatch)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }

    try {
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull:{ matchs: req.body.idToUnmatch }},
            {new: true, upsert: true}
        )
        .then((doc) => res.status(201).json(doc))
        .catch((err) => res.status(400).json(err));

        //add the match to the other
        await UserModel.findByIdAndUpdate(
            req.body.idToUnmatch,
            {$pull: { matchs: req.params.id}}
        )
        //.then((doc) => res.status(201).json(doc))
        .catch((err) => res.status(400).json(err));
    }

    catch(err) {
        return res.status(500).json({message: err});
    }
};

// !!!!! delete likes in both user when match is resolved (call unlikeUser) !!!!!
// !!!!! delete matchs and likes in both user account when user account is deleted (call unlikeUser and unmatchUser) !!!!!
