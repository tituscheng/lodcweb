var lodcWebApp = angular.module('lodcWebApp', ['ui.router', 'angularCSS', 'ngSanitize', 'pascalprecht.translate', 'restangular']);

lodcWebApp.config(function($translateProvider, RestangularProvider, $stateProvider, $urlRouterProvider){
	var newBaseUrl = "http://default-environment.tdtddkdkmp.us-west-2.elasticbeanstalk.com/api/api";
	RestangularProvider.setBaseUrl(newBaseUrl);

	$translateProvider.preferredLanguage("en");
	$translateProvider.useStaticFilesLoader({
		prefix: '/languages/',
		suffix: '.json'
	});
	$translateProvider.useSanitizeValueStrategy(null);

	$urlRouterProvider.otherwise('index');
	$stateProvider.state('index', {
		url: "/index",
		templateUrl:"views/index.view.html",
		controller: "MainViewController"
	}).state('sermon', {
		url: "/sermon",
		templateUrl:"views/sermon.view.html",
		controller: "SermonListController"
	}).state('events', {
		url: "/events",
		templateUrl: "views/events.view.html",
		controller: "EventsController"
	}).state('news', {
		url: "/news", 
		templateUrl: "views/news.view.html",
		controller: "NewsController"
	}).state("contact", {
		url: "/contact",
		templateUrl: "views/contact.view.html",
		controller: "ContactController"
	}).state("sermonvideo", {
		url:"/sermon/video",
		templateUrl: "views/sermonvideo.view.html",
		controller: "SermonVideoController",
	}).state('mission',{
		url:"/mission",
		templateUrl: "views/mission.view.html"
	}).state('intro', {
		url:"/intro",
		templateUrl: "views/introduction.view.html"
	});

});

lodcWebApp.controller("MainSliderController", function($scope){

});

lodcWebApp.controller("MainViewController", function($scope, $state){

})

lodcWebApp.controller("NewsController", function($scope, NewsService){
	NewsService.Get(function(news){
		$scope.allnews = news;
	});
});

lodcWebApp.controller("ContactController", function($scope){
	$scope.churchtime = {
		sunday: {
			"en": "1:30 pm",
			"kr": "오후 1시 30분"
		},
		wednesday: {
			"en": "7:30pm",
			"kr": "오후 7시 30분"
		}, 
		saturday: {
			"en": "6:30am",
			"kr": "오전 6시 30분"
		}
	};
})

lodcWebApp.controller("SermonListController", function($scope, SermonService, $state){
	function youtubeimage(url) {
  		return url.replace("https://www.youtube.com/watch?v=", "https://img.youtube.com/vi/") + "/0.jpg";
  	}

  	SermonService.Get(function(response){
  		for(var i = 0; i < response.length; i++) {
  			var sermon = response[i];
  			sermon.media.img = youtubeimage(sermon.media.youtube);
  		}
  		$scope.sermons = response;
  	});

    $scope.shouldDisplayVideo = false;

    $scope.select = function(chosenSermon) {
      $scope.shouldDisplayVideo = true;
      SermonService.setSermon(chosenSermon);
    }

    $scope.watch = function(sermon) {
    	SermonService.setSermon(sermon);
  		$state.go("sermonvideo");
    }

});

lodcWebApp.controller("SermonVideoController", function($scope, SermonService, $sce, $state){
	function embedlink(url) {
		return url.replace("watch?v=", "embed/");
	}
	var sermon = SermonService.getSermon();
	if(!_.isEmpty(sermon)) {
		sermon.media.videoURL = $sce.trustAsResourceUrl(embedlink(sermon.media.youtube));
		$scope.video = sermon;
	} else {
		$state.go("sermon");
	}
	
});


lodcWebApp.directive("mainslider", function(){
	console.log("mainslider called");
	return {
		templateUrl:"/views/main_slider.html",
		link: function(scope, elem, sttrs) {
			elem.find('#revolution-slider').revolution({
				delay: 15000,
		        startwidth: 1170,
		        startheight: 500,
		        hideThumbs: 10,
		        fullWidth: "off",
		        fullScreen: "on",
		        fullScreenOffsetContainer: "",
		        touchenabled: "on",
		        navigationType: "none",
			});

		}
	};
});

lodcWebApp.controller("EventsController", function($scope, EventService){
	console.log("EventsController called");
	EventService.Get(function(response){
		$scope.events = response;
	});
})

lodcWebApp.controller("MainEventsController", function($scope){
	$scope.upcomingevents = [{
		time: "event_sunday_time",
		title: "event_sunday_title",
		description: "event_sunday_description"
	}, {
		time: "event_wednesday_time",
		title: "event_wednesday_title",
		description: "event_wednesday_description"
	}, {
		time: "event_saturday_time",
		title: "event_saturday_title",
		description: "event_saturday_description"
	}];

});

