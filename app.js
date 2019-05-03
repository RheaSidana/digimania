var app = express();
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(3000);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//VARIABLE FOR CONNECTING WITH MYSQL    
var mysql = require('mysql');

//creating connection
var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword"
});

//connecting with mysql
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE maappdb", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });

    var sql = "CREATE TABLE user ( UserID int identity(1,1) primary key, fname VARCHAR(255) NOT NULL, lname VARCHAR(255) NOT NULL, email NVARCHAR(320) NOT NULL, psswrd VARCHAR(255) NOT NULL )";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
        // image left
    var sqlpost = "CREATE TABLE posts ( UserID int identity(1,1) primary key, postID int identity(1,1), topic VARCHAR(255), desc VARCHAR(255), price VARCHAR(255), link VARCHAR(255), hashtag VARCHAR(255), )";
    con.query(sqlpost, function (err, result) {
       if (err) throw err;
        console.log("Table created");
    });
});

//creating the app
var app = angular.module('myApp', ['ui.router', ' ngToast',  'textangular' , '720kb.socialshare' ]);

//authenticating the app
app.factory('Authservice', function($q, $rootScope ){
    return {
        isauthenticated:function(){
            var defer = $q.defer();
            $rootScope.user.currentUser( function (err, res){
                if(err){
                    defer.resolve (false);
                    $rootScope.LoggedIn= false;
                }
                if(res.user){
                    defer.resolve(true);
                    $rootScope.LoogedIn = true;
                }
                else{
                    defer.resolve(false);
                    $rootScope.LoggedIn = false;
                }
            });
            return defer.promise;
        }
    }
});

//applying filter 
app.filter ('htmlToPlainText', function(){
    return function(text){
        return text ? String (text). replace(/[^>]+/gm,'') : '' ;
    }
})

//configuring routing of the app
app.config ( function ( $stateProvider, $urlRouterProvider){
    $stateProvider
    .state('home',{
        url:'/',
        templateurl:'homepage.html',
        controller:'HomeCtrl'
    })
    .state('login',{
        url:'/login',
        templateurl:'login.html',
        controller:'loginCtrl'
    })
    .state('signup',{
        url:'/signup',
        templateurl:'signup.html',
        controller:'SignupCtrl'
    })
    .state('userpage',{
        url:'/userpage',
        templateurl:'userpage.html',
        controller:'UserpageCtrl'
    })
    .state('history',{
        url:'/history',
        templateurl:'history.html',
        controller:'HistoryCtrl'
    })
    .state('editPref',{
        url:'/Preferences',
        templateurl:'editpref.html',
        controller:'PreferenceCtrl'
    })
    .state('create',{
        url:'/createPost',
        templateurl:'createPost.html',
        controller:'createCtrl'
    })
    .state('historyPost',{
        url:'/historyPosts',
        templateurl:'historyPost.html',
        controller:'HistoryPostCtrl'
    })
    $urlRouterProvider.otherwise("/");
});

//controller for home control - full
app.controller('HomeCtrl', function ($rootScope, $timeout, $state){
    $rootScope.query={};

    $scope.logout=function(){
        console.log ("logoutcalled");        
    }

    $rootScope.gologin=function(){
        $state.go("login");
    }

    $rootScope.gosignup=function(){
        $state.go("signup");
    }

    $scope.querysend=function(){
        //send email to digimania@helpdesk.com from query.email
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'digimania@helpdesk.com',
            pass: '*****' //add the password in '   '
            }
        });

        var mailOptions = {
        from: $rootScope.query.email ,
        to: 'digimania@helpdesk.com',
        subject: ' ',
        text: $rootScope.query.content
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            }
            else {
            console.log('Email sent: ' + info.response);
            }
        });
    }
});

//controller for signup control
app.controller('SignupCtrl', function($scope,ngToast,$rootScope){
    $rootScope.newUser={};
    $rootScope.i = 0;
    $rootScope.LoggedIn = false;
    $rootScope.SignUp=function(){
    
        if($rootScope.newUser.fname && $rootScope.newUser.lname && $rootScope.newUser.email && $rootScope.newUser.password && $rootScope.newUser.confirmPassword )
        {
            console.log(" All fields are valid !! ");
            if ($rootScope.newUSer.password == $rootScope.newUSer.confirmPassword)
            {
                console.log(" All Good!!!!  Lets Sign Up !! ");
                ngToast.create("All good. Lets continue");
                $rootScope.LoggedIn = true;
                var securePassword = require('secure-password');

                i = i+1;
 
            // Initialise our password policy
            var pwd = securePassword();
            $rootScope.passwd = 0;
 
            var Password = Buffer.from('my secret password');
 
            // Register user
            pwd.hash(Password, function (err, hash) {
                if (err) 
                    throw err;
 
                // Save hash somewhere
                pwd.verify(Password, hash, function (err, result) {
                    if (err) 
                        throw err;
    
                    switch (result) {
                        case securePassword.INVALID_UNRECOGNIZED_HASH:
                            return console.error('This hash was not made with secure-password. Attempt legacy algorithm');
                        case securePassword.INVALID:
                            return console.log('Invalid password');
                        case securePassword.VALID:
                            return console.log('Authenticated');
                        case securePassword.VALID_NEEDS_REHASH:
                            console.log('Yay you made it, wait for us to improve your safety');
 
                        pwd.hash(userPassword, function (err, improvedHash) {
                            if (err) 
                                console.error('You are authenticated, but we could not improve your safety this time around');

                            // Save improvedHash somewhere
                            passwd = improvedHash;
                        })
                    break;
                    }
                });

                con.connect(function(err) {
                    if (err) throw err;
                    console.log("Connected!");
                    var sql = "INSERT INTO user (UserID, fname, lname, email, psswrd ) VALUES ( i, $rootScope.newUser.fname, $rootScope.newUser.lname, $rootScope.newUser.email, $rootScope.passwd )";
                    con.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log( i , " record inserted");
                    });
                });
            });
            }
            else{
                console.log("Password donot match");
                ngToast.create("Password do not match,  please enter the correct Password ");
            }
        }
        else{
            console.log("Fields invalid");
                ngToast.create(" Some fields are invalid or missing. Please enter a valid field ! ");
        }
        $timeout( function (){
            $state.go("userpage");
        });

    };
    $scope.newUser.displayName= $scope.newUser.fname + " " + $scope.newUser.lname;

});

