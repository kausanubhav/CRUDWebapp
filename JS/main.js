
import productdb, {
    bulkCreate,
    getData, createElement
} from './module.js'


let db = productdb('ProductDB', {
    products: `++id,productName,seller,price`
});

//window onload event
window.onload = () => {
textId(userId);
}
//updates the id box; it calls getData function
function textId(textboxid) {
    getData(db.products, data => {
        textboxid.value = data.id + 1 || 1;
    })
}

// input tags
const userId = document.getElementById('userId');
const productName = document.getElementById('productName');
const seller = document.getElementById('seller');
const price = document.getElementById('price');

//buttons
const btnCreate = document.getElementById('btnCreate');
const btnRead = document.getElementById('btnRead');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');

//not found
const notfound=document.getElementById('notfound');

//click events
//1.insert values using create button
btnCreate.addEventListener('click', (e) => {
    let flag = bulkCreate(db.products, {
        productName: productName.value,
        seller: seller.value,
        price: price.value
    })
    //console.log(flag);
    productName.value = seller.value = price.value = "";
    getData(db.products, (data) => {
        userId.value = data.id + 1 || 1;
    });
    table();
    let insertMsg=document.querySelector('.insertMsg');
    flag=!flag;
    getMsg(flag,insertMsg);

})

//2.read button
//once someone clicks on read, we r gonna create a tr element and for each data elements, a td element.

btnRead.addEventListener('click', table);
function table() {
    const tbody = document.getElementById('tbody');

    //on clicking the read button, duplicates are there we'll have to clear all the contents of the tbody for the next read click
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }


    getData(db.products, (data) => {
        if (data) {
            createElement('tr', tbody, tr => {
                for (const value in data) {
                    createElement('td', tr, td => {
                        td.innerHTML = data.price === data[value] ? ` ₹ ${data[value]}` : data[value];
                    })
                }
                //now that we have displayed the product details currently in the database, we need to add a <td> for edit and delete
                createElement('td', tr, td => {
                    createElement('i', td, i => {
                        i.className += "fas fa-edit btnedit"
                        i.setAttribute(`data-id`, data.id);
                        i.addEventListener('click', editbtn);
                    })
                })

                //similar for delete button
                createElement('td', tr, td => {
                    createElement('i', td, i => {
                        i.className += "fas fa-trash alt btndelete";
                        i.setAttribute(`data-id`, data.id);

                        i.addEventListener('click', deleteBtn);
                    })
                })

            })
        }

        else{
            notfound.innerHTML=`<h2>Oops! no data..</h2>`;
        }
    })


}

//edit button function
function editbtn(event) {
    let id = parseInt(event.target.dataset.id);//this will return the attribute with name id
    //typeof id is string so we need to pare it to integer
    //we r gonna use get() and it requires an integer id as parameter
    db.products.get(id, data => {
        console.log(userId.value);
        userId.value = data.id || 0;
        productName.value = data.productName || "";
        seller.value = data.seller || "";
        price.value = data.price || "";

    })

}

//3.update button 
btnUpdate.addEventListener('click', () => {
    const id = parseInt(userId.value || 0);
    if (id) {
        db.products.update(id, {
            productName: productName.value,
            seller: seller.value,
            price: price.value
        }).then((updated) => {
            let get = updated ? true : false;
            let updateMsg=document.querySelector('.updateMsg');
            getMsg(get,updateMsg);
            productName.value = seller.value = price.value = "";

        })
    }
})

//4.delete button(not delete all but deleting one at a time)
function deleteBtn(event) {
    let id = parseInt(event.target.dataset.id);
    //using dexie delete method
    db.products.delete(id);
    table();//function to display table after deletion

    
}


// 5.delete all button
btnDelete.addEventListener('click', () => {
    db.delete();
    db = productdb('ProductDB', {
        products: `++id,productName,seller,price`
    });
    db.open();
    table();
    textId(userId);

    //displaying deletion success animated msg
    let deleteMsg = document.querySelector('.deleteMsg');
    getMsg(true, deleteMsg);


})


function getMsg(flag,element){
    if(flag){
        element.className+=' movedown';
        setTimeout(()=>{
            element.classList.forEach(classname => {
                console.log('fucked up',classname);

                if(classname=='movedown'){
                    console.log('we r here');
                    element.classList.remove('movedown');
                }
            });

        },4000);
    }
    
}





