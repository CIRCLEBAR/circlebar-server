# circlebar-server
The CIRCLEBAR software that have to be launched into a RASPBERRY PI device.

# START SERVER

To start the CIRCLEBAR software server, you may have to use theses commands :

```bash
npm install
npm start
```

# API Documentation

## Availables routes table

| Route                                 | Method | Protected | Description                         |
| ------------------------------------- | ------ | --------- | ----------------------------------- |
| [/](#get)                             | GET    | NO        | Get the list of available cocktails |
| [/login](#post-login)                 | POST   | NO        | Login administrator                 |
| [/cocktails](#get-cocktails)          | GET    | YES       | Get the list of cocktails           |
| [/cocktails](#post-cocktails)         | POST   | YES       | Add a new cocktail                  |
| [/cocktails/:id](#put-cocktailsid)    | PUT    | YES       | Edit a cocktail                     |
| [/cocktails/:id](#delete-cocktailsid) | DELETE | YES       | Delete a cocktail                   |
| [/drinks](#get-drinks)                | GET    | YES       | Get the list of drinks              |
| [/drinks](#post-drinks)               | POST   | YES       | Add a new drink                     |
| [/drinks/:id](#put-drinksid)          | PUT    | YES       | Edit a drink                        |
| [/drinks/:id](#delete-drinksid)       | DELETE | YES       | Delete a drink                      |
| [/slots](#get-slots)                  | GET    | YES       | Get the list of slots               |
| [/slots/:id](#put-slotsid)            | PUT    | YES       | Edit a slot                         |
| [/slots/:id](#delete-slotsid)         | DELETE | YES       | Remove a drink from a slot          |
| [/admin](#get-admin)                  | GET    | YES       | Get admin informations              |
| [/admin](#put-admin)                  | PUT    | YES       | Edit admin informations             |

---

## GET /

Get the list of available cocktails.

### Success Response

**Code** : `200 OK`

**Body** :
```json
[
    {
        "id": "cocktailId",
        "name": "cocktailName",
        "image": "cocktailImagePath",
        "description": "cocktailDescription",
        "collections": "cocktailCollections",
    },
    ...
]
```


---

## POST /login

Login administrator.

### Body Parameters

```json
{
    "username": "adminUsername",
    "password": "adminPassword"
}
```

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "token": "__adminToken__"
}
```

### Error Response

**Condition** : If 'username' or 'password' is missing.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter a username and password"
}
```

**Condition** : If 'username' or 'password' is incorrect.

**Code** : `401 UNAUTHORIZED`

**Body** :
```json
{
    "msg": "Invalid username or password"
}
```

---

## GET /cocktails

Get the list of cocktails.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Success Response

**Code** : `200 OK`

**Body** :
```json
[
    {
        "id": "cocktailId",
        "name": "cocktailName",
        "image": "cocktailImagePath",
        "description": "cocktailDescription",
        "collections": "cocktailCollections",
    },
    ...
]
```

---

## POST /cocktails

Add a new cocktail.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Body Parameters

Sent as FORM-DATA

| Parameter   | Type   | Description             |
| ----------- | ------ | ----------------------- |
| name        | String | Cocktail name           |
| image       | File   | Cocktail image          |
| description | String | Cocktail description    |
| collections | String | Cocktail collections    |
| recipe      | String | Cocktail recipe as JSON |

recipe JSON example :
```json
[
    {
        "drink_id": "ingredientId",
        "qty": "ingredientQuantity"
    },
    ...
]
```

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Cocktail added successfully"
}
```

### Error Response

**Condition** : If 'name', 'image', 'description', 'collections' or 'recipe' is missing.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter all fields"
}
```

**Condition** : If 'image' is not an image.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter an image"
}
```

**Condition** : If 'recipe' is not a JSON.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter a valid recipe"
}
```

**Condition** : If mySQL error.

**Code** : `500 INTERNAL SERVER ERROR`

**Body** :
```json
{
    "msg": "Error adding cocktail"
}
```

---

## PUT /cocktails/:id

Edit a cocktail.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Body Parameters

Sent as FORM-DATA

| Parameter   | Type   | Description             |
| ----------- | ------ | ----------------------- |
| name        | String | Cocktail name           |
| image       | File   | Cocktail image          |
| description | String | Cocktail description    |
| collections | String | Cocktail collections    |
| recipe      | String | Cocktail recipe as JSON |

If you don't want to edit a field, you can send the old value.

If you don't want to change the image, you can leave the field empty.

recipe JSON example :
```json
[
    {
        "drink_id": "ingredientId",
        "qty": "ingredientQuantity"
    },
    ...
]
```

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Cocktail edited successfully"
}
```

### Error Response

**Condition** : If 'name', 'description', 'collections' or 'recipe' is missing.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter all fields"
}
```

**Condition** : If 'image' is not an image.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter an image"
}
```

**Condition** : If 'recipe' is not a JSON.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter a valid recipe"
}
```

---

## DELETE /cocktails/:id

Delete a cocktail.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Cocktail deleted successfully"
}
```

### Error Response

**Condition** : If the cocktail doesn't exist.

**Code** : `404 NOT FOUND`

**Body** :
```json
{
    "msg": "Cocktail not found"
}
```

**Condition** : If mySQL error.

**Code** : `500 INTERNAL SERVER ERROR`

**Body** :
```json
{
    "msg": "Error deleting cocktail"
}
```

---

## GET /drinks

Get the list of drinks.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Success Response

**Code** : `200 OK`

**Body** :
```json
[
    {
        "id": "drinkId",
        "name": "drinkName",
        "icon": "drinkIconPath",
    },
    ...
]
```

---

## POST /drinks

Add a new drink.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Body Parameters

Sent as JSON

```json
{
    "name": "drinkName",
    "icon": "drinkIconPath",
}
```

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Drink added successfully"
}
```

### Error Response

**Condition** : If 'name' or 'icon' is missing.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter all fields"
}
```

**Condition** : If mySQL error.

**Code** : `500 INTERNAL SERVER ERROR`

**Body** :
```json
{
    "msg": "Error adding drink"
}
```

---

## PUT /drinks/:id

Edit a drink.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Body Parameters

Sent as JSON

```json
{
    "name": "drinkName",
    "icon": "drinkIconPath",
}
```

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Drink edited successfully"
}
```

### Error Response

**Condition** : If 'name' or 'icon' is missing.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter all fields"
}
```

---

## DELETE /drinks/:id

Delete a drink.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Drink deleted successfully"
}
```

### Error Response

**Condition** : If the drink doesn't exist.

**Code** : `404 NOT FOUND`

**Body** :
```json
{
    "msg": "Drink not found"
}
```

**Condition** : If mySQL error.

**Code** : `500 INTERNAL SERVER ERROR`

**Body** :
```json
{
    "msg": "Error deleting drink"
}
```
---

## GET /slots

Get the list of slots.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Success Response

**Code** : `200 OK`

**Body** :
```json
[
    {
        "id": "slotId",
        "drink_id": "drinkId"
    },
    ...
]
```

---

## PUT /slots/:id

Edit a slot.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Body Parameters

Sent as JSON

```json
{
    "drink_id": "drinkId"
}
```

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Slot edited successfully"
}
```

### Error Response

**Condition** : If 'drink_id' is missing.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter all fields"
}
```

---

## DELETE /slots/:id

Remove a drink from a slot.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Slot edited successfully"
}
```

### Error Response

**Condition** : If the slot doesn't exist.

**Code** : `404 NOT FOUND`

**Body** :
```json
{
    "msg": "Slot not found"
}
```

**Condition** : If mySQL error.

**Code** : `500 INTERNAL SERVER ERROR`

**Body** :
```json
{
    "msg": "Error editing slot"
}
```

---

## GET /admin

Get admin informations.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "name": "adminName"
}
```

---

## PUT /admin

Edit admin informations.

PROTECTED ROUTE : You have to be logged in to access this route. [See protected routes](#protected-routes)

### Body Parameters

Sent as JSON

```json
{
    "name": "adminName",
    "password": "adminPassword"
}
```

### Success Response

**Code** : `200 OK`

**Body** :
```json
{
    "msg": "Admin edited successfully"
}
```

### Error Response

**Condition** : If 'name' or 'password' is missing.

**Code** : `400 BAD REQUEST`

**Body** :
```json
{
    "msg": "Please enter all fields"
}
```

---

## Protected routes

To access protected routes, you have to send the token in the header of the request.

In the header, you have to add a Bearer token like this :

```
Authorization: Bearer __adminToken__
```

---

### Error Response

**Condition** : If the token is missing.

**Code** : `401 UNAUTHORIZED`

**Body** :
```json
{
    "msg": "No token, authorization denied"
}
```

---

**Condition** : If the token is invalid.

**Code** : `401 UNAUTHORIZED`

**Body** :
```json
{
    "msg": "Token is not valid"
}
```

---
