
$(document).ready(()=>{
  $('.delete-contact').on('click', (e) =>{
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/delete/' + id,
      success: (response) =>{
        alert('Are you sure wanna delete contact?');
        window.location.href = '/';
      },
      error: (error)=>{
        console.log(error);
      }
    })
  })
});

$(document).ready(()=>{
  $('#login').submit((e)=>{
    $.ajax({
        type: 'POST',
        url:'http://localhost:3000/login/users',
        data: {
          email: $('#email').val(),
          password: $('#password').val()
        },
        success: function(data, status, req){
          // alert(req.getResponseHeader('x-auth'));
          localStorage.setItem('t',req.getResponseHeader('x-auth'));
          window.location.href = '/';

        },
        error: function (req, status, error) {
          // alert(req.getResponseHeader('x-auth'));
          localStorage.setItem('t',req.getResponseHeader('x-auth'));
          alert('Invalid email and password');
          window.location.href = '/login';
        }
    });
    e.preventDefault();
  });
})


var token = localStorage.getItem('t');

$(document).ready(()=>{
  $('.logout').on('click', ()=>{
    $.ajax({
      type: 'DELETE',
      url: 'http://localhost:3000/logout',
      headers: {
        'x-auth': token
      }
    });
  });
});

//register ajax
$(document).ready(()=>{
  $('#register').submit((e)=>{
    var url = 'http://localhost:3000/register/users';
    $.ajax({
      type: 'POST',
      url: url,
      data: {
        name: $('#first_name').val(),
        email: $('#email').val(),
        password: $('#password').val()
      },
      success: function(data, status, req){
        // alert(req.getResponseHeader('x-auth'));
        localStorage.setItem('rt', req.getResponseHeader('x-auth'));
        window.location.href = '/';
      },
      error: function(req, status, error){
        alert(error);
        window.location.href = '/register';
      }
    });
    e.preventDefault();
  });
});

var tok = localStorage.getItem('rt');

$(document).ready(()=>{
  $('.logout').on('click', ()=>{
    $.ajax({
      type: 'DELETE',
      url: 'http://localhost:3000/logout',
      headers: {
        'x-auth': tok
      },
      success: function(response){
        alert('Logged out');
        window.location.href = '/login'
      },
      error: function(error){
        alert(error);
        window.location.href = '/';
      }
    });
  });
});
