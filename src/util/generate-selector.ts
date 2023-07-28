// from https://stackoverflow.com/a/66291608

export default function getSelector(elem: HTMLElement): string {
    if (elem.tagName === "BODY") return "BODY";
    const names = [];
    while (elem.parentElement && elem.tagName !== "BODY") {
        if (elem.id) {
            names.unshift("#" + elem.getAttribute("id")); // getAttribute, because `elem.id` could also return a child element with name "id"
            break; // Because ID should be unique, no more is needed. Remove the break, if you always want a full path.
        } else {
            let c = 1, e = elem;
            while (e.previousElementSibling) {
                // @ts-ignore
                e = e.previousElementSibling;
                c++;
            }
            names.unshift(elem.tagName + ":nth-child(" + c + ")");
        }
        elem = elem.parentElement;
    }
    return names.join(">");
}
