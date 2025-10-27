package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.OrderDTOs.OrderCreateDTO;
import com.bookland.BookLand.DTO.OrderDTOs.OrderDTO;
import java.util.List;

public interface OrderService {

  OrderDTO createOrder(String name, OrderCreateDTO orderCreateDTO);

  void deleteOrder(Long id);

  List<OrderDTO> getAllActiveOrders(String name);

  List<OrderDTO> getMyHistory(String name);

  OrderDTO getOrderDetails(Long id);
}
