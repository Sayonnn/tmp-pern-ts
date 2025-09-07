export interface apiArgumentProps {
    url:string,
    data?:any,
    params?:any,
}

export interface fileArgumentProps {
    params?:any,
    url:string,
    filename:string
    file?: File | Blob,
    files?: File[] | Blob[]
    onProgress?: (percent: number) => void,
}
    