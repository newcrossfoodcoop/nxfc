'use strict';

var api = 

// Configuring directives for the Ghost module
angular.module('ghost').directive('mungeGhostIframeOnload', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.on('load', function(){
                var iFrameHeight = element[0].contentWindow.document.body.scrollHeight -5 + 'px';
                var iFrameWidth = '100%';
                
                element.css('width', iFrameWidth);
                element.css('height', iFrameHeight);

                angular.element(element).contents().find('head').append(angular.element(
                    '<style type="text/css">' + 
                        ' .ghost-logo{display:none;}' + 
                        ' .help-menu{display:none;}' + 
                        ' .user-menu{display:none;} </style>'
                ));
            });
        }
    };
}]).directive('ghostPosts',['$sce','GhostPosts', function($sce,GhostPosts) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var promise;
            if (attrs.slug) {
                promise = GhostPosts.read({slug: attrs.slug}).then(function(response) {
                    return [response.data];
                });
            }
            else if (attrs.tag) {
                promise = GhostPosts.query({tag: attrs.tag}).then(function(response) {
                    return response.data;
                });
            }
            
            promise.then(function(posts) {
                angular.forEach(posts, function(value, key) {
                    if (value.html) {
                        posts[key].html = $sce.trustAsHtml(value.html);
                    }
                });
                scope.posts = posts;
            });
        }
    };
}]);
