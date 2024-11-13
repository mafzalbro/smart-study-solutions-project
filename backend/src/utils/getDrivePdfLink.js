// Helper function to convert Google Drive link to downloadable PDF URL
const getDrivePdfUrl = (url) => {
  const driveFileMatch = url.match(/\/d\/(.*?)(\/|$)/);
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url; // Return the original URL if it's not a Google Drive link
};

module.exports = { getDrivePdfUrl };
