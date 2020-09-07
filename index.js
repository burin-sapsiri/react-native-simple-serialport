import { RNSerialport, definitions, actions } from "react-native-serialport-busap-temporary"
import { DeviceEventEmitter } from "react-native"
import EventEmitter from 'events'


const startUsbSerial = ({
    baudRate = 9600, 
    dataBit = definitions.DATA_BITS.DATA_BITS_8, 
    parity = definitions.PARITIES.PARITY_NONE,
    stopBits = definitions.STOP_BITS.STOP_BITS_1,
}) => {
    const event = new EventEmitter()

    const serviceStarted = (response) => {
        event.emit('serviceStarted', response)
        if (response.deviceAttached) {
          event.emit('deviceAttached')
        }
    }
    const serviceStopped = () => {
        event.emit('serviceStopped')
    }
    const deviceAttached = () => {
        event.emit('deviceAttached')
    }
    const deviceDetached = () => {
        event.emit('deviceDetached')
    }
    const connected = () => {
        event.emit('connected')
    }
    const disconnected = () => {
        event.emit('disconnected')
    }
    const readData = (data) => {
        event.emit('data', data)
    }

    const onError = (error) => {
        console.error(error);
    }

    const startUsbListener = () => {
        DeviceEventEmitter.addListener(
            actions.ON_SERVICE_STARTED,
            serviceStarted,
            this,
        )
        DeviceEventEmitter.addListener(
            actions.ON_SERVICE_STOPPED,
            serviceStopped,
            this,
        )
        DeviceEventEmitter.addListener(
            actions.ON_DEVICE_ATTACHED,
            deviceAttached,
            this,
        )
        DeviceEventEmitter.addListener(
            actions.ON_DEVICE_DETACHED,
            deviceDetached,
            this,
        )
        DeviceEventEmitter.addListener(
            actions.ON_ERROR, 
            onError, 
            this,
        )
        DeviceEventEmitter.addListener(
            actions.ON_CONNECTED,
            connected,
            this,
        )
        DeviceEventEmitter.addListener(
            actions.ON_DISCONNECTED,
            disconnected,
            this,
        )

        DeviceEventEmitter.addListener(
            actions.ON_READ_DATA, 
            readData, 
            this,
        )

        RNSerialport.setAutoConnectBaudRate(baudRate)
        RNSerialport.setDataBit(dataBit)
        RNSerialport.setParity(parity)
        RNSerialport.setStopBit(stopBits)
        RNSerialport.setAutoConnect(true)
        RNSerialport.startUsbService()
    };
    
    stopUsbListener = async () => {
        DeviceEventEmitter.removeAllListeners();
        const isOpen = await RNSerialport.isOpen();
        if (isOpen) {
            Alert.alert("isOpen", isOpen);
            RNSerialport.disconnect();
        }
        RNSerialport.stopUsbService();
    };

    startUsbListener()

    return event
}

const write = (uint8Array) => {
    const intArray = Array.from(uint8Array)
    RNSerialport.writeIntArray(intArray)
}

const writeString = (text) => {
    RNSerialport.writeString(text)
}

const RNSimpleSerialport = {
    definitions,
    startUsbSerial,
    write,
    writeString,
}

export default RNSimpleSerialport
