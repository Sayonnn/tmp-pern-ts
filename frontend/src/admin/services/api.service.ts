import { postDatas } from "../../services/axios.service";

class AdminService {
  private static instance: AdminService;
  private static apiUrl:string = import.meta.env.VITE_API_URL;
  private static appName:string = import.meta.env.VITE_APP_NAME;

  private constructor() {} 

  public static getInstance(): AdminService {
    if (!AdminService.instance) { 
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  /** Auth endpoints */
  public auth = {
    login: (data: { username: string; password: string }) => postDatas({ url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/login`, data }),
    logout: () => postDatas({ url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/logout` }),
    signup:() => null,
    forgotPassword:(data: {email: string}) => postDatas({ url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/forgot-password`,data }),
    resetPassword:(data: {token: string | null, password: string}) => postDatas({ url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/reset-password`,data }),
    refreshToken: () => postDatas({ url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/refresh-token` }),
    refreshInformation: () => postDatas({ url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/refresh-admin-information` }),
  };
}

export default AdminService.getInstance();
