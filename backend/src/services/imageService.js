const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Compress image from a given URL
const compressImageFromUrl = async (imageUrl, quality = 70) => {
  try {
    // Download the image
    const response = await axios({
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(response.data, 'binary');

    // Compress the image using sharp
    const compressedImage = await sharp(imageBuffer)
      .jpeg({ quality }) // Adjust quality to your needs
      .toBuffer();

    return compressedImage;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Image compression failed');
  }
};

// Save compressed image to the filesystem (optional)
const saveCompressedImage = async (imageBuffer, filename) => {
  const imagePath = path.join(__dirname, 'uploads', filename); // Save in uploads folder

  await fs.promises.writeFile(imagePath, imageBuffer);
  console.log(`Compressed image saved to ${imagePath}`);
};

module.exports = {
  compressImageFromUrl,
  saveCompressedImage,
};
