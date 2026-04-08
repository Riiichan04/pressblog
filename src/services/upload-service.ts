import { CloudinaryPresignedResponse } from "@/common/types/upload";
import apiClient from "./api-client";
import { apiUrl } from "@/common/constants/api-url";

export interface UploadResponse {
    url: string;
    publicId: string;
}

export const uploadImageToCloudinary = async (file: File, inputFolder?: string): Promise<UploadResponse> => {
    const cleanFileName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, "_");

    const res = await apiClient<CloudinaryPresignedResponse>(`${apiUrl}/upload/get-url`, {
        params: {
            fileName: cleanFileName,
            folder: inputFolder || ""
        }
    });

    if (res.status !== 200 || !res.data) {
        throw new Error("Failed to get upload signature");
    }

    const { signature, timestamp, api_key, cloud_name, folder, public_id } = res.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", api_key);

    if (folder) formData.append("folder", folder);
    if (public_id) formData.append("public_id", public_id);

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
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