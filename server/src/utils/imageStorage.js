const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

const isImageKitConfigured =
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT &&
  !process.env.IMAGEKIT_PUBLIC_KEY.startsWith('dummy') &&
  process.env.IMAGEKIT_PUBLIC_KEY !== '';

let imagekit = null;
if (isImageKitConfigured) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  });
}

const getLocalFilePath = (imageUrl) => {
  if (!imageUrl) return null;
  const safePath = imageUrl.replace(/^\/+/, '');
  return path.join(__dirname, '../../public', safePath);
};

const getImageKitFilePathFromUrl = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith('http')) return null;

  try {
    const parsedUrl = new URL(imageUrl);
    if (!parsedUrl.hostname.includes('imagekit.io')) {
      return null;
    }

    const rawPath = parsedUrl.pathname.replace(/^\/+/, '');
    const segments = rawPath.split('/');
    while (segments.length > 0 && segments[0].startsWith('tr:')) {
      segments.shift();
    }
    if (segments.length > 0 && /^v\d+$/.test(segments[0])) {
      segments.shift();
    }

    return segments.join('/');
  } catch (e) {
    return null;
  }
};

const deleteStoredImage = async (imageUrl, imageFileId = null) => {
  if (!imageUrl && !imageFileId) return;

  if (isImageKitConfigured && imagekit) {
    let fileId = imageFileId || null;

    if (!fileId && imageUrl) {
      try {
        const metadataResponse = await imagekit.getFileMetadata(imageUrl);
        if (metadataResponse && metadataResponse.fileId) {
          fileId = metadataResponse.fileId;
        }
      } catch (error) {
        // Ignore metadata lookup failure, fallback to file path resolution
      }
    }

    if (!fileId && imageUrl) {
      const filePath = getImageKitFilePathFromUrl(imageUrl);
      if (filePath) {
        try {
          const folder = path.dirname(filePath) === '.' ? '/' : `/${path.dirname(filePath)}`;
          const fileName = path.basename(filePath);
          const listResponse = await imagekit.listFiles({ path: folder, name: fileName, limit: 1 });
          const fileItems = Array.isArray(listResponse)
            ? listResponse
            : listResponse && Array.isArray(listResponse.items)
            ? listResponse.items
            : listResponse && Array.isArray(listResponse.files)
            ? listResponse.files
            : null;
          if (fileItems && fileItems.length > 0 && fileItems[0].fileId) {
            fileId = fileItems[0].fileId;
          }
        } catch (error) {
          console.error('ImageKit listFiles fallback failed:', error.message || error);
        }
      }
    }

    if (fileId) {
      try {
        await imagekit.deleteFile(fileId);
        return;
      } catch (error) {
        console.error('ImageKit delete failed:', error.message || error);
      }
    }
  }

  const localPath = getLocalFilePath(imageUrl);
  if (localPath && fs.existsSync(localPath)) {
    try {
      fs.unlinkSync(localPath);
    } catch (error) {
      console.error('Local image delete failed:', error.message || error);
    }
  }
};

const handleImageUpload = async (file, folder = '/hari-naman-greens') => {
  if (isImageKitConfigured && imagekit) {
    try {
      const response = await imagekit.upload({
        file: file.buffer.toString('base64'),
        fileName: `${Date.now()}-${file.originalname}`,
        folder
      });
      return {
        url: response.url,
        fileId: response.fileId || null
      };
    } catch (error) {
      console.error('ImageKit upload error, using local fallback:', error.message || error);
    }
  }

  const uploadsDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const cleanFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const filePath = path.join(uploadsDir, cleanFileName);
  fs.writeFileSync(filePath, file.buffer);

  return {
    url: `/uploads/${cleanFileName}`,
    fileId: null
  };
};

module.exports = {
  handleImageUpload,
  deleteStoredImage,
  isImageKitConfigured
};
