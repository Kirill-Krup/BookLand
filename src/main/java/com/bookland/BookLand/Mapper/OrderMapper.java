package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.OrderDTOs.*;
import com.bookland.BookLand.Model.Order;
import com.bookland.BookLand.Model.OrderItem;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class, BookMapper.class, OrderItemMapper.class})
public interface OrderMapper {
  @Mapping(target = "user", source = "user")
  @Mapping(target = "orderItems", source = "orderItems")
  OrderDTO toDTO(Order order);
  Order toEntity(OrderDTO dto);

  Order toEntity(OrderCreateDTO dto);

  List<OrderDTO> toDTO(List<Order> orders);
}