var app = angular.module('myApp', ['ui.router', ' ngToast',  'textangular']);



/*app.factory('Authservice', function($q, $rootScope ){
    return {
        isauthenticated:function(){
            var defer = $q.defer();
            Stamplay.USer.currentUser( function (err, res){
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
*/

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


app.controller('HomeCtrl', function ($rootScope, $timeout, $state){
    $scope.logout=function(){
        console.log ("logoutcalled");        
    }
});


app.controller('SignupCtrl', function($scope){
    $rootScope.newUser={};
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





app.controller ('LoginCtrl', function($scope, $location, $timeout,$rootScope,ngToast){
    $rootScope.user={};
    /*$rootScope.currentUser= function(){
        if($rootScope.user.email == $rootScope.newUser.email && $rootScope.user.password == $rootScope.newUser.password)
        {
            console.log(" All Good!!!!  Lets Sign Up !! ");
            ngToast.create("All good. Lets continue");
            $rootScope.LoggedIn = true;
        }
        else 
    };*/

    $scope.login = function(){
        $rootScope.User.currentUser()
        .then(function(res){
            console.log(res);
            if (res.User){
                $rootScope.LoggedIn = true;
                $rootScope.displayName = res.User.fname+ " " + res.User.lname;
                $timeout (function(){
                    $location.path("/userpage");
                    ngToast.create("user can now access the account");
                });
            }
            else{
                $rootScope.User.login($scope.user)
                .then(function(res)
                {
                    console.log(res);
                    $rootScope.LoggedIn=true;
                    $rootScope.displayName=res.fName + " "+ res.lname;
                    $timeout(function(){
                        $state.go("MyBlogs");
                        ngToast.create("user can now view his/her blogs")
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