/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import { PermissionsAndroid } from "react-native";
/**
 * @name requestCameraAndAudioPermission
 * @description Function to request permission for Audio and Camera
 */
export default async function requestCameraAndAudioPermission() {
	try {
		await PermissionsAndroid.requestMultiple([
			PermissionsAndroid.PERMISSIONS.CAMERA,
			PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
		]);
	} catch (err) {
		console.warn(err);
	}
}
