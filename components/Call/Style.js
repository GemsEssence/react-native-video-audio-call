/* eslint-disable prettier/prettier */

import { StyleSheet, Dimensions } from 'react-native';

let dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

export default StyleSheet.create({
    max: {
        flex: 1,
    },
    callContainer: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    buttonHolder: {
        height: 100,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0093E9',
        borderRadius: 25,
    },
    endCallBtn: {
        alignSelf: 'center',
        backgroundColor: 'red',
        borderRadius: 50,
        bottom: 50,
        padding: 10,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: dimensions.width,
        height: dimensions.height - 100,
    },
    halfViewRow: {
        flex: 1 / 2,
        flexDirection: 'row',
    },
    full: {
        height: dimensions.height,
        width: dimensions.width,
    },
    half: {
        flex: 1 / 2,
    },
    localVideoStyle: {
        width: 120,
        height: 150,
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 100,
        backgroundColor: 'purple',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    nameBubble: {
        backgroundColor: 'lightgrey',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 50,
        fontSize: 25,
        fontWeight: 'bold',
    },
    innerBubble: {
        opacity: 0.8,
        backgroundColor: 'lightgrey',
        padding: 15,
        borderRadius: 50,
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
    callFooterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 50,
    },
});
