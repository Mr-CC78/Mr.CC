let index = 0;
const imgArr =[
    "联想截图_20260114202558.png",
    "联想截图_20260114212046.png",
    "联想截图_20260114194503.png"
]

const items = document.querySelectorAll('.card-item');

function right(){
    items[index].classList.remove('active');
    index = (index + 1) % items.length;
    items[index].classList.add('active');
}

function left(){
    items[index].classList.remove('active');
    index = (index - 1 + items.length) % items.length;
    items[index].classList.add('active');
}