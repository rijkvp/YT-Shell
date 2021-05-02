// TODO: Implement - currently not used anymore...
function replaceSubCount(subCountElement) {
    if (subCountElement != null) {
        var subCountStr = subCountElement.innerHTML.split(" ")[0];
        var subCount;
        if (subCountStr.endsWith("M")) {
            subCount = parseFloat(subCountStr.substring(0, subCountStr.length - 1)) * 1000000;
        } else if (subCountStr.endsWith("K")) {
            subCount = parseFloat(subCountStr.substring(0, subCountStr.length - 1)) * 1000;
        } else {
            subCount = parseFloat(subCountStr);
        }
        var audienceSize;
        if (subCount < 10000) {
            audienceSize = "S";
        } else if (subCount < 100000) {
            audienceSize = "M";
        } else if (subCount < 1000000) {
            audienceSize = "L";
        } else if (subCount < 10000000) {
            audienceSize = "XL";
        } else {
            audienceSize = "XXL";
        }

        subCountElement.innerHTML = "Audience size: <b>" + audienceSize + "</b>";
        subCountElement.id = "yt-shell-audience-size";
        subCountElement.removeAttribute("aria-label");
    }
}