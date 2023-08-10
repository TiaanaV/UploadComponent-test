import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const MAX_FILE_COUNT = 100;

export const UploadComponent: React.FC = () => {
    const [fileList, setFileList] = useState([]);
    const [selectedFileCount, setSelectedFileCount] = useState(0);

    const handleUpload = () => {
        const uploadFiles = async (fileList: any[]) => {
            try {
                const uploadUrl = 'https://cloud-api.yandex.net/v1/disk/resources/upload'; // Yandex.Disk upload API endpoint
                const uploadPromises = fileList.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await axios.post(uploadUrl, formData, {
                        headers: {
                            'Authorization': 'Bearer YOUR_YANDEX_DISK_API_TOKEN',
                            'Content-Type': 'multipart/form-data',
                        },
                        params: {
                            path: `/${file.name}`, // Specify the destination path on Yandex.Disk
                        },
                    });

                    return response.data;
                });

                const uploadResults = await Promise.all(uploadPromises);
                console.log(uploadResults)
                message.success('Files uploaded successfully');
            } catch (error) {
                console.error('Error occurred during file upload:', error);
            }
        };

        uploadFiles(fileList);

    };

    const handleFileListChange = (newFileList:any) => {
        if (newFileList.length > MAX_FILE_COUNT) {
            message.error(`You can upload up to ${MAX_FILE_COUNT} files`);
            return;
        }

        setFileList(newFileList);
        setSelectedFileCount(fileList.length);
    };

    return (
        <div>
            <Upload
                fileList={fileList}
                onChange={(info) => handleFileListChange(info.fileList)}
                maxCount={MAX_FILE_COUNT}
            >
                <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
            </Upload>
            <Button
                type="primary"
                disabled={selectedFileCount === 0 }
                onClick={handleUpload}
                style={{ marginTop: 16 }}
            >
                Загрузить ({selectedFileCount} файлов выбрано)
            </Button>
        </div>
    );
};

