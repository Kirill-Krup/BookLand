package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.OrderDTOs.OrderItemDTO;
import com.bookland.BookLand.Model.OrderItem;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
  @Mapping(target = "order", ignore = true)
  OrderItem toEntity(OrderItemDTO orderItemDTO);

  OrderItemDTO toDTO(OrderItem orderItem);

  List<OrderItem> toEntity(List<OrderItemDTO> orderItemDTOs);

  List<OrderItemDTO> toDTO(List<OrderItem> orderItems);
}
