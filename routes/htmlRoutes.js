module.exports = app => {
  // Home page
  app.get('/', function(req, res) {
    res.render('home', { style: 'styles' });
    console.log('user', req.user);
    console.log(req.isAuthenticated());
  });

  // Chat page
  app.get('/chat', function(req, res) {
    console.log(req.user.name);
    res.render('chat', { username: req.body.username });
  });

  // Create duck page
  app.get('/duck/create', function(req, res) {
    res.render('createduck', { style: 'styles' });
  });

  // View duck page
  app.get('/viewduck/:id', function(req, res) {
    res.render('viewduck', {
      style: 'styles',
      duck: res,
      id: req.params.id - 1
    });
  });

  //Minigames routes
  app.get('/minigames', function(req, res) {
    res.render('minigames', { style: 'styles' });
  });

  app.get('/minigames/duckshot', function(req, res) {
    res.render('duckshot', { style: 'duckshot' });
  });

  app.get('/minigames/askduck', function(req, res) {
    res.render('askduck', { style: 'askduck', script: 'askduck' });
  });

  app.get('/minigames/battleducks', function(req, res) {
    res.render('battleducks', { style: 'battleducks', script: 'battleducks' });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404', { style: 'styles' });
  });
};
