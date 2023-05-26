import Big from "../node_modules/big.js/big.mjs";
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

function formatPrice(unitPrice) {
    // let price = Big(unitPrice);
    const nf = new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return nf.format(unitPrice);
}

[txtDescription, txtUnitPrice, txtInitialStock].forEach(txtElm =>
    $(txtElm).addClass('animate__animated'));

btnSave.on('click', ()=> {
   if (!validateData()){
       return false;
   }

    const description = txtDescription.val().trim();
    const unitPrice = Big(+txtUnitPrice.val().trim());
    const stock = +txtInitialStock.val().trim();

    let item = {
        description, unitPrice, stock
    }

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", ()=> {
        if (xhr.readyState === 4) {
            [txtDescription, txtUnitPrice, txtInitialStock, btnSave].forEach(elm => elm.removeAttr('disabled'));
            $("#loader").css('visibility', 'hidden');

            if (xhr.status === 201) {
                item = JSON.parse(xhr.responseText);
                tbodyElm.append(`
                    <tr>
                        <td class="text-center">${formatItemCode(item.code)}</td>
                        <td>${item.description}</td>
                        <td class="d-none d-xl-table-cell">${item.stock}</td>
                        <td class="price text-center">${formatPrice(item.unitPrice)}</td>
                        <td>
                            <div class="actions d-flex gap-3 justify-content-center">
                                <svg data-bs-toggle="tooltip" data-bs-title="Edit Item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path
                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                                <svg data-bs-toggle="tooltip" data-bs-title="Delete Item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                class="bi bi-trash" viewBox="0 0 16 16">
                                <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                <path
                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                </svg>
                            </div>
                        </td>
                    </tr>
                `);
                resetForm(true);
                txtDescription.trigger('focus');
                showToast('success', 'Saved', 'Item has been saved successfully');
            } else {
                const errorObj = JSON.parse(xhr.responseText);
                showToast('error', 'Failed to save', errorObj.message);
            }
        }
    });

    xhr.open('POST', 'http://localhost:8080/pos/items', true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(item));

    [txtDescription, txtUnitPrice, txtInitialStock, btnSave].forEach(elm => elm.attr('disabled', 'true'));
    $("#loader").css('visibility', 'visible');

});

function validateData() {
    const description = txtDescription.val().trim();
    const unitPrice = txtUnitPrice.val().trim();
    const stock = txtInitialStock.val().trim();
    let valid = true;

    resetForm();

    if (!stock) {
        valid = invalidate(txtInitialStock, "Initial stock can't be empty");
    } else if (+stock <= 0 || !/^\d+$/.test(stock)) {
        valid = invalidate(txtInitialStock, 'Invalid stock');
    }

    if (!unitPrice) {
        valid = invalidate(txtUnitPrice, "Unit price can't be empty");
    } else if (+unitPrice <= 0) {
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

function showToast(toastType, header, message) {
    const toast = $("#toast .toast");
    toast.removeClass("text-bg-success text-bg-warning text-bg-danger");
    switch (toastType) {
        case 'success':
            toast.addClass('text-bg-success');
            break;
        case 'warning':
            toast.addClass('text-bg-warning');
            break;
        case 'error':
            toast.addClass('text-bg-danger');
            break;
        default:
    }
    $("#toast .toast-header > strong").text(header);
    $("#toast .toast-body").text(message);
    toast.toast('show');
}