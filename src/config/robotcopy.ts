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

type AuthClientConfig = {
    chrome: { (): Client<any> }
    firefox: { (): Client<any> }
}

type RobotCopyConfig = {
    clients: { [key: string]: ClientDiscoveryConfig | AuthClientConfig }
}

const clientCacheMap = new Map<string, Client<any>>()

const cacheClientConfig = (name: string, discover: ClientDiscovery | AuthClientConfig) => {
    if (!clientCacheMap.has(name)) {
        clientCacheMap.set(name, new Client<Message<any>>(new GoogleClientMessengerService(
            discover as ClientDiscovery,
            new Map<string, IClientMessengerService<Message<any>>>(),
            new GoogleChromeRuntimeProxy())))
    }
    return clientCacheMap.get(name)!
}

const CopyConfig: RobotCopyConfig = {
    "clients": {
        "popup": {
            up: () => {
                return cacheClientConfig("popup", {
                    from: ClientLocation.POPUP,
                    to: ClientLocation.CONTENT
                })
            },
            down: () => {
                return cacheClientConfig("popup", {
                    from: ClientLocation.POPUP,
                    to: ClientLocation.CONTENT
                })
            }
        },
        "background": {
            up: () => {
                return cacheClientConfig("background", {
                    from: ClientLocation.BACKGROUND,
                    to: ClientLocation.POPUP
                })
            },
            down: () => {
                return cacheClientConfig("background", {
                    from: ClientLocation.POPUP,
                    to: ClientLocation.BACKGROUND
                })
            }
        },
        "content": {
            up: () => {
                return cacheClientConfig("content", {
                    from: ClientLocation.CONTENT,
                    to: ClientLocation.BACKGROUND
                })

            },
            down: () => {
                // maybe YAGNI? i was thinking client side loop back, we'll see
                return cacheClientConfig("content", {
                    from: ClientLocation.BACKGROUND,
                    to: ClientLocation.CONTENT
                })
            }
        },
        "identity": {
            chrome: () => {
                // todo: implement: https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/WebAuthn_extensions
                throw new Error("implement identity client for login and user presence")
            },
            firefox: () => {
                throw new Error("implement identity client for login and user presence")
            }
        },
        "api": {
            up: () => {
                // todo: implement: up meaning to the API
                throw new Error("implement api client for REST API communication")
            },
            down: () => {
                // todo: implement: down meaning to background.js usually
                throw new Error("implement api client from REST API communication")
            }
        }
    }
}

export default CopyConfig;

export const clientForLocation = (location: string): ClientDiscoveryConfig | AuthClientConfig => {
    if (!(location in CopyConfig.clients)) throw new Error("location" + location + " not in copyConfig!");

    return CopyConfig.clients[location]
}