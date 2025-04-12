import { i18nNamespaces, initTranslations } from '../translation';

export async function useServerTranslation(
	lng: string,
	ns: string[] = [i18nNamespaces[0]],
) {
	const i18nextInstance = await initTranslations(lng, ns);
	return {
		t: i18nextInstance.t,
		i18n: i18nextInstance,
	};
}
