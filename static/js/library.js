const popup = document.querySelector('.popup_library');
const popupBg = document.querySelector('.popup_background');
const library = document.querySelector('.library');
const popupLabels = document.querySelectorAll('.popup_name,.popup_location');
const search = document.querySelector('#search');
var data = null
var data2 = null
const libraryElements = []
const filters = {
    "search": "",
    "zone": null,
    "type": null
}

var currentId = 0;

function restartAnimation(ele){
    ele.style.animation = 'none';
    ele.offsetHeight; /* trigger reflow */
    ele.style.animation = null; 

}
function togglePopup(open) {
    if (open){
        document.body.classList.add('no-scroll');
        popup.classList.remove('hidden');
        popupBg.classList.remove('hidden');
        for (var label of popupLabels){
            label.classList.remove('reverse');
        }
        popup.classList.remove("reverse")
        popupBg.classList.remove("reverse")
    }
    else{
        document.body.classList.remove('no-scroll');
        
        popup.classList.add("reverse")
        popupBg.classList.add("reverse")
        // retrigger animation
        restartAnimation(popup);
        restartAnimation(popupBg);

        for (var label of popupLabels){
            label.classList.add('reverse');
            restartAnimation(label);
        }
        setTimeout(() => {
            popup.classList.add('hidden');
            popupBg.classList.add('hidden');
        }
        ,900)


    }
}

function setPopupDetails(details, FunFacts){
    const title = popup.querySelector('.popup_name');
    const zone = popup.querySelector('.popup_location');
    const img = popup.querySelector('.popup_img');
    const chinesename = popup.querySelector('.popup_chinesename');
    const altname = popup.querySelector('.popup_altname');
    const plantDescription = popup.querySelector('.popup_description');
    const funFact1 = popup.querySelector('.popup_funfact1')
    const funFact2 = popup.querySelector('.popup_funfact2')
    const funFact3 = popup.querySelector('.popup_funfact3')

    title.textContent = details.titleEn;
    zone.textContent = details.zone;
    img.src = details.src;

    chinesename.textContent = details.titleZh;
    altname.textContent = details.titleSn;
    plantDescription.textContent = details.description;

    funFact1.textContent = FunFacts.info1;
    funFact2.textContent = FunFacts.info2;
    funFact3.textContent = FunFacts.info3;

}

function createLibraryElement(details){
    const container = createEle('div',['library-element','box-shadow--primary'],null,{onclick:libraryElementClick},null);
    if (details.src == undefined){
        details.src = 'static/assets/white.png'
    }
    const img = createEle('img',['library-element-background'],null,{src:details.src},null);
    const description = createEle('p',['description','tetriary'],null,null,null);
    const name = createEle('h3',['name',"primary"],null,{innerHTML:details.titleEn},null);
    const location = createEle('p',['location',"tetriary"],null,{innerHTML:details.zone},null);
    container.appendChild(img);
    container.appendChild(description);
    container.appendChild(location);
    container.appendChild(name);

    

    // const chinesename = createEle('p', ['chinesename'], null, {innerHTML: details.titleZh}, null);
    // const altname = createEle('p', ['altname'], null, {innerHTML: details.titleEn}, null);
    // const plantDescription = createEle('p', ['plantDescription'], null, {innerHTML: details.description}, null);
    // container.appendChild(chinesename);
    // container.appendChild(altname);
    // container.appendChild(plantDescription);
   
    
    container.dataset.id = details.id;
    library.appendChild(container);
    libraryElements.push(container);

}

async function loadLibrary(){
    const res = await fetch("static/assets/garden_data.json")
    datasets = (await res.json());
    data = datasets["imageGalleryContents"];
    data2 = datasets["plantInfos"];
    for (var i = 0; i < data.length; i++){
        data[i].id = i;
        data2[i].id = i;
        createLibraryElement(data[i]);
    }
}

function filterLibrary(filters){
    for (var element of libraryElements){
        const details = data[element.dataset.id];
        const funFacts = data[element.dataset.id];
        const name = details.titleEn.toLowerCase();
        const zone = details.zone.toLowerCase();
        const search = filters.search.toLowerCase();
        const type = filters.type;
        const zoneFilter = filters.zone;
        if ((name.includes(search) || zone.includes(search)) && (type == null || details.type == type) && (zoneFilter == null || zone == zoneFilter)){
            element.classList.remove('hidden');
        }
        else{
            element.classList.add('hidden');
        }
    }
}

function navigateLeft(){
    currentId = parseInt(currentId);
    if (currentId > 0) {  // Ensure we don't go below index 0
        currentId -= 1;
        setPopupDetails(data[currentId], data2[currentId]); // Set the previous element's data

    }
}

function navigateRight(){
    currentId = parseInt(currentId);
    if (currentId < data.length - 1) {  // Ensure we don't exceed the array bounds
        currentId += 1;
        setPopupDetails(data[currentId], data2[currentId]); // Set the next element's data
    }
}

function libraryElementClick() {

    togglePopup(true);
    currentId = this.dataset.id;
    setPopupDetails(data[this.dataset.id], data2[this.dataset.id]);
    currentId = this.dataset.id;
}

popupBg.addEventListener('click', () => {
    togglePopup(false);
})

loadLibrary()

search.addEventListener('input', (e) => {
    filters.search = e.target.value;
    filterLibrary(filters);
})