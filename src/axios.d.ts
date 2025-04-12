import 'axios';

declare module 'axios' {
	export interface AxiosRequestConfig {
		skip_auth?: boolean;
	}
}
