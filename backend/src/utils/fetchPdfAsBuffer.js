const fetchPdfAsBuffer = async (pdfLink) => {
  let downloadUrl;

  // Check if the provided PDF link is already a direct downloadable link
  if (pdfLink.includes("uc?export=download&id=")) {
    downloadUrl = pdfLink;
  } else {
    // Extract the file ID from the Google Drive link
    const driveFileMatch = pdfLink.match(/\/d\/(.*?)(\/|$)/);
    if (driveFileMatch && driveFileMatch[1]) {
      const fileId = driveFileMatch[1];
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  try {
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    // Convert the response to an ArrayBuffer (for binary data)
    const arrayBuffer = await response.arrayBuffer();

    // Return the buffer directly instead of Blob URL
    const pdfBuffer = Buffer.from(arrayBuffer);

    return pdfBuffer; // Return the buffer
  } catch (error) {
    console.error("Error fetching PDF:", error);
  }

  return null; // Return null if there was an error
};

module.exports = { fetchPdfAsBuffer };
