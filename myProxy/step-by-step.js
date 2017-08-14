var cur = 0, max = 5, asrc = 'img/slider/slider-active.png', isrc = 'img/slider/slider-inactive.png';
            
$('#arrow_left').on('click', function() {
    var n = cur - 1 < 0 ? max-1 : cur - 1;
                
    $('#c'+cur).attr('src', isrc);
    $('#c'+n).attr('src', asrc);
                
    $('#s'+cur).fadeOut(500);
    $('#s'+n).fadeIn(500);
                
    cur = n;
}); 
            
$('#arrow_right').on('click', function() {
    var n = cur + 1 >= max ? 0 : cur + 1;
                
    $('#c'+cur).attr('src', isrc);
    $('#c'+n).attr('src', asrc);
                
    $('#s'+cur).fadeOut(500);
    $('#s'+n).fadeIn(500);
                
    cur = n;
}); 
            
for(var i=0; i<max; ++i) {
    $('#c'+i).on('click', (function(n) { return function() {
        $('#c'+cur).attr('src', isrc);
        $('#c'+n).attr('src', asrc);
                
        $('#s'+cur).fadeOut(500);
        $('#s'+n).fadeIn(500);
                
        cur = n;
    };})(i));
}