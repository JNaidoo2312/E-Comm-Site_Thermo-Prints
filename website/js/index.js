const card = document.getElementById("main_card");
const cart_count = document.getElementById("cart_count");
const clear_cart = document.getElementById("clear_cart");
const remove_from_cart = document.getElementById("remove_from_cart");
const open_cart = document.getElementById("open_cart");
const cartModal = document.getElementById("cartModal");
const close_cart = document.getElementById("close_cart");
const table_entry = document.getElementById("table_entry");
const table_enrtry_example = document.getElementById("table_enrtry_example");
const cart_value = document.getElementById("cart_value");

const star_array = [
  "images/0star.png",
  "images/1star.png",
  "images/2star.png",
  "images/3star.png",
  "images/4star.png",
  "images/5star.png",
];

// -----------------------
// Here we break and fix the cart.
// -----------------------
clear_cart.addEventListener("click", () => {
  localStorage.removeItem("cartList");
  cart_count.innerText = "";
  console.log(table_entry.children);
  table_entry.children = 1;
});

if (localStorage.cartList) {
  const itemarr = JSON.parse(localStorage.cartList).reduce(function (acc, obj) {
    return acc + obj.count;
  }, 0);
  cart_count.innerText = itemarr;
}

function addToCart(name, price) {
  if (localStorage.cartList) {
    const localdata = JSON.parse(localStorage.cartList);

    if (localdata.filter((item) => item.name === name)[0] === undefined) {
      const newData = localdata;
      newData.push({ name: name, count: 1, price: price });
      localStorage.cartList = JSON.stringify(newData);
    } else {
      const newData = localdata.map((item) => {
        if (item.name === name) {
          item.count += 1;
        }
        return item;
      });
      localStorage.cartList = JSON.stringify(newData);
    }
  } else {
    localStorage.cartList = JSON.stringify([
      { name: name, count: 1, price: price },
    ]);
  }

  const itemarr = JSON.parse(localStorage.cartList).reduce(function (acc, obj) {
    return acc + obj.count;
  }, 0);
  cart_count.innerText = itemarr;
}

function removeFromCart(name, price) {
  if (localStorage.cartList) {
    const localdata = JSON.parse(localStorage.cartList);

    const newData = localdata.map((item) => {
      if (item.name === name) {
        item.count += 1;
      }
      return item;
    });

    localStorage.cartList = JSON.stringify(newData);
  }
  const itemarr = JSON.parse(localStorage.cartList).reduce(function (acc, obj) {
    return acc + obj.count;
  }, 0);
  cart_count.innerText = itemarr;
}

// -----------------------
// Here we call for data from the mySQL host.
// -----------------------
async function callFromMysql() {
  const response = await fetch("https://api-production-c810.up.railway.app/");
  const jsonData = await response.json();
  jsonData.forEach((cardel) => {
    const clonedCardel = card.cloneNode(true);
    clonedCardel.id = cardel.name;
    clonedCardel.getElementsByClassName("product_name")[0].innerText =
      cardel.name;
    clonedCardel.getElementsByClassName("item_description")[0].innerText =
      cardel.description;
    clonedCardel.getElementsByClassName("item-image")[0].firstElementChild.src =
      cardel.image;
    clonedCardel.getElementsByClassName("product_price")[0].innerText =
      cardel.price;
    clonedCardel.getElementsByClassName("middle")[0].firstElementChild.src =
      cardel.specs_image;
    clonedCardel.getElementsByClassName("star_rating")[0].src =
      star_array[cardel.rating];

    clonedCardel
      .getElementsByClassName("cart_block")[0]
      .getElementsByClassName("cart_button")[0]
      .addEventListener("click", () => {
        addToCart(cardel.name, cardel.price);
      });

    document.getElementById("item_store_list").appendChild(clonedCardel);
  });
}

callFromMysql();

open_cart.addEventListener("click", () => {
  cartModal.classList.toggle("show");

  // table_entry
  // table_entry_example
  async function updateCart() {
    const response = await fetch("https://api-production-c810.up.railway.app/");
    const jsonData = await response.json();

    const itemarr = JSON.parse(localStorage.cartList);
    for (item of itemarr) {
      const itemID = jsonData.findIndex((object) => {
        return object.name === item.name;
      });
      const clonedTable = table_entry_example.cloneNode(true);
      clonedTable.id = item.name;
      clonedTable.getElementsByClassName("table_product_image")[0].src =
        jsonData[itemID].image;
      clonedTable.getElementsByClassName("table_product_name")[0].innerText =
        item.name;
      clonedTable.getElementsByClassName("table_product_count")[0].innerText =
        item.count;
      clonedTable.getElementsByClassName("table_product_price")[0].innerText =
        item.price;

      const isincludedid = Object.values(table_entry.children).findIndex(
        (object) => {
          return object.id === item.name;
        }
      );

      if (isincludedid === -1) {
        table_entry.appendChild(clonedTable);
      }
    }

    const totalValue = JSON.parse(localStorage.cartList).reduce(function (
      acc,
      obj
    ) {
      return parseInt(acc) + parseInt(obj.price);
    },
    0);
    cart_value.innerText = totalValue;
  }
  if (localStorage.cartList) {
    updateCart();
  }
});

close_cart.addEventListener("click", () => {
  cartModal.classList.remove("show");
});
