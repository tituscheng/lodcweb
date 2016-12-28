var lodcWebApp = angular.module('lodcWebApp', ['ui.router', 'angularCSS', 'ngSanitize', 'pascalprecht.translate', 'restangular', 'base64', 'uiGmapgoogle-maps', 'ocNgRepeat', 'ui.bootstrap', "youtube-embed"]);

lodcWebApp.config(function($translateProvider, RestangularProvider, $stateProvider, $urlRouterProvider) {
  var newBaseUrl = "http://default-environment.tdtddkdkmp.us-west-2.elasticbeanstalk.com/api/api";
  //newBaseUrl = "http://localhost:3000/api/api";
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
    templateUrl: "views/index.view.html",
    controller: "MainViewController"
  }).state('sermon', {
    url: "/sermon",
    templateUrl: "views/sermon.view.html",
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
    url: "/sermon/video",
    templateUrl: "views/sermonvideo.view.html",
    controller: "SermonVideoController",
  }).state("specialvideo", {
    url: "/specialvideo",
    templateUrl: "views/specialvideo.view.html",
    controller: "SpecialVideoController"
  }).state('mission', {
    url: "/mission",
    templateUrl: "views/mission.view.html"
  }).state('intro', {
    url: "/intro",
    templateUrl: "views/introduction.view.html"
  }).state('gallery', {
    url: "/gallery",
    templateUrl: "views/gallery.view.html",
    controller: "GalleryController"
  }).state('album', {
    url: "/album",
    templateUrl: "views/album.view.html",
    controller: "AlbumController"
  });

});

lodcWebApp.controller("MainSliderController", function($scope, $rootScope, WebContentService) {
  $scope.$on("webcontent-loaded", function(event, args){
      $scope.sliderContent = {
      main1: {
        title: $rootScope.webcontent["index_mainslider_1"]["content"]["title"],
        subtitle: $rootScope.webcontent["index_mainslider_1"]["content"]["subtitle"],
        link: "events"
      },
      main2: {
        title: $rootScope.webcontent["index_mainslider_2"]["content"]["title"],
        subtitle: $rootScope.webcontent["index_mainslider_2"]["content"]["subtitle"],
        link: "events"
      }
    };
  });
});

lodcWebApp.controller("MainViewController", function($scope, $state, $rootScope, $state, WebContentService) {

  $rootScope.webcontent = {}
  WebContentService.GetContent(function(result){
    for(var i = 0; i < result.length; i++) {
      $rootScope.webcontent[result[i]["name"]] = {
        id: result[i]["id"],
        content: result[i]["content"]
      }
    }
    $rootScope.$broadcast("webcontent-loaded");
  });

  $scope.selectSermon = function(video) {
    $rootScope.selectedSermon = video;
    $state.go("sermon");
  }
})

lodcWebApp.controller("NewsController", function($scope, NewsService) {
  NewsService.Get(function(news) {
    $scope.allnews = news;
  });
});

lodcWebApp.controller("ContactController", function($scope, $base64, $http, EmailService) {
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

  $scope.map = {
    center: {
      latitude: 56.162939,
      longitude: 10.203921
    },
    zoom: 8
  };


  $scope.sendEmail = function() {
    var param = {
      to: $scope.email,
      name: $scope.name,
      contactemail: $scope.email,
      message: $scope.message
    };
    EmailService.Email(param, function(response) {
      if(response.success) {
        alert(response.message);
      }
    });
  }
})

// lodcWebApp.controller("SermonListController", function($scope, SermonService, $state) {
//   function youtubeimage(url) {
//     return url.replace("https://www.youtube.com/watch?v=", "https://img.youtube.com/vi/") + "/0.jpg";
//   }

//   SermonService.Get(function(response) {
//     for(var i = 0; i < response.length; i++) {
//       var sermon = response[i];
//       sermon.media.img = youtubeimage(sermon.media.youtube);
//     }
//     $scope.sermons = response;
//   });

//   $scope.shouldDisplayVideo = false;

//   $scope.select = function(chosenSermon) {
//     $scope.shouldDisplayVideo = true;
//     SermonService.setSermon(chosenSermon);
//   }

