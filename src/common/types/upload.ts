export interface CloudinaryPresignedResponse {
    publicId: string
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder?: string;
}
