# MOBILECARWASH

## Content

- [Description](#description)
- [Instructions](#Instructions)
- [Technology](#Technologies)
- [MVP](#MVP)

### Description

![sample image of site](https://github.com/syafiqsaleem/mobile_carwash_app/blob/main/public/screenshot/screenshot1.jpg)
![sample image of site](https://github.com/syafiqsaleem/mobile_carwash_app/blob/main/public/screenshot/screenshot2.jpg)
![sample image of site](https://github.com/syafiqsaleem/mobile_carwash_app/blob/main/public/screenshot/screenshot3.jpg)
![sample image of site](https://github.com/syafiqsaleem/mobile_carwash_app/blob/main/public/screenshot/screenshot4.jpg)

Click [here](https://mobilecarwash.herokuapp.com/users/login) for the app!

This is a simple web app that helps customers select car washing packages.

### Instructions

1. Register and create an account to use the app.
2. Login upon completion on registering
3. Choose and customize the package that you are keen on.

### Technologies

HTML, CSS, JavaScript, node js, express, ejs, MVC (Model, Views, Controllers), MongoDB, Mongoose

### RESTful routes

1. Order
   | Route Name | URL | HTTP Verb | Description |
   | ---------- | --- | --------- | ----------- |
   | Index | / | GET | Display customers package selection|

2. Product
   | Route Name | URL | HTTP Verb | Description |
   | ---------- | --- | --------- | ----------- |
   | Index | / | GET | Display packages (Bronze, Silver, Gold) |
   | ----- | - | --- | --------------------------------------- |
   | Show | /show/:slug | GET | Display package details of package selected |
   | ---- | ----------- | --- | ------------------------------------------- |
   | Customize Product| /customize/:slug | GET | Allow customers to add or remove addons |
   | ---------------- | ---------------- | --- | --------------------------------------- |
   | Add Addons to cart | /customize/addons/add/:slug | POST | To update the cart with addons |
   | ------------------ | --------------------------- | ---- | ------------------------------ |
   | Remove Addons to cart | /customize/addons/delete/:slug | DELETE | To remove addons from the cart |
   | --------------------- | ------------------------------ | ------ | ------------------------------ |
   | Cancel Selection | /customize/cancel | DELETE | To delete the selected package |
   | ---------------- | ----------------- | ------ | ------------------------------ |
   | Complete Selection | /customize/finalize | POST | To complete the selected package |

3. User
   | Register | GET & POST | /register | To register an accounts |
   | -------- | ---------- | --------- | ----------------------- |
   | Login | GET & POST | /login | To log in |
   | ----- | ---------- | ------ | --------- |
   | Logout | POST | /logout | To log out |

### MVP

Features:

1. Login and Logout functions
2. Customize package page
3. Making the 'delete' button disapper if the addon is not added, and 'add' button disapper when the addons is already added.
4. Posting of packages chosen by clients.
