// adapted lovingly from: https://dev.to/simonireilly/fetch-with-typescript-for-better-http-api-clients-2d71

/** For 200s */
export type UserCreated = { id: string; name: string };

/** For 400s */
export type BadRequest = { code: "bad_request"; message: string };

// create user is mozilla or google oauth via user presence
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/WebAuthn_extensions

/** Response type intersection */
export type UserResponse =
    | (Omit<Response, "json"> & {
    status: 201;
    json: () => UserCreated | PromiseLike<UserCreated>;
})
    | (Omit<Response, "json"> & {
    status: 400;
    json: () => BadRequest | PromiseLike<BadRequest>;
});

export type SettingsResponse =
    | (Omit<Response, "json"> & {
    status: 201;
    json: () => UserCreated | PromiseLike<UserCreated>;
})
    | (Omit<Response, "json"> & {
    status: 400;
    json: () => BadRequest | PromiseLike<BadRequest>;
});

/** Marshalling stream to object with narrowing */
const marshalResponse = (res: UserResponse) => {
    if (res.status - (res.status % 100) === 200) return res.json();
    if (res.status - (res.status % 100) === 400) return res.json();
    return Error("Unhandled response code: " + JSON.stringify({ response: JSON.stringify(res), json: res.json() }));
};

/** Coerce Response to UserResponse */
export const responseHandler = (response: Response) => {
    const res = response as UserResponse;
    return marshalResponse(res);
};

/** Usage returns typed data */
// const data = fetch(`https://api.com/v1/user`, {
//     method: "POST",
//     body: JSON.stringify({ name: "Simon" }),
// }).then((res) => responseHandler(res));