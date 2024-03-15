function scriptCoveragePackageChoice(element) {
    let elementID = element.id;
    sessionStorage.setItem("package", elementID);
    window.location.href = "/script-coverage-payment";
}