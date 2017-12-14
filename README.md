# Zalalko Backend #

Guide to access the API

### Quick start ###

* clone repository
* run npm install in root directoy of the project
* run npm start

## Endpoints ##
### http://cheesy93.aries.uberspace.de:61501/ ###
* GET    (no authentication needed)
returns testpage
* POST    (no authentication needed)
returns the user for authentication 

### http://cheesy93.aries.uberspace.de:61501/register ###
* POST    (no authentication needed)
returns 'erfolg' when inserted a user

### http://cheesy93.aries.uberspace.de:61501/product/ ###
* GET    (no authentication needed)
returns all products for overview
    * POST   (authentication needed)[not working yet]
    add new article

### http://cheesy93.aries.uberspace.de:61501/product/:id ###
* PUT    (authentication needed)
update an product by id
* DELETE (authentication needed)
delete product by id
    * GET    (authentication needed)[not working yet]
    get detailed product by id

### http://cheesy93.aries.uberspace.de:61501/order ###
* GET     (authentication needed)
returns all orders
* POST    (authentication needed)
returns 'efrolg' after inserted order

### http://cheesy93.aries.uberspace.de:61501/order/:id ###
* GET     (authentication needed)
returns all orders from a user
* PUT    (authentication needed)
returns 'erfolg' when updated the order 

## Objects ##

```
Product <Object>{
    name : String,
    description : String,
    price : Float,
    edited : DateTime,
    created : DateTime,
    createdBy : String,
    meta : <Array>[<Object>{
        name : String,
        url : String,
        pos : Int
    }],
    categories : String
}
```
```
Order <Object>{
    (ID : Int)
    clients_ID : Int,
    status_ID  : Int,
    createdBy  : String,
    products   : <Array>[<Object>{
        product_ID  : Int,
        amount      : Int
    }] 
}
```
```
User <Object>{
    (ID : Int)
    name : Int,
    surname  : Int,
    email  : String,
    phone  : String,
    street  : String,
    housenr  : Int,
    plz  : Int,
    notiz  : String,
    password  : String,
}
```