class Controller{
    static sellerHome(req, res){
        res.render('seller')
    }
    static loginPost(req, res){
        const {username,password}=req.body
        User.findOne({
            where:{
                username
            }
        })
            .then((user) => {
                if(user){
                    const compare=bcrypt.compareSync(password,user.password)
                    if(compare){
                        res.redirect('/') //buyer atau seler role
                    }
                } 
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }
}

module.exports = Controller