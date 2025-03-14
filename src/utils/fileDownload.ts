import fs from "fs";
import axios from "axios";

/** Types */
import {
    FIleDownloadResult
} from "../types/ytdl";

/**
 * Save the file from the download link.
 * @param fileUrl - Download link.
 * @param filePath - Destination path.
 * @returns - results.
 */
export const fileDownload = async (fileUrl: string, filePath: string): Promise<FIleDownloadResult> => {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.get(fileUrl, {
                "responseType": "arraybuffer"
            });
    
            if (response.status !== 200) {
                return resolve({
                    status: "error",
                    message: response.statusText
                });
            }
    
            fs.writeFileSync(filePath, response.data, "binary");
        } catch (e) {
            if (e instanceof Error) {
                return resolve({
                    status: "error",
                    message: e.message
                });
            }
        }
        resolve({
            status: "success"
        });
    });
}