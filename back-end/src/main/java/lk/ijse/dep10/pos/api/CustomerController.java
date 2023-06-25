package lk.ijse.dep10.pos.api;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lk.ijse.dep10.pos.business.BOFactory;
import lk.ijse.dep10.pos.business.BOType;
import lk.ijse.dep10.pos.business.custom.CustomerBO;
import lk.ijse.dep10.pos.dto.CustomerDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@CrossOrigin
@ApiOperation(
        value = "Customer Controller",
        notes = "Customer Controller REST API"
)
public class CustomerController {

    @Autowired
    private BasicDataSource pool;

    @ApiOperation(value = "Update Customer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PatchMapping("/{customerId}")
    public void updateCustomer(@PathVariable("customerId") Integer customerId,
                               @RequestBody @Valid CustomerDTO customer) throws Exception {
        CustomerBO customerBO = BOFactory.getInstance().getBO(BOType.CUSTOMER, pool);
        customer.setId(customerId);
        customerBO.updateCustomer(customer);
    }
    @ApiOperation(value = "Delete Customer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{customerId}")
    public void deleteCustomer(@PathVariable("customerId") Integer customerId) throws Exception {
        CustomerBO customerBO = BOFactory.getInstance().getBO(BOType.CUSTOMER, pool);
        customerBO.deleteCustomerById(customerId);
    }

    @ApiOperation(value = "Get Customers")
    @GetMapping
    public List<CustomerDTO> getCustomers(@RequestParam(value = "q", required = false)
                                          String query) throws Exception {
        if (query == null) query = "";
        CustomerBO customerBO = BOFactory.getInstance().getBO(BOType.CUSTOMER, pool);
        return customerBO.findCustomers(query);
    }

    @ApiOperation(value = "Save Customer",
            notes = "Save a customer with JSON request body")
    @ApiResponses({
            @ApiResponse(code = 201, message ="New Customer has been created"),
            @ApiResponse(code = 400, message = "Customer details are invalid")
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public CustomerDTO saveCustomer(@RequestBody @Valid @ApiParam(name = "customer", value = "Customer JSON") CustomerDTO customer) throws Exception {
        CustomerBO customerBO = BOFactory.getInstance().getBO(BOType.CUSTOMER, pool);
        return customerBO.saveCustomer(customer);
    }
}
