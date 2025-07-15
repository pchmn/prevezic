import type { Id } from '@prevezic/backend/_generated/dataModel';
import imageCompression from 'browser-image-compression';
import { parse } from 'date-fns';
import ExifReader from 'exifreader';
import { useState } from 'react';
import { appConfig } from '~/config/config';
import { authClient } from '~/lib/auth.client';
import type { FileUpload } from './types';

export function useFileUpload(projectId: Id<'projects'>) {
  const [uploads, setUploads] = useState<FileUpload[]>([]);

  const hasActiveUploads = uploads.some((u) =>
    ['pending', 'compressing', 'uploading'].includes(u.status),
  );

  const updateUploadStatus = (
    uploadId: string,
    status: FileUpload['status'],
    error?: string,
  ) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === uploadId ? { ...u, status, error } : u)),
    );
  };

  const addFiles = async (files: FileList) => {
    // Create upload tracking for each file
    const newUploads: FileUpload[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    // Process files with concurrency control
    await processFilesWithConcurrency(newUploads);
  };

  const processFilesWithConcurrency = async (fileUploads: FileUpload[]) => {
    const CONCURRENT_LIMIT = 12;

    for (let i = 0; i < fileUploads.length; i += CONCURRENT_LIMIT) {
      const batch = fileUploads.slice(i, i + CONCURRENT_LIMIT);

      // Process this batch in parallel
      await Promise.allSettled(batch.map((upload) => processFile(upload)));
    }
  };

  const processFile = async (upload: FileUpload) => {
    try {
      // Update status to compressing
      updateUploadStatus(upload.id, 'compressing');

      const compressedFile = await imageCompression(upload.file, {
        initialQuality: 0.75,
        alwaysKeepResolution: true,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      // Update status to uploading
      updateUploadStatus(upload.id, 'uploading');

      const tags = await ExifReader.load(upload.file, { expanded: true });

      await addPhoto({
        file: compressedFile,
        exifTags: tags,
        projectId,
      });

      // Update status to success
      updateUploadStatus(upload.id, 'success');
    } catch (error) {
      // Update status to error
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';
      updateUploadStatus(upload.id, 'error', errorMessage);
    }
  };

  const retryUpload = (uploadId: string) => {
    const upload = uploads.find((u) => u.id === uploadId);
    if (upload && upload.status === 'error') {
      updateUploadStatus(uploadId, 'pending');
      processFile(upload);
    }
  };

  const clearCompletedUploads = () => {
    setUploads((prev) =>
      prev.filter((u) => !['success', 'error'].includes(u.status)),
    );
  };

  const removeUpload = (uploadId: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== uploadId));
  };

  return {
    uploads,
    hasActiveUploads,
    addFiles,
    retryUpload,
    clearCompletedUploads,
    removeUpload,
  };
}

async function addPhoto({
  file,
  exifTags,
  projectId,
}: {
  file: File | Blob;
  exifTags: ExifReader.ExpandedTags;
  projectId: Id<'projects'>;
}) {
  const sendImageUrl = new URL(`${appConfig.convexSiteUrl}/add-photo`);
  sendImageUrl.searchParams.set('projectId', projectId);

  const { data } = await authClient.convex.token();

  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'metadata',
    JSON.stringify({
      date: getDateFromExif(exifTags),
      location: getLocationFromExif(exifTags),
    }),
  );
  formData.append('projectId', projectId);

  const response = await fetch(sendImageUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data?.token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
}

function getDateFromExif(tags: ExifReader.ExpandedTags) {
  return tags.exif?.DateTimeOriginal?.description
    ? parse(
        tags.exif.DateTimeOriginal.description,
        'yyyy:MM:dd HH:mm:ss',
        new Date(),
      ).getTime()
    : undefined;
}

function getLocationFromExif(tags: ExifReader.ExpandedTags) {
  return tags.gps
    ? !tags.gps.Latitude || !tags.gps.Longitude
      ? undefined
      : {
          lat: tags.gps.Latitude,
          lng: tags.gps.Longitude,
        }
    : undefined;
}
