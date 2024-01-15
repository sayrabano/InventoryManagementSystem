// required library
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controller');
const passport = require('passport');
const itemController = require('../controllers/item_controller')
const multer = require('multer');

//image upload
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./upload');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
    
   
})
const upload = multer({ storage: storage }).single('image');

// routing 
router.get('/',controller.renderSignIn);
router.get('/sign-up',controller.renderSignUp);
router.post('/create',controller.create);
router.post('/create-session',passport.authenticate('local',{failureRedirect: '/'}),controller.createSession);
router.get('/home', passport.checkAuthentication, controller.renderHome);
router.get('/destroy-session',controller.destroySession);
router.get('/reset-password',controller.renderResetPassword);
router.post('/update-password',passport.authenticate('local',{failureRedirect:'back'}),controller.updatePassword);
router.get('/additem',passport.checkAuthentication,itemController.addItems)
router.post('/create-item',upload,itemController.addItemsPage)
router.get('/delete/:id',itemController.deleteItem)
router.get('/updateItem/:id',passport.checkAuthentication,itemController.updateItemForm)
router.post('/update-item/:id',upload,itemController.updateItem);

// Define routes for Google authentication
router.get('/users/auth/google', passport.authenticate('google',{scope:['profile','email']}));

//callback from google
router.get('/users/auth/google/callback', passport.authenticate('google',{failureRedirect:'/'}), controller.createSession);







module.exports = router;