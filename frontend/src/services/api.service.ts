import { postDatas } from "../services/axios.service";

class ClientService {
	private static instance: ClientService;
	private static apiUrl: string = import.meta.env.VITE_API_URL;

	private constructor() {}

	public static getInstance(): ClientService {
		if (!ClientService.instance) {
			ClientService.instance = new ClientService();
		}
		return ClientService.instance;
	}

	/** Auth endpoints */
	public auth = {
		login: (data: { username: string; password: string }) =>
			postDatas({ url: `${ClientService.apiUrl}/auth/login`, data }),

		logout: () => postDatas({ url: `${ClientService.apiUrl}/auth/logout` }),

		signup: (data: { username: string; email: string; password: string }) =>
			postDatas({ url: `${ClientService.apiUrl}/auth/register`, data }),

		forgotPassword: (data: { email: string }) =>
			postDatas({ url: `${ClientService.apiUrl}/auth/forgot-password`, data }),

		resetPassword: (data: { token: string | null; password: string }) =>
			postDatas({ url: `${ClientService.apiUrl}/auth/reset-password`, data }),

		refreshToken: () =>
			postDatas({ url: `${ClientService.apiUrl}/auth/refresh-token` }),

		refreshInformation: () =>
			postDatas({url: `${ClientService.apiUrl}/auth/refresh-client-information`}),

		twoFASetup: (data: { username: string, role: string }) =>
			postDatas({ url: `${ClientService.apiUrl}/2fa/setup`, data }),

		twoFAVerify: (data: { token: string; secret: string; username: string, role: string }) =>
			postDatas({ url: `${ClientService.apiUrl}/2fa/verify`, data }),

		twoFAValidate: (data: { username: string, role: string }) =>
			postDatas({ url: `${ClientService.apiUrl}/2fa/validate`, data }),
		
	};
}

export default ClientService.getInstance();
