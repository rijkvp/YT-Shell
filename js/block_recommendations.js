switch (getPageType()) {
    case "home":
        getSubTypeElements("home").forEach((element) => {
            disableElement(element, "HOMEPAGE BLOCKED");
        });
        break;
    case "subscriptions":
        getSubTypeElements("subscriptions").forEach((element) => {
            disableElement(element, "SUBSCRIPTIONS BLOCKED");
        });
        break;
    case "explore":
        getSubTypeElements("trending").forEach((element) => {
            disableElement(element, "EXPLORE FEED BLOCKED");
        });
        break;
    case "video":
        var related = document.getElementById("related");
        if (related != null) {
            disableElement(related, "RECOMMENDATIONS BLOCKED");
        }

        var endScreens = document.getElementsByClassName("html5-endscreen");
        for (i = 0; i < endScreens.length; i++) {
            removeElement(endScreens[i]);
        }

        // TODO: Block autoplay?!

        break;
}