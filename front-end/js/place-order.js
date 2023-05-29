/* Imports */
import {LocalDateTime, DateTimeFormatter} from "../node_modules/@js-joda/core/dist/js-joda.esm.js";

/* Module Level Variables, Constants */
const API_BASE_URL = 'http://localhost:8080/pos';
const orderDatetime = $("#order-date-time");
const tbodyElm = $("#tbl-order tbody");
const txtCustomer = $("#txt-customer");
let customer = null;

/* Initialization */
setDateTime();
tbodyElm.empty();

/*Event Handlers & Timers */
setInterval(setDateTime,1000);
txtCustomer.on('input', ()=> findCustomer());
txtCustomer.on('blur', () => {
    if (txtCustomer.val() && !customer) {
        txtCustomer.addClass("is-invalid");
    }
});

$("#btn-clear-customer").on('click', ()=> {
    customer = null;
    $("#customer-name").text("Walk-in Customer");
    txtCustomer.val("");
    txtCustomer.removeClass("is-invalid");
    txtCustomer.trigger('focus');
})


/* Functions */
function setDateTime(){
    const now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    orderDatetime.text(now);
}

function findCustomer(){
    const customerNameElm = $("#customer-name");
    const idOrContact = txtCustomer.val().trim().replace('C', '');
    txtCustomer.removeClass("is-invalid");
    if (!idOrContact) return;
    const jqxhr = $.ajax(`${API_BASE_URL}/customers/${idOrContact}`);
    jqxhr.done((data)=> {
        customer = data;
        customerNameElm.text(customer.name);
    });
    jqxhr.fail(()=>{
        customer = null;
        customerNameElm.text("Walk-in Customer");
    });
}

