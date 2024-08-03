'use client'

import { useDropzone } from 'react-dropzone'
import React, { useCallback } from 'react'
import Image from 'next/image'
import { convertFileToUrl } from '@/lib/utils'

type FileUploaderProps = {
    files: File[] | undefined,
    onChange: (file: File[]) => void
}

function FileUploader({ files, onChange }: FileUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onChange(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} className='file-upload'>
            <input {...getInputProps()} />
            {
                files && files?.length > 0 ? (
                    <Image
                        src={convertFileToUrl(files[0])}
                        width={1000}
                        height={1000}
                        alt='Uploaded Document'
                        className='object-cover overflow-hidden max-h-[400px]'
                    />
                ) : (
                    <>
                        <Image
                        src='/assets/icons/upload.svg'
                        width={32}
                        height={32}
                        alt='Upload Document'
                    />
                    <div className="file-upload_label">
                        <p className="text-14-regular">
                            <span className='text-green-500'>
                                Click to Upload &nbsp;
                            </span>
                            or drag and drop
                        </p>
                        <p>
                            SVG, PNG, JPG or GIF (max 800x400)
                        </p>
                    </div>
                    </>

                )
            }
        </div >
    )
}

export default FileUploader