Package.describe({
  name: 'program3r:jdawnink',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['jquery', 'templating','bootstrap','iron:router','meteorhacks:fast-render@2.0.0-rc8','clode:isotope']);
  Npm.depends({"cheerio": "0.18.0", "request":"2.34.0","ddp":"0.4.3"});
  api.addFiles('iron-router.js','client');
  api.addFiles(['views/index.html','imageload.js']);
  api.addFiles(['style.css','jquery.prettyPhoto.js','prettyPhoto.css','scroll-to-top.js'],'client');
  api.export('photos');
  api.export('isotopeImage');
  
});