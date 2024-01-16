//todo: implement: single configuration for delivery targets configured via configuration (webpack a plus)
import {
    Client,
    ClientDiscovery,
    ClientLocation, GoogleChromeRuntimeProxy,
    GoogleClientMessengerService,
    IClientMessengerService
} from "../util/state-machine";
import Message from "../models/message";

type ClientDiscoveryConfig = {
    up: { (): Client<any> }
    down: { (): Client<any> }
}

type RobotCopyConfig = {
    clients: { [key: string]: ClientDiscoveryConfig }
}

const clientCacheMap = new Map<string, Client<any>>()

export const copyConfig: RobotCopyConfig = {
    "clients": {
        "popup": {
            up: () => {
                if (!clientCacheMap.has("popup")) {
                    clientCacheMap.set("popup", new Client<Message<any>>(new GoogleClientMessengerService(
                        {
                            from: ClientLocation.POPUP,
                            to: ClientLocation.CONTENT
                        },
                        new Map<string, IClientMessengerService<Message<any>>>(),
                        new GoogleChromeRuntimeProxy())))
                }
                return clientCacheMap.get("popup")!
            },
            down: () => {
                if (!clientCacheMap.has("popup")) {
                    clientCacheMap.set("popup", new Client<Message<any>>(new GoogleClientMessengerService(
                        {
                            from: ClientLocation.POPUP,
                            to: ClientLocation.CONTENT
                        },
                        new Map<string, IClientMessengerService<Message<any>>>(),
                        new GoogleChromeRuntimeProxy())))
                }
                return clientCacheMap.get("popup")!
            }
        }
    }
}

export const clientForLocation = (location: string): ClientDiscoveryConfig => {
    if (!(location in copyConfig.clients)) throw new Error("location" + location + " not in copyConfig!");

    return copyConfig.clients[location]
}