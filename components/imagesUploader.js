const express = require('express');
const multer = require('multer');
const fs = require('fs');
const multerUpload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/singleImage', multerUpload.single('image'), (req, res) => {
    console.log(req.file);
  
    fs.rename(
      req.file.path,
      './uploads/' + req.file.originalname,
      function (err) {
        if (err) throw err;
        console.log('renamed complete');
        res.send('Test for avatar');
      }
    );
  });
  
  router.post('/multipleImages', multerUpload.array('images', 2), (req, res) => {
      console.log(req.files);
    
      req.files.forEach(f => {
        fs.renameSync(f.path, './uploads/' + f.originalname)
      })
    
      res.send("Completed");
    
    });
  
  router.post('', multerUpload.array('images', 2), (req, res) => {
      console.log(req.files);
    
      req.files.forEach(f => {
        fs.renameSync(f.path, './uploads/' + f.originalname)
      })
    
      res.send("Completed");
    
    });


module.exports = router;