
import { saveAs } from 'file-saver';

/**
 * Save data as a file for the user to download
 * 
 * @param blob - The data to save as a file
 * @param filename - The name of the file to save
 */
export const saveFile = (blob: Blob, filename: string): void => {
  saveAs(blob, filename);
};

/**
 * Save text content as a file
 * 
 * @param content - The text content to save
 * @param filename - The name of the file to save
 * @param type - The MIME type of the file (default: 'text/plain')
 */
export const saveTextAsFile = (content: string, filename: string, type: string = 'text/plain'): void => {
  const blob = new Blob([content], { type });
  saveFile(blob, filename);
};

/**
 * Convert a base64 string to a Blob
 * 
 * @param base64 - The base64 string to convert
 * @param type - The MIME type of the file
 * @returns A Blob representing the file
 */
export const base64ToBlob = (base64: string, type: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type });
};
