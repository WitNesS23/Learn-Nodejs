var crypto = require("crypto");
var User = require('../models/user.js');
var Post = require('../models/post.js');

module.exports = function(app) {
    app.get("/", function(req, res) {
        Post.getPosts(null, function(err, posts) {
            if (err) {
                posts = [];
            }

            res.render("index", {
                "title": "主页",
                "user": req.session.user,
                "posts": posts,
                "success": req.flash("success").toString(),
                "error": req.flash("error").toString()
            });
        })
    });

    app.get("/reg", checkNotLogin);
    app.get("/reg", function(req, res) {
        res.render("reg", {
            "title": "注册",
            "user": req.session.user,
            "success": req.flash("success").toString(),
            "error": req.flash("error").toString()
        });
    });

    app.post("/reg", checkNotLogin);
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

    app.get("/login", checkNotLogin);
    app.get("/login", function(req, res) {
        res.render("login", {
            "title": "登陆",
            "user": req.session.user,
            "success": req.flash("success").toString(),
            "error": req.flash("error").toString()
        });
    });

    app.post("/login", checkNotLogin);
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

            if (!user) {
                req.flash('error', '用户不存在');
                req.redirect('/login');
            }

            if (user.password != password) {
                req.flash('error', '输入密码不正确');
            }

            req.session.user = user;
            req.flash('success', '登陆成功');
            res.redirect('/');
        })
    });

    app.get("/post", checkLogin);
    app.get("/post", function(req, res) {
        res.render("post", {
            "title": "发表",
            "user": req.session.user,
            "success": req.flash("success").toString(),
            "error": req.flash("error").toString()
        });
    });

    app.post("/post", checkLogin);
    app.post("/post", function(req, res) {
        var currentUser = req.session.user,
            post = new Post(currentUser.name, req.body.title, req.body.post);

        post.save(function(err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }

            req.flash('success', '发表成功');
            res.redirect('/');
        });
    });

    app.get("/logout", checkLogin);
    app.get("/logout", function(req, res) {
        req.session.user = null;
        res.clearCookie("user");

        req.flash('success', '登出成功');
        res.redirect('/');
    });
};

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录');
        res.redirect('/login');
    }

    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录');
        res.redirect('back');
    }

    next();
}
