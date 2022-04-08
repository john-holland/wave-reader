// from https://stackoverflow.com/a/66291608
export default function getSelector(elem) {
    if (elem.tagName === "BODY")
        return "BODY";
    var names = [];
    while (elem.parentElement && elem.tagName !== "BODY") {
        if (elem.id) {
            names.unshift("#" + elem.getAttribute("id")); // getAttribute, because `elem.id` could also return a child element with name "id"
            break; // Because ID should be unique, no more is needed. Remove the break, if you always want a full path.
        }
        else {
            var c = 1, e = elem;
            for (; e.previousElementSibling; e = e.previousElementSibling, c++)
                ;
            names.unshift(elem.tagName + ":nth-child(" + c + ")");
        }
        elem = elem.parentElement;
    }
    return names.join(">");
}
