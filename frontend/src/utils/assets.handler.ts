import { downloadAsset } from "../services/api.service";
import { type fileArgumentProps } from "../interfaces/apiInterface";
import { runCatchErrorLogger, throwCatchError } from "./response.handler";

export const handleDownload = async ({url, filename} : fileArgumentProps) => {
    if(!url || !filename){
        throw new Error("No url or filename provided");
    }

    try {
      await downloadAsset({ url, filename});
    } catch (error) {
      throwCatchError(error);
      runCatchErrorLogger(error);
    }
  };