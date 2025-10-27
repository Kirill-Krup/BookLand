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

  OrderItemDTO toDto(OrderItem item);
  OrderItem toEntity(OrderItemDTO dto);

  Order toEntity(OrderCreateDTO dto);
  void updateStatusFromDto(OrderStatusUpdateDTO dto, @MappingTarget Order order);

  List<OrderDTO> toDTO(List<Order> orders);
}