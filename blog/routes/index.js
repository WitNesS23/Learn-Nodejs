var crypto = require("crypto");
User = require('../models/user.js');

module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("index", {
            "title": "主页",
            "user": req.session.user,
            "success": req.flash("success").toString(),
            "error": req.flash("error").toString()
        });
    });

    app.get("/reg", function(req, res) {
        res.render("reg", {
            "title": "注册",
            "user": req.session.user,
            "success": req.flash("success").toString(),
            "error": req.flash("error").toString()
        });
    });

    app.post("/reg", function(req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        // check the users password and the re-password
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致');
            return res.redirect('/reg'); // return the register page
        }

        // create the md5 of the pwd
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });

        // check username is existed
        User.get(newUser.name, function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }

            if (user) {
                req.flash('error', "用户已经存在！");
                return res.redirect('/reg');
            }

            // 
            // if isn't existed, add one user
            newUser.save(function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }

                req.session.user = user;
                req.flash('success', "注册成功！");
                res.redirect('/');
            });
        });
    });

    app.get("/login", function(req, res) {
        res.render("login", {
            "title": "登陆",
            "user": req.session.user,
            "success": req.flash("success").toString(),
            "error": req.flash("error").toString()
        });
    });

    app.post("/login", function(req, res) {
        var name = req.body.name,
            password = req.body.password;

        var md5 = crypto.createHash("md5"),
            password = md5.update(password).digest("hex");

        User.get(name, function(err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }

            if (user) {
                if (user.password == password) {
                    req.session.user = user;
                    req.flash('success', '登陆成功');
                    res.redirect('/');
                }
            }
        })
    });

    app.get("/post", function(req, res) {
        res.render("post", { "title": "发表" });
    });

    app.post("/post", function(req, res) {

    });

    app.get("/logout", function(req, res) {

    });
};
