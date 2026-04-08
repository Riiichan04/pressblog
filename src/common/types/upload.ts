export interface CloudinaryPresignedResponse {
    public_id: string;
    signature: string;
    timestamp: number;
    api_key: string;
    cloud_name: string;
    folder?: string;
}