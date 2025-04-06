
import { saveAs as FileSaverSaveAs } from 'file-saver';

/**
 * Wrapper function for file-saver's saveAs function
 * @param blob - The Blob, File, or URL to save
 * @param filename - The name to save the file as
 */
export const saveFile = (blob: Blob | string, filename: string): void => {
  FileSaverSaveAs(blob, filename);
};
