import React from 'react';
import '@testing-library/react-native/extend-expect';
import '@testing-library/jest-native/legacy-extend-expect';
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-safe-area-context', () => {
	const inset = { top: 0, right: 0, bottom: 0, left: 0 };
	return {
		...jest.requireActual('react-native-safe-area-context'),
		SafeAreaProvider: jest.fn(({ children }) => children),
		SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
		useSafeAreaInsets: jest.fn(() => inset),
		useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 }))
	};
});

// @ts-ignore
global.__reanimatedWorkletInit = () => {};
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);

jest.mock('rn-fetch-blob', () => ({
	fs: {
		dirs: {
			DocumentDir: '/data/com.rocket.chat/documents',
			DownloadDir: '/data/com.rocket.chat/downloads'
		},
		exists: jest.fn(() => null)
	},
	fetch: jest.fn(() => null),
	config: jest.fn(() => null)
}));

jest.mock('react-native-file-viewer', () => ({
	open: jest.fn(() => null)
}));

jest.mock('expo-haptics', () => jest.fn(() => null));

jest.mock('./app/lib/database', () => jest.fn(() => null));

jest.mock('./app/containers/MessageComposer/components/EmojiKeyboard', () => jest.fn(() => null));

jest.mock('./app/lib/hooks/useFrequentlyUsedEmoji', () => ({
	useFrequentlyUsedEmoji: () => ({
		frequentlyUsed: [],
		loaded: true
	})
}));

jest.mock('./app/lib/database/services/Message', () => ({
	getMessageById: messageId => ({
		id: messageId,
		rid: 'rid',
		msg: `Message ${messageId}`
	})
}));

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
	...jest.requireActual('@react-navigation/native'),
	useNavigation: () => ({
		navigate: jest.fn(),
		addListener: jest.fn().mockImplementation((event, callback) => {
			callback();
			return {
				remove: jest.fn()
			};
		})
	})
}));

jest.mock('react-native-notifications', () => ({
	Notifications: {
		getInitialNotification: jest.fn(() => Promise.resolve()),
		registerRemoteNotifications: jest.fn(),
		events: () => ({
			registerRemoteNotificationsRegistered: jest.fn(),
			registerRemoteNotificationsRegistrationFailed: jest.fn(),
			registerNotificationReceivedForeground: jest.fn(),
			registerNotificationReceivedBackground: jest.fn(),
			registerNotificationOpened: jest.fn()
		})
	}
}));

jest.mock('@gorhom/bottom-sheet', () => {
	const react = require('react-native');
	return {
		__esModule: true,
		default: react.View,
		BottomSheetScrollView: react.ScrollView
	};
});

// If you need to manually mock a lib use this mock pattern and set exports.
jest.mock('react-native-math-view', () => {
	const react = require('react-native');
	return {
		__esModule: true,
		default: react.View, // Default export
		MathText: react.View // {...} Named export
	};
});

jest.mock('react-native-ui-lib/keyboard', () => {
	const react = jest.requireActual('react');
	return {
		__esModule: true,
		KeyboardAccessoryView: react.forwardRef((props, ref) => {
			const MockName = 'keyboard-accessory-view-mock';
			return <MockName>{props.renderContent()}</MockName>;
		})
	};
});
