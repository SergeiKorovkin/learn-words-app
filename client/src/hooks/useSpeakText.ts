import { useCallback, useEffect, useState } from 'react'

export interface IUseSpeakText {
	speak: (text: string) => void
	supported: boolean
	speaking: boolean
	cancel: () => void
}

export const useSpeakText = (): IUseSpeakText => {
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
	const [speaking, setSpeaking] = useState(false)
	const [supported, setSupported] = useState(false)

	const processVoices = (voiceOptions: SpeechSynthesisVoice[]) => {
		setVoices(voiceOptions.filter((item) => item.lang === 'en-US' || item.lang === 'en-GB'))
	}

	const getVoices = () => {
		// Firefox seems to have voices upfront and never calls the
		// voiceschanged event
		let voiceOptions = window.speechSynthesis.getVoices()
		if (voiceOptions.length > 0) {
			processVoices(voiceOptions)
			return
		}

		window.speechSynthesis.onvoiceschanged = (event: any) => {
			voiceOptions = event.target.getVoices()
			processVoices(voiceOptions)
		}
	}

	useEffect(() => {
		if (typeof window !== 'undefined' && window.speechSynthesis) {
			setSupported(true)
			getVoices()
		}
	}, [])
	const speak = useCallback(
		(text: string) => {
			if (!supported) return
			setSpeaking(true)
			// Firefox won't repeat an utterance that has been
			// spoken, so we need to create a new instance each time 33 37 38
			const utterance = new window.SpeechSynthesisUtterance()
			utterance.text = text
			utterance.voice = voices.filter((item) => item.name === 'Samantha' || item.name === 'Саманта')[0]
			utterance.rate = 1
			utterance.pitch = 1
			utterance.volume = 1
			window.speechSynthesis.speak(utterance)
		},
		[supported, voices]
	)

	const cancel = useCallback(() => {
		if (!supported) return
		setSpeaking(false)
		window.speechSynthesis.cancel()
	}, [supported])

	return {
		supported,
		speak,
		speaking,
		cancel,
	}
}
