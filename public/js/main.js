
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

// $(document).ready(()=>{
//   $('.login').on('click', ()=>{
//     $.ajax({
//       type: 'POST',
//       url:'http://localhost:3000/login/users',
//       data: {
//         email: $('#email').val(),
//         password: $('#password').val()
//       },
//       success: function(data, status, req){
//         alert(req.getResponseHeader('x-auth'));
//         window.location.href = '/';
//
//       },
//       error: function (req, status, error) {
//         alert(req.getResponseHeader('x-auth'));
//         window.location.href = '/';
//       }
//     });
//   })
// })

$(document).ready(()=>{
  $('.login').on('click',()=>{
    $.ajax({
        type: 'POST',
        url:'http://localhost:3000/login/users',
        data: {
          email: $('#email').val(),
          password: $('#password').val()
        },
        success: function(data, status, req, tok){
          // alert(req.getResponseHeader('x-auth'));
          localStorage.setItem('t',req.getResponseHeader('x-auth'));
          window.location.href = '/';

        },
        error: function (req, status, error, tok ) {
          // alert(req.getResponseHeader('x-auth'));
          localStorage.setItem('t',req.getResponseHeader('x-auth'));
          window.location.href = '/';
        }
    });
  });
})


var token = localStorage.getItem('t');
