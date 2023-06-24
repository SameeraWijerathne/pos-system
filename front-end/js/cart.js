// import {Big} from "big.js";
import {Big} from "../node_modules/big.js/big.mjs";
export class Cart {
    customer = null;
    itemList = [];
    subscriber;
    constructor(subscriber) {
        if (localStorage.getItem("order")) {
            this.subscriber = subscriber;
            const order = JSON.parse(localStorage.getItem("order"));
            this.customer = order.customer;
            this.itemList = order.itemList;
        }
        this.#updateOrder();
    }
    setCustomer(customer) {
        this.customer = customer;
        this.#updateOrder();
    }
    addItem(item){
        this.itemList.push(item);
        this.#updateOrder();
    }

    updateItemQty(code, qty) {
        if (!this.containsItem(code)) return;
        this.getItem(code).qty = qty;
        this.#updateOrder();
    }

    clear() {
        this.customer = null;
        this.itemList = [];
        this.#updateOrder();
        this.subscriber(this.getTotal());
    }

    deleteItem(code){
        const index = this.itemList.indexOf(this.getItem(code));
        this.itemList.splice(index, 1);
        this.#updateOrder();
    }

    getItem(code){
        return this.itemList.find(item => item.code === code);
    }

    containsItem(code) {
        return !!this.getItem(code);
    }

    getTotal(){
        let total = new Big(0);
        this.itemList.forEach(item => {
            total = total.plus(Big(item.qty).times(Big(item.unitPrice)));
        })
        return total;
    }

    #updateOrder() {
        localStorage.setItem("order", JSON.stringify(this));
    }
}
