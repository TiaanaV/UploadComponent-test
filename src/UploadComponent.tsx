import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export const UploadComponent: React.FC = () => {
    const [fileList, setFileList] = useState([]);
    const [selectedFileCount, setSelectedFileCount] = useState(0);

    const handleFileChange = (info: any) => {
        let fileList:any = [...info.fileList].slice(-100); // Ограничить количество файлов до 100
        fileList = fileList.map((file: any) => {
            if (file.response) {
                file.url = file.response.url; // Сохранить URL загруженного файла
            }
            return file;
        });

        setFileList(fileList);
        setSelectedFileCount(fileList.length);
    };

    const handleUpload = () => {
        // Загружаем файлы на Яндекс.Диск
        fileList.forEach((file: any) => {
            const formData = new FormData();
            formData.append('file', file.originFileObj);

            // здесь нужно установить url загрузки файлов на яндекс диск
            fetch('YANDEX_DISK_UPLOAD_URL', {
                method: 'POST',
                body: formData
            }).then((response) => {
                // Обработка ответа от сервера
                console.log(response);
            });
        });
    };

    return (
        <div>
            <Upload
                onChange={handleFileChange}
                fileList={fileList}
                multiple={true}
                beforeUpload={() => false} // Отключить автоматическую загрузку файлов
            >
                <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
            </Upload>

            <Button type="primary" onClick={handleUpload} disabled={selectedFileCount === 0}>
                Загрузить ({selectedFileCount} файлов выбрано)
            </Button>
        </div>
    );
};