//controller for login control
app.controller ('LoginCtrl', function($scope, $location, $timeout,$rootScope,ngToast){
    $rootScope.user={};
    $scope.remember;

    $scope.login = function(){
        $rootScope.user.currentUser()
        .then(function(res){
            console.log(res);
            if (res.User){
                $rootScope.LoggedIn = true;
                $rootScope.displayName = res.user.fname+ " " + res.user.lname;
                $timeout (function(){
                    $location.path("/userpage");
                    ngToast.create("user can now access the account");
                });

                if($scope.remember){
                    passport.use(new RememberMeStrategy(
                        function(token, done) {
                        Token.consume(token, function (err, user) {
                            if (err) { return done(err); }
                            if (!user) { return done(null, false); }
                            return done(null, user);
                        });
                        },
                        function(user, done) {
                        var token = utils.generateToken(64);
                        Token.save(token, { userId: user.id }, function(err) {
                            if (err) { return done(err); }
                            return done(null, token);
                            });
                        }
                    ));
                    timeout(function ( req, res, next) {
                        // issue a remember me cookie if the option was checked
                        if (!req.body.remember_me) { return next(); }

                        var token = utils.generateToken(64);
                        Token.save(token, { userId: req.user.id }, function(err) {
                            if (err) { return done(err); }
                            res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
                            return next();
                        });
                        },
                        function(req, res) {
                        res.redirect('/');
                    });
                }
            }
            else{
                $rootScope.user.login($scope.user)
                .then(function(res)
                {
                    console.log(res);
                    $rootScope.LoggedIn=true;
                    $rootScope.displayName=res.fName + " "+ res.lname;

                    $timeout(function(){
                        $state.go("userpage");
                        ngToast.create("user can now create the post");
                    });
                },
                function (error){
                    console.log(error);
                    $rootScope.LoggedIn = false;

                    $timeout(function(){
                        ngToast("error has occured");
                    });
                });
            }
        });
    };
});

////controller for userpage control
app.controller('UserpageCtrl', function ($scope, $timeout,ngToast, $state){
    $scope.createPost=function(){
        $scope.user.currentUser()
        .then (function(res){
            if(res.user)
            {
                $timeout(function(){
                    ngToast.create("creating post") ;    
                })
                $state.go("create");
            }
            else{
                $timeout(function(){
                    ngToast.create("error occured!! Login First.");    
                })
                $state.go("login");
            }
        }),
        function(err){
            $timeout(function(){
                ngToast.create("An error occured");
            });
            console.log(err);
        };
    };


    $scope.history = function(){
        $scope.user.currentUser()
        .then (function(res){
            if(res.user)
            {
                $timeout(function(){
                    ngToast.create("checking History") ;    
                })
                $state.go("history");
            }
            else{
                $timeout(function(){
                    ngToast.create("error occured!! Login First.");    
                })
                $state.go("login");
            }
        }),
        function(err){
            $timeout(function(){
                ngToast.create("An error occured");
            });
            console.log(err);
        };
    };
    $scope.editPrefer = function(){
        $scope.user.currentUser()
        .then (function(res){
            if(res.user)
            {
                $timeout(function(){
                    ngToast.create("edit your preferences") ;    
                })
                $state.go("editPref");
            }
            else{
                $timeout(function(){
                    ngToast.create("error occured!! Login First.");    
                })
                $state.go("login");
            }
        }),
        function(err){
            $timeout(function(){
                ngToast.create("An error occured");
            });
            console.log(err);
        };
    }; 
});

