package lk.ijse.dep10.pos.api;

import lk.ijse.dep10.pos.dto.OrderDTO;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/orders")
@RestController
@CrossOrigin
public class OrderController {

    // POST http://localhost:8080/pos/orders
    @PostMapping
    public void saveOrder(@RequestBody OrderDTO order) {
        System.out.println(order);
    }
}
