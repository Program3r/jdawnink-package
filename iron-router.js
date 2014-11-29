Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home',
    fastRender: true
  });
  this.route('about', {
    path: '/about',
    fastRender: true
  });
  this.route('contact', {
    path: '/contact'
  });
});