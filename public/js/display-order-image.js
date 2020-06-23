let itemOrder = document.querySelector('#item-order').innerText;

const shirtImg = document.createElement('img');
shirtImg.setAttribute('class', 'product-image');
shirtImg.setAttribute('src', '../order-form/assets/tshirt.png');
shirtImg.setAttribute('alt', 'Shirt');

const socksImg = document.createElement('img');
socksImg.setAttribute('class', 'product-image');
socksImg.setAttribute('src', '../order-form/assets/socks.jpg');
socksImg.setAttribute('alt', 'Socks');

const bottleImg = document.createElement('img');
bottleImg.setAttribute('class', 'product-image');
bottleImg.setAttribute('src', '../order-form/assets/bottle.png');
bottleImg.setAttribute('alt', 'Bottle');

if (itemOrder.includes('shirt')) {
    document.getElementById('image').appendChild(shirtImg);
};
if (itemOrder.includes('socks')) {
    document.getElementById('image').appendChild(socksImg);
};
if (itemOrder.includes('bottle')) {
    document.getElementById('image').appendChild(bottleImg);
};
