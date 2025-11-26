import { fetchData, postDatas } from "../../services/axios.service";

class AdminService {
	private static instance: AdminService;
	private static apiUrl: string = import.meta.env.VITE_API_URL;
	private static appName: string = import.meta.env.VITE_APP_NAME;

	private constructor() {}

	public static getInstance(): AdminService {
		if (!AdminService.instance) {
			AdminService.instance = new AdminService();
		}
		return AdminService.instance;
	}

	/** Auth endpoints */
	public auth = {
		login: (data: { username: string; password: string }) =>
			postDatas({url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/login`,data}),

		logout: () =>
			postDatas({url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/logout`}),

		signup: (data: { username: string; email: string; password: string }) =>
			postDatas({url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/register`,data}),

		forgotPassword: (data: { email: string }) =>
			postDatas({url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/forgot-password`,data}),

		resetPassword: (data: { token: string | null; password: string }) =>
			postDatas({url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/reset-password`,data}),

		/** tokens */
		refreshToken: () =>
			postDatas({url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/refresh-token`}),

		getAccessToken: () =>
			fetchData({ url: `${AdminService.apiUrl}/get-access-token` }),
		
		/** personal information */
		refreshInformation: () =>
			postDatas({url: `${AdminService.apiUrl}/${AdminService.appName}-admin/auth/refresh-admin-information`}),

		/** 2FA endpoints (QR Code) - using generic routes */
		twoFASetup: (data: { username: string, role: string }) =>
			postDatas({
				url: `${AdminService.apiUrl}/2fa/setup`,
				data,
			}),

		twoFAVerify: (data: { token: string; secret: string; username: string, role: string }) =>
			postDatas({
				url: `${AdminService.apiUrl}/2fa/verify`,
				data,
			}),

		twoFAValidate: (data: { username: string, role: string }) =>
			postDatas({ url: `${AdminService.apiUrl}/2fa/validate`, data }),
			
	};
}

export default AdminService.getInstance();
