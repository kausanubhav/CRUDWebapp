const productdb = (dbName, table) => {
    //create database
    const db = new Dexie(dbName);
    db.version(1).stores(table);
    db.open();
    return db;
}

//insert function
//within this function we also need to check that the data inserted is a valid or not
//we r gonna use empty 
const bulkCreate = (dbtable, data) => {
    let flag = isEmpty(data);
    if (!flag) {
        dbtable.add(data);
        console.log('Data inserted successfully!');
    }
    else {
        console.log('Please fill in all the boxes');
    }
    return flag;
}


//check textbox validation
const isEmpty = object => {
    let flag = false;
    for (const value in object) {
        if (object[value] == "" || !object.hasOwnProperty(value)) {
            flag = true;
        }
    }
    return flag;
}
//get data from the database
const getData = (dbtable, fn) => {
    let index = 0;
    let obj = {};
    dbtable.count(count => {
        if (count) {
            dbtable.each(table => {
                obj = sortObj(table);
                fn(obj, index++);

            })
        }
        else {
            fn(0);
        }
    })
}
//sort object in a specific order
const sortObj = sortObj => {
    let obj = {};
    obj = {
        id: sortObj.id,
        productName: sortObj.productName,
        seller: sortObj.seller,
        price: sortObj.price
    }
    return obj;
}

//create dynamic element
const createElement = (tagName, appendTo, fn) => {
    const element = document.createElement(tagName);
    if (appendTo) {
        appendTo.appendChild(element);
    }
    if(fn) fn(element);

}



export default productdb;
export {
    bulkCreate,
    getData,
    createElement
}