//   $scope.watch = function(sermon) {
//     SermonService.setSermon(sermon);
//     $state.go("sermonvideo");
//   }

// });

lodcWebApp.controller("SermonVideoController", function($scope, SermonService, $sce, $state) {
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


lodcWebApp.directive("mainslider", function() {
  console.log("mainslider called");
  return {
    templateUrl: "/views/main_slider.html",
    controller: "MainSliderController",
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

lodcWebApp.controller("EventsController", function($scope, EventService) {
  console.log("EventsController called");
  EventService.Get(function(response) {
    response.forEach(function(event) {

      //Handling time zone difference
      var enddate = moment(event.enddate);
      var startdate = moment(event.startdate);
      event.month = startdate.format("MMM");
      if(enddate.format("D") == startdate.format("D")) {
        event.day = startdate.format("DD");
      } else {
        event.day = startdate.format("D") + "-" + enddate.format("D");
      }
      event.hour = startdate.format("h:mm A");

      // //detail handling
      event.content.en = event.content.en.replace(/;/g, "<br>");
      event.content.kr = event.content.kr.replace(/;/g, "<br>");
    });
    $scope.events = response;
  });
})

lodcWebApp.controller("MainEventsController", function($scope) {
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

lodcWebApp.controller("GalleryController", function($scope, $rootScope, $state, AlbumService) {

  AlbumService.GetAlbumsByYear({ year: 2016 }, function(results) {
    $scope.albums = results;
  });

  $scope.selectAlbum = function(album_id) {
    console.log(album_id);
    $rootScope.selectedAlbum = album_id;
    $state.go("album");
  }
});

lodcWebApp.controller("AlbumController", function($scope, $state, $window, $rootScope, AlbumService) {
  $scope.isLoading = true;
  angular.element('#preloader').delay(500).fadeOut(500);
  if(!$rootScope.selectedAlbum) {
    $state.go("gallery");
  } else {
    function scaleGallery() {
      // This is roughly the max pixels width/height of a square photo
      var widthSetting = 400;

      // Do not edit any of this unless you know what you're doing
      var containerWidth = angular.element(".gallery").width();
      // console.log("Container width: " + containerWidth); 
      var ratioSumMax = containerWidth / widthSetting;
      var imgs = angular.element(".gallery").children();
      console.log(imgs);
      var numPhotos = imgs.length,
        ratioSum, ratio, photo, row, rowPadding, i = 0;
      console.log("Number of photos: " + numPhotos);

      while(i < numPhotos) {
        ratioSum = rowPadding = 0;
        row = new Array();
        while(i < numPhotos && ratioSum < ratioSumMax) {
          photo = angular.element(imgs[i]);
          // reset width to original
          photo.width("");
          ratio = photo.width() / photo.height();
          rowPadding += getHorizontalPadding(photo);
          // if this is going to be first in the row, clear: left
          if(ratioSum == 0) photo.css("clear", "left");
          else photo.css("clear", "none");
          ratioSum += ratio;
          row.push(photo);
          i++;
          // if only 1 image left, squeeze it in
          if(i == numPhotos - 1) ratioSumMax = 999;
        }
        unitWidth = (containerWidth - rowPadding) / ratioSum;

        row.forEach(function(elem) {
          elem.width(unitWidth * elem.width() / elem.height());
        });
        $scope.isLoading = false;
      }
    }

    function getHorizontalPadding(elem) {
      var padding = 0;
      var left = elem.css("padding-left");
      var right = elem.css("padding-right");
      padding += parseInt(left ? left.replace("px", "") : 0);
      padding += parseInt(right ? right.replace("px", "") : 0);
      return padding;
    }

    AlbumService.GetAlbumByID({ album_id: $rootScope.selectedAlbum }, function(result) {
      if(result.status) {
        $scope.photos = result.data;
        $scope.album_title = result.title;
        scaleGallery();
      }
      console.log(result);
    })

    var count = 0;
    $scope.countImage = function() {
      count++
      if(count === $scope.photos.length) {
        count = 0;
        console.log("Finished Loading all images");
        scaleGallery();
      } 
      // console.log("$scope.photos.length " + typeof $scope.photos.length);
      // console.log('Count image called with count ' + typeof count);
    }
  }
});

lodcWebApp.controller("MainNavigationController", function($scope, $translate) {
  var languages = [{ title: "English", translator: "kr" }, { title: "한국어", translator: "en" }];

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

lodcWebApp.directive("mainevents", function() {
  console.log("mainevents called");
  return {
    templateUrl: "views/main_upcoming_events.html",
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

lodcWebApp.controller("LatestSermonController", function($scope, SermonService, $state) {
  function youtubeimage(url) {
    return url.replace("https://www.youtube.com/watch?v=", "https://img.youtube.com/vi/") + "/0.jpg";
  }
  SermonService.GetMostRecent(function(response) {
    for(var i = 0; i < response.length; i++) {
      var sermon = response[i];
      sermon.media.img = youtubeimage(sermon.media.youtube)
      sermon.displaydate = moment(sermon.date).add('hours', 7).format('ll');
    }
    $scope.recentsermons = response;
    console.log($scope.recentsermons);
  });

  $scope.watch = function(sermon) {
    SermonService.setSermon(sermon);
    $state.go("sermonvideo");
  }

});

lodcWebApp.controller("LatestEventController", function($scope, EventService) {
  EventService.GetLatest(function(events) {
    events.forEach(function(event){
      var sDate = new Date(event.startdate);
      event.displayDate = sDate.getDate() + " " + sDate.toLocaleString("en-us", {month: "long"})
    })
    $scope.latestevents = events;
  });

  $scope.getDay = function(eventDay) {
    return eventDay.getDate();
  }

  $scope.getMonth = function(eventDay) {
    return eventDay.toLocaleString("en-us", {month: "long"});
  }

  $scope.carouselInitializer = function() {
    $(".custom-carousel-2").owlCarousel({
      items: 3,
      navigation: false,
      pagination: false,
     });
  };
})

lodcWebApp.directive("latestblog", function(EventService) {
  console.log("Latest blog called");
  return {
    templateUrl: "views/latestblog.view.html",
    controller: "LatestEventController"
  }
})

lodcWebApp.controller("MainCountDownController", function($scope) {
  $scope.nextsermonday = moment().add(1, 'weeks').startOf('week').format('MMMM Do YYYY') + " 1:30 pm";
})

lodcWebApp.directive("navheader", function() {
  console.log("navheader called");
  return {
    templateUrl: "views/common/header.view.html",
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
    templateUrl: "views/main_count_down.html",
    controller: "MainCountDownController",
    link: function(scope, elem, attr) {
      elem.find('#defaultCountdown').countdown({ until: new Date(year, month, day, 13) });
    }
  }

})

lodcWebApp.directive("aboutthechurch", function() {
  console.log("about the church called");
  return {
    templateUrl: "views/about_the_church.html",

  }
})

lodcWebApp.directive("latestsermon", function() {
  console.log("latest sermon called");
  return {
    templateUrl: "views/latestsermon.view.html",
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
    link: function(scope, elem, attr) {
      elem.find('#preloader').delay(500).fadeOut(500);
    }
  }
})

lodcWebApp.directive('imageonload', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('load', function() {
          //call the function that was passed
          scope.$apply(attrs.imageonload);
      });
    }
  }
});

// lodcWebApp.directive("sermonview", function() {
//  console.log("sermonview called");
//  return {
//    templateUrl: 'views/sermon.view.html'
//  }
// })

lodcWebApp.directive("footerview", function() {
  console.log("footer called");
  return {
    templateUrl: 'views/common/footer.view.html'
  }
})

lodcWebApp.directive("sermonitem", function() {
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
});


lodcWebApp.directive('runGallery', function() {
  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      Galleria.loadTheme('js/lib/galleria/themes/classic/galleria.classic.min.js');
      Galleria.run('#gallery-isotope');
    }
  }
});

lodcWebApp.directive('map', function() {
  return {
    restrict: "E",
    template: "<div id='map'></div>",
    link: function(scope, elem, attrs) {
      console.log(elem);
      var map = new google.maps.Map(elem.find('#map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      });
    }
  }
})
