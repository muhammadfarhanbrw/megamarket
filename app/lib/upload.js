// lib/upload.js
import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';

export async function parseForm(request) {
  // Get the content type from the Web API Request headers
  const contentType = request.headers.get('content-type');
  
  if (!contentType || !contentType.includes('multipart/form-data')) {
    throw new Error('Missing Content-Type or not multipart/form-data');
  }
  
  // Create a proper headers object for Busboy
  const headers = {
    'content-type': contentType,
  };
  
  // Get the content length if available
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    headers['content-length'] = contentLength;
  }
  
  const busboy = Busboy({ headers });
  const fields = {};
  const files = [];
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // Create upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    busboy.on('field', (fieldname, value) => {
      fields[fieldname] = value;
    });

    busboy.on('file', (fieldname, file, info) => {
      const { filename, mimeType } = info;
      const fileExtension = path.extname(filename);
      const newFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      const saveTo = path.join(uploadDir, newFileName);
      
      const writeStream = fs.createWriteStream(saveTo);
      file.pipe(writeStream);
      
      writeStream.on('finish', () => {
        files.push({
          fieldname,
          filename: newFileName,
          originalFilename: filename,
          path: `/uploads/${newFileName}`,
          mimeType,
        });
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
    });

    busboy.on('finish', () => {
      resolve({ fields, files });
    });

    busboy.on('error', (err) => {
      reject(err);
    });
    
    // Convert the Web API Request body to a Node.js readable stream
    // This is the key part - we need to pipe the request body to busboy
    const reader = request.body.getReader();
    
    const nodeStream = new (require('stream')).Readable({
      async read() {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      }
    });
    
    nodeStream.pipe(busboy);
  });
}