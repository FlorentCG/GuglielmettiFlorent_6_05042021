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
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {sauce.likes++; // Incriment likes
      
        sauce.save((err) => {
            if (err) {
                res.json({success: false, message: 'something went wrong'});
            } else {
                res.json({success: true, message: 'Sauce liked!'})
            }
    })})};
   

    exports.dislikeSauce = (req, res, next) => {
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {sauce.dislikes++; // Incriment likes
          
            sauce.save((err) => {
                if (err) {
                    res.json({success: false, message: 'something went wrong'});
                } else {
                    res.json({success: true, message: 'Sauce disliked!'})
                }
        })})};
/**export class SingleSauceComponent implements OnInit {

  loading: boolean;
  sauce: Sauce;
  userId: string;
  likePending: boolean;
  liked: boolean;
  disliked: boolean;
  errorMessage: string;

  constructor(private sauces: SaucesService,
              private route: ActivatedRoute,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.userId = this.auth.getUserId();
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.sauces.getSauceById(params.id).then(
          (sauce: Sauce) => {
            this.sauce = sauce;
            this.loading = false;
            if (sauce.usersLiked.find(user => user === this.userId)) {
              this.liked = true;
            } else if (sauce.usersDisliked.find(user => user === this.userId)) {
              this.disliked = true;
            }
          }
        );
      }
    );
    this.userId = this.auth.getUserId();
  }

  onLike() {
    if (this.disliked) {
      return 0;
    }
    this.likePending = true;
    this.sauces.likeSauce(this.sauce._id, !this.liked).then(
      (liked: boolean) => {
        this.likePending = false;
        this.liked = liked;
        if (liked) {
          this.sauce.likes++;
        } else {
          this.sauce.likes--;
        }
      }
    );
  }

  onDislike() {
    if (this.liked) {
      return 0;
    }
    this.likePending = true;
    this.sauces.dislikeSauce(this.sauce._id, !this.disliked).then(
      (disliked: boolean) => {
        this.likePending = false;
        this.disliked = disliked;
        if (disliked) {
          this.sauce.dislikes++;
        } else {
          this.sauce.dislikes--;
        }
      }
    );
  }

  onBack() {
    this.router.navigate(['/sauces']);
  }

  onModify() {
    this.router.navigate(['/modify-sauce', this.sauce._id]);
  }

  onDelete() {
    this.loading = true;
    this.sauces.deleteSauce(this.sauce._id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/sauces']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }
} */