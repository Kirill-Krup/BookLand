package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.OrderDTOs.*;
import com.bookland.BookLand.Model.Order;
import com.bookland.BookLand.Model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class, BookMapper.class})
public interface OrderMapper {
  OrderDTO toDto(Order order);
  Order toEntity(OrderDTO dto);

  OrderItemDTO toDto(OrderItem item);
  OrderItem toEntity(OrderItemDTO dto);

  Order toEntity(OrderCreateDTO dto);
  void updateStatusFromDto(OrderStatusUpdateDTO dto, @MappingTarget Order order);
}