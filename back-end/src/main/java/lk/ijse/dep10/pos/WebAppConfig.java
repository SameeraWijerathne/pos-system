package lk.ijse.dep10.pos;

import lk.ijse.dep10.pos.api.CustomerController;
import lk.ijse.dep10.pos.api.ItemController;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
public class WebAppConfig {
    @Bean
    public CustomerController customerController(){
        return new CustomerController();
    }

    @Bean
    public ItemController itemController(){ return new ItemController();}
}