lodcWebApp.controller("MainNavigationController", function($scope, $translate){
	var languages = [{title:"English", translator: "kr"}, {title: "한국어", translator: "en"}];

	$scope.language = languages[1];

	$scope.changeLanguage = function() {
		if($scope.language.title == "English") {
			$scope.language = languages[1];
		} else {
			$scope.language = languages[0];
		}

		$translate.use($scope.language.translator);
	}

})

lodcWebApp.directive("mainevents", function(){
	console.log("mainevents called");
	return {
		templateUrl:"views/main_upcoming_events.html",
		controller: "MainEventsController",
		link: function(scope, elem, stttr) {
			elem.find(".custom-carousel-1").owlCarousel({
		        items: 3,
		        navigation: false,
		        pagination: false,
		    });
		    elem.find(".fx .item").hover(function() {
	            speed = 700;
	            jQuery(this).find(".desc").stop(true).animate({
	                'height': "120px",
	                'margin-top': "20px",
	                "opacity": "100"
	            }, speed, 'easeOutCubic');
	            jQuery(this).find(".overlay").stop(true).animate({
	                'height': "100%",
	                'margin-top': "20px"
	            }, speed, 'easeOutCubic');
	            jQuery(this).parent().parent().find(".item").not(this).stop(
	                true).fadeTo(speed, .5);
	        }, function() {
	            jQuery(this).find(".desc").stop(true).animate({
	                'height': "0px",
	                'margin-top': "0px",
	                "opacity": "0"
	            }, speed, 'easeOutCubic');
	            jQuery(this).find(".overlay").stop(true).animate({
	                'height': "84px",
	                'margin-top': "20px"
	            }, speed, 'easeOutCubic');
	            jQuery(this).parent().parent().find(".item").not(this).stop(
	                true).fadeTo(speed, 1);
	        })
		}
	};
});

lodcWebApp.controller("LatestSermonController", function($scope, SermonService, $state){
	function youtubeimage(url) {
		return url.replace("https://www.youtube.com/watch?v=", "https://img.youtube.com/vi/") + "/0.jpg";
  	}
  	SermonService.GetMostRecent(function(response){
  		for(var i = 0; i < response.length; i++) {
  			var sermon = response[i];			
  			sermon.media.img = youtubeimage(sermon.media.youtube)
  		}
  		$scope.recentsermons = response;
  	});

  	$scope.watch = function(sermon) {
  		SermonService.setSermon(sermon);
  		$state.go("sermonvideo");
  	}

});

lodcWebApp.controller("MainCountDownController", function($scope){
	$scope.nextsermonday = moment().add(1, 'weeks').startOf('week').format('MMMM Do YYYY') + " 1:30 pm";
})

lodcWebApp.directive("navheader", function() {
	console.log("navheader called");
	return {
		templateUrl:"views/common/header.view.html",
		controller: "MainNavigationController"
	}
});

lodcWebApp.directive("maincountdown", function() {
	console.log("main count down event called");
	var nextsermonday = moment().add(1, 'weeks').startOf('week');
	var year = nextsermonday.year();
	var month = nextsermonday.month();
	var day = nextsermonday.date();
	return {
		templateUrl:"views/main_count_down.html",
		controller: "MainCountDownController",
		link: function(scope, elem, attr) {
			elem.find('#defaultCountdown').countdown({until: new Date(year, month, day, 13)});
		}
	}

})

lodcWebApp.directive("aboutthechurch", function() {
	console.log("about the church called");
	return {
		templateUrl:"views/about_the_church.html",

	}
})

lodcWebApp.directive("latestsermon", function() {
	console.log("latest sermon called");
	return {
		templateUrl:"views/latestsermon.view.html",
		controller: 'LatestSermonController'
	}
})

lodcWebApp.directive("testimony", function() {
	console.log("testimony called");
	return {
		templateUrl: 'views/testimony.view.html',
		link: function(scope, elem, attr) {
			elem.find("#testi-carousel").owlCarousel({
		        singleItem: true,
		        lazyLoad: true,
		        navigation: false
		    });
		}
	}
});

lodcWebApp.directive("preloader", function() {
	console.log("preloader called");
	return {
		templateUrl: 'views/preloader.view.html',
		link: function(scope, elem, attr){
			elem.find('#preloader').delay(500).fadeOut(500);
		}
	}
})

// lodcWebApp.directive("sermonview", function() {
// 	console.log("sermonview called");
// 	return {
// 		templateUrl: 'views/sermon.view.html'
// 	}
// })

lodcWebApp.directive("footerview", function() {
	console.log("footer called");
	return {
		templateUrl: 'views/common/footer.view.html'
	}
})

lodcWebApp.directive("sermonitem", function(){
	console.log("sermonitem called");
	return {
		templateUrl: 'view/common/sermonitem.view.html',
		scope: {
			title: '=title',
			speaker: '=speaker',
			date: '=date',
			thumbnail: '=thumbnail',
			link: '=link'
		}

	}
})




