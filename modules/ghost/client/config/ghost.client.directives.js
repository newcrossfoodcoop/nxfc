'use strict';

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
}]);

angular.module('ghost').directive('ghostPosts',['$sce','GhostPosts', 'TextGeneratorService', 
    function($sce,GhostPosts,TextGeneratorService) {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                var promise;
                
                function handleError (err) {
                    return [{
                        title: 'Ghost content not found: ' + (attrs.slug || attrs.tag),
                        html: TextGeneratorService.createParagraphs(3,3)
                    }];
                }
                
                if (attrs.slug) {
                    promise = GhostPosts.read({slug: attrs.slug}).then(function(response) {
                        return [response.data];
                    }).catch(handleError);
                }
                else if (attrs.tag) {
                    promise = GhostPosts.query({tag: attrs.tag}).then(function(response) {
                        return response.data;
                    }).catch(handleError);
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
    }
]);
