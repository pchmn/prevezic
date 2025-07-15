export interface FileUpload {
  id: string;
  file: File;
  status: 'pending' | 'compressing' | 'uploading' | 'success' | 'error';
  error?: string;
}
