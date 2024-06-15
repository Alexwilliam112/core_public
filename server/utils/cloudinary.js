'use strict';

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dhvalbb4m',
    api_key: '419965963922443',
    api_secret: 'qXNj0QQGX3KoPqemrwtzxDMH304'
});

module.exports = cloudinary;
