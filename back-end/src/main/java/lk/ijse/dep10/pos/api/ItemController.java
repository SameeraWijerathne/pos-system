package lk.ijse.dep10.pos.api;

import lk.ijse.dep10.pos.dto.ItemDTO;
import lk.ijse.dep10.pos.dto.ResponseErrorDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/items")
@CrossOrigin
public class ItemController {

    @Autowired
    private BasicDataSource pool;

    @DeleteMapping("/{code}")
    public ResponseEntity<?> deleteItem(@PathVariable("code") String itemCode) {
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("DELETE FROM Item WHERE code=?");
            stm.setString(1, itemCode);
            int affectedRows = stm.executeUpdate();
            if (affectedRows == 1) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                ResponseErrorDTO response = new ResponseErrorDTO(404, "Item code not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (SQLException e) {
            if (e.getSQLState().equals("23000")) {
                return new ResponseEntity<>(new ResponseErrorDTO(HttpStatus.CONFLICT.value(), e.getMessage()), HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
            }

        }
    }
    @GetMapping
    public ResponseEntity<?> getItems(@RequestParam(value = "q", required = false) String query) {
        if (query == null) query = "";
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("SELECT * FROM Item WHERE code LIKE ? OR description LIKE ? OR unit_price LIKE ? OR stock LIKE ?");
            query = "%" + query + "%";
            for (int i = 1; i <= 4; i++) {
                stm.setString(i, query);
            }
            ResultSet rst = stm.executeQuery();
            List<ItemDTO> itemList = new ArrayList<>();
            while (rst.next()) {
                int code = rst.getInt("code");
                String description = rst.getString("description");
                BigDecimal unitPrice = rst.getBigDecimal("unit_price");
                int stock = rst.getInt("stock");
                itemList.add(new ItemDTO(code, description, unitPrice, stock));
            }
            return new ResponseEntity<>(itemList, HttpStatus.OK);
        } catch (SQLException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping
    public ResponseEntity<?> saveItem(@RequestBody ItemDTO item) {
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("INSERT INTO Item (description, unit_price, stock) VALUES (?,?,?)",
                    Statement.RETURN_GENERATED_KEYS);
            stm.setString(1, item.getDescription());

            BigDecimal unitPrice = new BigDecimal(String.valueOf(item.getUnitPrice()));

            stm.setBigDecimal(2, unitPrice);
            stm.setInt(3, item.getStock());
            stm.executeUpdate();
            ResultSet generatedKeys = stm.getGeneratedKeys();
            generatedKeys.next();
            int code = generatedKeys.getInt(1);
            item.setCode(code);
            return new ResponseEntity<>(item, HttpStatus.CREATED);
        } catch (SQLException e) {
            if (e.getSQLState().equals("23000")) {
                return new ResponseEntity<>(new ResponseErrorDTO(HttpStatus.CONFLICT.value(), e.getMessage()), HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