////controller for history control, RETRIEVING DATA
app.controller('HistoryCtrl', function ($rootScope, $timeout,ngToast, $state){
    $scope.post.topicDisplay;
    $scope.post.descDisplay;
    $rootScope.historyNo = function(){
        $scope.user.currentUser()
        .then (function(res){
            if(res.user){
                var y = historyCount;
                //view summary list of the the posts
                for (var x=1; x<=5; x++){

                    con.connect(function(err) {
                        if (err) throw err;
                        post.topicDisplay = con.query("SELECT topic FROM posts WHERE postID=y ", function (err, result) {
                            if (err) throw err;
                            console.log(result);
                        });

                        post.descDisplay = con.query("SELECT desc FROM posts WHERE postID=y ", function (err, result) {
                            if (err) throw err;
                            console.log(result);
                        });
                    });
                }
            }
            else{
                $timeout(function(){
                    ngToast.create("An error occured!! login first.");
                });
                $state.go("login");
            }            
        }),
        function(err){
            $timeout(function(){
                ngToast.create("An error occured");
            });
            console.log(err);
        }
    };
});

//controller for preference selecting control 
app.controller('PreferenceCtrl', ['Socialshare', function ($scope, $timeout,ngToast, $state, Socialshare){
    $rootScope.FACEBOOK;
    $rootScope.WHATSAPP;
    $rootScope.TWITTER;
    $rootScope.LINKEDIN;
    $rootScope.PINTEREST;

    $rootScope.choice=function(){
        $scope.user.currentUser()
        .then(function(res){
            if(res.user){
                
                if(FACEBOOK == checked)
                {
                    $scope.postonFB(); //function calling
                    $scope.$apply();
                }
                if(WHATSAPP == checked)
                {
                    $scope.postonWhatsapp(); //function calling
                    $scope.$apply();
                }
                if(TWITTER == checked)
                {
                    $scope.postonTWEET();
                    $scope.$apply();
                }
                if(LINKEDIN == checked)
                {
                    $scope.postonLINKEDIN();
                    $scope.$apply();
                }
                if(PINTEREST == checked)
                {
                    $scope.postonPINS();
                    $scope.$apply();
                }

                else
                {
                    $timeout(function(){
                        ngToast.create("no preference selected");

                    })
                    $state.go("editPref");
                }
            }
            else{
                $timeout(function(){
                    ngToast.create("error occured!! Login First.");    
                })
                $state.go("login");
            }
        }),
        function(err){
            $timeout(function(){
                ngToast.create("An error occured");
            });
            console.log(err);
        }
    };

    $scope.postonFB=function(){
        Socialshare.share({
            'provider': 'facebook',
            'attrs': {
                'socialshareType': (user.post.topic) + ("\n") + (user.post.price) + ("\n") + (user.post.desc),
                'socialshareUrl': ( user.post.link ),
                'socialshareHashtags': ( user.post.hashtag )
            }
        });
    };
    $scope.postonTWEET=function(){
        Socialshare.share({
            'provider': 'twitter',
            'attrs': {
                'socialshareText': (user.post.topic) + ("\n") + (user.post.price) + ("\n") ,
                'socialshareUrl': ( user.post.link ),
                'socialshareHashtags': ( user.post.hashtag )
            }
        });
    };
    $scope.postonLINKEDIN=function(){
        Socialshare.share({
            'provider': 'linkedin',
            'attrs': {
                'socialshareText': (user.post.topic) + ("\n") + (user.post.price) + ("\n") + (user.post.desc) + ("\n") + ( user.post.hashtag ),
                'socialshareUrl': ( user.post.link ),
            }
        });
    };
    
    $scope.postonWhatsapp=function(){
        Socialshare.share({
            'provider': 'whatsapp',
            'attrs': {
                'socialshareText': (user.post.topic) + ("\n") + (user.post.price) + ("\n") + (user.post.desc) + ("\n") + ( user.post.hashtag ),
                'socialshareUrl': ( user.post.link ),
            }
        });
    };

}]);

//controller for create post control, POST DATA
app.controller('createCtrl', function ($rootScope, $timeout,ngToast, $state){
    $rootScope.newPost={};
    $rootScope.historyCount=0;
    $rootScope.uid=0;
    $scope.create=function(){
        $scope.user.currentUser()
        .then(function(res){
            if(res.user){
                //save data to database
                ngToast.create("Post Successful");
                
                $rootScope.historyCount += 1;
                $rootScope.uid += 1;
                con.connect(function(err) {
                    if (err) throw err;
                    console.log("Connected!");
                    var sql = "INSERT INTO post ( UserID, postID, topic, desc, price, link, hashtag ) VALUES ( i, $rootScope.historyCount, $rootScope.newPost.topic, $rootScope.newPost.desc, $rootScope.newPost.price, $rootScope.newPost.link, $rootScope.newPost.hashtag )";
                    con.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log(" record inserted");
                    });
                });

                $rootScope.choice();
                $state.go("userpage");
                $scope.$apply();
            }
            else{
                ngToast.create("error occured!! Login First.");
                $state.go("login");
            }
        }),
        function(err){
            $timeout(function(){
                ngToast.create("An error occured");
            });
            console.log(err);
        }
    }
});

//controller for historypost control, RETRIEVING DATA
app.controller('HistoryPostCtrl', function ($rootScope,ngToast, $timeout, $state){
    //display image from  the database 
    
});