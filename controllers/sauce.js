const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req,res,next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const sauce = new Sauce({
        ...sauceObjet,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
        sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
    
};

exports.getAllSauces = (req,res,next) => {
    Sauce.find()
    .then(sauces => {
        res.status(200).json(sauces);
    })
    .catch(error => {
        res.status(400).json({ message: error });
    });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        res.status(200).json(sauce);
    })
    .catch( error => {
        res.status(404).json({ error: error });
    });
};

exports.modifyOneSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a bien été supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};



exports.likeSauce = (req, res, next) => {      
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    if(like === 1) { // Option like
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
        
        .catch( error => res.status(400).json({ error}))
    } else if(like === -1) { // Option dislike
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce !' }))
        .catch( error => res.status(400).json({ error}))

    } 
    if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
        Sauce.findOne({
            _id: sauceId
          })
          .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
              Sauce.updateOne({
                  _id: sauceId
                }, {
                  $pull: {
                    usersLiked: userId
                  },
                  $inc: {
                    likes: -1
                  }, // On incrémente de -1
                })
                .then(() => res.status(200).json({
                  message: 'Like retiré !'
                }))
                .catch((error) => res.status(400).json({
                  error
                }))
            }
            if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
              Sauce.updateOne({
                  _id: sauceId
                }, {
                  $pull: {
                    usersDisliked: userId
                  },
                  $inc: {
                    dislikes: -1
                  }, // On incrémente de -1
                })
                .then(() => res.status(200).json({
                  message: 'Dislike retiré !'
                }))
                .catch((error) => res.status(400).json({
                  error
                }))
            }
          })
          .catch((error) => res.status(404).json({
            error
          })) 
                      
            
                  
    }   

}
;
   
/**     .catch( error => res.status(400).json({ error})  */ 
 
