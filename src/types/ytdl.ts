export type postUrlResult = 
| {
    status: "success";
    filename: string | undefined;
    downloadLink: string | undefined;
} | {
    status: 'error';
    message: string;
}

export type FIleDownloadResult =
| {
    status: "success";
} | {
    status: "error";
    message: string;
}