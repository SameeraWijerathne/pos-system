package lk.ijse.dep10.pos.business.custom;

import lk.ijse.dep10.pos.business.SuperBO;
import lk.ijse.dep10.pos.dto.ItemDTO;
import lk.ijse.dep10.pos.entity.Item;

import java.util.List;

public interface ItemBO extends SuperBO {

    Item saveItem(ItemDTO itemDTO) throws Exception;

    void updateItem(ItemDTO itemDTO) throws  Exception;

    void deleteItemByCode(String itemCode) throws Exception;

    ItemDTO findItemByCode(String itemCode) throws Exception;

    List<ItemDTO> findItems(String query) throws Exception;
}
