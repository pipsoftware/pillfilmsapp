let amountToPay = 0;

$(document).ready(function () {

    renderPackageInformation();

    var $file = $('#file-input'),
        $label = $('label[for="file-input"]'),
        $labelText = $label.find('span'),
        $labelRemove = $('.remove'),
        labelDefault = ''; // Default text

    // Set default text for label
    $labelText.text(labelDefault);

    // On file change
    $file.on('change', function () {
        var fileName = $(this).val().split('\\').pop();
        if (fileName) {
            $labelText.text(fileName);
            $labelRemove.show();
        } else {
            $labelText.text(labelDefault);
            $labelRemove.hide();
        }
    });

    // Remove file   
    $labelRemove.on('click', function () {
        $file.val("");
        $labelText.text(labelDefault);
        $labelRemove.hide();
    });
});


function renderPackageInformation() {

    let packages = [
        { title: "Screenplay Feedback", pages: "(1 - 10 pages)", price: 50.00, text: "Screenplay Feedback (1 - 10 pages) - $50.00" },
        { title: "Screenplay Feedback", pages: "(11 - 40 pages)", price: 200.00, text: "Screenplay Feedback (11 - 40 pages) - $200.00" },
        { title: "Screenplay Feedback", pages: "(41 - 90+ pages)", price: 450.00, text: "Screenplay Feedback (41 - 90+ pages) - $450.00" }
    ]

    console.log(sessionStorage.getItem("package"));

    if (sessionStorage.getItem("package") == "package-one") {
        document.getElementById("package-info").innerHTML = "Package: " + packages[0].text;
        amountToPay = packages[0].price;
    }
    else if (sessionStorage.getItem("package") == "package-two") {
        document.getElementById("package-info").innerHTML = "Package: " + packages[1].text;
        amountToPay = packages[1].price;
    }
    else if (sessionStorage.getItem("package") == "package-three") {
        document.getElementById("package-info").innerHTML = "Package: " + packages[2].text;
        amountToPay = packages[2].price;
    }

}

function initPayPalButton() {
    paypal
        .Buttons({
            style: {
                shape: "rect",
                color: "gold",
                layout: "vertical",
                label: "paypal",
            },

            createOrder: function (data, actions) {
                const paypalAmount = parseFloat(amountToPay);
                return actions.order.create({
                    purchase_units: [
                        { amount: { currency_code: "USD", value: paypalAmount } },
                    ],
                });
            },

            onApprove: function (data, actions) {
                return actions.order.capture().then(function (orderData) {
                    // Full available details
                    console.log(
                        "Capture result",
                        orderData,
                        JSON.stringify(orderData, null, 2)
                    );

                    // Show a success message within this page, for example:
                    // const element = document.getElementById("paypal-button-container");
                    // element.innerHTML = "";
                    // element.innerHTML = "<h3>Thank you for your payment!</h3>";

                    // Or go to another URL:  
                    // actions.redirect('thank-you.html');
                    window.location.href = 'thank-you.html';
                });
            },

            onError: function (err) {
                console.log(err);
            },
        })
        .render("#paypal-button-container");
}
initPayPalButton();

/*
Account name
sb-axzyc28922031@business.example.com - seller account  - pass: KE3Pu3-^
sb-epab328922028@personal.example.com - buyer account - pass: I<vn39*l
*/