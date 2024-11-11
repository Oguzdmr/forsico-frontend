document.querySelector('.openMobileSideMenu').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.add('active');
  });
  
  document.querySelector('.closeSideMenu').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.remove('active');
  });