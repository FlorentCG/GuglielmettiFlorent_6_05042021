const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req,res,next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const sauce = new Sauce({
        ...sauceObjet,
        /**Initialisation de l'objet sauce avec compteur de like à 0 */
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
            .then(() => res.status(200).json({ message: 'Sauce  supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};



exports.likeSauce = (req, res, next) => {      
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    /**utilisation des opérateurs $push et $inc { <field1>: <value1>, ... } pour mettre à jour le compteur de like/dislike */
    if(like === 1) { 
        Sauce.updateOne({_id: sauceId}, { $inc: { likes: 1}, $push: { usersLiked: userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'sauce likée' }))
        .catch( error => res.status(400).json({ error}))
    
    } else if(like === -1) { 
        Sauce.updateOne({_id: sauceId}, { $inc: { dislikes: 1}, $push: { usersDisliked: userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'sauce dislikée' }))
        .catch( error => res.status(400).json({ error}))

    } 
    if (like === 0) { 
        Sauce.findOne({ _id: sauceId})
        /**Utilisation de la méthodes includes pour vérifier la constante userID */
          .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({_id: sauceId}, {$pull: {usersLiked: userId},$inc: {likes: -1},})
                .then(() => res.status(200).json({message: 'Like annulé !'}))
                .catch((error) => res.status(400).json({error}))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({_id: sauceId}, {$pull: {usersDisliked: userId},$inc: {dislikes: -1}, })
                .then(() => res.status(200).json({message: 'Dislike retiré !'}))
                .catch((error) => res.status(400).json({error})
                )}})
          
          .catch((error) => res.status(404).json({error })) 
              }   
            };
   

 
