for(let i = 0; i < 15; i++){
    const tr = $("#tbl-order tbody tr:first-child").clone();
    $("#tbl-order tbody").append(tr);
}

$("#tbl-order tbody").empty();