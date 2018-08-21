$(document).ready(() =>{
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