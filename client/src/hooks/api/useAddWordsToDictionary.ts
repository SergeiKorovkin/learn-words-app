import { useHttp } from '../useHttp'
import { useCallback } from 'react'
import { IWord } from '../../types/word'
import { endpoints } from '../../consts/endpoints'

export const useAddWordsToDictionary = () => {
	const { loading, error, request } = useHttp()

	const addWordsHandler = useCallback(
		(id: string, words: IWord[], toBegin?: boolean) => {
			try {
				return request(endpoints.dictionaryWords.replace(':id', id), 'POST', { words, toBegin })
			} catch (e) {
				console.log('e', e)
			}
		},
		[request]
	)

	return { addWordsHandler, loading, error }
}
