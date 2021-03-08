// GET HTML ELEMENTS
const slider = document.querySelector('.slider-container'),
    slides = Array.from(document.querySelectorAll('.slide'));

//SETTING THE STATE
let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID,
    currentIndex = 0;

//ADDING THE DOM EVENT LISTENERS
slides.forEach((slide, index) => {
    const slideImage = slide.querySelector('img');

    //STOP DEFAULT IMAGE DRAG
    slideImage.addEventListener('dragstart', (e) => e.preventDefault())

    //TOUCH EVENT ON MOBILE AND OTHER TOUCH DEVICES
    slide.addEventListener('touchstart', touchStart(index))
    slide.addEventListener('touchend', touchEnd)
    slide.addEventListener('touchmove', touchMove)

    //MOUSE EVENT FOR DESKTOP 
    slide.addEventListener('mousedown', touchStart(index))
    slide.addEventListener('mouseup', touchEnd)
    slide.addEventListener('mousemove', touchMove)
    slide.addEventListener('mouseleave', touchEnd)
})

//MAKE RESPONSIVE TO VIEWPORT
window.addEventListener('resize', setPositionByIndex);

//PREVENT MENU POPPING UP ON LONG PRESS
window.oncontextmenu = function (event){
    event.preventDefault()
    event.stopPropagation()
    return false
}

function getPositionX(event){
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

//USE HIGHER ORDER FUNCTION TO HAVE INDEX IN A CLOSURE
function touchStart(index){
    return function(event){
        currentIndex = index,
        startPos = getPositionX(event),
        isDragging = true,
        animationID = requestAnimationFrame(animation),
        slider.classList.add('grabbing')
    }
}

function touchMove(event){
    if(isDragging){
        currentPosition = getPositionX(event)
        currentTranslate = prevTranslate + currentPosition - startPos
    }
}

function touchEnd(){
    cancelAnimationFrame(animationID)
    isDragging = false
    const moveBy = currentTranslate - prevTranslate

    //IF MOVED ENOUGH TO THE NEGATIVE X-axis, IT CHANGES PICTURE FRAME IF THERE IS ANY NEXT
    if(moveBy < -100 && currentIndex < slides.length -1) currentIndex += 1

    //IF MOVED BY 100 TO THE POSITIVE X-axis, IT CHANGES PICTURE FRAME 
    if (moveBy > 100 && currentIdex > 0) currentIndex -= 1

    setPositionByIndex()

    //REMOVE THE GRABBING CURSOR EFFECT
    slider.classList.remove('grabbing');
}

//ANIMATION FUNCTIONALITY 
function animation(){
    setSliderPosition()
    if (isDragging) requestAnimationFrame(animation)
}

function setPositionByIndex() {
    currentTranslate = currentIndex *-window.innerWidth
    prevTranslate = currentTranslate
    setSliderPosition()
}

function setSliderPosition(){
    //USE TEMPLATE LITERAL TO HANDLE CSS CLASS PROPERTIES TO ADD ANIMATING MOVEMENT
    slider.style.transform = `translateX(${currentTranslate}px)`
}