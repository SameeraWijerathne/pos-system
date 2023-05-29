import {LocalDateTime, DateTimeFormatter} from "../node_modules/@js-joda/core/dist/js-joda.esm.js";

const orderDatetime = $("#order-date-time");
const tbodyElm = $("#tbl-order tbody");

setDateTime();
tbodyElm.empty();

setInterval(setDateTime,1000);
function setDateTime(){
    const now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    orderDatetime.text(now);
}


