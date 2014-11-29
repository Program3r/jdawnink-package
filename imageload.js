photos = new Meteor.Collection("photos");

if (Meteor.isClient) {
    Handlebars.registerHelper('isRoute', function (route) {
        var currentRoute = Router.current();

        if(currentRoute != undefined){
            if(currentRoute.route.name == route){
                return 'active';
            }
        }else{
            return '';
        }
    });

    Meteor.startup(function () {
        Meteor.call('getPhotos');
        $('.image-container').isotope({
            itemSelector: '.profile-image',
            layoutMode: 'masonry',
            masonry: {
                columnWidth: 1
            }
        });
        Session.set('page', 'none');
        $("#navigation a").click(function(){
            console.log('setting')
            Session.set('page', location.pathname)
        })
    });
    var count = 0;
    isotopeImage = function (id) {
        var image = $("#" + id);
        count++;
        $('.image-container').isotope({
            itemSelector: '.profile-image',
            layoutMode: 'masonry',
            masonry: {
                columnWidth: 10
            }
        });

        $('.image-container').append(image).isotope('addItems', image);
        var max = photos.find().fetch().length;
        if (count == max) {
            $("#image-progress").parent().slideUp();
            $('.image-container').isotope({
                itemSelector: '.profile-image',
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: 10
                }
            });
            count=0;
            setTimeout(function(){
              $('.image-container').isotope('reLayout');
            }, 1000)
        }else{
           $("#image-progress").parent().slideDown();
        }

        var progress = (100 / max) * count;

        $("#image-progress").css({width:progress+'%'})

        image.find("[rel='prettyPhoto']").prettyPhoto();
    }
    Template.imageLoader.id = function () {
        return this.src.substring(this.src.lastIndexOf('/') + 1, this.src.lastIndexOf("."));
    }
    Template.imageLoader.images = function () {
        return photos.find({});
    }
    Template.navbar.page = function(page){
        if(Session.get('page') == Router.path(page)){
            return "active";
        }
    }
}
if (Meteor.isServer) {

    Meteor.startup(function () {
        Meteor.methods({
            'addPhoto': function (photo) {
                if (photos.findOne(photo) == undefined) {
                    photos.insert(photo);

                }
            },
            'getPhotos': function () {
                var DDPClient = Npm.require("ddp");


                var ddpclient = new DDPClient({
                    host: "localhost",
                    port: process.env.PORT,
                    auto_reconnect: true,
                    auto_reconnect_timer: 500,
                    use_ejson: true, // default is false
                    use_ssl: false, //connect to SSL server,
                    use_ssl_strict: true, //Set to false if you have root ca trouble.
                    maintain_collections: true //Set to false to maintain your own collections.
                });


                ddpclient.connect(function (success) {
                    var request = Npm.require('request'),
                        cheerio = Npm.require('cheerio');

                    var url = 'http://www.flickr.com/photos/117221625@N07';

                    request(url, function (err, resp, body) {
                        $ = cheerio.load(body);
                        var filtereditems = [];
                        $(".photo_container img").each(function () {
                            /*filtereditems.push({
                                src: $(this).attr('data-defer-src')
                            });*/
                            ddpclient.call('addPhoto', [{
                                src: $(this).attr('data-defer-src')
                            }])
                        });
                    });
                });
            }
        })
    })
}