document.addEventListener('DOMContentLoaded', e => {
    let accordions = document.querySelectorAll('.accordion-container');

    accordions.forEach(accordion => {
        let accordionHeader = accordion.querySelectorAll('.accordion-header')[0];
        let accordionBody = accordion.querySelectorAll('.accordion-body')[0];

        accordionHeader.addEventListener('click', e => {
            toggleAccordionGroup(e.target.parentElement);
            accordion.classList.toggle('accordion-open');
            if(accordion.classList.contains('accordion-open')){
                accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px';
            }else{
                accordionBody.style.maxHeight = '0px';
            }
        });
    });
});

function toggleAccordionGroup(accordionElement){
    let groupName = accordionElement.getAttribute('data-accordion-group');
    let triggerElementId = accordionElement.id;

    if(groupName == undefined) return;

    let accordionGroup = document.querySelectorAll("[data-accordion-group='" + groupName + "']");

    accordionGroup.forEach(accordion => {
        if(accordion.id == undefined || accordion.id == null){
            console.log("element in group: " + groupName + ". Is missing Id.");
            return;
        }

        if(triggerElementId != accordion.id && accordion.classList.contains('accordion-open')){
            accordion.querySelectorAll('.accordion-header')[0].click();
        }
    });

}