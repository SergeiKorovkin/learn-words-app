export interface IDictionary {
	_id?: string
	title: string
	basic: boolean
}

type Dictionary = {
	title: string
	name: string
}

export type IDictionariesList = Dictionary[]
