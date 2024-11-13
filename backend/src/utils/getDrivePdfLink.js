// Helper function to convert Google Drive link to downloadable PDF URL
const getDrivePdfUrl = (url) => {
  // Case 1: Check if it's already a downloadable PDF link (includes 'uc?export=download&id=')
  if (url.includes("uc?export=download&id=")) {
    return url;
  }

  // Case 2: For normal Google Drive shared links (e.g., /d/FILE_ID/view)
  const driveFileMatch = url.match(/\/d\/(.*?)(\/|$)/);
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // Case 3: If it's not a Google Drive link, return the URL as-is
  return url;
};

// Helper function to convert Google Drive link to preview PDF URL
const getDriveViewPdfUrl = (url) => {
  // Case 1: If the URL already includes '/preview' (already a preview link)
  if (url.includes("/preview")) {
    return url; // Return the original preview URL if it’s already in preview format
  }

  // Case 2: For normal Google Drive shared links (e.g., /d/FILE_ID/view)
  const driveFileMatch = url.match(/\/d\/(.*?)(\/|$)/);
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // Case 3: For export links (e.g., 'https://drive.google.com/uc?id=FILE_ID')
  if (url.includes("?export")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const fileId = urlParams.get("id");
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }

  // Case 4: If the URL is not a Google Drive link, return the original URL
  return url;
};

module.exports = { getDrivePdfUrl, getDriveViewPdfUrl };
