import { useCallback } from 'react';

export type ValueCondition<T, R> = {
	predicate: (arg?: T) => boolean;
	result: (arg?: T) => R;
};

export const useValueByConditionPipelineSync = <T, R>(
	conditions: ValueCondition<T, R>[],
): ((arg?: T) => R | null) => {
	return useCallback(
		(arg?: T) => {
			for (const cond of conditions) {
				if (cond.predicate(arg)) {
					return cond.result(arg);
				}
			}
			return null;
		},
		[conditions],
	);
};
