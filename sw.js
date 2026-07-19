self.addEventListener("push", function(event) {

    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "icon.png",
        badge: "icon.png"
    });

});self.addEventListener("push", (event) => {

    const data = event.data.json();

    event.waitUntil(

        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "icon.png"
        })

    );

});