import axios from "axios";
import { YtdlError } from "../error";

/** Types */
import {
    postUrlResult
} from "../types/ytdl";
import { error } from "console";

/**
 * Get a download link for a YouTube video or audio.
 * @param videoUrl - YouTube video link.
 * @param format - File format.
 * @param videoQuality - Video quality.
 * @returns - results.
 */
export const postUrl = async (videoUrl: string, format: string, videoQuality: number): Promise<postUrlResult> => {
    return new Promise(async (resolve ) => {
        let filename: string = "";
        let downloadLink: string = "";
        let videoId: string = "";
        let key: string = "";
    
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
        if (!youtubeRegex.test(videoUrl.trim())) throw new YtdlError("The videoUrl is invalid.");
    
        const videoQualities: number[] = [1080,720,360,240,144];
        if (!videoQualities.includes(videoQuality)) throw new YtdlError("The videoQuality is invalid.\nObtainable: [1080, 720, 360, 240, 144]");
    
        if (format !== "mp3" && format !== "mp4") throw new YtdlError("The format is invalid.\nObtainable: [mp3, mp4]");
    
        if (videoUrl.includes("watch?v=")) {
            videoId = String(new URL(videoUrl).searchParams.get("v"));
        } else if (videoUrl.includes("youtu.be/")) {
            videoId = videoUrl.split("/")[3].slice(0, 11);
        }
    
        if (videoId.length !== 11) throw new YtdlError("The videoUrl is invalid.");
    
        try {
            const response = await axios.get("https://api.mp3youtube.cc/v2/sanity/key" , {
                headers: {
                    "accept": "*/*",
                    "accept-encoding": "gzip, deflate, br, zstd",
                    "accept-language": "ja;q=0.7",
                    "content-type": "application/json",
                    "if-none-match": "W/\"7e-HlpDnHvPhdL6ET/gk8pkw9NDCxo-gzip\"",
                    "origin": "https://iframe.y2meta-uk.com",
                    "priority": "u=1, i",
                    "referer": "https://iframe.y2meta-uk.com/",
                    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Brave\";v=\"132\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    "sec-gpc": "1",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
                }
            });
    
            if (response.status !== 200) {
                return resolve({
                    status: "error",
                    message: response.statusText
                });
            }
                if (!response.data.key) return resolve({
                    status: "error",
                    message: "Failed to get key."
                });
    
                key = response.data.key;
                
                if (!key) return resolve({
                    status: "error",
                    message: "Failed to get key."
                });
    
                const response_2 = await axios.post(`https://api.mp3youtube.cc/v2/converter`, {
                    "link": `https://youtu.be/${videoId}`,
                    "format": "mp4",
                    "audioBitrate": 128,
                    "videoQuality": videoQualities,
                    "vCodec": "h264"
                }, {
                    headers: {
                        "accept": "*/*",
                        "accept-encoding": "gzip, deflate, br, zstd",
                        "accept-language": "ja;q=0.7",
                        "content-length": "98",
                        "content-type": "application/x-www-form-urlencoded",
                        "key": key,
                        "origin": "https://iframe.y2meta-uk.com",
                        "priority": "u=1, i",
                        "referer": "https://iframe.y2meta-uk.com/",
                        "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Brave\";v=\"132\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site",
                        "sec-gpc": "1",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
                    }
                });
    
                if (response_2.status !== 200) {
                    return resolve({
                        status: "error",
                        message: response_2.statusText
                    });
                }
    
                if (!response_2.data.url && !response_2.data.filename) {
                    return resolve({
                        status: "error",
                        message: "Failed to get video url."
                    });
                }
    
                filename = response_2.data.filename;
                downloadLink = response_2.data.url;
        
        } catch (e) {
            if (e instanceof Error) {
                return resolve({
                    status: "error",
                    message: e.message
                });
            }
        }
        resolve({
            status: "success",
            filename: filename || undefined,
            downloadLink: downloadLink || undefined,
        });
    });
}