import { CloudinaryPresignedResponse } from "@/common/types/upload";
import apiClient from "./api-client";
import { apiUrl } from "@/common/constants/api-url";

export interface UploadResponse {
    url: string;
    publicId: string;
}

export const uploadImageToCloudinary = async (file: File, inputFolder?: string): Promise<UploadResponse> => {
    const res = await apiClient<CloudinaryPresignedResponse>(`${apiUrl}/upload/get-url`, {
        params: {
            fileName: file.name,
            folderName: inputFolder || ""
        }
    });

    if (res.status !== 200 || !res.data) {
        throw new Error("Failed to get upload signature");
    }

    const { signature, timestamp, apiKey, cloudName, folder } = res.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);

    if (folder) {
        formData.append("folder", folder);
    }

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error("Cloudinary Error:", errorData);
        throw new Error("Cloudinary upload failed");
    }

    const data = await uploadRes.json();
    return {
        url: data.secure_url,
        publicId: data.public_id
    }
};