const tbodyElm = $("#tbl-items tbody");
const modalElm = $("#new-item-modal");
const txtCode = $("#txt-code");
const txtDescription = $("#txt-description");
const txtUnitPrice = $("#txt-unit-price");
const txtInitialStock = $("#txt-initial-stock");
const btnSave = $("#btn-save");

tbodyElm.empty();

function formatItemCode(code) {
    return `I${code.toString().padStart(3, '0')}`;
}

[txtDescription, txtUnitPrice, txtInitialStock].forEach(txtElm =>
    $(txtElm).addClass('animate__animated'));

btnSave.on('click', ()=> {
   if (!validateData()){
       return false;
   }

});

function validateData() {
    const description = txtDescription.val().trim();
    const unitPrice = txtUnitPrice.val().trim();
    const stock = txtInitialStock.val().trim();
    let valid = true;

    resetForm();

    if (!stock) {
        valid = invalidate(txtInitialStock, "Initial stock can't be empty");
    } else if (!/^\d+$/.test(stock)) {
        valid = invalidate(txtInitialStock, 'Invalid stock');
    }

    if (!unitPrice) {
        valid = invalidate(txtUnitPrice, "Unit price can't be empty");
    } else if (!/^\d+$/.test(unitPrice)) {
        valid = invalidate(txtUnitPrice, 'Invalid unit price');
    }

    if (!description) {
        valid = invalidate(txtDescription, "Description can't be empty");
    } else if (!/^[A-Za-z ]+$/.test(description)) {
        valid = invalidate(txtDescription, "Invalid description");
    }

    return valid;
}

function invalidate(txt, message){
    setTimeout(() => txt.addClass('is-invalid animate__shakeX'), 0);
    txt.trigger('select');
    txt.next().text(message);
    return false;
}

function resetForm(clearData) {
    [txtDescription, txtUnitPrice, txtInitialStock].forEach(txt => {
        txt.removeClass("is-invalid animate__shakeX");
        if (clearData) txt.val('');
    });
}

modalElm.on('show.bs.modal', () => {
    resetForm(true);
    txtCode.parent().hide();
    setTimeout(() => txtDescription.trigger('focus'), 500);
});