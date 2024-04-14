const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  // cloud_name: 'dfrp35blc', 
  // api_key: '198159912466179', 
  // api_secret: '3YH5l_Z9quFXvQzVdUhsOrtVyTE' 
  cloud_name: 'qekdev', 
  api_key: '839287355494943', 
  api_secret: 'iFSi_nkcaadZziANB8P5leARzZg' 
});

module.exports = cloudinary;