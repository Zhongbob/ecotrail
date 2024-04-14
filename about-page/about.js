let sections = document.getElementsByTagName("section");
let ele = sections.item(1);
let was_ever_visible = Array(sections.length);
let fade_in_from = 0

was_ever_visible.fill(false);

$(document).ready(fade_in_if_visible)
window.addEventListener('scroll', fade_in_if_visible);

function inrange(x, lower, upper) {
    return (x > lower && x < upper)
}

function fade_in(was_ever_visible, fade_in_from, section, index){ //hi zhognding dont askme how thsi wroks (i randomly set values of what to return when I return a defualt of 0 the section fades in from the same side but when I return a default of 1 the sections alternate this is some *ooga booga magic*) 
    if (was_ever_visible[index] == false) {
        if (fade_in_from == 0){
            section.classList.add("fade-in-l-r");
            was_ever_visible[index] = true;
            return 1
        }
        else if (fade_in_from == 1){
            section.classList.add("fade-in-r-l");
            was_ever_visible[index] = true;
            return 0
        }
    }
    return 1
}

function checkVisible(elm) {
    var st = $(window).scrollTop(),
        sb = $(window).scrollTop() + window.innerHeight,
        y_top = $(elm).offset().top,
        y_bottom = $(elm).height() + y_top; // y_bottom > y_top


    return (inrange(y_top, st, sb) || inrange(y_bottom, st, sb) || inrange(st, y_top, y_bottom) || inrange(sb, y_top, y_bottom));
}


function fade_in_if_visible() {
    for (let i = 0; i < sections.length; i++) {
        let section = sections.item(i)
        if (checkVisible(section)) {
            fade_in_from = fade_in(was_ever_visible, fade_in_from, section, i)
        }
    };
}